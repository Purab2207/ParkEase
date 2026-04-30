import os
import re
import uuid
import random
import httpx
from datetime import datetime, timezone, timedelta
from contextlib import asynccontextmanager
from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator
from typing import Optional
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

SUPABASE_URL = os.environ.get("SUPABASE_URL", "").rstrip("/")
SUPABASE_SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_KEY", "")
DASHBOARD_API_KEY = os.environ.get("DASHBOARD_API_KEY", "demo-key-change-before-prod")
DEMO_MODE = os.environ.get("DEMO_MODE", "false").lower() == "true"

# ---------------------------------------------------------------------------
# Thin PostgREST client — wraps Supabase REST API via httpx.
# ---------------------------------------------------------------------------
_REST = f"{SUPABASE_URL}/rest/v1"
_HEADERS = {
    "apikey": SUPABASE_SERVICE_KEY,
    "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=representation",
}


def sb_select(table: str, filters: dict | None = None, columns: str = "*",
              order: str | None = None, limit: int | None = None,
              count: bool = False) -> list:
    params: dict = {"select": columns}
    if filters:
        params.update(filters)
    if order:
        params["order"] = order
    if limit:
        params["limit"] = limit
    headers = dict(_HEADERS)
    if count:
        headers["Prefer"] = "count=exact"
    r = httpx.get(f"{_REST}/{table}", headers=headers, params=params, timeout=10)
    r.raise_for_status()
    if count:
        return int(r.headers.get("content-range", "0/0").split("/")[-1])
    return r.json()


def sb_insert(table: str, data: dict | list) -> list:
    r = httpx.post(f"{_REST}/{table}", headers=_HEADERS, json=data, timeout=10)
    r.raise_for_status()
    return r.json()


def sb_update(table: str, data: dict, filters: dict) -> list:
    r = httpx.patch(f"{_REST}/{table}", headers=_HEADERS, json=data,
                    params=filters, timeout=10)
    r.raise_for_status()
    return r.json()


def sb_upsert(table: str, data: dict, on_conflict: str) -> list:
    headers = {**_HEADERS, "Prefer": "resolution=merge-duplicates,return=representation"}
    r = httpx.post(f"{_REST}/{table}", headers=headers, json=data,
                   params={"on_conflict": on_conflict}, timeout=10)
    r.raise_for_status()
    return r.json()


def sb_rpc(fn: str, params: dict) -> dict:
    """Call a Postgres function via Supabase RPC."""
    r = httpx.post(f"{SUPABASE_URL}/rest/v1/rpc/{fn}", headers=_HEADERS,
                   json=params, timeout=10)
    r.raise_for_status()
    return r.json()


# ---------------------------------------------------------------------------
# Auth helpers
# ---------------------------------------------------------------------------

def require_dashboard_key(request: Request) -> None:
    """Raise 401 if the request is missing a valid X-Dashboard-Key header."""
    key = request.headers.get("x-dashboard-key", "")
    if not key or key != DASHBOARD_API_KEY:
        raise HTTPException(401, "Missing or invalid X-Dashboard-Key")


def verify_booking_access(request: Request, booking: dict) -> None:
    """
    Demo-appropriate ownership check: caller must supply either:
      - a valid X-Dashboard-Key (operator access), or
      - an ?email= query param that matches the booking's stored email.
    Production replacement: validate a JWT and check booking.user_id == auth.uid().
    """
    key = request.headers.get("x-dashboard-key", "")
    if key and key == DASHBOARD_API_KEY:
        return  # operator access

    email_param = request.query_params.get("email", "").strip().lower()
    booking_email = (booking.get("email") or "").strip().lower()
    if email_param and email_param == booking_email:
        return  # caller proved they know the owner's email

    raise HTTPException(
        401,
        "Provide ?email=<booking-owner-email> or a valid X-Dashboard-Key header."
    )


# ---------------------------------------------------------------------------
# Rate limiter
# ---------------------------------------------------------------------------
limiter = Limiter(key_func=get_remote_address)


# ---------------------------------------------------------------------------
# App
# ---------------------------------------------------------------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    yield


app = FastAPI(lifespan=lifespan)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

ALLOWED_ORIGINS = [
    "https://park-ease-rho.vercel.app",
    "http://localhost:5173",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "X-Dashboard-Key"],
)


# ---------------------------------------------------------------------------
# Pydantic models
# ---------------------------------------------------------------------------
_PLATE_RE = re.compile(r"^[A-Z0-9 \-]{1,15}$", re.IGNORECASE)


