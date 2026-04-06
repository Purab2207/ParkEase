# ParkEase — Condensed PRD
**Version:** 1.0 · **Date:** April 2026 · **Author:** Purab
**Status:** Prototype live, 9 screens, deployed on Vercel. First live event not yet secured.

---

## 1. Executive Summary

ParkEase pre-sells named parking bays to Indian event attendees and gives operators a live dashboard and auto-generated compliance report. When parking fills, it redirects users to Ola/Uber/Rapido via deep-link.

**The core problem** is a coordination failure, not a parking shortage. Post-event exit surge is predictable, recurring, and entirely unsolved. Lots that could function under distributed demand collapse under a concentrated spike. No product exists to shape that demand before it arrives.

**The two-sided model:** consumer pre-booking (₹99–₹249/bay) funds operations; the B2B platform fee (₹15,000–₹25,000/event) is 60% of per-event contribution margin. The B2B buyer funds the distribution channel — every organiser who signs a contract brings ParkEase to every attendee at every event they run.

**North Star:** Parking fill rate per event — % of inventory sold before event day. MVP target: 35%. Year 1: 65%.

When fill rate rises, redirect triggers, behaviour change is tested, and the operator compliance report gains its most credible data point. Every downstream metric depends on fill rate being high.

**The core hypothesis — not yet validated:** When shown a parking full screen, Indian event-goers will book a cab instead of finding informal alternatives. Event 1 answers this.

---

## 2. Problem and Market

### The Coordination Failure

India's live events market now regularly draws 20,000–60,000 attendees per event in Tier 1 cities. The infrastructure around these venues is completely unmanaged.

Indian attendees rationally delay departure hoping crowds will thin — but when everyone does this simultaneously, it creates a concentrated exit surge that overwhelms parking capacity in minutes. The result: 1–3 hours of post-event gridlock that is entirely predictable, deeply recurring, and completely unsolved.

Three documented failures establish the B2B urgency:

- **RCB Chinnaswamy, June 2025** — post-match gridlock caused a fatal stampede. Police FIR filed against the organiser. Karnataka government fast-tracked the Crowd Control Bill 2025.
- **Diljit Dosanjh, Delhi, January 2025** — overcrowding, wristband theft, organisers fleeing the venue. Business Standard documented the chaos.
- **Coldplay, Mumbai, January 2025** — highway gridlock persisted 30+ minutes post-show. Free Press Journal documented the congestion.

These are not freak incidents. They are the natural outcome of a zero-baseline industry: no pre-sold parking, no demand shaping, no structured alternative when the lot fills. Event organisers carry reputational and compliance risk with no product to manage it.

**The Karnataka Crowd Control Bill 2025** is a regulatory tailwind: it creates a compliance obligation around crowd and parking management that did not formally exist before. The ParkEase compliance report is the document that satisfies this obligation.

### Market and Scope

**Total India live events market:** ₹20,861 crore (2024), growing 15% YoY. India live music specifically: ~₹11,600 crore (2025), CAGR 17.5% through 2034. India is increasingly a top-tier destination for international tours — 2025 saw Coldplay, Travis Scott, Bruno Mars, Ed Sheeran, and Rolling Loud all run India legs.

**ParkEase's addressable slice — bottom-up:**

| Category | Events/year (Tier 1) | Structured parking? |
|---|---|---|
| IPL home games (5 Tier 1 franchises × ~8 games) | ~40 matches/season | ✅ All stadiums have numbered pillar parking |
| Major international concerts (Coldplay, Travis Scott scale) | ~15–20/year | ~50% — stadium/mall venues only |
| Domestic tours (Arijit, Diljit, Karan Aujla scale) | ~30–40/year | ~50% — stadium/mall venues only |
| Large comedy, festivals, other | ~20–30/year | ~40% |
| **Total addressable (structured venues, Tier 1)** | **~110–130 events/year** | |

**Revenue per event (avg):** 600 bays × ₹175 avg price × 75% fill + ₹20,000 B2B platform fee = **~₹1 lakh per event**

**Year 1 realistic target** (20–25 events, first organiser relationships): **₹20–25 lakh**
**Full Tier 1 penetration** (120 events): **~₹1.2 crore/year**

As a % of total India live events market: ~0.006% — ParkEase is a new ancillary revenue layer that does not exist today, growing alongside the market at 15%+ YoY. The opportunity is not to take share from existing parking — it is to monetise a layer that is currently free, unmanaged, and causing the problem.

**Competitive positioning:**

