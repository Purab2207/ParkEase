import os
import uuid
import asyncio
import json
from datetime import datetime, timezone
from contextlib import asynccontextmanager
from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from pymongo import MongoClient

MONGO_URL = os.environ.get("MONGO_URL")
DB_NAME = os.environ.get("DB_NAME")

# ---------------------------------------------------------------------------
# Database helpers
# ---------------------------------------------------------------------------
client = MongoClient(MONGO_URL)
db = client[DB_NAME]
events_col = db["events"]
bays_col = db["bays"]
bookings_col = db["bookings"]


def seed_demo_data():
    """Seed all demo events, bays, and bookings."""
    _seed_karan_aujla()
    _seed_simple_event(
        event_id="arijit-singh-dy-patil-2026",
        event_name="Arijit Singh",
        sub_title="Arijit Singh Live in Concert",
        venue="DY Patil Stadium", city="Navi Mumbai",
        date="Fri, 18 Apr 2026", doors_open="5:30 PM", show_time="7:30 PM",
        total_spots=600, consumer_price=149, venue_base_rate=100,
        distance_to_gate_metres=150, gate_name="Gate 1",
        lots=[
            {"id": "north", "name": "DY Patil North Lot", "total": 350, "distance_m": 150, "gate_name": "Gate 1"},
            {"id": "south", "name": "DY Patil South Lot", "total": 250, "distance_m": 250, "gate_name": "Gate 3"},
        ],
        booking_seed=480,
    )
    _seed_simple_event(
        event_id="coldplay-nms-2026",
        event_name="Coldplay",
        sub_title="Music of the Spheres World Tour",
        venue="Narendra Modi Stadium", city="Ahmedabad",
        date="Sun, 26 Jan 2026", doors_open="4:00 PM", show_time="6:00 PM",
        total_spots=800, consumer_price=199, venue_base_rate=150,
        distance_to_gate_metres=200, gate_name="Gate A",
        lots=[
            {"id": "north", "name": "NMS North Lot", "total": 500, "distance_m": 200, "gate_name": "Gate A"},
            {"id": "south", "name": "NMS South Lot", "total": 300, "distance_m": 300, "gate_name": "Gate D"},
        ],
        booking_seed=788,
    )
    _seed_simple_event(
        event_id="diljit-dosanjh-pca-2026",
        event_name="Diljit Dosanjh",
        sub_title="Dil-Luminati Tour",
        venue="PCA Cricket Stadium", city="Mohali",
        date="Sat, 10 May 2026", doors_open="5:00 PM", show_time="7:00 PM",
        total_spots=400, consumer_price=169, venue_base_rate=120,
        distance_to_gate_metres=160, gate_name="Gate 3",
        lots=[
            {"id": "north", "name": "PCA North Lot", "total": 250, "distance_m": 160, "gate_name": "Gate 3"},
            {"id": "south", "name": "PCA South Lot", "total": 150, "distance_m": 220, "gate_name": "Gate 5"},
        ],
        booking_seed=311,
    )


def _seed_simple_event(event_id, event_name, sub_title, venue, city, date,
                        doors_open, show_time, total_spots, consumer_price,
                        venue_base_rate, distance_to_gate_metres, gate_name,
                        lots, booking_seed):
    """Seed a generic event with B/C-series bays and mock bookings."""
    if events_col.find_one({"event_id": event_id}):
        return
    events_col.insert_one({
        "event_id": event_id, "event_name": event_name, "sub_title": sub_title,
        "venue": venue, "city": city, "date": date,
        "doors_open": doors_open, "show_time": show_time,
        "total_spots": total_spots, "consumer_price": consumer_price,
        "venue_base_rate": venue_base_rate, "park_ease_fee": 49,
        "event_tier": "Standard", "distance_to_gate_metres": distance_to_gate_metres,
        "gate_name": gate_name, "covered_parking": False,
        "entry_windows": ["5:00-6:30 PM", "6:30-8:00 PM"],
        "redirect_threshold_spots": int(total_spots * 0.9),
        "lots": lots,
        "prohibited_items": ["Professional cameras / DSLR", "Outside food & beverages", "Laser pointers"],
        "amenities": ["Pillar-mapped bays", "QR entry enforcement", "Pre-assigned bay number"],
        "created_at": datetime.now(timezone.utc).isoformat(),
    })
    north_taken = {"B-01", "B-04", "B-07", "B-10", "B-13"}
    south_taken = {"C-01", "C-03", "C-07", "C-10"}
    bay_docs = []
    for i in range(1, 21):
        code = f"B-{i:02d}"
        bay_docs.append({"event_id": event_id, "lot_id": "north", "lot_name": lots[0]["name"],
                          "pillar_code": code, "status": "taken" if code in north_taken else "available"})
    for i in range(1, 16):
        code = f"C-{i:02d}"
        bay_docs.append({"event_id": event_id, "lot_id": "south", "lot_name": lots[1]["name"],
                          "pillar_code": code, "status": "taken" if code in south_taken else "available"})
    bays_col.insert_many(bay_docs)
    mock_bookings = [
        {"booking_id": f"PE-SEED-{event_id[:4].upper()}-{idx:04d}", "event_id": event_id,
         "bay_id": f"SEED-{idx:03d}", "lot_id": "north" if idx < booking_seed // 2 else "south",
         "phone": f"98765{10000+idx}", "entry_window": "5:00-6:30 PM",
         "group_size": 1, "amount_paid": consumer_price, "status": "confirmed",
         "created_at": datetime.now(timezone.utc).isoformat()}
        for idx in range(booking_seed)
    ]
    if mock_bookings:
        bookings_col.insert_many(mock_bookings)


