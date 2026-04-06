# ParkEase — Condensed PRD
**Version:** 2.0 · **Date:** April 2026 · **Author:** Purab
**Status:** Solution Review — Prototype live (9 screens, Vercel). First live event not yet secured.
**Resources:** [Prototype](../app/) · [Financials](../02_Financials/) · [Handover](../04_Handover/ParkEase_Handover_2026-03-31.md)

---

## 1. Executive Summary

ParkEase is a software layer that pre-sells named parking bays to event attendees, gives operators a live dashboard and auto-generated compliance report, and redirects overflow traffic to Ola/Uber/Rapido when the lot fills.

**The problem:** Post-event exit surge at India's large-scale live events is a predictable, recurring coordination failure — not a parking shortage — and no product exists to shape attendee demand before it collapses the infrastructure.

**The market:** India's live events market is ₹20,861 crore (2024), growing 15% YoY. ~110–130 structured-venue events/year in Tier 1 cities are addressable at MVP.

**Current state:** 9-screen Vercel prototype is live and demoable. No live event secured yet. All persona motivations are hypothesis-based — Event 1 is the validation checkpoint.

**MVP targets:** 35% parking fill rate · 25–30% redirect CTA tap rate · <45% checkout drop-off

---

## 2. Problem Alignment

**The problem in one sentence:** Post-event exit surge at India's large-scale live events is a predictable, recurring coordination failure — not a parking shortage — and no product exists to shape attendee demand before it collapses the infrastructure.

**Why it matters to customers:** Indian event-goers regularly spend 1–3 hours trapped in post-event gridlock that is entirely avoidable. Priya skips events over parking uncertainty. Arjun sits in his car for 90 minutes after an IPL match. Rahul's group blames each other for arriving late to find no parking.

**Why it matters to the business:** Event organisers carry reputational and compliance risk with zero tools to manage it. A fatal stampede at Chinnaswamy, documented chaos at Diljit Delhi, highway gridlock after Coldplay Mumbai — these are not freak incidents. They are the natural outcome of zero pre-sold parking, zero demand shaping, and no structured alternative when the lot fills.

**Evidence:**
- **RCB Chinnaswamy, June 2025** — post-match gridlock caused a fatal stampede. Police FIR filed against the organiser. Karnataka government fast-tracked the Crowd Control Bill 2025.
- **Diljit Dosanjh, Delhi, January 2025** — overcrowding, wristband theft, organisers fleeing the venue. *Business Standard* documented the chaos.
- **Coldplay, Mumbai, January 2025** — highway gridlock 30+ minutes post-show. *Free Press Journal* documented the congestion.
- **Karnataka Crowd Control Bill 2025** — creates a formal compliance obligation around crowd and parking management that did not formally exist before. The ParkEase compliance report is the document that satisfies it.

---

## 3. Market Context

India's live events market: ₹20,861 crore (2024), growing 15% YoY. Live music specifically: ~₹11,600 crore (2025), CAGR 17.5% through 2034.

**ParkEase's addressable slice — bottom-up:**

| Category | Events/year (Tier 1) | Structured parking? |
|---|---|---|
| IPL home games (5 Tier 1 franchises × ~8 games) | ~40 | ✅ All stadiums have numbered pillar parking |
| Major international concerts (Coldplay, Travis Scott scale) | ~15–20 | ~50% — stadium/mall venues only |
| Domestic tours (Arijit, Diljit, Karan Aujla scale) | ~30–40 | ~50% |
| Large comedy, festivals, other | ~20–30 | ~40% |
| **Total addressable (structured venues, Tier 1)** | **~110–130/year** | |

**Revenue per event (avg):** 600 bays × ₹175 avg price × 75% fill + ₹20,000 B2B platform fee = **~₹1 lakh/event**
**Year 1 realistic target** (20–25 events): **₹20–25 lakh** · **Full Tier 1 penetration**: **~₹1.2 crore/year**

**Competitive positioning:**

| Competitor | What they do | ParkEase difference |
|---|---|---|
| ShowMyParking | Aggregates existing parking supply | No pre-booking, no demand shaping, no compliance report |
| ValetEZ | Physical valet management at venues | Operations-only, no consumer app, no redirect |
| BookMyShow | Ticketing with informal parking links | Add-on link only — no named bay, no operator dashboard |
| Google Maps | Navigation | Post-arrival only, no pre-booking |