| Competitor | What they do | ParkEase difference |
|---|---|---|
| ShowMyParking | Aggregates existing parking supply | No pre-booking, no demand shaping, no compliance report |
| ValetEZ | Physical valet management at venues | Operations-only, no consumer app, no redirect |
| BookMyShow | Ticketing with informal parking links | Add-on link only, no named bay, no operator dashboard |
| Google Maps | Navigation | Post-arrival only, no pre-booking |

ParkEase's differentiator is what happens *after the lot fills*. No competitor addresses this.

**Venue constraint — acknowledged honestly:** The bay allocation model requires structured, numbered parking with pillar bay systems. Open grounds without numbered infrastructure are out of scope. MVP venue list: stadium complexes, mall-adjacent venues, purpose-built grounds with pillar parking. A venue audit checklist is part of the sales process before any partnership is signed.

---

## 3. Personas

*Note: All persona journeys are hypothesis-based — built from documented event failures, behavioural analogues (BookMyShow, Zomato, Waze), and founder inference. No primary interview data exists yet. These should be treated as directional until validated.*

| Persona | Snapshot | Core Pain | Core Objection | Primary Touchpoint | Key Product Decision |
|---|---|---|---|---|---|
| **Arjun Rao** | 28, software engineer, Bangalore. 4–6 events/year. Plans ahead, pays for convenience. | 90 mins stuck leaving Chinnaswamy after IPL. | "Is this actually guaranteed or will I show up and the spot is gone?" | S1 venue landing page, event email / QR code | Named pillar bay (not zone allocation) is the primary trust signal. Bay mapping exercise is the enabling ops step. |
| **Priya Sharma** | 35, drives from Thane with two children. Low risk appetite. Has skipped events over parking uncertainty. | Arrived at confirmed parking 20 minutes from the entry gate with no signage and children. | "Will the parking actually be close to the venue entry gate?" | Google search before buying tickets — she researches logistics before committing. | Distance to entry gate is the headline conversion metric — above price, above availability. A prohibited items banner at the lot entry is the detail that earns her trust. |
| **Rahul Kumar** | 21, college student, Delhi. Goes to events in groups of 4–6. Price-sensitive, FOMO-driven, last-minute planner. | Group arrived late, missed the opening act, got blamed. | "Can we split the parking payment between 4 people on the app?" | Ticket confirmation link embedded by B2B organiser — he does not find ParkEase independently. | Scarcity converts, price does not. ₹75 split 4 ways is invisible. UPI collect request post-booking removes the social friction of chasing friends. One Rahul conversion = 4–6 people redirected. |
| **Siddharth Mehta** | 38, ops head at a large live events company. Manages 15–30 events/year. Risk-averse, KPI-obsessed. | Fears viral gridlock video linked to his event, compliance notices from municipal bodies, zero data today. | "What if your app fails on event night and 40,000 people have nowhere to go? You become my liability." | Targeted outreach from ParkEase timed to a documented industry failure — not a cold pitch. | Manual fallback (printed booking list at every gate) closes the sale. The compliance report is the B2B acquisition channel. Platform fee conversation happens *after* the report lands on his MD's desk — never before. |

---

## 4. Features and Build Sequence

### MoSCoW

**Must Have — ship before Event 1**