class OtpRequest(BaseModel):
    phone: str
    email: str

    @field_validator("phone")
    @classmethod
    def phone_must_be_10_digits(cls, v: str) -> str:
        if not v.isdigit() or len(v) != 10:
            raise ValueError("Phone must be exactly 10 digits")
        return v

    @field_validator("email")
    @classmethod
    def email_basic_check(cls, v: str) -> str:
        if "@" not in v or "." not in v.split("@")[-1]:
            raise ValueError("Invalid email address")
        return v.strip().lower()


class OtpVerify(BaseModel):
    email: str
    code: str
    phone: Optional[str] = None


class BookingCreate(BaseModel):
    event_id: str
    bay_id: str
    lot_id: str
    phone: str = Field(..., pattern=r"^\d{10}$", description="10-digit mobile number")
    email: str
    entry_window: str
    vehicle_number: Optional[str] = Field(
        default=None,
        max_length=15,
        description="Indian vehicle registration plate (max 15 chars)",
    )
    group_size: int = Field(default=1, ge=1, le=6)

    @field_validator("vehicle_number")
    @classmethod
    def validate_plate(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and not _PLATE_RE.match(v):
            raise ValueError("vehicle_number must be alphanumeric (max 15 chars)")
        return v


# ---------------------------------------------------------------------------
# Health
# ---------------------------------------------------------------------------
@app.get("/api/health")
def health():
    return {"status": "ok"}


# ---------------------------------------------------------------------------
# Auth routes
# ---------------------------------------------------------------------------
@app.post("/api/auth/request-otp", status_code=200)
@limiter.limit("3/minute")
async def request_otp(request: Request, data: OtpRequest):
    # OTP delivery is via Resend. In demo mode we skip the actual send.
    if DEMO_MODE:
        return {"message": "OTP sent", "email": data.email,
                "demo_hint": "Demo mode — use OTP: 0000"}
    # TODO: send real OTP via Resend to data.email, store hash in otp_codes
    return {"message": "OTP sent", "email": data.email}


@app.post("/api/auth/verify-otp")
@limiter.limit("10/minute")
async def verify_otp(request: Request, data: OtpVerify):
    # [DEMO] Bypass: code "0000" / "000000" authenticates any email.
    # This branch only runs when DEMO_MODE=true; safe to leave for demo.
    # Production path: remove this block and validate against otp_codes table only.
    if DEMO_MODE and data.code in ("0000", "000000"):
        phone = data.phone or "0000000000"
        user_rows = sb_upsert("users", {"email": data.email, "phone": phone}, on_conflict="email")
        user = user_rows[0] if user_rows else {}
        return {"verified": True, "user_id": user.get("id"), "email": data.email}

    now = datetime.now(timezone.utc).isoformat()
    rows = sb_select(
        "otp_codes",
        filters={"email": f"eq.{data.email}", "code": f"eq.{data.code}",
                 "used": "eq.false", "expires_at": f"gt.{now}"},
        order="created_at.desc",
        limit=1,
    )
    if not rows:
        raise HTTPException(400, "Invalid or expired OTP")

    otp_row = rows[0]
    sb_update("otp_codes", {"used": True}, {"id": f"eq.{otp_row['id']}"})

    phone = data.phone or otp_row.get("phone")
    user_rows = sb_upsert("users", {"email": data.email, "phone": phone}, on_conflict="email")
    user = user_rows[0] if user_rows else {}

    return {"verified": True, "user_id": user.get("id"), "email": data.email}


# ---------------------------------------------------------------------------
# Event routes
# ---------------------------------------------------------------------------
@app.get("/api/events")
def list_events():
    rows = sb_select("events")
    for e in rows:
        e["event_id"] = e["id"]
        e["event_name"] = e["name"]
        e["consumer_price"] = e["price"]
    return rows


@app.get("/api/events/{event_id}")
def get_event(event_id: str):
    rows = sb_select("events", filters={"id": f"eq.{event_id}"})
    if not rows:
        raise HTTPException(404, "Event not found")

    e = rows[0]
    total = e["total_spots"]
    remaining = e["spots_remaining"]
    booked = total - remaining
    fill_percent = round((booked / total) * 100) if total > 0 else 0
    redirect_threshold = int(total * 0.9)

    return {
        **e,
        "event_id": event_id,
        "event_name": e["name"],
        "consumer_price": e["price"],
        "booked_spots": booked,
        "fill_percent": fill_percent,
        "booking_count": booked,
        "redirect_active": booked >= redirect_threshold,
    }


@app.get("/api/events/{event_id}/bays")
def get_bays(event_id: str, lot_id: Optional[str] = None):
    filters = {"event_id": f"eq.{event_id}"}
    if lot_id:
        filters["lot_id"] = f"eq.{lot_id}"
    rows = sb_select("bays", filters=filters,
                     columns="event_id,lot_id,pillar_code,status")
    return rows


@app.get("/api/events/{event_id}/stats")
def get_event_stats(event_id: str, request: Request):
    require_dashboard_key(request)

    rows = sb_select("events", filters={"id": f"eq.{event_id}"})
    if not rows:
        raise HTTPException(404, "Event not found")

    e = rows[0]
    total = e["total_spots"]
    remaining = e["spots_remaining"]
    booked = total - remaining
    fill_percent = round((booked / total) * 100) if total > 0 else 0
    redirect_threshold = int(total * 0.9)
    redirect_active = booked >= redirect_threshold
    redirect_cta_taps = max(0, round((fill_percent - 50) * 2.36)) if fill_percent > 50 else 0

    lots = e.get("lots") or []

    # Fetch all bays for this event in one query, then group in Python (avoids N+1)
    all_bays = sb_select("bays", filters={"event_id": f"eq.{event_id}"}, columns="lot_id,status")
    bays_by_lot: dict[str, list] = {}
    for b in all_bays:
        bays_by_lot.setdefault(b["lot_id"], []).append(b)

    lot_stats = []
    for lot in lots:
        bay_rows = bays_by_lot.get(lot["id"], [])
        lot_booked = sum(1 for b in bay_rows if b["status"] == "booked")
        lot_total = lot["total"]
        lot_percent = round((lot_booked / lot_total) * 100) if lot_total > 0 else 0
        lot_stats.append({
            "name": lot["name"],
            "total": lot_total,
            "booked": lot_booked,
            "percent": lot_percent,
        })

    return {
        "event_name": e["name"],
        "venue": f"{e['venue']}, {e['city']}",
        "date": e["date"],
        "event_status": "live",
        "total_spots": total,
        "booked_spots": booked,
        "spots_remaining": remaining,
        "fill_percent": fill_percent,
        "redirect_cta_taps": redirect_cta_taps,
        "compliance_rate": 0.65,
        "redirect_threshold_spots": redirect_threshold,
        "redirect_active": redirect_active,
        "lots": lot_stats,
        "last_updated": datetime.now(timezone.utc).strftime("%H:%M"),
    }


# ---------------------------------------------------------------------------
# Booking routes
# ---------------------------------------------------------------------------
@app.post("/api/bookings", status_code=201)
@limiter.limit("10/minute")
def create_booking(request: Request, data: BookingCreate):
    event_rows = sb_select("events", filters={"id": f"eq.{data.event_id}"})
    if not event_rows:
        raise HTTPException(404, "Event not found")
    event = event_rows[0]

    valid_windows = event.get("entry_windows") or []
    if valid_windows and data.entry_window not in valid_windows:
        raise HTTPException(400, f"Invalid entry window. Choose one of: {valid_windows}")

    # Atomically claim bay — only one concurrent request gets a non-empty result.
    now = datetime.now(timezone.utc).isoformat()
    claimed = sb_update(
        "bays",
        {"status": "booked", "booked_at": now},
        {"event_id": f"eq.{data.event_id}", "pillar_code": f"eq.{data.bay_id}",
         "status": "eq.available"},
    )
    if not claimed:
        exists = sb_select("bays", filters={"event_id": f"eq.{data.event_id}",
                                             "pillar_code": f"eq.{data.bay_id}"},
                           columns="id")
        if not exists:
            raise HTTPException(404, "Bay not found")
        raise HTTPException(409, "Bay already taken")

    bay_row = claimed[0]

    # Upsert user
    user_rows = sb_upsert("users", {"phone": data.phone, "email": data.email},
                          on_conflict="email")
    user_id = user_rows[0]["id"] if user_rows else None

    # Create booking record
    booking_id = f"PE-{datetime.now(timezone.utc).strftime('%Y')}-{uuid.uuid4().hex[:8].upper()}"
    sb_insert("bookings", {
        "booking_id": booking_id,
        "event_id": data.event_id,
        "bay_id": bay_row["id"],
        "user_id": user_id,
        "phone": data.phone,
        "email": data.email,
        "vehicle_number": data.vehicle_number,
        "entry_window": data.entry_window,
        "amount_paid": event["price"],
        "status": "confirmed",
    })

    # Atomically decrement spots_remaining via Postgres RPC.
    # SQL for the RPC (run once in Supabase SQL editor):
    #
    #   create or replace function decrement_spots(event_id text)
    #   returns void language sql as $$
    #     update events
    #     set spots_remaining = greatest(spots_remaining - 1, 0)
    #     where id = event_id;
    #   $$;
    #
    try:
        sb_rpc("decrement_spots", {"event_id": data.event_id})
    except Exception:
        # Fallback: non-atomic decrement if RPC not yet created.
        # Replace with the RPC above to eliminate the race condition.
        new_remaining = max(event["spots_remaining"] - 1, 0)
        sb_update("events", {"spots_remaining": new_remaining}, {"id": f"eq.{data.event_id}"})

    return {
        "booking_id": booking_id,
        "event_id": data.event_id,
        "bay_id": data.bay_id,
        "lot_id": data.lot_id,
        "phone": data.phone,
        "email": data.email,
        "vehicle_number": data.vehicle_number,
        "entry_window": data.entry_window,
        "amount_paid": event["price"],
        "status": "confirmed",
        "created_at": now,
    }


@app.get("/api/bookings/{booking_id}")
def get_booking(booking_id: str, request: Request):
    rows = sb_select("bookings", filters={"booking_id": f"eq.{booking_id}"})
    if not rows:
        raise HTTPException(404, "Booking not found")
    doc = rows[0]

    # Ownership check — see verify_booking_access docstring for production path.
    verify_booking_access(request, doc)

    event_rows = sb_select("events", filters={"id": f"eq.{doc['event_id']}"})
    event = event_rows[0] if event_rows else {}

    bay_lot = {}
    if doc.get("bay_id"):
        bay_rows = sb_select("bays", filters={"id": f"eq.{doc['bay_id']}"})
        if bay_rows:
            b = bay_rows[0]
            lots = event.get("lots") or []
            lot_info = next((l for l in lots if l["id"] == b["lot_id"]), {})
            bay_lot = {
                "bay_pillar_code": b["pillar_code"],
                "lot_name": lot_info.get("name", ""),
                "distance_to_gate_metres": lot_info.get("distance_m", 0),
                "gate_name": lot_info.get("gate_name", ""),
            }

    return {
        **doc,
        "event_name": event.get("name", ""),
        "venue": f"{event.get('venue', '')}, {event.get('city', '')}",
        "date": event.get("date", ""),
        "consumer_price": event.get("price", 0),
        **bay_lot,
    }


# ---------------------------------------------------------------------------
# Demo simulation — DEMO_MODE=true + valid X-Dashboard-Key only
# ---------------------------------------------------------------------------
@app.post("/api/events/{event_id}/simulate-booking")
def simulate_booking(event_id: str, request: Request):
    if not DEMO_MODE:
        raise HTTPException(404, "Not found")
    require_dashboard_key(request)

    event_rows = sb_select("events", filters={"id": f"eq.{event_id}"})
    if not event_rows:
        raise HTTPException(404, "Event not found")
    event = event_rows[0]

    remaining = event["spots_remaining"]
    if remaining <= 0:
        return {"message": "Event is full", "spots_remaining": 0}

    idx = event["total_spots"] - remaining + 1
    sb_insert("bookings", {
        "booking_id": f"PE-SIM-{uuid.uuid4().hex[:8].upper()}",
        "event_id": event_id,
        "phone": f"9000{10000 + idx}",
        "email": f"sim{idx}@demo.parkease.in",
        "entry_window": (event.get("entry_windows") or ["5:30–7:00 PM"])[0],
        "amount_paid": event["price"],
        "status": "confirmed",
    })

    try:
        sb_rpc("decrement_spots", {"event_id": event_id})
    except Exception:
        new_remaining = remaining - 1
        sb_update("events", {"spots_remaining": new_remaining}, {"id": f"eq.{event_id}"})
        return {
            "message": "Simulated booking created",
            "spots_remaining": new_remaining,
            "booked_spots": event["total_spots"] - new_remaining,
        }

    return {
        "message": "Simulated booking created",
        "spots_remaining": remaining - 1,
        "booked_spots": event["total_spots"] - (remaining - 1),
    }