def _seed_karan_aujla():
    """Seed the original Karan Aujla demo event (unchanged)."""
    event_id = "karan-aujla-jln-2026"

    if events_col.find_one({"event_id": event_id}):
        return  # already seeded

    # --- Event ---
    events_col.insert_one({
        "event_id": event_id,
        "event_name": "Karan Aujla",
        "sub_title": "The Bombairiya Tour",
        "venue": "Jawaharlal Nehru Stadium",
        "city": "Delhi",
        "date": "Sat, 12 Apr 2026",
        "doors_open": "6:00 PM",
        "show_time": "8:00 PM",
        "total_spots": 500,
        "consumer_price": 169,
        "venue_base_rate": 120,
        "park_ease_fee": 49,
        "event_tier": "Standard IPL",
        "distance_to_gate_metres": 180,
        "gate_name": "Gate 2",
        "covered_parking": True,
        "entry_windows": ["5:30-7:00 PM", "7:00-8:30 PM"],
        "redirect_threshold_spots": 450,
        "lots": [
            {"id": "north", "name": "JLN North Lot", "total": 300, "distance_m": 180, "gate_name": "Gate 2"},
            {"id": "south", "name": "JLN South Lot", "total": 200, "distance_m": 280, "gate_name": "Gate 4"},
        ],
        "prohibited_items": [
            "Professional cameras / DSLR",
            "Outside food & beverages",
            "Laser pointers",
            "Selfie sticks / tripods",
            "Power banks above 20,000 mAh",
        ],
        "amenities": [
            "Covered parking",
            "Pillar-mapped bays",
            "QR entry enforcement",
            "Pre-assigned bay number",
        ],
        "created_at": datetime.now(timezone.utc).isoformat(),
    })

    # --- Bays (North lot: B-01 to B-20, South lot: C-01 to C-15) ---
    north_taken = {"B-01", "B-04", "B-07", "B-10", "B-13", "B-16", "B-19"}
    south_taken = {"C-01", "C-03", "C-07", "C-10", "C-12"}

    bay_docs = []
    for i in range(1, 21):
        code = f"B-{i:02d}"
        bay_docs.append({
            "event_id": event_id,
            "lot_id": "north",
            "lot_name": "JLN North Lot",
            "pillar_code": code,
            "status": "taken" if code in north_taken else "available",
        })
    for i in range(1, 16):
        code = f"C-{i:02d}"
        bay_docs.append({
            "event_id": event_id,
            "lot_id": "south",
            "lot_name": "JLN South Lot",
            "pillar_code": code,
            "status": "taken" if code in south_taken else "available",
        })
    bays_col.insert_many(bay_docs)

    # --- Seed ~435 mock bookings to get fill rate to ~87% (PRD demo value) ---
    # We create virtual bookings (not tied to specific bays) to simulate 87% fill
    mock_bookings = []
    for idx in range(435):
        lot_id = "north" if idx < 265 else "south"
        mock_bookings.append({
            "booking_id": f"PE-SEED-{idx:04d}",
            "event_id": event_id,
            "bay_id": f"SEED-{idx:03d}",
            "lot_id": lot_id,
            "phone": f"98765{10000+idx}",
            "entry_window": "5:30-7:00 PM",
            "group_size": 1,
            "amount_paid": 169,
            "status": "confirmed",
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
    if mock_bookings:
        bookings_col.insert_many(mock_bookings)


# ---------------------------------------------------------------------------
# WebSocket connection manager for live scarcity updates
# ---------------------------------------------------------------------------
class LiveCounterManager:
    def __init__(self):
        self.connections: dict[str, list[WebSocket]] = {}

    async def connect(self, event_id: str, ws: WebSocket):
        await ws.accept()
        if event_id not in self.connections:
            self.connections[event_id] = []
        self.connections[event_id].append(ws)

    def disconnect(self, event_id: str, ws: WebSocket):
        if event_id in self.connections:
            self.connections[event_id] = [c for c in self.connections[event_id] if c != ws]

    async def broadcast(self, event_id: str):
        if event_id not in self.connections:
            return
        data = _get_live_counts(event_id)
        if data is None:
            return
        msg = json.dumps(data)
        dead = []
        for ws in self.connections[event_id]:
            try:
                await ws.send_text(msg)
            except Exception:
                dead.append(ws)
        for ws in dead:
            self.disconnect(event_id, ws)


def _get_live_counts(event_id: str):
    doc = events_col.find_one({"event_id": event_id}, {"_id": 0, "total_spots": 1, "redirect_threshold_spots": 1})
    if not doc:
        return None
    total = doc["total_spots"]
    booked = bookings_col.count_documents({"event_id": event_id, "status": "confirmed"})
    spots_remaining = max(total - booked, 0)
    fill_percent = round((booked / total) * 100) if total > 0 else 0
    return {
        "type": "live_count",
        "spots_remaining": spots_remaining,
        "booked_spots": booked,
        "fill_percent": fill_percent,
        "total_spots": total,
        "redirect_active": booked >= doc.get("redirect_threshold_spots", total),
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


live_manager = LiveCounterManager()


# ---------------------------------------------------------------------------
# App lifecycle
# ---------------------------------------------------------------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    seed_demo_data()
    yield


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Pydantic models
# ---------------------------------------------------------------------------
class BookingCreate(BaseModel):
    event_id: str
    bay_id: str
    lot_id: str
    phone: str
    entry_window: str
    group_size: int = 1


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.get("/api/events")
def list_events():
    docs = list(events_col.find({}, {"_id": 0}))
    return docs


@app.get("/api/events/{event_id}")
def get_event(event_id: str):
    doc = events_col.find_one({"event_id": event_id}, {"_id": 0})
    if not doc:
        raise HTTPException(404, "Event not found")

    # Compute live spots remaining
    booked_count = bookings_col.count_documents({"event_id": event_id, "status": "confirmed"})
    total = doc["total_spots"]
    spots_remaining = max(total - booked_count, 0)
    fill_percent = round((booked_count / total) * 100) if total > 0 else 0

    doc["booked_spots"] = booked_count
    doc["spots_remaining"] = spots_remaining
    doc["fill_percent"] = fill_percent
    doc["booking_count"] = booked_count
    doc["redirect_active"] = booked_count >= doc.get("redirect_threshold_spots", total)

    return doc


@app.get("/api/events/{event_id}/bays")
def get_bays(event_id: str, lot_id: Optional[str] = None):
    query = {"event_id": event_id}
    if lot_id:
        query["lot_id"] = lot_id
    docs = list(bays_col.find(query, {"_id": 0}))
    return docs


@app.get("/api/events/{event_id}/stats")
def get_event_stats(event_id: str):
    """Operator dashboard stats"""
    doc = events_col.find_one({"event_id": event_id}, {"_id": 0})
    if not doc:
        raise HTTPException(404, "Event not found")

    booked_count = bookings_col.count_documents({"event_id": event_id, "status": "confirmed"})
    total = doc["total_spots"]
    spots_remaining = max(total - booked_count, 0)
    fill_percent = round((booked_count / total) * 100) if total > 0 else 0

    # Per-lot stats
    lot_stats = []
    for lot in doc.get("lots", []):
        lot_booked = bookings_col.count_documents({"event_id": event_id, "lot_id": lot["id"], "status": "confirmed"})
        lot_total = lot["total"]
        lot_percent = round((lot_booked / lot_total) * 100) if lot_total > 0 else 0
        lot_stats.append({
            "name": lot["name"],
            "total": lot_total,
            "booked": lot_booked,
            "percent": lot_percent,
        })

    redirect_threshold = doc.get("redirect_threshold_spots", total)
    redirect_active = booked_count >= redirect_threshold

    # Mock redirect CTA taps (based on fill rate for demo)
    redirect_cta_taps = max(0, round((fill_percent - 50) * 2.36)) if fill_percent > 50 else 0
    compliance_rate = 0.55

    return {
        "event_name": doc["event_name"],
        "venue": f"{doc['venue']}, {doc['city']}",
        "date": doc["date"],
        "event_status": "live",
        "total_spots": total,
        "booked_spots": booked_count,
        "spots_remaining": spots_remaining,
        "fill_percent": fill_percent,
        "redirect_cta_taps": redirect_cta_taps,
        "compliance_rate": compliance_rate,
        "redirect_threshold_spots": redirect_threshold,
        "redirect_active": redirect_active,
        "lots": lot_stats,
        "last_updated": datetime.now(timezone.utc).strftime("%H:%M"),
    }


@app.post("/api/bookings", status_code=201)
async def create_booking(data: BookingCreate):
    # Check event exists
    event = events_col.find_one({"event_id": data.event_id}, {"_id": 0})
    if not event:
        raise HTTPException(404, "Event not found")

    # Check bay is available
    bay = bays_col.find_one({"event_id": data.event_id, "pillar_code": data.bay_id}, {"_id": 0})
    if not bay:
        raise HTTPException(404, "Bay not found")
    if bay["status"] == "taken":
        raise HTTPException(409, "Bay already taken")

    # Check phone length
    if len(data.phone) != 10:
        raise HTTPException(400, "Phone must be 10 digits")

    # Create booking
    booking_id = f"PE-{datetime.now(timezone.utc).strftime('%Y')}-{uuid.uuid4().hex[:8].upper()}"
    booking_doc = {
        "booking_id": booking_id,
        "event_id": data.event_id,
        "bay_id": data.bay_id,
        "lot_id": data.lot_id,
        "phone": data.phone,
        "entry_window": data.entry_window,
        "group_size": data.group_size,
        "amount_paid": event["consumer_price"],
        "status": "confirmed",  # Mock payment — auto-confirm
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    bookings_col.insert_one(booking_doc)

    # Mark bay as taken
    bays_col.update_one(
        {"event_id": data.event_id, "pillar_code": data.bay_id},
        {"$set": {"status": "taken"}}
    )

    # Broadcast live count to all connected WebSocket clients
    await live_manager.broadcast(data.event_id)

    # Return booking without _id
    booking_doc.pop("_id", None)
    return booking_doc


@app.get("/api/bookings/{booking_id}")
def get_booking(booking_id: str):
    doc = bookings_col.find_one({"booking_id": booking_id}, {"_id": 0})
    if not doc:
        raise HTTPException(404, "Booking not found")

    # Enrich with event + bay details
    event = events_col.find_one({"event_id": doc["event_id"]}, {"_id": 0})
    bay = bays_col.find_one({"event_id": doc["event_id"], "pillar_code": doc["bay_id"]}, {"_id": 0})

    lot_info = {}
    if event:
        for lot in event.get("lots", []):
            if lot["id"] == doc["lot_id"]:
                lot_info = lot
                break

    return {
        **doc,
        "event_name": event["event_name"] if event else "",
        "venue": f"{event['venue']}, {event['city']}" if event else "",
        "date": event["date"] if event else "",
        "consumer_price": event["consumer_price"] if event else 0,
        "bay_pillar_code": doc["bay_id"],
        "lot_name": lot_info.get("name", ""),
        "distance_to_gate_metres": lot_info.get("distance_m", 0),
        "gate_name": lot_info.get("gate_name", ""),
    }


# ---------------------------------------------------------------------------
# WebSocket: Live scarcity counter
# ---------------------------------------------------------------------------
@app.websocket("/api/ws/events/{event_id}/live")
async def websocket_live_counter(websocket: WebSocket, event_id: str):
    await live_manager.connect(event_id, websocket)
    # Send initial count immediately
    data = _get_live_counts(event_id)
    if data:
        await websocket.send_text(json.dumps(data))
    try:
        while True:
            # Keep connection alive, listen for pings
            msg = await websocket.receive_text()
            if msg == "ping":
                await websocket.send_text(json.dumps({"type": "pong"}))
    except WebSocketDisconnect:
        live_manager.disconnect(event_id, websocket)


# ---------------------------------------------------------------------------
# Demo simulation: fake bookings to show live counter in action
# ---------------------------------------------------------------------------
@app.post("/api/events/{event_id}/simulate-booking")
async def simulate_booking(event_id: str):
    """Create a fake booking to demonstrate live counter updates."""
    event = events_col.find_one({"event_id": event_id}, {"_id": 0})
    if not event:
        raise HTTPException(404, "Event not found")

    booked = bookings_col.count_documents({"event_id": event_id, "status": "confirmed"})
    if booked >= event["total_spots"]:
        return {"message": "Event is full", "spots_remaining": 0}

    idx = booked + 1
    lot_id = "north" if idx % 2 == 0 else "south"
    bookings_col.insert_one({
        "booking_id": f"PE-SIM-{uuid.uuid4().hex[:8].upper()}",
        "event_id": event_id,
        "bay_id": f"SIM-{idx:03d}",
        "lot_id": lot_id,
        "phone": f"90000{10000+idx}",
        "entry_window": "5:30-7:00 PM",
        "group_size": 1,
        "amount_paid": event["consumer_price"],
        "status": "confirmed",
        "created_at": datetime.now(timezone.utc).isoformat(),
    })

    # Broadcast to all connected clients
    await live_manager.broadcast(event_id)

    new_count = bookings_col.count_documents({"event_id": event_id, "status": "confirmed"})
    return {
        "message": "Simulated booking created",
        "spots_remaining": max(event["total_spots"] - new_count, 0),
        "booked_spots": new_count,
    }