1. Ola/Uber/Rapido deep-link redirect with venue drop zone pre-filled
2. Manual inventory seeding + bay pillar mapping exercise (ops)
3. Parking full → redirect screen (S4)
4. Real-time inventory counter — live spots remaining
5. Named bay allocation with pillar map display (S1, S2)
6. QR booking confirmation with offline caching (S3)
7. Operator dashboard — live fill rate, spots remaining, redirect count, per-lot status, alert feed (S5)
8. Auto-generated PDF compliance report
9. Manual fallback printed booking list — physical ops, gate attendants
10. SLA and liability contract template (legal — ParkEase is the **booking software agent**, not the physical lot operator. Physical ops liability stays with the organiser/venue. ParkEase's SLA covers: booking system uptime, correct bay assignment, QR validation accuracy, and refund processing for errors caused by ParkEase. ParkEase's total liability per event is capped at the refund value of bookings processed that night — not the organiser's broader event liability.)
11. Emergency override in dashboard (S5 operator controls)
12. S9 Attendant Scanner — QR scan, plate verification, bay reassignment for blocked bays
13. WhatsApp forward CTA on confirmation (S3) ✅ **already built** — one tap, pre-formatted booking summary with per-person split amount

**Should Have — ship if time allows before Event 1**

14. Pre-event push notification with departure nudge timed to user home location
15. Post-booking UPI split calculator — per-person amount, UPI collect request to contacts
16. Distance to entry gate as headline on venue page (Priya's primary conversion metric)
17. Prohibited items banner — physical sign at lot entry (ops deliverable, not a tech feature)

**Could Have — V2**

- Ola/Uber API callback for confirmed ride booking (hard conversion measurement)
- Dynamic exit routing via Google Maps API
- Operator self-service inventory input (reduces manual seeding bottleneck)
- True escrow group booking (each person authorises their share independently)

**Won't Have**

- IoT per-bay occupancy sensors
- Shuttle/fleet operations
- Open-ground venue support without numbered parking infrastructure

---

### Sprint Sequence

**Sprint 1 — Consumer booking core (S1, S2, S3)**
Named bay selection, UPI payment, QR confirmation. Group split calculator. WhatsApp forward CTA. Establishes the consumer trust arc (Arjun, Priya). Target: checkout drop-off rate <45%.

**Sprint 2 — Demand shifting (S4)**
Parking full detection, redirect screen with Ola/Uber/Rapido deep-links, cab fare estimate. This is the hypothesis being tested. Redirect screen is a conversion asset, not an information page.

**Sprint 3 — Operator dashboard (S5)**
Live fill rate, spots remaining, redirect trigger count, per-lot status, colour-coded alert feed, post-event exit clearance comparison vs. industry baseline. Manually seeded data at MVP. PDF compliance report download. This is Siddharth's entire product interaction.

**Sprint 4 — Retention and edge cases (S6–S8)**
Re-engagement flow, RCB-style retention screen, operator override controls. Pre-event notification nudge system.

**Sprint 5 — Attendant scanner (S9)**
Ground-staff PWA for QR scan at gate, plate verification, blocked bay reassignment. Closes the loop between "booking confirmed" and "bay actually occupied". Feeds verified occupancy data to compliance report.

*Note on RICE vs strategic sequencing:* The operator dashboard (S5) scores low on RICE Reach (serves 1 persona). Strategic reasoning overrides RICE here — without Siddharth saying yes, there is no consumer product at all. The dashboard is built in Sprint 3 despite its low Reach score.

---

## 5. Metrics

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

---

## 6. Risks

**R1 — Core hypothesis may be wrong** *(most existential)*
The entire product rests on one behavioural bet: Indian event-goers shown a parking full screen will book a cab instead of finding informal parking. If redirect compliance at MVP falls below 20%, the demand-shifting mechanism has failed.
Mitigation: Redirect screen designed as a conversion asset — fare estimate, three platform options, honest surge pricing copy. Event 1 data becomes the new compliance baseline. Never present 55% as confirmed.

**R6 — Single failure creates disproportionate brand damage** *(most urgent for Event 1 sequencing)*
ParkEase is a trust product. One visible failure — app down at an IPL match, lot oversold, QR enforcement collapse — is visible to 35,000 people simultaneously. Indian social media amplifies event failures rapidly (JLN, Diljit Delhi, Coldplay all demonstrated this). Existential at MVP stage with no brand equity to absorb the damage.
Mitigation: First MVP event must be deliberately under-promised. Mid-sized event, structured venue, conservative inventory limit (50–60% of total lot capacity pre-sold, not 90%). Build trust before volume. **R1 and R6 are connected** — a bad first event is simultaneously a product failure (R1) and a reputational failure (R6). This is why Event 1 must be small and safe.

**R2 — B2B sales cycle is slower than expected** *(most likely to delay timeline)*
No consumer product without Siddharth saying yes. India's events industry sales cycle is relationship-driven and slow — 2–3 months per deal. Protects existing informal parking revenue, resistant to new tech vendors.
Mitigation: Primary channel — warm intro through college event/fest contacts (lower barrier, faster trust, college fests are ideal for Event 1: smaller scale, forgiving if something goes wrong). Secondary channel — cold email to stadium-scale organisers timed to a documented failure, referencing the Event 1 compliance report.

**R5 — Venue infrastructure limits addressable market**
Bay allocation model requires structured, numbered parking. Many Indian concert venues (open grounds, MMRDA, NICE Grounds) have no numbered infrastructure. Addressable market is smaller than the headline live events number implies.
Mitigation: Venue audit checklist in sales process. Stadium complexes and mall-adjacent venues are MVP target. Open grounds are explicitly out of scope.

**R3 — V2 Ola/Uber API access is uncertain**
MVP deep-links work without a partnership. V2 conversion tracking needs a referral callback API. Both platforms have selective partner programmes with revenue share requirements.
Mitigation: Rapido is a more accessible early-stage partner and already integrated in Indian event ticketing flows. Primary V2 API partner.

**R4 — Manual inventory becomes a bottleneck at scale**
Bay mapping and manual seeding is manageable for one event. Five events across three cities simultaneously requires a team that does not exist yet.
Mitigation: Operator self-service inventory input (V2) reduces ParkEase ops dependency. Prioritise early in V2 to prevent a growth ceiling.

**R7 — Venue authority overrides inventory on event day** *(high probability, under-planned)*
At Indian stadium events, police, municipal officials, VIP security detail, and organiser guests routinely commandeer 10–20% of parking bays with zero notice — often within 90 minutes of doors opening. If ParkEase has pre-sold those bays, users arrive to find their confirmed spot physically occupied by authority vehicles. This is not a tech failure but it is a ParkEase product failure in the user's eyes.
Mitigation: (1) **Never pre-sell more than 80% of allocated inventory** — hold a 20% buffer as unassigned reserve at every event. (2) Add a force majeure clause to every organiser contract: organiser is contractually required to notify ParkEase of any bay loss ≥30 minutes before doors open. (3) Bay reassignment protocol: attendant scanner (S9) triggers WhatsApp notification to affected user with new bay number within 5 minutes of reassignment. (4) If no alternate bay is available, instant refund + Ola/Uber/Rapido redirect — same S4 flow. This scenario must be a named state in the S9 attendant scanner, not an unhandled edge case.

---

## 7. Open Questions — What Event 1 Must Answer

*These are the questions the MVP is specifically designed to validate. The personas, journeys, and metrics above are hypotheses. The questions below define what validation looks like.*

**OQ1 — What is the actual redirect compliance rate in India?** *(most important unknown)*
Western benchmarks (Waze/Google Maps) suggest 35–40%. India's driving culture, informal parking availability, and cab trust levels are different. The real number is unknown until Event 1. If it falls below 20%, the product's core differentiation does not exist. Everything downstream depends on this answer.
*How we answer it:* Event 1 generates the number. Redirect screen designed for maximum conversion. Measured: tap rate (confirmed), estimated diversion (tap count × compliance rate). Result determines whether V2 investment is justified.

**OQ4 — Which city and venue for Event 1?**
Criteria: structured numbered parking, 15,000–25,000 attendees, cooperative ops team, strong cab supply, organiser motivated by compliance protection.
Recommendation: Bangalore (Chinnaswamy or similar) — structured infrastructure, strong Ola/Uber/Rapido supply, tech-savvy audience, RCB stampede June 2025 creates active B2B urgency.
*How we answer it:* Warm intro through college/fest contacts as first path. Smaller college fest may be the safer Event 0 — even more forgiving, faster decision cycle.

**OQ3 — Will organisers accept the liability boundary as written?**
ParkEase's SLA covers the booking software layer only — bay assignment accuracy, system uptime, QR validation, refunds for ParkEase-caused errors. Physical ops liability (crowd management, gate security, lot access) stays with the organiser. The liability cap is the refund value of bookings that night. The question is whether organisers accept this boundary or push for ParkEase to absorb broader event liability (which it must not).
*How we answer it:* Legal review of liability cap structures used by comparable Indian event-tech vendors (BookMyShow, insider.in). Frame the SLA as "software warranty" not "operations guarantee" in all sales conversations from day one.

**OQ2 — What is the right consumer pricing?**
Proposed: ₹99–₹249 based on event scale. Key question: is demand price-elastic (lower price = higher attach rate) or price-inelastic (certainty value is the driver, price doesn't matter in the relevant range)?
*How we answer it:* Event 1 establishes the attach rate at one price point. A/B pricing test at V2 if attach rate data is inconclusive.

**OQ5 — Manual to automated inventory: build, buy, or partner?**
Manual seeding works for MVP. V2 options: build own sensor network, develop operator self-service input, or partner with ValetEZ (already has ANPR cameras at Hyderabad and Bangalore venues). ValetEZ partnership is the most efficient path — bypass sensor investment, share occupancy data, ParkEase provides the demand-shifting and booking layer.
*How we answer it:* ValetEZ partnership conversation after Event 1. Self-service input form in dashboard as interim V2 step regardless of partnership outcome.

**OQ6 — Multi-zone architecture: native support or rearchitecture in V2?**
Some events span multiple stages and parking zones. The data model either supports multi-zone natively or requires significant rearchitecture. This decision has compounding implications for the dashboard design, bay mapping ops process, and compliance report structure. Does not block MVP (single lot). Must be resolved before V2 feature development begins.

**OQ7 — User research gap**
All persona journeys above are based on documented event failures, behavioural analogues, and founder inference. No primary interview data exists yet. 5–8 concert/IPL attendee interviews and 1–2 venue ops conversations are planned before Event 1. Until then, all persona motivations and friction points should be treated as directional, not validated. This is the honest framing — not a gap to hide but a hypothesis to test.

---

*Full PRD (1,700 lines): `01_Product/ParkEase_PRD.md` — full RICE table, edge case catalogue (15 scenarios), per-persona flow tables, booking flow architecture spec.*
