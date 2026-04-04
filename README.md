# ParkEase

Two-sided event parking platform for India. Pre-sells named parking bays to attendees; gives operators a live dashboard and compliance report; redirects overflow traffic to Ola/Uber/Rapido.

---

## Repository layout

```
/
├── frontend/          ← ACTIVE codebase  (React CRA + Tailwind v3 · port 3000)
├── backend/           ← ACTIVE codebase  (FastAPI + MongoDB · port 8001)
│
├── app/               ← ARCHIVED — Phase 0 Vite prototype (Vercel demo build)
├── 03_Code_Blueprints/← ARCHIVED — original dark-theme JSX blueprints
│
├── 01_Product/        ← Product — PRD
├── 02_Financials/     ← Financials — Business Valuation
└── 04_Handover/       ← Handover doc and roadmap
```

**If you want to run the product: use `frontend/` + `backend/`.**  
`app/` is the Phase 0 prototype kept for reference; it has no backend.

---

## Running locally

### Backend (FastAPI + MongoDB)
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env          # set MONGO_URL and DB_NAME
uvicorn server:app --reload --port 8001
```

### Frontend (React)
```bash
cd frontend
npm install
echo "REACT_APP_BACKEND_URL=http://localhost:8001" > .env
npm start                     # runs on port 3000
```

---

## Phase status

| Phase | Description | Status |
|-------|-------------|--------|
| 0 | React prototype (6 screens, all mocked) | Complete — `app/` |
| 1 | MVP backend: inventory DB, real-time scarcity, UPI payment flow | In progress — `frontend/` + `backend/` |
| 2 | Operator dashboard backend | Not started |
| 3 | B2B integrations (BMS, Ola/Uber API) | Not started |

---

## Tech stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Tailwind CSS v3, React Router v6 |
| Backend | FastAPI, MongoDB, WebSockets |
| Phase 0 prototype | React 19, Vite, Tailwind v4, React Router v7 |
| Deployment (Phase 0) | Vercel (root: `app/`) |