ParkEase's differentiator is what happens *after the lot fills*. No competitor addresses this.

---

## 4. Personas

*All persona journeys are hypothesis-based — built from documented event failures, behavioural analogues, and founder inference. No primary interview data exists yet. Treat as directional until validated by Event 1 (see OQ7).*

| Persona | Snapshot | Core Pain | Core Objection | Key Product Decision |
|---|---|---|---|---|
| **Arjun Rao** | 28, software engineer, Bangalore. 4–6 events/year. Plans ahead, pays for convenience. | 90 mins stuck leaving Chinnaswamy after IPL. | "Is this actually guaranteed or will I show up and the spot is gone?" | Named pillar bay (not zone allocation) is the primary trust signal. Bay mapping is the enabling ops step. |
| **Priya Sharma** | 35, drives from Thane with two children. Low risk appetite. Has skipped events over parking uncertainty. | Arrived at confirmed parking 20 mins from entry gate with no signage and children. | "Will the parking actually be close to the venue entry gate?" | Distance to entry gate is the headline conversion metric — above price, above availability. |
| **Rahul Kumar** | 21, college student, Delhi. Events in groups of 4–6. Price-sensitive, last-minute planner. | Group arrived late, missed the opening act, got blamed. | "Can we split the parking payment between 4 people?" | Scarcity converts, price does not. ₹75 split 4 ways is invisible. One Rahul = 4–6 people redirected. |
| **Siddharth Mehta** | 38, ops head at a large live events company. 15–30 events/year. Risk-averse, KPI-obsessed. | Fears viral gridlock video linked to his event, compliance notices, zero data. | "If your app fails on event night, you become my liability." | Manual fallback (printed list at every gate) closes the sale. Compliance report is the B2B acquisition channel. |

**Persona stories — today, without ParkEase:**

**Arjun:** Drives to Chinnaswamy for an IPL match. There is no pre-booking option. He arrives 30 minutes before the match to find the lot full. He parks informally 1.5km away. After the match, he sits in his car for 90 minutes waiting for the crowds to thin. He does the same thing at the next match.

**Siddharth:** His company organised the Diljit Delhi concert. A viral video of the exit gridlock has 400,000 views. A municipal authority has sent a compliance notice. He has no data, no report, and no product that could have prevented it. His MD asks what they will do differently next time. He has no answer.

---

## 5. Goals & Metrics

### Measurable Goals
1. **35% parking fill rate** at first live event (MVP) — the minimum that triggers the redirect mechanism and generates a credible compliance report
2. **25–30% redirect CTA tap rate** when parking is full — validates the core demand-shifting hypothesis
3. **<45% checkout drop-off rate** — honest floor given UPI first-authorisation friction on unfamiliar apps

### Immeasurable Goals
1. **Arjun should feel certain** — not optimistic, *certain* — that his named bay will exist when he arrives. Certainty, not convenience, is what this product sells.
2. **Priya should feel prepared** — every logistical unknown (distance to gate, prohibited items, signage) resolved before she leaves home. She should not have to think on arrival.
3. **Siddharth should feel protected** — that if an official asks about crowd management the morning after the event, he has a credible document to hand over.

### Metrics Tree

