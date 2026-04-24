
[[ParkEase_PRD]]

---

[https://fuchsia-elyssa-23.tiiny.site](https://fuchsia-elyssa-23.tiiny.site)

# What changed from v1 — and why

## Correction 1 — Revenue structure

v1 modelled ParkEase as collecting the full consumer price and remitting 30% to the venue. Real comparable platforms — ShowMyParking at Coldplay Ahmedabad (₹500 for four-wheelers), SpotHero (10–30% commission), Indian stadium base rates (₹100–200) — all show a **platform fee on top of the venue's base rate**. ParkEase does not own the base rate. It adds a fee on top.

||Structure|ParkEase net (₹149 tier)|
|---|---|---|
|**v1 — wrong**|Collect ₹149 → remit ₹45 to venue|₹104/spot|
|**v2 — correct**|₹100 venue base + ₹49 ParkEase fee|~₹47/spot (post gateway)|

## Correction 2 — Ops cost methodology

v1 divided event ops cost by booked spots (₹8,500 ÷ 175 = ₹48.6/spot), inflating the apparent cost. Industry standard treats per-event ops as a **fixed cost per event, divided by total inventory**.

||Method|Result|
|---|---|---|
|**v1 — inflated**|÷ 175 booked spots|₹48.6/spot|
|**v2 — correct**|÷ 500 total mapped spots|₹17/spot|

## Correction 3 — Marquee pricing

v1 capped marquee at ₹249. ShowMyParking charged **₹500 for four-wheelers** at Coldplay Ahmedabad. Marquee tier updated to ₹450 (₹300 venue base + ₹150 ParkEase fee).

---

# 1 · Revenue model — corrected

ParkEase earns a **platform fee on top of the venue's own base parking rate**. The consumer sees one total price. The venue collects their base via ParkEase's payment flow. ParkEase keeps the fee. This matches the model used by ShowMyParking, SpotHero, and ParkMobile globally.

## Pricing tiers

|Event scale|Attendees|Venue base|ParkEase fee|Consumer pays|PE net (post gateway)|
|---|---|---|---|---|---|
|Small/mid concert|10k–20k|₹100|₹49 (33%)|₹149|**₹48**|
|Standard IPL|25k–35k|₹120|₹49 (29%)|₹169|**₹48**|
|Large concert|40k+|₹150|₹49 (25%)|₹199|**₹48**|
|Marquee event|60k+|₹300|₹150 (33%)|₹450|**₹146**|

> **Key insight**

> ParkEase's fee as a % of total consumer price ranges from 25–33%. This is within the 10–30% commission range observed for SpotHero and is defensible given ParkEase adds pre-booking, QR enforcement, and the compliance report — none of which ShowMyParking provides at equivalent depth.

## Stream B — B2B platform fee

|Tier|When|Fee|Rationale|
|---|---|---|---|
|Pilot|Event 1 only|₹0|Trust-building. ParkEase earns only consumer fees.|
|Annual contract|Events 2–8|₹15k–25k/event|Dashboard + compliance report + SLA.|
|Enterprise|10+ events/yr|₹10k/event|Volume discount locks in renewal.|

> **No cab/shuttle referral revenue at MVP.** Deep-links to Ola/Uber/Rapido are not monetised. If redirect compliance is validated, a Rapido referral deal becomes V2 revenue. Do not model it at MVP.

---

# 2 · Unit economics — corrected

**Model event:** Standard IPL match, Chinnaswamy Bangalore · 500 spots · Consumer price ₹169 (₹120 venue + ₹49 PE fee) · MVP fill rate 35% = 175 spots sold.

## Revenue waterfall — corrected

|Line|Amount|
|---|---|
|ParkEase platform fee collected (175 × ₹49)|₹8,575|
|Gateway fee (~2.36% on ₹49 × 175)|−₹353|
|**Net platform fee revenue**|**₹8,222**|
|Venue base flow-through (175 × ₹120) — passthrough, not ParkEase revenue|₹21,000 passthrough|

## Per-event fixed ops cost — corrected methodology

|Cost item|Amount|
|---|---|
|Bay pillar mapping (0.5 person-day + photography)|₹4,000|
|Printed fallback list + lamination|₹600|
|Physical entry banner (prohibited items)|₹400|
|Attendant briefing + on-ground coordination|₹3,000|
|Push notification infra (per-event)|₹500|
|**Total fixed ops cost per event**|**₹8,500**|
|Per total spot (÷ 500 inventory) — how operators calculate|₹17/spot|
|Repeat venue events 3–8 (no re-mapping needed)|₹4,500/event|

## Contribution margin — fill rate sensitivity

|Fill rate|Spots sold|Fee revenue|New venue CM|Repeat venue CM|
|---|---|---|---|---|
|25%|125|₹5,875|−₹2,625|₹1,375|
|**35% (MVP target)**|**175**|**₹8,225**|**−₹275**|**₹3,725**|
|45%|225|₹10,575|₹2,075|₹6,075|
|55%|275|₹12,925|₹4,425|₹8,425|
|65% (Year 1)|325|₹15,275|₹6,775|₹10,775|
|75%|375|₹17,625|₹9,125|₹13,125|

> **Critical finding v1 missed**

> At 35% fill on a **new venue**, ParkEase is contribution-negative by ₹275. The ₹8,500 ops cost exceeds the ₹8,222 platform fee revenue. The first event at any new venue is a **trust investment, not a profit event**. Break-even on variable ops requires ~45% fill at a new venue, or any positive fill at a repeat venue. v1 obscured this by conflating venue remittance with ParkEase revenue.

## Summary metric cards

|Metric|MVP (new venue)|MVP (repeat venue)|Year 1 (repeat venue)|
|---|---|---|---|
|Contribution margin|**−₹275**|**₹3,725**|**₹10,775**|
|Net per spot (post gateway)|₹47|₹47|₹47|
|Ops cost per event|₹8,500|₹4,500|₹4,500|

---

# 3 · LTV analysis — corrected inputs

Same contribution-based LTV methodology (correct), recalculated with ₹47 net fee per spot instead of v1's inflated ₹104.

||Arjun (repeat solo booker)|Rahul (group organiser)|
|---|---|---|
|Bookings/year (PE events)|3|2–3|
|Contribution/booking (Y1, repeat venue)|₹33|₹33|
|Direct Year 1 LTV|**₹99**|**₹66**|
|Network referrals generated|1–2|4–6 secondary users|
|Network-adjusted Year 1 LTV|**~₹350**|**~₹250+**|
|v1 stated LTV (overstated)|~~₹252~~|~~₹168~~|

> **Implication for product strategy**

> With corrected unit economics, neither Arjun nor Rahul generates meaningful LTV on their own within Year 1. The business case is not built on consumer LTV — it is built on the **B2B platform fee (₹15k–25k/event)** layered on top of volume consumer transactions. This is the correct framing for a B2B2C marketplace at pre-scale stage.

---

# 4 · B2B flywheel — corrected

## Annual contract economics — 8 events, corrected (Y1 fill rate 65%)

|Line|Amount|
|---|---|
|Events 1–2: new venues, 65% fill (325 × ₹47 − ₹8,500) × 2|₹13,550|
|Events 3–8: repeat venues, 65% fill (325 × ₹47 − ₹4,500) × 6|₹64,650|
|B2B platform fees (₹15k × 8 events)|₹1,20,000|
|**Total annual contribution — 1 Siddharth**|**₹1,98,200**|
|B2B fee as % of total contribution|**60.5%**|

> **The B2B fee now carries 60% of the economic weight.**

> In v1 the B2B fee was a supplement to consumer revenue. In the corrected model it is the **primary driver**. If ParkEase cannot get Siddharth to pay the platform fee, consumer-only economics are marginal at best. The platform fee conversation must happen in the first sales call, not at contract renewal.

## Event-by-event economics (visual)

|Event|Consumer fee revenue|B2B platform fee|Ops cost|Net contribution|
|---|---|---|---|---|
|Ev 1 (new venue)|₹15,275|₹0|−₹8,500|₹6,775|
|Ev 2 (new venue)|₹15,275|₹0|−₹8,500|₹6,775|
|Ev 3 (repeat)|₹15,275|₹15,000|−₹4,500|₹25,775|
|Ev 4 (repeat)|₹15,275|₹15,000|−₹4,500|₹25,775|
|Ev 5 (repeat)|₹15,275|₹15,000|−₹4,500|₹25,775|
|Ev 6 (repeat)|₹15,275|₹15,000|−₹4,500|₹25,775|
|Ev 7 (repeat)|₹15,275|₹15,000|−₹4,500|₹25,775|
|Ev 8 (repeat)|₹15,275|₹15,000|−₹4,500|₹25,775|
|**Total**|**₹1,22,200**|**₹1,20,000**|**−₹44,000**|**₹1,98,200**|

> **Vehicles diverted — methodology note**
> Pre-pilot benchmark: 55% (Western market). Post-Event-1: replace with India baseline. Sensitivity: at 30% compliance ~35 vehicles diverted, at 20% ~24. Compliance report always shows raw tap count + discounted estimate with rate labelled. Lead with exit clearance time as primary metric — treat vehicles diverted as supporting evidence.

---

# 5 · Break-even analysis — corrected

## Fixed costs — unchanged

|Item|Monthly|Annual|
|---|---|---|
|Tech infrastructure|₹15,000|₹1,80,000|
|Founder 1 salary (Product/Ops)|₹80,000|₹9,60,000|
|Founder 2 salary (Tech)|₹80,000|₹9,60,000|
|Legal (SLA contracts, retainer)|₹10,000|₹1,20,000|
|B2B sales (travel, demos)|₹20,000|₹2,40,000|
|Misc (domain, tools, comms)|₹5,000|₹60,000|
|**Total fixed costs**|**₹2,10,000**|**₹25,20,000**|

## Break-even scenarios

|Scenario|Annual contribution|vs Fixed costs|Verdict|
|---|---|---|---|
|Consumer-only, no B2B fee|~₹1,08,000 (20 events, Y1)|−₹24,12,000|Not viable|
|10 annual contracts, Y1|₹19,82,000|−₹5,38,000|Near break-even|
|**15 annual contracts, Y1**|**₹29,73,000**|**+₹4,53,000**|**Break-even**|

> **Scenario 1 — Consumer only**

> Needs ~20 events/month to cover fixed costs at Y1 contribution rates. A 2-person team running manual bay mapping cannot physically deliver 20 events/month. Consumer-only model without the B2B layer is not operationally viable.

> **Scenario 2 — 10 annual contracts (harder than v1 suggested)**

> Gap is ₹5.38L — larger than v1's ₹3.2L. Requires seed funding or deferred founder comp to bridge. Still achievable within 12–18 months if Bangalore pilot closes by month 3.

> **Scenario 3 — 15 annual contracts (break-even)**

> 15 Siddharthas across 2–3 cities by end of Year 1. Ambitious but not unrealistic if Bangalore pilot generates a compliance report that travels. Each compliance report shared with a municipal authority reaches the next Siddharth.

## 12-month contribution trajectory

|Month|New contracts|Monthly contribution|Cumulative contribution|
|---|---|---|---|
|M1–M2|0 (pilot in progress)|₹0|₹0|
|M3|1 pilot event fires|₹6,775|₹6,775|
|M4|Annual contract signed|₹6,775|₹13,550|
|M5|Events 3–4 + B2B fee active|₹17,550|₹31,100|
|M6|2nd organiser added|₹28,325|₹59,425|
|M7|Scaling to 3 organisers|₹39,100|₹98,525|
|M8|Mumbai expansion begins|₹57,650|₹1,56,175|
|M9||₹76,200|₹2,32,375|
|M10||₹94,750|₹3,27,125|
|M11||₹1,22,300|₹4,49,425|
|M12|10 contracts active|₹1,49,850|₹5,99,275|

> Monthly fixed cost burns ₹2,10,000/month throughout. Cumulative fixed cost by M12 = ₹25,20,000. Cumulative contribution by M12 = ₹5,99,275. **Funding gap = ~₹19,20,725** — the seed requirement before the model reaches contribution break-even at 15 contracts in Year 1.

---

# 6 · GTM strategy

Zero paid marketing in Stage 1. Every consumer acquisition flows through a B2B relationship.

## The acquisition chain

```
Founder-curated target list (30–40 venues/operators)
    → Warm intro via college fest contact  OR  Cold email timed to documented failure
        → Discovery call (listening mode)
            → Pitch call + pilot scope
                → Siddharth signs B2B contract
                    → Arjun discovers ParkEase at BMS checkout
                        → Arjun's group chat → Rahul activates via ticket link
                            → Varun sees redirect → word of mouth
                                → Priya finds via Google / parent WhatsApp group
                                    → Compliance report travels → next Siddharth
```

## Stage sequence

|Stage|Timeline|Gating condition|Exit criteria|
|---|---|---|---|
|Bangalore pilot|M1–M3|B2B contract signed|First compliance report generated, redirect rate measured|
|Annual contract conversion|M4–M6|Pilot compliance report|Siddharth requests 8-event contract|
|Mumbai/Delhi expansion|M7–M12|B2B buyer in second city|Two Tier 1 cities operational, 1 annual contract signed|

> **Revised pilot structure based on corrected economics**

> Event 1 — waive B2B platform fee (trust-building). Events 2–8 — full ₹15k–25k/event. This concession costs less than it appears. The first-event margin is already thin at new-venue ops cost (−₹275 CM). Giving away the B2B fee on event 1 costs ₹15k in foregone revenue. Giving it away on events 2–8 would cost ₹1,05,000 — 60% of total annual economics.

---

# 7 · Risk register — corrected

## High severity

> **B2B platform fee resistance is now existential, not just commercial**

> In v1 the B2B fee was a bonus stream. In v2 it's 60% of event economics. If Siddharth refuses to pay it after a successful pilot, ParkEase's per-event contribution is ₹10,775 vs ₹25,200 monthly fixed costs. The platform fee is non-negotiable at scale. Sales must be built around this from conversation one.

> **First event at every new venue is contribution-negative**

> At 35% MVP fill, new-venue ops cost (₹8,500) exceeds platform fee revenue (₹8,222). Every new venue is a −₹275 loss before fixed costs. The B2B annual contract must be signed before bay mapping begins — not after.

> **Compliance rate risk**
> Below 25% materially weakens the compliance report. Mitigation: make raw CTA tap count the headline metric. Municipal authorities respond to exit clearance time, not diversion estimates.

## Medium severity

> **Platform fee pricing has no direct India comparable**

> ShowMyParking, ValetEZ, and GetMyParking do not publish B2B dashboard/compliance report pricing. The ₹15k–25k/event fee is anchored on value (liability transfer + compliance report) rather than market rate. The first negotiation with Siddharth will set the benchmark for all subsequent contracts.

> **Consumer fee as % of total price is visible and contestable**

> **BMS baseline:** BookMyShow charges 18–20% convenience fee on ticket face value — roughly ₹270 on a ₹1,500 concert ticket — for a product someone else built. The user gets nothing additional; it is a pure friction tax.
>
> **ParkEase comparison:** ₹49 on a ₹149 parking transaction is 33% by ratio but buys a named product: pillar-mapped bay, QR enforcement, scarcity visibility, redirect fallback, and a compliance-backed SLA. It is the price of the product itself, not a toll on someone else's product.
>
> **Informal parking comparison:** The real comparison shoppers make is ₹50–200 cash parking (no guarantee, no attendant accountability, vehicle-vandalism risk — confirmed by Yuvraj and Akshat in user research) vs ₹149 for a named guaranteed bay. On this framing, ₹49 wins on trust, not just price.
>
> **Framing rule:** The LocalCircles survey found 80% of Indian users flag hidden charges as a frustration on BookMyShow. The fee must be presented as a named, justified line item — "pre-booking + named bay guarantee" — in the S2 pricing breakdown, never buried as a convenience charge.
>
> **What would invalidate this:** Event 1 attach rate below 15% at the ₹149 price point would indicate price elasticity is the blocker, not framing. Triggers an A/B pricing test at V2.

## Lower severity

> **Marquee pricing upside is real but depends on exclusivity**

> The Coldplay ₹500 data point only works because ShowMyParking had a venue-level arrangement. ParkEase can only charge marquee-tier fees if the venue partnership agreement grants exclusive pre-booking rights. Without exclusivity, informal operators undercut and the price ceiling collapses.

---

# Summary — v2 vs v1

|Metric|v1 (wrong)|v2 (corrected)|Change|
|---|---|---|---|
|ParkEase net per spot (₹149 tier)|₹104|₹47|−55%|
|MVP new venue contribution margin|₹9,085|−₹275|Flipped negative|
|B2B fee share of event economics|~35%|60%|B2B is primary|
|Annual contracts for break-even|10|15|Harder target|
|Arjun Year 1 LTV|₹252|₹99|Corrected|
|Rahul Year 1 LTV|₹168|₹66|Corrected|
|Seed funding requirement|~₹40–60L|~₹50–70L|Gap is wider|

> **The business is still viable — the model is now honest.**

> The consumer fee economics are thin and that is correct for a marketplace at MVP. The B2B platform fee is what makes ParkEase financially viable, and that is now explicit in the numbers rather than obscured by an inflated take rate. A recruiter or investor reading this model sees a PM who ran sanity checks against real market data and corrected their own work. That is the point.

---

_Last updated: March 2026 · Phase 3 v2 · Sanity-checked against ShowMyParking Coldplay Ahmedabad data, SpotHero commission benchmarks, Indian stadium base rate data (₹100–200/vehicle), and Razorpay gateway fee structure (2% + 18% GST on platform fee)._