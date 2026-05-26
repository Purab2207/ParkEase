# Security Notes — ParkEase Demo

ParkEase is a **portfolio demo**. It is not deployed to real users and does not process real payments or store production PII. This document records what is intentionally kept demo-friendly, what has been hardened, and what a production build would require.

---

## Intentionally demo-only (by design)

| Feature | Behaviour | Why it stays |
|---|---|---|
| OTP `0000` bypass | Any email authenticates with code `0000` | Lets reviewers explore the flow without a phone. Gated behind `DEMO_MODE=true`; setting `DEMO_MODE=false` disables it and falls through to real OTP validation. |
| UPI payment simulation | Generates a real UPI deep link to demo VPA `parksease@okaxis`. The VPA is not a registered merchant account — any attempted transaction will be rejected at the UPI network level. No Razorpay/Cashfree SDK integrated. | Razorpay/Cashfree integration requires a merchant account. Not scoped for the demo. |
| Client-side bay state | Bay availability tracked in React state, not live DB | Supabase Realtime sync is functional but the bay grid uses in-memory state to keep the demo self-contained without live traffic. |

---

## What has been hardened (enforced in this codebase)

### Secrets & hygiene
- `backend/.env` is covered by the root `.gitignore` (`*.env` rule) — never committed.
- `.env.example` documents all required variables with placeholder values only.
- No API keys appear anywhere in the frontend bundle.

### Rate limiting (`slowapi`)
- `POST /api/auth/request-otp` — 3 requests/minute/IP
- `POST /api/auth/verify-otp` — 10 requests/minute/IP
- `POST /api/bookings` — 10 requests/minute/IP

### CORS
Explicit allowlist: origins `[park-ease-rho.vercel.app, localhost:3000, localhost:5173]`, methods `GET POST OPTIONS`, headers `Content-Type Authorization X-Dashboard-Key`. No wildcard.

### Operator dashboard access control
- `GET /api/events/{id}/stats` requires `X-Dashboard-Key` header matching `DASHBOARD_API_KEY`.
- `POST /api/events/{id}/simulate-booking` requires both `DEMO_MODE=true` AND `X-Dashboard-Key`.
- The `/dashboard` React route prompts for a PIN compared to `VITE_OPERATOR_PIN` (default: `1234` for demo).

### Booking lookup (IDOR mitigation)
`GET /api/bookings/{id}` requires one of:
- `X-Dashboard-Key` header (operator access), OR
- `?email=<owner-email>` query param matching the booking's stored email.

Direct guessing of a booking ID returns HTTP 401. Production path: validate a Supabase JWT and check `booking.user_id == auth.uid()`.

### Input validation
All booking fields validated server-side via Pydantic:
- `phone` — must be exactly 10 digits
- `vehicle_number` — max 15 chars, alphanumeric/spaces/hyphens only
- `group_size` — integer 1–6
- `email` — basic format check on OTP request

### Race condition (spots_remaining)
`POST /api/bookings` calls `decrement_spots(event_id)` Postgres RPC which uses a server-side `spots_remaining - 1` expression — no read/write race. Falls back to non-atomic decrement if the RPC hasn't been created yet (see SQL below).

### UPI ID input
The manual UPI ID field in the payment modal validates format (`name@provider`) before enabling the Pay button. Empty or malformed IDs are rejected client-side.

### Silent booking failure (demo fallback)
If the backend is unreachable, `createBooking` in `api.js` returns a `DEMO-{timestamp}` booking ID rather than throwing. This keeps the demo flow intact when Railway is cold or offline. The confirmation screen detects the `DEMO-` prefix and reads booking context from `localStorage` instead of Supabase. Production path: remove the catch block and surface the error to the user.

### Accessibility
- OTP inputs carry `aria-label="OTP digit N of 6"`.
- AuthModal has `role="dialog" aria-modal="true"` and a Tab focus trap.

---

## Required actions before any real-user deployment

1. **Rotate the Supabase service key** — the key that was historically in `backend/.env` has been rotated out of scope for this demo. A new key must be generated in the Supabase dashboard before any production use.
2. **Rotate the Resend API key** — same reason.
3. Run `git rm --cached backend/.env` if the file was ever committed in git history, then force-push (or use `git filter-repo`).
4. Set `DEMO_MODE=false` in the production environment.
5. Add `DASHBOARD_API_KEY` to backend host env vars and `REACT_APP_DASHBOARD_KEY` to Vercel env vars.
6. Run this SQL once in Supabase SQL Editor to enable the atomic decrement RPC:

```sql
create or replace function decrement_spots(event_id text)
returns void language sql as $$
  update events
  set spots_remaining = greatest(spots_remaining - 1, 0)
  where id = event_id;
$$;
```

---

## Out of scope for demo — required for production

| Gap | Production fix |
|---|---|
| No real session tokens | Use Supabase Auth; return JWT on login; validate on every write endpoint |
| No Row-Level Security | Enable RLS on `users`, `bookings`, `bays`; restrict reads to `auth.uid()` |
| No real payment gateway | Integrate Razorpay UPI; webhook to flip booking from `pending` → `confirmed` |
| No error tracking | Sentry (`sentry-sdk[fastapi]` + `@sentry/react`) |
| Emergency override is frontend state only | Persist to DB; check flag server-side on every booking creation |
| WebSocket endpoint missing | Implement `/api/ws/events/{id}/live` in FastAPI with `websockets` |
| No DB backups | Enable Supabase Pro for PITR, or nightly `pg_dump` to cloud storage |