```
NORTH STAR
└── Parking Fill Rate per Event
    ├── Definition:   % of pre-booked inventory sold before event day
    ├── MVP Target:   35%
    └── Year 1:       65%

    Why this is the North Star: If fill rate is high, the redirect triggers.
    If the redirect triggers, behaviour change is tested. If behaviour change
    works, the compliance report has its strongest data point. Every downstream
    metric depends on fill rate being high.

    ├── LEADING:   Parking attach rate at checkout
    │              % of ticket buyers who add parking at checkout
    │              MVP: 8% · Year 1: 14%
    │              India adjustment: lower floor than Western benchmarks (8–18%)
    │              due to UPI first-authorization friction on unfamiliar apps.
    │
    ├── LEADING:   Redirect CTA tap rate (when parking full)
    │              % of users who tap the cab redirect when shown the full screen
    │              MVP: 25–30% · Year 1: 38–42%
    │              ⚠️ Methodology note: tap rate measures intent, not confirmed
    │              cab booking. Hard conversion requires V2 Ola/Uber API callback.
    │              The 55% compliance discount (tap → actual diversion) is a
    │              Western benchmark (Waze/Google Maps). ParkEase India baseline
    │              replaces it after Event 1. Both figures shown on dashboard
    │              transparently — methodology honesty is a product feature.
    │
    ├── B2B PROOF: Lot exit clearance time reduction
    │              % reduction vs. unmanaged industry baseline at same venue
    │              MVP: 35% reduction · Year 1: 50%
    │              Baseline source: Business Standard (Diljit Delhi) + Free Press
    │              Journal (Coldplay Mumbai) — 60–90 min industry baseline.
    │              Direct same-night measurement requires V2 sensor integration.
    │
    ├── GUARDRAIL: Spot utilisation rate >70% MVP · >80% Year 1
    │              % of bookings where user arrives and uses the spot.
    │              UPI upfront collection naturally suppresses no-shows.
    │
    ├── GUARDRAIL: Checkout drop-off rate <45% MVP · <28% Year 1
    │              India's UPI first-authorization abandon rate runs 35–50%.
    │              45% is the honest MVP floor. Drops sharply after first
    │              successful transaction and once BookMyShow brand association
    │              is established.
    │
    └── RETENTION: Repeat booking rate 25%
                   Window calibrated to event type — not a fixed rolling window.
                   IPL/leagues: 30–45 days. Annual concerts: 6–12 months.
                   Domestic festivals: 6 months.
```

*Note: Fill rate is the gate condition for all downstream metrics — no fill means no redirect trigger, no compliance report data, and no B2B retention story. Redirect CTA tap rate is the closest alternative but cannot be measured without fill rate being high first. Fill rate stays as North Star.*

---

## 6. Non-Goals

These define where ParkEase's responsibility begins and ends. As important as the goals.

1. **ParkEase does not operate shuttle or cab fleets.** We redirect to Ola/Uber/Rapido — we do not procure or schedule vehicles. Running a fleet is a different business, permanently out of scope.

2. **ParkEase does not handle in-venue navigation.** Our product boundary ends at the parking entry gate. Seat-finding, food stalls, stage navigation — the venue's responsibility.

3. **ParkEase does not serve venues without structured, numbered parking.** Open grounds and informal lots are incompatible with named bay allocation. This is a deliberate market constraint, not a temporary limitation.

4. **ParkEase does not replace ticketing platforms.** We are a parking and transit layer on top of BookMyShow and similar infrastructure. We do not sell tickets or manage event access.

5. **ParkEase does not manage in-venue crowd management.** Security queues, entry gate management, and in-venue congestion are entirely the organiser's responsibility. Our compliance report covers parking performance only.

6. **ParkEase does not guarantee cab availability after redirect.** We facilitate access to three platforms simultaneously — we take no responsibility for driver cancellations or surge pricing. Three-platform deep-links and honest fare estimates mitigate but do not eliminate this risk.

---

## 7. High Level Approach

ParkEase is a software layer that pre-sells named parking bays to event attendees, gives operators a live dashboard and auto-generated compliance report, and redirects overflow traffic to Ola/Uber/Rapido when the lot fills.

We do not own or operate parking infrastructure, run shuttle fleets, or compete with event ticketing platforms. We add a pre-booking and demand-shifting layer on top of venue infrastructure that currently exists but is entirely unmanaged.

---

## 8. Key Features — MoSCoW

**Must Have — ship before Event 1**

1. Named bay allocation with pillar map display (S1, S2)
2. Real-time inventory counter — live spots remaining
3. QR booking confirmation with **offline caching** — generated and stored on device at confirmation, works with zero connectivity on event night
4. Parking full → redirect screen (S4) with Ola/Uber/Rapido deep-links and pre-filled venue drop zone
5. Operator dashboard — live fill rate, spots remaining, redirect count, per-lot status, alert feed (S5)
6. Auto-generated PDF compliance report
7. Manual fallback printed booking list — physical ops, gate attendants
8. SLA and liability contract template — ParkEase is the booking software agent only; physical ops liability stays with organiser; ParkEase liability capped at refund value of bookings processed that night
9. Emergency override in dashboard (S5 operator controls)
10. S9 Attendant Scanner — QR scan, plate verification, bay reassignment for blocked bays
11. Manual inventory seeding + bay pillar mapping (ops task, not tech feature)
12. WhatsApp forward CTA on confirmation (S3) ✅ built — pre-formatted booking summary with per-person split amount

**Should Have — ship if time allows before Event 1**

