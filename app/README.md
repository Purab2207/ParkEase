# ARCHIVED — Phase 0 Vite Prototype

This directory is the **Phase 0 prototype** (React 19 + Vite + Tailwind v4).  
It is kept for reference and is deployed to Vercel for demo purposes.

**It has no backend.** All data is mocked. Do not build new features here.

The active codebase is in `../frontend/` (React CRA) + `../backend/` (FastAPI).

---

## What's here

- `src/screens/` — S1 VenueLanding through S6 RetentionScreen (all mocked)
- `src/components/` — Navbar, AuthModal, SearchOverlay
- `src/App.jsx` — React Router v7, URL-based routing (`/`, `/booking`, `/confirmation`, `/redirect`, `/dashboard`, `/retain`)
- `vercel.json` — Vercel SPA rewrite config

## Running (for reference only)

```bash
cd app
npm install
npm run dev     # http://localhost:5173
```