13. Pre-event push notification with departure nudge timed to user home location
14. UPI split calculator — per-person amount, UPI collect request to contacts
15. Distance to entry gate as headline on venue page (Priya's primary conversion metric)
16. Prohibited items banner — physical sign at lot entry (ops deliverable, not a tech feature)

**Could Have — V2**

- Ola/Uber API callback for confirmed ride booking (hard conversion measurement)
- Dynamic exit routing via Google Maps API
- Operator self-service inventory input (removes manual seeding bottleneck at scale)
- True escrow group booking (each person authorises their share independently)

*Note on RICE vs strategic sequencing:* The operator dashboard (S5) scores low on RICE Reach (serves 1 persona). Strategic reasoning overrides RICE — without Siddharth saying yes, there is no consumer product at all.

---

## 9. Prototype — Live Screens

**Live site:** https://park-ease-rho.vercel.app
**Stack:** React 19 · Tailwind CSS v4 · React Router v7 · Vite
**Status:** 9 screens, data-driven, auto-deploys on push to `main`.

### Consumer Flow

**S1 — Venue Landing** · `/events/:eventId`
*Attendee's first touchpoint — live scarcity + named bay selection*
Hero image, live scarcity bar (spots remaining), lot selector, Google Maps directions to gate, OTP auth trigger.

**S2 — Booking Flow** · `/events/:eventId/book`
*5-step checkout — designed to complete in under 2 minutes*
Bay grid → arrival window → pricing breakdown → vehicle number → UPI pay.

**S3 — Booking Confirmation** · `/confirmation/:bookingId`
*The screen Arjun screenshots and WhatsApps to his group*
UPI payment QR → entry pass QR → bay details → WhatsApp forward + Google Maps to gate. Entry QR cached offline at confirmation — works with zero signal on event night.

**S4 — Parking Full → Redirect** · `/redirect`
*The hypothesis screen — do Indian attendees book a cab when parking is full?*
Sold-out state, Ola/Uber/Rapido deep-links with venue drop zone pre-filled, redirect tracking label. Event 1 measures this tap rate.

### Operator Flow

**S5 — Operator Dashboard** · `/dashboard`
*Siddharth's entire product interaction — the B2B acquisition screen*
Live fill rate gauge, per-lot occupancy bars, redirect CTA count, colour-coded alert feed, manual override controls (show ends early / lot blocked / emergency), PDF compliance report download.

### Retention Flow

**S6 — Retention / Re-engagement** · `/retain`
*Converts one-time bookers into repeat users*
Past booking recap, upcoming event recommendations, one-tap re-book CTA.

**S7 — RCB Booking** · `/retain/book`
*Partner-branded variant — demonstrates white-label capability to B2B buyers*
RCB dark theme booking flow: bay grid in brand colours, group size + pricing + vehicle number.

**S8 — RCB Confirmation** · `/retain/confirm`
*Same QR mechanics as S3 — partner colour scheme applied throughout*
Named bay entry QR, gate directions, booking ID — all in RCB dark theme.

### Ground Staff Flow

**S9 — Attendant Scanner** · `/attendant`
*Closes the loop between "booking confirmed" and "bay actually occupied" — feeds compliance report*
Ground-staff PWA with offline manifest caching. Shift login + OTP + zone selection, ready-to-scan state with live/offline indicator, match (green) / mismatch (red) result with plate comparison, bay reassignment flow + session audit log.

---

## 10. Key Flows

### Consumer Flow — Arjun

| Stage | Touchpoint | User Action | Emotional State | Friction | Product Response |
|---|---|---|---|---|---|
| Trigger | BookMyShow checkout | Taps parking add-on | Excited, cautious | Price + trust doubt | Real-time scarcity counter + price anchoring vs. informal parking |
| Booking | ParkEase screen | Reviews spot details, pays | Cautiously hopeful | "Is it actually guaranteed?" | Named pillar bay + lot map + cancellation policy |
| Day of event | Push notification | Taps for directions | Organised | Tendency to leave late | Timed departure nudge 30 mins before recommended leave time |
| Arrival | Physical gate | Shows QR, parks | Moment of truth | Spot taken or mislabelled | Offline QR enforcement + pre-mapped pillar bay; attendant has reassignment authority |
| Post-event exit | Push notification | Follows exit guidance | Relieved | Exit congestion anxiety | Static section-based exit routing (MVP) |
| Retention | Re-engagement notification | Books next event | Confident, no hesitation | None — trust established | Scarcity nudge tied to next event announcement |

### Operator Flow — Siddharth

| Stage | Touchpoint | Action | Emotional State | Friction | Product Response |
|---|---|---|---|---|---|
| Outreach | Targeted email + one-pager | Reads email, takes the call | Cautious | Generic pitches are ignored | Email references a documented failure by name; includes manual fallback detail upfront |
| Sales call | 30-min call | Asks 3 liability questions; agrees to pilot | Objection-heavy | "Who is liable if it fails?" | Contractual SLA scoping ParkEase liability; pilot event waives B2B platform fee |
| Pre-event setup | Operator dashboard | Configures event, reviews pre-event fill data | Methodical | Dashboard must work before event night, not just on it | Full functional dashboard from day of configuration |
| Event night | Dashboard — live | Monitors in real time, no manual intervention needed | Alert | Must trust data accuracy under pressure | Live fill rate, redirect count, per-lot status, automated alert feed |
| Post-event | Dashboard PDF download | Downloads report, shares with MD and authorities | Relieved | Report must hold up to municipal scrutiny | Auto-generated PDF: honest methodology notes, industry baseline comparison (Business Standard + FPJ), raw CTA tap count + discounted estimate |
| Retention | Internal review → contract negotiation | MD asks to scale; Siddharth negotiates annual contract | Confident, then evaluating | Fee must be justified, not discounted | ₹15k–₹25k/event presented as risk insurance; the pilot compliance report is the justification — fee conversation happens *after* the report, never before |

### Booking Flow Architecture

S2 implements a 5-step progressive disclosure model. Each step unlocks the next only when complete; completed steps collapse to summary chips.

1. **Inventory Signal** (always visible) — real-time scarcity banner, fill progress bar, urgency copy
2. **Bay Selection** — lot tabs + bay grid per pillar code; selection advances to Step 3 automatically
3. **Arrival Time Window** — entry window picker (5:30–7:00 PM / 7:00–8:30 PM); informs ops of expected arrival distribution
4. **Pricing Breakdown** — venue base rate + ParkEase service fee + group split calculator (1–6 people) with per-person amount in real time
5. **UPI Payment** — single sticky CTA, disabled until bay and window are both selected

*Guardrail dependency: the <45% checkout drop-off guardrail depends directly on this progressive disclosure pattern. Any regression to a flat all-at-once form must be evaluated against this guardrail before shipping.*

---

## 11. Key Logic — Rules and Edge Cases

These are the rules design and engineering work to. Edge cases are grounded in documented Indian event failures.

**Rule 1 — Inventory buffer (always enforce)**
Never pre-sell more than 80% of allocated inventory at any event. The 20% buffer absorbs VIP commandeering, authority vehicle override, and last-minute venue changes — all documented at Indian stadium events. Pre-selling 90% to maximise revenue is the wrong trade-off at MVP.

**Rule 2 — Bay reassignment protocol**
If a pre-booked bay is physically blocked or damaged on event day: attendant reassigns user to nearest available unbooked bay in the same lot. User is never turned away. Blocked bay logged in operator dashboard. WhatsApp notification sent to affected user within 5 minutes of reassignment.

**Rule 3 — Venue exclusivity is non-negotiable in the SLA**
If the venue's own parking team sells physical tokens or cash entry at the same lot ParkEase has pre-sold inventory in, the entire product promise collapses simultaneously for all users. The partnership agreement must include an exclusivity clause: ParkEase has sole authority to admit vehicles to designated lots during the event window. This is a contract failure — not a tech failure — and only the SLA prevents it.

**Rule 4 — App down is a planned state, not an emergency**
Network congestion inside a 35,000-person venue is the highest-probability tech failure ParkEase faces — and has nothing to do with our infrastructure. The product must work without connectivity. Mitigation sequence: (a) QR code cached offline at booking confirmation — works with zero signal. (b) Manual fallback printed list at every gate — attendant cross-checks name and vehicle plate. (c) Pre-event notification embeds QR as a screenshot-able image for additional redundancy.

**Rule 5 — Honest redirect copy, always**
When parking is full and surge pricing is active, the redirect screen acknowledges it: *"Cab prices may be higher than usual right now — this is still faster than finding parking."* Hiding surge information to improve tap rate trades short-term conversion for long-term trust. Three-platform deep-links (Ola + Uber + Rapido) shown simultaneously — if one platform has no cabs or a driver cancels, user has instant fallback without returning to ParkEase.

---

## 12. Launch Plan

| Stage | Timeline | Description | Exit Criteria |
|---|---|---|---|
| **Prototype Validation** | M1–M2 | Demo Vercel prototype to 3–5 event organiser contacts in Bangalore. No backend, no real bookings. Consumer story (S1→S3) and operator story (S5) both demoable in 60 seconds. | At least one organiser expresses genuine pilot intent |
| **Event 1 — First Live Pilot** | M3–M4 | Single venue, Bangalore, 15,000–25,000 attendees, structured parking. Conservative inventory: 50–60% of lot capacity pre-sold. Manual ops throughout. B2B platform fee waived. | Redirect CTA rate measured. First compliance report generated. Zero catastrophic failures (app down, lot oversold, QR enforcement collapse). |
| **Events 2–8 — Annual Contract** | M5–M7 | Apply Event 1 learnings. Same city, possibly same venue. B2B platform fee introduced from Event 2. WhatsApp CTA and UPI split tested at scale. | Organiser signs 8-event annual contract at ₹15k–₹25k/event. Repeat booking rate measurable. |
| **Second City Expansion** | M8–M12 | Mumbai or Delhi — where B2B relationship is strongest. Same playbook: single venue, conservative inventory, manual ops. | Two Tier 1 cities operational. One annual contract signed in second city. |

*What determines pace: not a calendar — the B2B sales relationship. Each stage unlocks when Siddharth says yes, not when a sprint ends.*

**B2B acquisition chain:**
```
Siddharth signs B2B contract
    → Arjun discovers ParkEase at BMS checkout
        → Arjun's group chat → Rahul activates via ticket link
            → Varun sees redirect → word of mouth
                → Priya finds via Google / parent WhatsApp group
                    → Compliance report travels → next Siddharth
```

---

## 13. Risks

**R1 — Core hypothesis may be wrong** *(most existential)*
The entire product rests on one behavioural bet: Indian event-goers shown a parking full screen will book a cab instead of finding informal parking. If redirect compliance at MVP falls below 20%, the demand-shifting mechanism has failed.
*Mitigation:* Redirect screen designed as a conversion asset — fare estimate, three platform options, honest surge copy. Event 1 data becomes the new compliance baseline. Never present 55% as confirmed.

**R6 — Single failure creates disproportionate brand damage** *(most urgent for Event 1 sequencing)*
ParkEase is a trust product. One visible failure — app down at an IPL match, lot oversold, QR enforcement collapse — is visible to 35,000 people simultaneously. Indian social media amplifies event failures rapidly.
*Mitigation:* First event deliberately under-promised. Mid-sized event, structured venue, conservative inventory limit. R1 and R6 are connected — a bad first event is simultaneously a product failure and a reputational failure. This is why Event 1 must be small and safe.

**R2 — B2B sales cycle is slower than expected** *(most likely to delay timeline)*
No consumer product without Siddharth saying yes. India's events industry sales cycle is relationship-driven — 2–3 months per deal.
*Mitigation:* Primary channel: warm intro through college event/fest contacts (faster trust, smaller scale, more forgiving if something goes wrong). Secondary: cold email timed to a documented failure, referencing the Event 1 compliance report.

**R7 — Venue authority overrides inventory on event day** *(high probability, under-planned)*
Police, municipal officials, and VIP security routinely commandeer 10–20% of parking bays with zero notice at Indian stadium events.
*Mitigation:* (1) Never pre-sell >80% of inventory — 20% buffer held as unassigned reserve at every event. (2) Force majeure clause in organiser contract: notify ParkEase of any bay loss ≥30 minutes before doors open. (3) Attendant scanner triggers WhatsApp notification to affected user with new bay within 5 minutes. (4) If no alternate bay available: instant refund + Ola/Uber/Rapido redirect — same S4 flow.

**R5 — Venue infrastructure limits addressable market**
Bay allocation requires structured, numbered parking. Many Indian concert venues (open grounds, MMRDA, NICE Grounds) have no numbered infrastructure.
*Mitigation:* Venue audit checklist in sales process. Stadium complexes and mall-adjacent venues are MVP target. Open grounds explicitly out of scope.

**R3 — V2 Ola/Uber API access is uncertain**
MVP deep-links work without a partnership. V2 conversion tracking needs a referral callback API. Both platforms have selective partner programmes.
*Mitigation:* Rapido is the more accessible early-stage partner. Primary V2 API target.

**R4 — Manual inventory is a bottleneck at scale**
Bay mapping and manual seeding is manageable for one event. Five events across three cities simultaneously requires a team that does not exist yet.
*Mitigation:* Operator self-service inventory input (V2) reduces ops dependency. Prioritise early in V2 to prevent a growth ceiling.

---

## 14. Open Questions — What Event 1 Must Answer

**OQ1 — What is the actual redirect compliance rate in India?** *(most important unknown)*
Western benchmarks (Waze/Google Maps) suggest 35–40%. India's driving culture, informal parking availability, and cab trust levels are different. Below 20% means the product's core differentiation does not exist.
*How we answer it:* Event 1 generates the number. Redirect screen designed for maximum conversion. Measured: tap rate (confirmed) + estimated diversion (tap count × compliance rate). Result determines whether V2 investment is justified.

**OQ4 — Which city and venue for Event 1?**
Criteria: structured numbered parking, 15,000–25,000 attendees, cooperative ops team, strong cab supply, organiser motivated by compliance protection.
*Recommendation:* Bangalore (Chinnaswamy or similar) — structured infrastructure, strong Ola/Uber/Rapido supply, tech-savvy audience, RCB stampede June 2025 creates active B2B urgency. Smaller college fest may be the safer Event 0.

**OQ3 — Will organisers accept the liability boundary as written?**
ParkEase's SLA covers the booking software layer only — bay assignment accuracy, system uptime, QR validation, refunds for ParkEase-caused errors. Physical ops liability stays with the organiser.
*How we answer it:* Legal review of liability cap structures used by comparable Indian event-tech vendors. Frame as "software warranty" not "operations guarantee" in all sales conversations from day one.

**OQ2 — What is the right consumer pricing?**
₹99–₹249 proposed based on event scale. Is demand price-elastic (lower price = higher attach rate) or price-inelastic (certainty value is the driver)?
*How we answer it:* Event 1 establishes attach rate at one price point. A/B pricing test at V2 if attach rate data is inconclusive.

**OQ5 — Manual to automated inventory: build, buy, or partner?**
Manual seeding works for MVP. V2 options: build own sensor network, operator self-service input, or partner with ValetEZ (already has ANPR cameras at Hyderabad and Bangalore venues).
*Recommendation:* ValetEZ partnership conversation after Event 1. Self-service input form in dashboard as interim V2 step regardless of partnership outcome.

**OQ6 — Multi-zone architecture: native or V2 rearchitecture?**
Some events span multiple stages and parking zones. Does not block MVP (single lot). Must be resolved before V2 feature development begins — the decision has compounding implications for dashboard design, bay mapping ops, and compliance report structure.

**OQ7 — User research gap**
All persona journeys are based on documented failures, behavioural analogues, and founder inference. No primary interview data exists yet. 5–8 concert/IPL attendee interviews and 1–2 venue ops conversations are planned before Event 1. Until then, all persona motivations should be treated as directional, not validated.

---

## Appendix

### Changelog

| Date | Decision | Detail |
|---|---|---|
| Mar 2026 | Financial model corrected v1 → v2 | v1 collected full consumer price and remitted 30% to venue — wrong. v2 models ParkEase fee on top of venue base rate (₹49 on ₹100–₹300 base). Net per spot corrected: ₹104 → ₹47. MVP new-venue contribution margin flipped from +₹9,085 to −₹275. B2B platform fee share corrected from ~35% to 60% of per-event economics. Annual contracts required for break-even revised from 10 to 15. |
| Apr 2026 | North Star confirmed: Fill Rate | Fill rate is the gate condition for all downstream metrics. Contribution-negative at MVP economics on a new venue (waived B2B fee) — that is a pricing decision, not a North Star argument. Redirect CTA tap rate is the closest alternative but cannot be measured without fill rate being high first. Decision: fill rate stays. |

---

*Full PRD (1,762 lines): `01_Product/ParkEase_PRD.md` — complete RICE scoring table, full edge case catalogue (15 scenarios across 5 categories), per-persona detailed journey stages with structured flow tables, operator dashboard build specification.*
