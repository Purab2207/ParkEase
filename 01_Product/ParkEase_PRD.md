


Status: In Progress | Last Updated: March 2026 | Author: Purab

---

## Section 1 — Problem Statement

India's live events market is experiencing explosive growth — IPL matches, international tours (Rolling Loud, Travis Scott), and domestic festivals now regularly draw 20,000–60,000 attendees per event in Tier 1 cities. Yet the infrastructure around these venues remains completely unmanaged.

The problem is a coordination and behaviour failure, not simply a parking shortage. Indian attendees rationally delay departure hoping crowds will thin — but when everyone does this simultaneously, it creates a concentrated exit surge that overwhelms parking capacity in minutes. Lots that could function efficiently under distributed demand collapse entirely under this spike. No real-time information exists. No demand is shaped before it arrives.

The result: 1–3 hours of post-event gridlock that is entirely predictable, deeply recurring, and completely unsolved. Event organizers carry reputational and compliance risk with no product to manage it. Attendees are left with no structured alternative — they leave early, park kilometres away, or avoid driving altogether.

ParkEase addresses the root cause: shaping commute behaviour before the chaos begins.

---

---

## Section 2 — Success Metrics

ParkEase operates as a two-sided platform serving end consumers (attendees) and B2B clients (event organizers). The metrics framework reflects both sides, structured across four tiers: a North Star, leading indicators, a B2B proof point, and guardrails. All targets are India-adjusted and benchmarked against comparable platforms including SpotHero, BookMyShow, Waze, and Shuttl India.

---

### 2.1 North Star Metric

|   |   |   |   |
|---|---|---|---|
|Metric|Definition|MVP Target|Year 1 Target|
|Parking fill rate per event|% of pre-booked parking inventory sold before event day|35%|65%|

Rationale: This is the single number that determines whether everything else works. If parking fills, the demand-shifting redirect triggers. If the redirect triggers, behaviour change is tested. If behaviour change works, organizers see measurable gridlock reduction. Every downstream metric depends on this number being high.

A 35% MVP target reflects India's trust-building curve — slower than Western markets due to first-time UPI friction and add-on skepticism on new platforms. 65% by Year 1 is achievable once BookMyShow integration establishes trust by association.

---

### 2.2 Leading Indicators

These metrics signal whether the product is heading in the right direction before the North Star fully activates.

|   |   |   |   |   |
|---|---|---|---|---|
|Metric|Definition|MVP Target|Year 1 Target|India Adjustment|
|Parking attach rate at checkout|% of ticket buyers who add parking at the organizer checkout step|8%|14%|Lower floor vs. global benchmark (8–18%) due to Indian add-on skepticism and UPI first-authorization friction on unfamiliar apps|
|Redirect CTA tap rate when parking full|% of users who tap the cab/shuttle CTA when shown the parking sold-out screen|25–30%|38–42%|Adjusted down from Waze's 32–45% global compliance benchmark — Indian users exhibit higher distrust of redirects from unfamiliar apps at first exposure|

Note on redirect tracking: At MVP stage, redirect CTA tap rate serves as a proxy for behaviour change — it measures intent, not confirmed cab booking completion. This is a known architectural constraint of the Ola/Uber deep-link redirect and will be addressed in V2 via API callback integration for hard conversion confirmation.

Compliance methodology note: The 55% compliance discount is a Western market benchmark (Waze/Google Maps). This will be replaced with a ParkEase India baseline after Event 1. The compliance report shows both raw tap count and estimated diversion — methodology transparency is a product feature.

---

### 2.3 B2B Proof Point

The metric that closes the next organizer deal.

|   |   |   |   |   |
|---|---|---|---|---|
|Metric|Definition|MVP Target|Year 1 Target|India Adjustment|
|Average lot exit clearance time reduction|% reduction in time for a ParkEase-managed lot to fully clear post-event vs. unmanaged baseline at the same venue|35% reduction|50% reduction|India has an inherent structural advantage — existing parking attendant culture means QR-based entry enforcement requires zero new behaviour from ground staff. Even modest management improvement appears dramatic against a zero-baseline|

---

### 2.4 Guardrail Metrics

These are the floors we must never breach. Crossing these breaks operator trust or user trust — either kills the product.

|   |   |   |   |   |
|---|---|---|---|---|
|Metric|Definition|MVP Floor|Year 1 Target|India Adjustment|
|Pre-booked spot utilisation rate|% of bookings where the user actually arrives and uses the spot|>70%|>80%|Indians honour paid bookings at high rates — UPI upfront collection naturally suppresses no-shows. A non-refundable or partial-refund cancellation policy pushes this toward 80%+|
|Checkout drop-off rate|% of users who initiate the parking booking flow but abandon before payment completion|<45%|<28%|India's UPI first-authorization abandon rate on new apps runs 35–50%. 45% is the honest MVP reality. Drops sharply after the first successful transaction and once BookMyShow brand association is established. Note: MVP checkout is UPI-only by design — a single payment method reduces decision paralysis for a ₹169 transaction. Wallets, cards, and Pay Later are V2 additions if drop-off data indicates payment method is the barrier.|

---

### 2.5 Retention Signal

|   |   |   |   |
|---|---|---|---|
|Metric|Definition|Target|Measurement Window|
|Repeat booking rate|% of users who book parking for a second event after their first|25%|Event-type contextual — not a fixed window|

On measurement windows: A single fixed window is not appropriate for ParkEase given the diversity of event types served. The window must be calibrated to event frequency:

- IPL / recurring leagues → 30–45 day window (multiple fixtures per season)
    
- Annual concerts and international tours → 6–12 month window (once-a-year events)
    
- Domestic festivals → 6-month window
    

A 25% repeat booking rate within the relevant event-type window signals that trust has been established — the threshold at which, per Shuttl India data, reliable behavioural change becomes consistent.

---

### 2.6 Metrics Hierarchy Summary

NORTH STAR

└── Parking Fill Rate per Event

        ├── LEADING:     Attach Rate at Checkout         →  8% MVP   →  14% Y1

        ├── LEADING:     Redirect CTA Tap Rate           →  25–30% MVP   →  38–42% Y1

        ├── B2B:         Lot Exit Clearance Reduction    →  35% MVP   →  50% Y1

        ├── GUARDRAIL:   Spot Utilisation Rate           →  >70% MVP  →  >80% Y1

        ├── GUARDRAIL:   Checkout Drop-off Rate          →  <45% MVP  →  <28% Y1

        └── RETENTION:   Repeat Booking Rate             →  25% (event-type window)

  

---

---

## Section 3 — User Journeys

Each journey combines narrative storytelling (emotional states, product rationale) with a structured flow table (touchpoints, friction points, product responses). This dual format reflects strong product thinking — understanding the human experience while maintaining analytical precision.

---

### 3.1 Arjun Rao — The Urban Professional

Persona snapshot: 28, software engineer, Bangalore. Attends 4–6 events/year. Plans ahead, pays for convenience. Core trauma: 90 mins stuck leaving Chinnaswamy after IPL. Core objection: "Is this actually guaranteed, or will I show up and the spot is gone?"

Journey theme: A trust arc. Arjun isn't skeptical of technology — he uses BookMyShow, Zomato, Ola daily. He is skeptical of this specific promise. Every product decision in his journey must address that one doubt, progressively, until it is eliminated.

---

Stage 1 — Trigger | BookMyShow checkout | Excited, cautiously anxious

Arjun books 2 IPL tickets. At checkout, just above the payment button: "Guaranteed parking near Chinnaswamy — only 34 spots left. ₹199. Add to order?" Two signals hit simultaneously — scarcity (34 spots) and trivial price relative to ticket cost. Past trauma activates. He taps "Add."

Product decision: Parking must appear as a bundled checkout add-on, not a separate app flow. Real-time scarcity counter pulled from ParkEase inventory API — a static counter destroys credibility the moment a user notices it hasn't changed.

⚠️ MVP Entry Point Update: The BookMyShow checkout embed is a V2/partnership-phase feature requiring a formal BookMyShow integration agreement. For MVP, Arjun's entry point is the standalone ParkEase venue landing page (S1) — accessible via direct URL, QR code printed on event confirmation emails, or a link embedded in the event organiser's own communications. The scarcity counter and checkout experience are identical; only the discovery surface changes. The S1 venue page is the canonical MVP consumer entry point for all three personas.

---

Stage 2 — Booking Confirmation | ParkEase confirmation screen | Cautiously hopeful

Arjun sees: named spot (Pillar B, Bay 14), map showing exact bay location, entry window (5:30–7:00 PM), cancellation policy (full refund 24hrs before). The named bay — not a zone, a specific numbered bay — converts an abstract promise into something concrete and verifiable.

Product decision: Generic zone allocation ("Lot A") is insufficient. A pillar-mapped bay number is the primary trust signal. This requires a pre-event physical bay mapping exercise — a ParkEase team member walks the lot, photographs each pillar marker, and maps bay IDs into the system exactly as they appear on the physical structure. If the app says "Bay 14" but the pillar reads "B-14" or "Zone 2 Slot 14", the user is confused at the worst possible moment. This mapping is a non-negotiable ops requirement before every new venue goes live.

⚠️ Ops caution — Bay Pillar Mapping: Indian parking structures use pillar-based numbering (e.g., B-14) painted directly onto the structure. ParkEase must map to this existing system — not create a parallel one. Venue walkthrough + photography + bay catalogue must be completed and signed off in the venue partnership agreement before go-live.

---

Stage 3 — Day of Event | Push notification | Organised, in control

At 5:15 PM: "Your spot at Pillar B, Bay 14 is confirmed. Leave by 5:45 PM to arrive before gates open. Tap for directions." Reassurance + departure nudge in one notification. Directly counters India's lethargic departure behaviour.

Product decision: The pre-event push notification is a congestion management feature, not a UX nicety. Without this nudge, users leave late, arrive in the peak entry surge, and the physical experience degrades. Nudge timing calculated from user's home location set at booking.

---

Stage 4 — Arrival and Entry | Physical parking gate | First moment of truth

Attendant scans QR. Green light. Directed to Pillar B. Bay 14 is empty, clearly marked, exactly where the map showed it. Parks in under 3 minutes. For someone who previously circled a stadium for 45 mins, this feels extraordinary.

Product decision: If Bay 14 is occupied on arrival, the trust arc collapses permanently. QR entry enforcement prevents non-bookers from taking reserved bays. The pillar mapping exercise (Stage 2) ensures zero discrepancy between the app display and physical reality.

---

Stage 5 — Post-Event Exit | Push notification | Relieved, satisfied

Ten minutes before match ends: "Heading out? Exit via Gate C — estimated 8–12 minutes from Section B." Pre-configured section-based guidance — no live data dependency. Out in 11 minutes. Sends screenshot to friend group chat: "Bhai next time book parking here, got out in 10 mins."

Product decision — MVP vs V2: MVP = static section-based exit guidance. V2 = dynamic real-time routing via Google Maps API once venue traffic patterns are established across multiple events.

Strategic note: This notification is the word-of-mouth engine. Arjun's message in the group chat is the exact trigger by which Rahul (college group organiser) enters the product. These journeys are structurally connected.

---

Stage 6 — Retention Loop | Re-engagement notification, 3 weeks later | Receptive, no hesitation

"RCB Playoffs announced — parking spots near Chinnaswamy already 60% booked. Secure yours before they're gone." Books immediately. Trust arc complete.

---

#### Structured Flow Table

|   |   |   |   |   |   |
|---|---|---|---|---|---|
|Stage|Touchpoint|User Action|Emotional State|Friction Point|Product Response|
|Trigger|BookMyShow checkout|Taps parking add-on|Excited, cautious|Price + trust doubt|Real-time scarcity counter + trivial price anchoring|
|Booking confirmation|ParkEase screen|Reviews spot details|Cautiously hopeful|"Is it actually guaranteed?"|Named pillar bay + map + cancellation policy|
|Day of event|Push notification|Taps for directions|Organised|Tendency to leave late|Timed departure nudge 30 mins before recommended leave time|
|Arrival|Physical gate|Shows QR, parks|Moment of truth|Spot taken or mislabelled|QR enforcement + pre-mapped pillar bay system|
|Post-event exit|Push notification|Follows exit guidance|Relieved, delighted|Exit congestion anxiety|Static section-based exit routing (MVP)|
|Retention|Re-engagement notification|Books next event|Confident, no hesitation|None — trust established|Scarcity-based nudge tied to next event announcement|

---

#### Key Product Insights — Arjun

1. Named pillar bay over zone allocation — achievable at MVP given India's existing structured parking infrastructure. Bay pillar mapping exercise is the enabling ops step.
    
2. Pre-event nudge = congestion management feature — as important to operations as to UX. Arjun leaving on time keeps entry load distributed and lot experience clean.
    
3. Post-event exit notification = acquisition engine — Arjun's word-of-mouth in the group chat is how Rahul enters the product. Journeys are sequentially linked.
    

---

---

### 3.2 Priya Sharma — The Suburban Family Driver

Persona snapshot: 35, drives from Thane to Mumbai events with two children. Safety-conscious, low risk appetite. Has skipped events because parking logistics with children felt too uncertain. Core objection: "Will the parking actually be close to the venue entry gate, and will getting there with the kids be manageable?"

---

#### Journey Overview

Priya's journey is a distance and clarity arc. Her specific fear — validated by real attendee complaints at Diljit Dosanjh's Delhi concert — is arriving at a confirmed parking spot only to find it is a 20-minute drive from the entry gate with no signage and children in tow. Every product decision in her journey eliminates that one specific unknown before she leaves home.

Critically, Priya's journey begins before ticket purchase — not at checkout. She researches logistics before she commits to attending. This is her structural difference from Arjun, and it surfaces a product surface that Arjun's journey never reveals.

---

#### Stage 1 — Research Trigger

Touchpoint: Google search before buying tickets · Emotional state: Interested but gate-checking

Priya's friend in her building society WhatsApp group mentions a Diljit concert at MMRDA Grounds BKC. Before she checks ticket availability, she opens Google: "parking near MMRDA Grounds concert how far from entrance."

She has done this before. The last time she drove to a large event, she found parking and then spent 25 minutes navigating an unmarked path to find the right entry gate — children tired before the show even started. She will not repeat that.

If ParkEase has a venue page that shows distance from parking to entry gate clearly and specifically, she finds it and continues. If not, she calls a friend who has attended or decides not to drive.

Product decision — pre-purchase venue page: ParkEase needs a Google-indexed venue page that answers Priya's specific pre-purchase question: "How far is the parking from the venue entry gate?" This is not generic parking information — it is the single metric that determines whether she drives at all. The page must show: parking lot name, distance to entry gate in metres, estimated walking time, and whether the path is covered. This surface does not exist in Arjun's journey. It is Priya's unique top-of-funnel entry point into the product.

---

#### Stage 2 — The Detail That Converts Her

Touchpoint: ParkEase venue page · Emotional state: Evaluating one specific thing

Priya lands on the ParkEase page for MMRDA Grounds and sees:

- Parking lot: Nexus BKC Basement, Bay 22
    
- Distance to venue entry gate: 280 metres — approximately 4 minutes walking
    
- Prohibited items banner: "Venue does not permit powerbanks inside — leave in your car at the lot before heading to the gate"
    
- Availability: 34 spots remaining · Price: ₹249
    

The prohibited items note is the detail that earns her trust. Finding out at the security gate with two children in tow that she must walk back to the car is exactly the kind of moment that ruins an evening. Knowing this before she arrives removes it entirely.

Product decision: Distance to entry gate is the headline conversion metric for Priya — displayed above price and above availability. The prohibited items note is a physical banner at the parking entry gate, not an app feature. A simple printed sign placed by the venue ops team during ParkEase onboarding: "Heading to the venue? Powerbanks not permitted inside — leave them in your car now, while you're still here." Zero tech dependency. Part of the venue setup checklist. High impact for any attendee managing children or bags.

---

#### Stage 3 — Husband Approval and Booking

Touchpoint: WhatsApp + ParkEase booking screen · Emotional state: Purposeful

Priya screenshots the venue page and sends it to her husband: "Parking is 280 metres from the gate, covered path. Looks fine with the kids." He agrees. She books — named bay, entry time window, QR code on confirmation.

Product decision: The screenshot-and-share moment is not accidental — it is how Priya makes decisions involving the family. The venue page must be clean, credible, and display the distance figure prominently enough to survive a WhatsApp screenshot. This is her decision-making artefact. A cluttered page or buried distance figure breaks this moment entirely.

---

#### Stage 4 — Day of Event

Touchpoint: Push notification · Emotional state: In execution mode

At 5:15 PM:

"Your spot at Bay 22, Nexus BKC is confirmed. Leave Thane by 5:45 PM for smooth arrival. Reminder: leave powerbanks in your car before walking to the venue gate."

She loads the kids, packs accordingly — no powerbank in the bag — and leaves on time.

Product decision: The powerbank reminder in the push notification mirrors the physical banner at the lot. The same message delivered twice — once digitally before arrival, once physically at the lot. The digital version catches anyone who missed the venue page detail. Together they eliminate the security gate surprise for drivers with children.

---

#### Stage 5 — Arrival

Touchpoint: Parking structure + walk to gate · Emotional state: First real test

Priya arrives at Nexus BKC Basement. QR scanned, directed to Bay 22. She parks, leaves the powerbank in the glove compartment, and the family walks toward the venue entry gate.

From here — ParkEase's job is done. The parking structure's own pillar and floor markings guide her to the exit. The venue's gate signage and her ticket tell her which gate to enter. The 280 metres takes 4 minutes. The crowd outside is busy and loud — exactly what a large Mumbai concert looks like — but she arrives at the entry queue without a single moment of confusion.

No 20-minute detour. No wrong gate. No children asking where to go.

Product decision — product boundary: ParkEase's physical responsibility ends at the parking entry gate. The structure's existing infrastructure — pillar bay numbers, floor markings, exit signs — handles navigation inside the lot. The venue handles everything beyond its own gates. ParkEase owns one promise: get her to the right structure, confirm her bay, and tell her how far she is from the venue entry. Everything else is already built into the environment.

---

#### Stage 6 — Post-Event Exit

Touchpoint: Push notification · Emotional state: Tired children, wants direct path home

Ten minutes before the show ends:

"Time to head out? Your car is at Bay 22, Nexus BKC Basement. Follow exit signs back to the lot — estimated 12 minutes to clear."

The bay number reminder is the feature that matters here. Priya has been managing two children for three hours at a loud concert. She does not remember Bay 22. The notification does that work for her.

Product decision: The exit notification content is different from Arjun's. He needs route efficiency. Priya needs the bay number reminder — a trivially small feature that directly addresses the reality of managing tired children at the end of a long evening. Same notification architecture, different content, different persona need.

---

#### Stage 7 — Advocacy

Touchpoint: Building society WhatsApp group, next morning · Emotional state: Satisfied

"Went for the Diljit show last night with the kids — really worth it. Parking was 5 minutes from the gate, exactly as advertised, no confusion. Used this app. Sharing the link."

Three other parents in the group save the link for the next family-friendly event.

Strategic note: Priya's advocacy channel is closed, high-trust networks — building society groups, school parent groups, family chats. Her recommendation carries disproportionate conversion weight because she is personally accountable for it. One Priya advocate in an active parent group converts 4–6 families. The product must make sharing the venue page or booking link one tap from the confirmation screen.

---

#### Structured Flow Table

|   |   |   |   |   |   |
|---|---|---|---|---|---|
|Stage|Touchpoint|User Action|Emotional State|Friction Point|Product Response|
|Research trigger|Google search|Finds ParkEase venue page|Interested, gate-checking|"How far is parking from the gate?"|SEO-indexed venue page with distance as headline metric|
|Evaluation|ParkEase venue page|Screenshots, sends to husband|Evaluating one thing|Prohibited items surprise at security with kids|Distance + prohibited items banner at lot entry|
|Booking|ParkEase + WhatsApp|Books after husband approval|Purposeful|Page must survive WhatsApp screenshot|Distance figure prominent, page clean and credible|
|Day of event|Push notification|Packs correctly, leaves on time|Execution mode|Powerbank forgotten until security check|Prohibited items reminder in pre-event push notification|
|Arrival|Parking structure|Parks, walks to gate|First real test|Long unmarked walk, wrong gate with kids|Physical lot infrastructure + banned-items banner at entry|
|Post-event exit|Push notification|Follows bay reminder to car|Tired, direct path needed|Forgot bay number after 3-hour show with kids|Bay number reminder in exit notification|
|Advocacy|WhatsApp parent group|Shares link|Satisfied|No easy sharing mechanism|One-tap share CTA from confirmation screen|

---

#### Key Product Insights — Priya

Distance to entry gate is the primary conversion metric for this persona. Not price, not availability. The single figure — 280 metres, 4 minutes — is what converts her and what she shares with her husband. It must be the headline on the venue page, above the fold.

The prohibited items banner is a physical ops deliverable, not a tech feature. A printed sign at the parking lot entry, placed during venue onboarding. Zero cost, high impact. Eliminates the worst possible moment for a family driver. The push notification reinforces it digitally.

ParkEase's product boundary ends at the parking entry gate. The lot's existing infrastructure handles the rest. This is not a limitation — it is an honest, clean product scope that keeps venue onboarding manageable and prevents over-engineering.

Priya's WhatsApp advocacy is the highest-trust acquisition channel for the family driver segment. Her word in a parent group converts more families than any paid campaign. One-tap share from confirmation is the low-effort feature that unlocks this channel.

---

---

### 3.3 Rahul Kumar — The College Group Organiser

Persona snapshot: 21, college student, Delhi. Day scholar — has access to a family car. Goes to IPL and concerts in groups of 4–6. Price-sensitive, FOMO-driven, last-minute planner. Venue: JLN Stadium, Delhi (Karan Aujla P-POP Culture Tour). Core pain: group arrived late to a concert, missed the opening act, got blamed for poor planning. Core objection: "Can we split the parking payment between 4 people on the app?"

---

#### Journey Overview

Rahul's journey is a social accountability arc. His FOMO is not about the event — it is about being the person in the group who either made the night work or ruined it. Every product decision in his journey must reduce the coordination overhead of managing a group outing while making the cost feel trivially small when split.

What makes this structurally different from Arjun and Priya:

- Enters through a ticket confirmation link embedded by Siddharth's B2B operator dashboard — not BookMyShow checkout, not Google search
    
- Booking involves a group — payment split is a core product requirement, not an afterthought
    
- Last-minute behaviour collides with real-time inventory scarcity — creating the FOMO trigger
    
- One Rahul conversion = 4–6 people in one car = highest-leverage demand redirect in the entire product
    

---

#### Stage 1 — The Group Chat Trigger

Touchpoint: WhatsApp group + ticket confirmation link · Emotional state: Excited, half-committed

Rahul and five college friends book tickets for the Karan Aujla P-POP Culture Tour at JLN Stadium. BookMyShow sends each of them a ticket confirmation. Inside that confirmation, embedded by the event organiser through ParkEase's B2B operator dashboard:

"Parking near JLN Stadium for Karan Aujla — only 200 spots for 40,000 attendees. Pre-book now before it sells out."

Rahul screenshots it and drops it in the group WhatsApp: "Bhai parking bhi book karein? 200 hi spots hain." The group reacts immediately. Three people say yes. The plan starts to feel real — and Rahul is the one who made it happen.

Product decision — B2B as B2C acquisition: Rahul does not find ParkSmart through an ad or Google search. He finds it through the ticket confirmation that Siddharth's team embedded via the operator dashboard. This is the B2B product directly creating B2C demand — zero paid marketing required. The scarcity signal (200 spots, 40,000 attendees) is the conversion trigger. It must be real-time and accurate — a manufactured scarcity number breaks trust permanently with this age group.

---

#### Stage 2 — The Scarcity Trigger

Touchpoint: ParkEase availability page · Emotional state: FOMO activated, urgency rising

Rahul taps the link:

"Karan Aujla — JLN Stadium, Delhi · 47 spots remaining · ₹299"

The number 47 does the work. Not the price. Not the features. The scarcity. India's concert economy is explicitly FOMO-driven — limited availability and rarity of international and domestic artists touring India are the primary purchase triggers for this age group, with people willing to pay premium prices fearing they won't get another chance. His group has 5 people. He needs to act now before the option disappears.

Product decision — real-time inventory counter: The scarcity display must be live inventory, not a manufactured urgency signal. Gen Z concert-goers are highly attuned to fake scarcity after years of ticket resale platforms. A real counter that moves as spots are booked is credible. A static "only X left" that never changes is not. This counter feeds directly from ParkEase's inventory API.

---

#### Stage 3 — The Payment Problem

Touchpoint: ParkEase booking flow · Emotional state: Ready to book, one friction point

Rahul goes to book. ₹299 for one spot. He pauses — not because ₹299 is expensive. Split four ways it is ₹75. Nobody thinks twice about ₹75. He pauses because he has been here before: he pays alone, then spends three days sending GPay reminders to friends who forget, delay, or suddenly claim they might not come. That social friction has killed group plans before.

Product decision — post-booking UPI split request (MVP): Rahul pays the full ₹299 upfront. Immediately after booking confirmation the app shows: "Split this with your group — ₹60 per person for 5 people." One tap generates individual UPI collect requests to contacts he selects from his phonebook. Each person receives a GPay or PhonePe request for ₹60. For Gen Z in India, UPI is the default — a 20-year-old college student described carrying cash as archaic, using UPI for everything from splitting bills to daily purchases. The collect request is a familiar action in an unfamiliar context. No new behaviour required.

MVP implementation status: Group split is fully built at MVP. S2 (booking flow) includes a GroupSplitCalculator — single payer selects group size (1–6), per-person amount shown instantly (e.g. ₹42/person for 4 people). S3 (confirmation) includes a UPISplitBlock — one tap sends individual UPI collect requests to contacts after confirmation. WhatsApp forward with pre-formatted bullet summary including split amount is also live at S3. V2 = true escrow group booking where each person individually authorises their share before the spot is confirmed and assigned.

---

#### Stage 4 — Group Lock-In

Touchpoint: WhatsApp group · Emotional state: Organiser social currency moment

Rahul books. He shares the confirmation screenshot in the group: "Done — parking booked, Bay 18, JLN North Lot. ₹60 each, GPay karo."

The pre-filled WhatsApp message that gets shared:

📍 ParkEase — Parking Confirmed

  

- Event: Karan Aujla · JLN Stadium, Delhi

- Date: [Event Date]

- Parking: Bay 18, JLN North Lot

- Departure: Leave by 6:00 PM

- Split: ₹60 per person (5 people)

  

Book your spot: [ParkEase link]

  

Three people pay within 10 minutes. One ghosts for two hours then pays. The group is locked in. Rahul is now the person who made the plan happen — that social standing is the actual emotional reward of the product for this persona.

Product decision — WhatsApp forward CTA: The booking confirmation (S3) includes a one-tap WhatsApp forward button — a deep-link using WhatsApp's public URL format (wa.me/?text=...) with booking details pre-formatted as bullet points. No WhatsApp Business API required, no Meta partnership, no review process. Works on every Indian smartphone with WhatsApp installed. The message is professional, accurate, and structured for easy reading in a group chat.

✅ Implementation status: Built and shipped in S3_BookingConfirmation.jsx. Pre-formatted message includes: event name, date, bay number, lot name, departure time, per-person split amount (if group > 1), and a direct booking link. One tap opens WhatsApp with the message pre-typed.

Product decision — confirmation design for shareability: The booking confirmation must be clean enough to serve as social proof in the group chat. Bay number, event name, date, and split amount all visible in one screen. A cluttered confirmation weakens Rahul's standing as the organiser. A clean, branded one reinforces it.

---

#### Stage 5 — Day of Event

Touchpoint: Push notification · Emotional state: Coordinating the group

Two hours before the show:

"Karan Aujla tonight — Bay 18, JLN North Lot confirmed. Leave by 6:00 PM for smooth arrival. Forward to your group 👇"

Rahul taps the forward button. WhatsApp opens with the departure reminder pre-typed. He selects the group and sends. One tap eliminates the back-and-forth of "kal kitne baje nikalna hai" entirely.

Product decision: For Arjun the notification is personal. For Rahul it is a coordination tool. Same notification architecture, fundamentally different use case. The forward CTA is the feature that makes ParkSmart feel built for groups, not just individuals.

---

#### Stage 6 — The Redirect Moment

Touchpoint: In-app alert to a non-booker friend · Emotional state: Watching it play out

By 5 PM on event day, ParkSmart parking at JLN is 100% sold. Rahul's spot is confirmed — he is fine. But his friend Varun, who was planning to drive separately and "figure out parking on the way", now sees:

"Parking near JLN Stadium is sold out. Book a cab to the venue drop zone instead — arrives faster than driving right now. Tap to book via Ola."

Varun taps the redirect. Books an Ola. Arrives at the drop zone 15 minutes before Rahul who drove and still needed to park and walk. At the gate, Varun messages the group: "already andar hoon, cab liya — parking wale abhi bhi circle kar rahe hain baahar."

This is ParkEase's demand-shifting mechanism working exactly as designed — not in isolation, but through peer comparison inside a real group.

Product decision — redirect must outperform driving for the peer loop to work: The most powerful advertisement for the redirect feature is not a notification. It is Varun arriving first. If the redirect experience is slower or more expensive than informal parking, the peer comparison reverses and actively damages future conversions. The cab redirect CTA must deep-link into Ola/Uber with the venue drop zone pre-filled, reducing booking time to under 30 seconds.

---

#### Stage 7 — Post-Event Exit

Touchpoint: Push notification · Emotional state: Buzzing, wants to keep the energy going

"Your car is at Bay 18, JLN North Lot. Exit via Gate C — estimated 14 minutes to clear. See you at the next one."

Short, energetic, functional. The bay number reminder matters — Rahul has been in a crowd for 3 hours and does not remember Bay 18.

Product decision — tone is a product decision: Notification copy for Rahul must match his register. Arjun gets functional and reassuring. Priya gets calm and clear. Rahul gets something with energy. Same notification system, persona-specific copy. A small detail that signals to a hiring manager that the product was designed for people, not a generic user.

---

#### Stage 8 — Advocacy and the Group Multiplier

Touchpoint: Group chat, post-event · Emotional state: Satisfied organiser

In the cab home Rahul posts: "Parking was sorted, Bay 18, got out in 15 mins. Next show same plan."

Two things happen downstream:

Rahul books the next event without hesitation — he is a repeat user before the retention window even matters.

Varun tells his own separate friend group the following week: "yaar ye ParkEase app hai, parking full tha toh cab redirect kiya, reached before the parking guys did." A second acquisition chain begins through a completely different group.

Strategic note — the group multiplier is ParkSmart's organic growth engine for this segment: One Rahul booking touches 5 people directly. Varun's redirect experience touches another 5–6 independently. Every product decision in Rahul's journey should be evaluated against one question: "does this make the experience easy to spread to the next group?"

---

#### Structured Flow Table

|   |   |   |   |   |   |
|---|---|---|---|---|---|
|Stage|Touchpoint|User Action|Emotional State|Friction Point|Product Response|
|Group chat trigger|Ticket confirmation (B2B embedded)|Shares link in WhatsApp group|Excited, half-committed|Discovery depends on organiser embedding the link|B2B operator dashboard auto-generates parking link in ticket confirmation|
|Scarcity trigger|ParkEase availability page|Sees 47 spots, acts immediately|FOMO activated|Fake scarcity destroys trust permanently|Real-time inventory counter from ParkEase API|
|Payment problem|ParkEase booking flow|Books, initiates UPI split|Ready but hesitant on split|Chasing friends post-payment is socially awkward|Post-booking UPI collect request to selected contacts|
|Group lock-in|WhatsApp|Shares pre-formatted confirmation|Social currency moment|Message must be professional and readable in group chat|One-tap WhatsApp forward with bullet-point booking summary|
|Day of event|Push notification|Forwards departure time to group|Coordinating|Group timing back-and-forth|WhatsApp forward CTA on pre-event notification|
|Redirect moment|In-app alert (non-booker Varun)|Varun books Ola redirect|Peer comparison activated|Redirect must be faster than driving|Cab deep-link pre-fills venue drop zone, booking under 30 seconds|
|Post-event exit|Push notification|Follows bay reminder, exits|Buzzing|Forgot bay number after 3-hour show|Bay number reminder + energetic tone-matched copy|
|Advocacy|Group chat + Varun's group|Experience spreads to next group|Satisfied organiser|No easy re-share mechanism|One-tap next event booking from post-event confirmation screen|

---

#### Key Product Insights — Rahul

The B2B channel is Rahul's only reliable discovery channel. He does not find ParkSmart on his own. Siddharth's operator dashboard embedding the parking link in the ticket confirmation is the only scalable way to reach him at the right moment — when the event is booked and the group energy is live in the chat.

Scarcity converts, price does not. ₹75 split is invisible. 47 spots against 40,000 attendees is the trigger. The real-time inventory counter is as important as the booking flow itself.

The UPI split removes the single biggest barrier to group bookings. Without it Rahul pays alone and chases friends — friction that has killed group plans before. With it the booking takes 3 minutes and the money awkwardness is handled by the product.

The WhatsApp forward CTA is an MVP feature, not V2. It requires one line of code — a public WhatsApp deep-link URL with pre-formatted bullet-point text. Implementation time under one hour. Impact: eliminates group coordination friction entirely.

The redirect experience must outperform driving for the word-of-mouth loop to activate. Varun arriving first is the product's best marketing. If the redirect is slower, the loop reverses.

Tone is a product decision. Persona-specific notification copy is a small build with outsized impact on the product feeling native to each user segment.

---

---

### 3.4 Siddharth Mehta — The B2B Event Operations Head

Persona snapshot: 38, operations head at a large live events company, Hyderabad. Manages 15–30 events/year across Mumbai, Delhi, Bangalore, Hyderabad. Risk-averse, vendor-driven, KPI-obsessed. Core pain: fears viral video of post-event gridlock linked to his event, compliance notices from municipal bodies, zero data or structured system today. Core objection: "What if your app fails on event night and 40,000 people have nowhere to go? You become my liability."

---

#### Journey Overview

Siddharth's journey is a liability elimination arc. He does not buy products — he buys risk reduction. Every interaction with ParkEase must answer one question: "if something goes wrong tonight, is it your problem or mine?"

What makes this structurally different from all three consumer journeys:

- No app booking, no QR code, no parking spot
    
- Entry point is proactive outreach from ParkEase triggered by a documented industry failure
    
- Primary product surface is the operator dashboard — not the consumer app
    
- Success metric is a post-event compliance report, not a personal experience
    
- His journey defines exactly what gets built in the operator dashboard prototype screen
    

---

#### Stage 1 — Proactive Outreach

Touchpoint: Targeted email from ParkEase BD team · Emotional state: Cautious, alert

Three weeks after the Karan Aujla JLN Stadium chaos — 75,000 fans against a 35–40k capacity, overcrowding, stampede reports, wristbands stolen, organisers fleeing — Siddharth's company has an upcoming concert at Rajiv Gandhi International Cricket Stadium, Hyderabad. 35,000 attendees expected. His team is already nervous.

ParkEase's BD team sends a targeted email:

"Subject: Post-event gridlock at your next show — here is how we prevent it.

Siddharth — we saw what happened at JLN on February 28. We have built a product specifically for what you are about to face in Hyderabad. One-page summary attached. 15-minute call?"

The one-page summary covers: pre-booked parking inventory, real-time demand shifting when parking fills, live operator dashboard, post-event compliance report for municipal bodies, and — critically — a manual fallback protocol: if the app fails, printed booking lists are at every gate entry.

That last point gets him on the call. It tells him ParkEase has thought about failure modes. Most tech vendors don't.

Product decision — outreach timed to documented failure: ParkEase's B2B sales motion is not cold outreach. It is outreach timed to real, named, documented industry failures. The email that references JLN by name is the one that gets opened. The manual fallback detail is the line that converts a cynical ops head from "another tech vendor" to "these people understand my world."

---

#### Stage 2 — The Sales Call: Three Liability Questions

Touchpoint: 30-minute video call · Emotional state: Evaluating, objection-heavy

Siddharth asks three questions — all liability questions, not feature questions.

Q1: "What happens if parking fills and the redirect fails?"

ParkEase: Manual fallback. Printed booking list at every gate. Attendant checks the list if app is down. Tech failure does not cascade into physical failure.

Q2: "What if two people show up for the same bay?"

ParkEase: Each bay is assigned to exactly one booking via sequential bay mapping. QR is unique per booking. Duplicate assignment is architecturally impossible without a manual operator override.

Q3: "Who is liable if something goes wrong on event night?"

ParkEase: ParkEase takes contractual liability for the parking product. SLA covers uptime, booking accuracy, and physical bay availability. If ParkEase fails to deliver a confirmed spot, ParkEase refunds the attendee and compensates the organiser. Siddharth's name is not on the parking failure.

That third answer closes the conversation. They agree on a pilot — one event, two lots, 500 spots.

Commercial decision — event 1 is free, deliberately: ParkEase charges no platform fee on the pilot event. The ops cost (bay mapping, attendant briefing, dashboard setup) is absorbed. This is not a discount — it is a pricing strategy. A paid pilot asks Siddharth for financial trust before he has seen the product work. A free pilot asks only for access. The fee conversation happens after the compliance report lands on his MD's desk, not before. Asking for money before delivering proof is the fastest way to lose a risk-averse buyer in India's events industry.

Product decision — SLA and liability clause is a product feature: The contractual liability transfer is what converts B2B buyers in India's live events space. The SLA belongs in the PRD as a product requirement, not just a legal footnote.

---

#### Stage 3 — Pre-Event Setup

Touchpoint: Operator dashboard onboarding · Emotional state: Methodical, detail-checking

Two weeks before the Hyderabad event, Siddharth's ops team configures the event on the ParkEase operator dashboard:

- Total inventory: 500 spots across 2 lots
    
- Bay mapping exercise completed: ParkEase team walks both lots, photographs every pillar marker, maps into system exactly as physically labelled
    
- Prohibited items list uploaded: auto-populates into attendee pre-event notifications
    
- Redirect threshold set: parking full alert triggers at 90% fill (450 spots)
    
- Cab redirect destination configured: Drop Zone A, near Gate 4
    
- Manual fallback printed: 500 booking confirmations, laminated set at each lot entry gate
    

Siddharth logs into the dashboard for the first time. He sees real, live data — 312 pre-booked of 500, 62.4% fill rate, system status green. He refreshes it twice. Screenshots it and sends to his MD.

Product decision — pre-event dashboard state is a trust signal: Siddharth seeing accurate live data two weeks before the event is as important as event night. If the dashboard works correctly pre-event, he trusts it on the night. The dashboard must be fully functional from the moment the event is configured.

---

#### Stage 4 — Event Night: The Operator Dashboard

Touchpoint: Operator dashboard — live event view · Emotional state: Monitoring, alert

This is Siddharth's primary product interaction and the core B2B prototype screen.

He has two screens open: his event ops WhatsApp group and the ParkEase operator dashboard. He is at the venue operations centre. His job is oversight, not operation.

---

OPERATOR DASHBOARD — LIVE EVENT VIEW

Header:

🟢 LIVE  |  Concert · Rajiv Gandhi Stadium, Hyderabad  |  Event Night

  

Row 1 — Primary metric cards:

|   |   |   |   |
|---|---|---|---|
|Parking Fill Rate|Spots Remaining|Redirect CTA Taps|Est. Vehicles Diverted|
|87%|65 of 500|118|~65 est.|
|████████████░░|Live count|Since redirect triggered|Taps × 55% compliance rate|

Row 2 — Demand shifting performance:

REDIRECT PERFORMANCE

Users shown parking full alert         312

Tapped cab/shuttle CTA                 118   (38% tap rate)

Est. actual vehicles diverted          ~65   (55% compliance discount applied)

Average cab booking time               24 sec

  

Row 3 — Per-lot status:

LOT STATUS

Lot A · Nexus Mall Basement     ████████░░  78%   110/141   ✅ Normal

Lot B · Stadium Road Open       ██████████  97%   325/335   ⚠️ Near full

  

Row 4 — Alert feed:

⚠️  20:47  Lot B approaching capacity — redirect threshold active

✅  20:31  No booking conflicts reported

✅  20:15  Attendant check-ins: 435/500 confirmed arrivals

✅  19:58  Redirect CTA live — parking full screen active for new visitors

  

Live update at 21:03 — parking hits 100%:

🔴 PARKING FULL  |  Redirect active for all new visitors

Users redirected since full:     156

Est. vehicles diverted:          ~86   (156 × 55% compliance)

  

Post-event update at 22:47:

EXIT CLEARANCE

Lot A — 92% cleared in 18 minutes         ✅

Lot B — 87% cleared in 22 minutes         ✅

Industry baseline (unmanaged events)      60–90 minutes (source: documented events)

  

Estimated vehicles diverted tonight: ~86

  

Product decision — vehicles diverted methodology: The vehicles diverted figure uses redirect CTA tap count × 55% compliance discount. Raw tap count overstates diversion because some users tap out of curiosity but drive anyway. The 55% rate is based on validated Waze/Google Maps behavioural redirection benchmarks. This is displayed transparently on the dashboard with a methodology note — it is an honest estimate, not a hard count. Direct measurement requires V2 sensor integration.

Product decision — exit clearance baseline (Option B — industry baseline): At MVP, ParkEase cannot independently measure unmanaged street parking clearance time at the same venue. Instead the compliance report references the documented industry baseline from verified journalism: Coldplay Mumbai concert gridlock persisted for 30+ minutes on major highways, and Diljit Dosanjh Delhi concert post-event chaos lasted over an hour per Business Standard reporting. ParkEase-managed lot clearance is compared against this documented industry baseline — not a same-night estimate. This is labelled clearly as an industry comparison, not event-specific measurement. V2 introduces a structured ops input field for baseline logging.

Prototype build spec — operator dashboard: One of five core prototype screens. Must show: live fill rate progress bar, spots remaining counter, redirect trigger count, redirect CTA tap rate, vehicles diverted estimate with compliance note, per-lot status with capacity bars, colour-coded alert feed, post-event exit clearance comparison. All data manually seeded at MVP. Dashboard reads from the same inventory database the consumer app writes to. One data source, two interfaces.

---

#### Stage 5 — Post-Event: The Compliance Report

Touchpoint: Dashboard — PDF report download · Emotional state: Relieved, closing the loop

The morning after, Siddharth opens the dashboard and downloads the auto-generated compliance report:

---

PARKEASE POST-EVENT COMPLIANCE REPORT

Concert · Rajiv Gandhi International Cricket Stadium, Hyderabad

Parking Performance

- Total pre-booked spots: 500
    
- Utilisation rate: 94.2% (471 of 500 confirmed arrivals)
    
- Booking conflicts: 0
    
- No-show rate: 5.8%
    

Demand Shifting Performance

- Users shown parking full alert: 312
    
- Tapped cab/shuttle redirect CTA: 118 (38% tap rate)
    
- Estimated actual vehicles diverted: ~86 (tap count × 55% compliance discount)
    
- Average cab booking time via redirect: 24 seconds
    
- Note: Diversion estimate uses a 55% compliance discount on CTA taps based on validated behavioural redirection benchmarks. Direct measurement requires sensor integration (planned V2).
    

Exit Clearance Performance

- ParkEase-managed lots: average 20-minute clearance post-event
    
- Industry baseline — unmanaged large events: 60–90 minutes (source: Business Standard, Diljit Dosanjh Delhi concert, Jan 2025; Free Press Journal, Coldplay Mumbai, Jan 2025)
    
- ParkEase performance vs industry baseline: 65–77% faster clearance
    

Compliance Notes

- Zero post-event parking complaints via event ops channel
    
- No municipal notices triggered
    
- Full booking log available for authority review upon request
    

---

Siddharth forwards the report to his MD, legal team, and the municipal liaison officer. The report is the product delivering on its B2B promise — not just a good event, but a documented, auditable, shareable proof that the organiser managed parking responsibly.

Product decision — compliance report is a prototype deliverable: Auto-generated PDF from the same dashboard data. Fixed template, same fields every event. One-time build, recurring B2B value after every event.

Strategic note — the compliance report is an acquisition channel: Every report Siddharth shares with a municipal authority reaches a person who influences other event organisers. The PDF carries ParkEase branding and contact details. Build it as a product, not an afterthought.

---

#### Stage 6 — Retention and Scale

Touchpoint: Internal review meeting → commercial negotiation · Emotional state: Confident, then evaluating

Three weeks later, Siddharth presents the report in his company's post-event review. His MD asks: "Can we use this for all our events this year?"

He contacts ParkEase: "We have 8 more events this year across Mumbai, Delhi, and Bangalore. Can you scale?"

This is where the platform fee enters the conversation for the first time.

ParkEase: "Event 1 was our pilot — complimentary to establish baseline data and earn your trust. From event 2 onwards, our platform fee is ₹15,000–₹25,000 per event, scaled by attendee count and lot complexity."

Siddharth: "What does that include?"

ParkEase: "Bay mapping exercise before every new venue, operator dashboard for your team, live monitoring on event night, auto-generated compliance report the morning after. Your ops team does nothing beyond initial configuration. We deliver the parking ops layer — you take the compliance report to your MD and your municipal contacts."

Siddharth's internal calculation: his team currently spends 2–3 days per event managing informal parking arrangements with no documentation, no data, and full liability. A ₹15,000–₹25,000 fixed cost that eliminates that liability and produces a defensible compliance report is not a vendor fee — it is risk insurance with a paper trail.

He agrees to an annual contract covering 8 events.

Commercial note — the platform fee is 60% of per-event contribution margin: At a standard-tier event (500 spots, 87% fill, ₹169 consumer price), consumer bookings generate approximately ₹8,000–₹10,000 net to ParkEase. The ₹15,000–₹25,000 platform fee is the majority of the economics. This fee is non-negotiable at scale and must be introduced in the annual contract conversation — not discounted to close the deal. The free pilot is the reason Siddharth says yes to the fee, not a precedent for future free events.

Strategic note — Siddharth is the distribution channel for the entire consumer product: His annual contract brings ParkEase to every event his company runs. Arjun books parking at checkout, Priya finds the venue page, Rahul gets the ticket confirmation link — all because Siddharth said yes. The B2B conversion multiplies B2C reach across every city his company operates in.

---

#### Structured Flow Table

|   |   |   |   |   |   |
|---|---|---|---|---|---|
|Stage|Touchpoint|Action|Emotional State|Friction Point|Product Response|
|Outreach|Targeted email + one-pager|Reads email, takes the call|Cautious|Generic pitches ignored|Email references JLN failure by name + manual fallback detail|
|Sales call|30-min video call|Asks 3 liability questions; agrees to pilot|Objection-heavy|"Who is liable if it fails?"|Contractual SLA — ParkEase takes liability; pilot event is free (deliberate pricing strategy)|
|Pre-event setup|Operator dashboard|Configures event, reviews live pre-event data|Methodical|Dashboard must work pre-event, not just event night|Full functional dashboard from day of configuration|
|Event night|Operator dashboard — live|Monitors in real time, no manual intervention needed|Alert, monitoring|Must trust data accuracy under pressure|Live fill rate, redirect count, per-lot status, automated alert feed|
|Post-event|Dashboard PDF download|Downloads report, shares with MD and authorities|Relieved|Report must be credible for municipal submission|Auto-generated PDF with honest methodology notes, industry baseline comparison|
|Retention + commercial|Internal review → fee negotiation|MD asks to scale; Siddharth negotiates annual contract; platform fee introduced|Confident, then evaluating|Fee must be justified, not discounted|₹15,000–₹25,000/event platform fee presented as risk insurance; pilot compliance report is the justification|

---

#### Key Product Insights — Siddharth

The manual fallback closes the sale, not the dashboard. The printed list at the gate that works when the app doesn't tells Siddharth ParkEase has thought about failure modes. Most tech vendors don't. This ops decision is as important as any feature.

The pre-event dashboard state is a trust signal. Accurate live data two weeks before the event builds confidence that the data will be accurate on event night.

The dashboard's one job on event night is to let Siddharth watch without intervening. Automated alerts, automated redirects, automated clearance tracking. His role is oversight. A dashboard requiring manual action fails his core need.

The vehicles diverted metric must be honest. Raw redirect tap count overstates diversion. Applying the 55% compliance discount and labelling it transparently as an estimate is more credible to a municipal authority than an inflated number that cannot be defended.

The compliance report uses verified journalism as the industry baseline. Rather than estimating unmanaged clearance on the same night — which is anecdotal — the report cites Business Standard and Free Press Journal documentation of real Indian concert chaos. This is honest, defensible, and backed by published sources.

The platform fee is the business. Consumer booking margin (≈₹48/spot net) is meaningful but secondary. The ₹15,000–₹25,000 per-event platform fee is 60% of per-event contribution. It must be introduced in the annual contract conversation — not waived, not discounted, not deferred. The free pilot is what earns the right to name the fee. It is not a precedent.

The fee conversation happens after the compliance report, never before. Introducing the fee before Siddharth has seen the product work inverts the trust dynamic. The sequencing is: access (pilot) → proof (compliance report) → fee (annual contract). Collapsing this sequence loses the sale.

Siddharth is the distribution channel for the entire consumer product. His contract brings ParkEase to every event his company runs across every Tier 1 city. The B2B flywheel is the consumer product's growth engine.

---

#### Operator Dashboard — Prototype Build Specification

|   |   |   |
|---|---|---|
|UI Component|Data Source|Scope|
|Live fill rate progress bar|Booking database (manually seeded)|MVP|
|Spots remaining counter|Same database|MVP|
|Redirect trigger count|App event log|MVP|
|Redirect CTA tap rate|App event log|MVP|
|Vehicles diverted estimate (with compliance note)|Tap count × 55%|MVP|
|Per-lot status with capacity bars|Lot config + bookings|MVP|
|Colour-coded alert feed|Rule-based triggers|MVP|
|Post-event exit clearance (vs industry baseline)|Dashboard data + cited sources|MVP|
|PDF compliance report download|Dashboard data export|MVP|
|Real-time sensor occupancy|IoT hardware|V2|
|Live traffic integration|Google Maps API|V2|
|Structured ops baseline input field|Manual ops team entry|V2|

---

Section 3 — User Journeys: Complete

---

### 3.5 — Booking Flow Architecture (Canonical UI Spec)

The S2 booking flow implements a 5-step progressive disclosure model. Each step unlocks the next only when the prior step is completed. Completed steps collapse to summary chips that can be tapped to re-open.

**Step 1 — Inventory Signal (always visible)**
Real-time scarcity banner showing spots remaining, fill progress bar, and urgency copy. Decays as bookings arrive. Never hidden — maintains FOMO signal throughout the booking session.

**Step 2 — Bay Selection**
Lot tabs (North / South) + bay grid showing available/taken status per pillar code. User taps a bay to select. Selection advances to Step 3 automatically.

**Step 3 — Arrival Time Window**
Entry window picker (e.g. 5:30–7:00 PM or 7:00–8:30 PM). Informs the ops team of expected arrival distribution. Selection advances to Step 4 automatically.

**Step 4 — Pricing Breakdown**
Transparent fee split: venue base rate + ParkEase service fee = total. Group split calculator (1–6 people) with per-person amount shown in real time. Cancellation policy displayed.

**Step 5 — UPI Payment (sticky CTA)**
Single "Pay ₹X via UPI" button. Disabled until bay and window selected. Loading state on tap. 1.5s mock payment timeout navigates to S3 confirmation.

**Progressive disclosure rationale:** Showing all five steps simultaneously increases cognitive load and drop-off. The collapsed chip pattern (from the reference District by Zomato template) keeps users oriented without overwhelming them — at any point in the flow, the user can see what they've completed and what's next with one glance.

**Guardrail metric dependency:** The <45% checkout drop-off guardrail (§2.4) depends directly on this flow being frictionless. Any regression to a flat all-at-once form should be evaluated against this guardrail before shipping.

---

## Section 4 — Feature List & Prioritization

All features identified across the four user journeys are catalogued below with three independent prioritisation frameworks applied simultaneously. This multi-framework approach ensures no single scoring method distorts the build sequence.

---

### 4.1 Prioritisation Framework Key

RICE Score = (Reach × Impact × Confidence) ÷ Effort

- Reach (1–4): How many personas does this serve?
    
- Impact (1–3): How directly does it prove the demand-shifting hypothesis?
    
- Confidence (1–3): How certain are we it works as expected?
    
- Effort (1–5 complexity): 1 = trivial, 5 = very complex / external dependency
    

Kano Model

- Basic — expected; dissatisfaction if absent
    
- Performance — more = better; linear satisfaction
    
- Delighter — unexpected; creates wow moment
    
- Indifferent — users don’t care either way
    

Value vs Effort Quadrant

- Quick Win — high value, low effort → build first
    
- Big Bet — high value, high effort → plan carefully
    
- Fill-in — low value, low effort → build if time permits
    
- Money Pit — low value, high effort → avoid or defer
    

Departments

- Tech — FE (Frontend UI)
    
- Tech — BE (Backend / database / logic)
    
- Tech — INT (Third-party integration)
    
- Product/Design (UX, copy, information architecture)
    
- Ops — Venue (Physical execution at venue)
    
- Ops — Sales (B2B outreach, contracts, onboarding)
    
- Legal (Contracts, SLA, liability)
    

Prototype Screens (9 screens — demo order)

- S1 — Venue/Event Landing Page
    
- S2 — Parking Pre-Booking Flow
    
- S3 — Booking Confirmation
    
- S4 — Parking Full → Redirect Screen
    
- S6 — Retention / Re-engagement

- S7 — RCB Booking (retention partner flow)

- S8 — RCB Confirmation

- S9 — Attendant Scanner (ground staff)

- S5 — Operator Dashboard
    

---

### 4.2 Full Feature Table (sorted by RICE score, descending)

|   |   |   |   |   |   |   |   |
|---|---|---|---|---|---|---|---|
|#|Feature|Department|RICE|Kano|Value vs Effort|Prototype Screen|Ship|
|1|Ola/Uber deep-link redirect with destination pre-filled|Tech — INT|36.0|Basic|Quick Win|S4|MVP|
|2|Manual inventory seeding at MVP|Ops — Venue, Tech — BE|36.0|Basic|Quick Win|S2, S5|MVP|
|3|Bay pillar mapping exercise|Ops — Venue|36.0|Basic|Quick Win|S2, S3|MVP|
|4|Static section-based exit guidance (pre-configured)|Tech — FE, Product/Design|24.0|Performance|Quick Win|S3|MVP|
|5|Real-time inventory counter (live spots remaining)|Tech — BE, Tech — FE|18.0|Basic|Quick Win|S1, S2|MVP|
|6|Parking full → redirect screen (demand shifting core)|Tech — FE, Tech — BE|18.0|Basic|Quick Win|S4|MVP|
|7|QR booking confirmation|Tech — FE, Tech — BE|18.0|Basic|Quick Win|S3|MVP|
|8|Named bay allocation with pillar mapping display|Tech — FE, Ops — Venue|18.0|Basic|Quick Win|S2, S3|MVP|
|9|Pre-event push notification with departure nudge|Tech — BE, Product/Design|12.0|Performance|Quick Win|S3|MVP|
|10|Post-event exit notification with bay number reminder|Tech — BE, Product/Design|12.0|Performance|Quick Win|S3|MVP|
|11|Parking pre-booking flow (search → select bay → pay → confirm)|Tech — FE, Tech — BE|12.0|Basic|Big Bet|S2|MVP|
|12|Tone-matched notification copy by user segment|Product/Design|12.0|Delighter|Quick Win|S3|MVP|
|13|Scarcity counter tied to real-time inventory|Tech — FE, Tech — BE|9.0|Delighter|Quick Win|S1, S2|MVP|
|14|One-tap share CTA from confirmation screen|Tech — FE, Tech — INT|9.0|Delighter|Quick Win|S3|MVP|
|15|Manual fallback printed booking list|Ops — Sales, Ops — Venue|9.0|Basic|Quick Win|— Ops|MVP|
|16|SLA and liability contract template|Ops — Sales, Legal|9.0|Basic|Quick Win|— Ops|MVP|
|17|Prohibited items physical banner at lot entry|Ops — Venue|9.0|Basic|Quick Win|— Ops|MVP|
|18|Navigation routing to parking entry gate specifically|Tech — INT|9.0|Basic|Quick Win|S2, S3|MVP|
|19|Vehicles diverted estimate with compliance discount display|Tech — FE, Product/Design|6.0|Performance|Quick Win|S5|MVP|
|20|WhatsApp forward CTA on pre-event notification|Tech — INT|6.0|Delighter|Quick Win|S3|MVP|
|21|B2B sales outreach template (timed to industry failures)|Ops — Sales, Product/Design|6.0|Indifferent|Fill-in|— Ops|MVP|
|22|Post-booking UPI split request (single payer + collect)|Tech — INT, Product/Design|3.0|Delighter|Quick Win|S3|MVP|
|23|Operator dashboard — live fill rate + spots remaining|Tech — FE, Tech — BE|3.0|Basic|Big Bet|S5|MVP|
|24|Operator dashboard — redirect trigger count + tap rate|Tech — FE, Tech — BE|3.0|Basic|Big Bet|S5|MVP|
|25|Operator dashboard — per-lot status with capacity bars|Tech — FE, Tech — BE|3.0|Basic|Big Bet|S5|MVP|
|26|PDF compliance report auto-generation + download|Tech — FE, Tech — BE|3.0|Performance|Big Bet|S5|MVP|
|27|Parking link generator for ticket confirmation embedding|Tech — BE, Ops — Sales|3.0|Basic|Quick Win|— BE|MVP|
|28|Prohibited items banner on venue page|Product/Design, Ops — Venue|3.0|Basic|Quick Win|S1|MVP|
|29|Venue/event discovery page (distance to gate as headline)|Tech — FE, Product/Design|2.0|Performance|Quick Win|S1|MVP|
|30|Operator dashboard — colour-coded alert feed|Tech — FE, Tech — BE|2.0|Performance|Big Bet|S5|MVP|
|31|Event configuration interface (inventory, threshold, drop zone)|Tech — FE, Tech — BE|2.0|Basic|Big Bet|S5|MVP|
|32|Ola/Uber API callback for hard conversion confirmation|Tech — INT|6.0|Performance|Big Bet|S4|V2|
|33|Dynamic exit routing via Google Maps API|Tech — INT|4.0|Performance|Big Bet|S3|V2|
|34|IoT sensor occupancy tracking per bay|Tech — BE, Ops — Venue|4.8|Performance|Money Pit|S5|V2|
|35|Structured ops baseline input field (manual clearance logging)|Tech — FE|3.0|Indifferent|Fill-in|S5|V2|
|36|True group booking with pre-payment split (escrow)|Tech — BE, Tech — INT|0.8|Delighter|Money Pit|S2|V2|
|37|SEO indexing of venue discovery pages|Tech — BE|0.7|Indifferent|Fill-in|S1|V2|

---

### 4.3 Key Prioritisation Decisions

Why the operator dashboard (#23–31) is MVP despite low RICE scores:

The operator dashboard features score low on RICE because Reach = 1 (only Siddharth). RICE alone would deprioritise them. However both Kano (Basic) and Value vs Effort (Big Bet) confirm they are non-negotiable — without the dashboard, ParkEase has no B2B product. Three independent frameworks disagreeing is the signal to apply strategic reasoning over numerical scoring. Dashboard = MVP regardless of RICE.

Why features #1–3 score 36.0 (joint highest):

The Ola/Uber deep-link, manual inventory seeding, and bay pillar mapping are all trivially low effort but foundational to the entire product working. They are the first three things built in the prototype. No other feature activates without them.

Why #36 (true group booking with escrow) is V2 despite being Rahul’s key feature:

RICE 0.8 — lowest in the table. High engineering complexity, external payment escrow dependency, one persona. Post-booking UPI split request (#22) achieves 90% of the same outcome at a fraction of the effort. MVP delivers the split experience; V2 makes it seamless.

Why #21 (B2B sales outreach template) is MVP despite being Indifferent on Kano:

Siddharth never interacts with the outreach template directly — hence Indifferent on Kano. But without the outreach, Siddharth never enters the product, and without Siddharth, no consumer user ever reaches ParkEase. Go-to-market requirements override user-facing Kano classification.

The Money Pit features (#34, #36) are correctly deferred:

IoT sensors require hardware procurement, installation, and venue partnerships before a single line of code is written. True group booking requires payment escrow logic and regulatory consideration. Both are high-effort, low-confidence features at MVP stage. V2 after the core hypothesis is proven.

---

### 4.4 Prototype Build Sequence (MVP only, ordered by priority)

Based on the combined framework analysis, the recommended prototype build order is:

Sprint 1 — Foundation (must exist before anything else works)

- Manual inventory seeding and bay pillar mapping (Ops — Venue)
    
- Parking pre-booking flow — S2
    
- Real-time inventory counter — S1, S2
    
- QR booking confirmation — S3
    

Sprint 2 — Core Hypothesis (proves demand shifting works)

- Parking full → redirect screen — S4
    
- Ola/Uber deep-link redirect — S4
    
- Scarcity counter — S1, S2
    
- Named bay allocation display — S2, S3
    

Sprint 3 — B2B Product (operator dashboard)

- Event configuration interface — S5
    
- Live fill rate + spots remaining — S5
    
- Per-lot status with capacity bars — S5
    
- Redirect trigger count + tap rate — S5
    
- Colour-coded alert feed — S5
    
- PDF compliance report — S5
    

Sprint 4 — Consumer Experience Polish (persona-specific features)

- Venue/event discovery page with distance to gate — S1
    
- Pre-event and post-event push notifications — S3
    
- WhatsApp forward CTA — S3
    
- Post-booking UPI split request — S3
    
- One-tap share CTA — S3
    
- Tone-matched notification copy — S3
    
- Navigation routing to parking entry gate — S2, S3
    

Sprint 5 — Ops & Go-to-Market (non-tech deliverables)

- Manual fallback printed booking list
    
- Prohibited items physical banner at lot entry
    
- SLA and liability contract template
    
- B2B sales outreach template
    
- Parking link generator for ticket confirmation embedding
    

---

---

## Section 5 — Edge Cases & Constraints

Edge cases are the scenarios that will break ParkEase on event night if not anticipated. Each entry documents what triggers the failure, what the product response is, and whether it is handled at MVP or deferred. All five categories are grounded in verified, documented Indian event failures.

---

### Category 1 — Inventory Failures

---

1.1 — Venue cancels or relocates a parking lot last minute

Trigger: The venue operator decides 48 hours before the event to repurpose a designated parking lot for equipment staging, VIP access, or extended security perimeter.

What breaks: Users with confirmed QR bookings for that lot arrive to find it closed. The pre-booking promise collapses at the worst moment.

Product response:

- Lot deactivation flag in the operator dashboard immediately flags all affected bookings
    
- Affected users receive an automatic notification with a new bay assignment from an alternative lot
    
- If no alternative bay is available, automatic refund is triggered and the user is offered the cab redirect
    
- Manual fallback printed list at remaining lot entry gates is reprinted before event day
    

Handled at: MVP — lot deactivation flag and notification in operator dashboard. Refund automation in V2.

---

1.2 — A pre-booked bay is physically blocked or damaged on event day

Trigger: Another vehicle occupies a reserved bay without a QR. A barrier is placed incorrectly. A physical obstruction exists.

What breaks: User arrives with confirmed QR, bay is inaccessible. Trust arc collapses at the moment of arrival.

Product response:

- Attendant has authority to reassign the user to the nearest available unbooked bay in the same lot — documented in attendant briefing guide
    
- Attendant logs the blocked bay via a simple text input in the operator dashboard so Siddharth sees it in real time
    
- User is never turned away — the attendant resolves it physically on the ground
    
- Blocked bay flagged in post-event compliance report as an ops incident
    

Handled at: MVP — attendant briefing protocol and dashboard incident log field. This is an ops response, not a tech feature.

---

1.3 — Venue operator independently oversells the lot outside ParkEase

Trigger: The venue's own parking team sells physical tokens or cash entry at the same lot ParkEase has pre-sold inventory in.

What breaks: ParkEase fill rate data becomes inaccurate. Pre-booked users arrive to a full lot despite confirmed bookings. The entire product promise collapses.

Product response:

- Venue partnership agreement must include an exclusivity clause: ParkEase has sole authority to admit vehicles to designated lots during the event window
    
- The attendant at lot entry acts as physical enforcement — QR scan only, no cash entry
    
- This is a contract and ops failure, not a tech failure. Only the partnership agreement prevents it.
    

Handled at: MVP — exclusivity clause in SLA template. Physical enforcement by attendant.

---

### Category 2 — Tech Failures

---

2.1 — App is down or network is congested on event night

Triggers:

- Server outage, sudden traffic spike, third-party service failure
    
- Network congestion inside a packed venue — 35,000+ people simultaneously using mobile data overwhelm local cell towers. Users cannot load QR codes, notifications don't arrive, deep-links don't open. This is the highest-probability tech failure ParkEase faces and has nothing to do with our own infrastructure.
    

What breaks: Users cannot access QR codes. Attendants cannot scan bookings. The pre-booking promise fails simultaneously for all users.

Product response:

- Manual fallback is the primary response — printed booking confirmation list at every lot entry gate. Attendant cross-checks name and vehicle number against the printed list
    
- QR code must be cached offline — generated and stored locally on the user's device at booking confirmation, not fetched from server on event day. A cached offline QR works with zero connectivity and directly neutralises the network congestion scenario
    
- Pre-event notification sent 2 hours before event embeds the QR as a screenshot-able image for additional offline redundancy
    
- Operator dashboard displays system status indicator — if app is down, Siddharth sees a red alert immediately
    

Handled at: MVP — manual fallback list (ops), offline QR caching (tech), pre-event QR notification (tech).

---

2.2 — UPI payment fails mid-booking

Trigger: Bank server downtime, poor network connectivity at payment moment, UPI timeout. UPI experienced four major outages in less than three weeks in early 2025, with one lasting over five hours. At 16+ billion monthly transactions, even a 0.8% failure rate creates millions of failed payments monthly.

What breaks: User is charged but receives no confirmation, or is not charged but believes they have a confirmed spot.

Product response:

- Payment gateway webhook reconciles transaction status within 60 seconds — if payment confirmed but confirmation not issued, system retries confirmation delivery automatically
    
- If payment fails, the spot is held for 5 minutes while the user retries, then released back to inventory
    
- Clear failure notification: "Payment unsuccessful — your spot is held for 5 minutes. Retry now." Not a generic error
    
- Payment reconciliation log in operator dashboard shows Siddharth any unresolved payment disputes for his event
    

Handled at: MVP — 5-minute hold and retry flow (tech). Webhook reconciliation and dashboard payment log in V2.

---

2.3 — Push notifications fail to send

Trigger: Device notification permissions revoked, notification service outage, app backgrounded and killed by OS.

What breaks: Arjun doesn't get the departure nudge, Priya misses the prohibited items reminder, Rahul's group doesn't get the forward CTA. The behavioural management layer of the product stops working.

Product response:

- Notifications are a best-effort layer — the product must work without them
    
- Booking confirmation screen contains all the same information as the notifications: departure time, bay number, prohibited items note — as a static fallback
    
- Users prompted at first launch to enable notifications with clear value explanation
    
- Notification delivery rate tracked in operator dashboard as a health metric — below 70% delivery triggers a review
    

Handled at: MVP — confirmation screen as fallback (tech/design), notification permission prompt at onboarding (tech).

---

### Category 3 — Redirect Failures

---

3.1 — Parking is full but cab surge pricing makes the redirect unattractive

Trigger: 40,000 people simultaneously request cabs from the same 2km radius. Under MVAG 2025 guidelines, Ola/Uber/Rapido can charge up to 2x the base fare during peak hours — a ₹150 base fare becomes ₹300. While legally capped at 2x, this is still a meaningful deterrent for price-sensitive users like Rahul.

What breaks: User taps the redirect, sees ₹300 surge, closes the app. Demand-shifting fails exactly when needed most.

Product response:

- Redirect screen shows an estimated fare range before the user taps the deep-link, setting honest expectations
    
- If surge is active, redirect CTA copy acknowledges it: "Cab prices may be higher than usual right now — this is still faster than finding parking"
    
- V2: explore event-specific pricing arrangements with cab partners to reduce surge impact at ParkEase redirect events
    

Handled at: MVP — estimated fare display and honest copy (design). Event-specific pricing exploration in V2.

---

3.2 — No cabs available near venue, or driver cancels on redirect

Triggers:

- Very remote venue, insufficient cab supply, all cabs already engaged — user taps redirect, opens Ola, sees "No cabs available nearby"
    
- User books a cab via redirect, driver accepts, then cancels before arriving. 46% of Ola users in Bangalore report driver cancellations as a major complaint. Post-event cancellations are especially common as drivers avoid congested venue areas.
    

What breaks: User is now in the worst possible position — parking is full, redirect failed, no alternative. Frustration directed at ParkEase which triggered the chain.

Product response:

- Redirect screen shows three deep-links simultaneously — Ola, Uber, and Rapido. If one driver cancels or one platform shows no availability, the user has instant fallback without returning to ParkEase
    
- ParkEase checks cab availability signal via API before showing redirect CTA — if all three platforms show low supply, redirect CTA changes to a shuttle option or shows: "Cabs are busy right now — try again in 5 minutes or book from a nearby pickup point"
    
- At MVP, partially mitigated by venue selection criteria: ParkEase only onboards venues with strong cab supply within 2km during peak evening hours
    

Handled at: MVP — three-platform deep-links (tech/design), venue selection criteria (ops/sales). Cab availability API check in V2.

---

3.3 — Drop zone is poorly marked and redirected users can't find it

Trigger: The designated cab/shuttle drop zone is not clearly signed. Redirected users arrive by cab and are dropped in the wrong location.

What breaks: The redirect experience is worse than driving. Varun does not arrive before Rahul. The peer comparison reverses. Word of mouth turns negative.

Product response:

- Cab redirect deep-link passes exact GPS coordinates of the drop zone to Ola/Uber — not a general venue address
    
- Physical signage — "ParkEase Drop Zone" — installed at the drop zone as part of venue onboarding ops checklist
    
- Drop zone must be within 200 metres of the main venue entry gate — a venue partnership requirement
    

Handled at: MVP — GPS coordinates in deep-link (tech), physical signage and 200-metre requirement (ops/venue partnership).

---

### Category 4 — Venue and Ops Failures

---

4.1 — Bay pillar mapping is done incorrectly

Trigger: Mapping exercise error — photographed Bay B-14 but entered as Bay A-14. Or venue repainted bay numbers between mapping exercise and event day.

What breaks: App says Bay 14 but physical bay is labelled differently. Arjun arrives, cannot find his bay. Trust arc collapses.

Product response:

- Mapping exercise documented with photographs — each bay's photo, label, and position stored in the operator dashboard
    
- Two-person sign-off required before event goes live — sign-off captured in dashboard
    
- Venue partnership agreement includes a clause: venue notifies ParkEase of any bay re-labelling at least 7 days before the event
    
- If mismatch discovered on event day, attendant has authority to direct user to the correct bay physically
    

Handled at: MVP — two-person sign-off protocol and photo documentation (ops). Venue notification clause in SLA.

---

4.2 — Event ends significantly earlier or later than scheduled

Trigger: An IPL match ends in 2.5 hours instead of 3.5. A concert runs 45 minutes over schedule. Exit notifications fire at the wrong time.

Product response:

- Exit notification timing must be configurable from the operator dashboard — not hard-coded to a fixed event end time
    
- Simple "send exit notification now" button in the operator dashboard gives Siddharth manual control
    
- Default timing is T-10 minutes before scheduled end — configurable per event
    

Handled at: MVP — manual exit notification trigger in operator dashboard (tech).

---

4.3 — Event cancelled last minute or safety emergency mid-event

4.3a — Pre-event or same-day cancellation

Trigger: Artist no-show, venue damage, government order, force majeure.

Product response:

- Event cancellation button in operator dashboard triggers: automatic refund to all confirmed bookings, cancellation notification to all affected users, compliance report updated
    
- Refund SLA: within 5 business days to original payment method
    
- ParkEase's SLA with Siddharth must cover who bears the refund cost — the organiser, not ParkEase
    

Handled at: MVP — cancellation workflow in dashboard and user notification (tech). Refund SLA in partnership agreement.

4.3b — Safety emergency mid-event (unplanned mass exit)

Trigger: A section needs to be evacuated, a fire alarm triggers, or a crowd crush begins. Mass unplanned exit happens simultaneously with zero coordination. The Bengaluru RCB IPL stampede in June 2025 killed 11 people outside Chinnaswamy Stadium when a post-match celebration crowd overwhelmed exits with no entry cap or emergency plan.

What breaks: In a safety emergency, ParkEase's pre-booked lot — with a single QR-enforced entry/exit point — could become a bottleneck if hundreds of users simultaneously try to retrieve their cars. If ParkEase is seen as contributing to congestion during an emergency, the reputational and legal exposure is severe.

Product response:

- Operator dashboard must have an emergency override button — one tap that deactivates all QR enforcement, opens all lot exits simultaneously, and pushes a notification to all users: "Emergency exit in effect — proceed directly to your vehicle, all gates open"
    
- This removes ParkEase entirely from the critical path during an emergency — the product steps aside
    
- The override is a single flag in the database that bypasses QR scanning logic — simple to build, essential to have
    

Handled at: MVP — emergency override button in operator dashboard (tech). Simple flag implementation, non-negotiable for any venue with large crowds.

---

### Category 5 — B2B and Compliance Failures

---

5.1 — Municipal authority rejects ParkEase compliance report format

Trigger: The municipal body requires a specific format — particular fields, official stamp, notarised data — that ParkEase's auto-generated PDF does not meet. No uniform protocol for managing large public events exists across India's states and cities, meaning report format requirements vary by city and authority.

Product response:

- Before go-live in each city, ParkEase ops/sales team researches the specific compliance format required by that city's municipal authority
    
- PDF template is configurable per city — different field labels, ordering, official header if required
    
- At MVP: manual template review per city, feedback incorporated before next event
    
- City-by-city ops requirement that gets resolved once per city, then becomes standard
    

Handled at: MVP — manual template review (ops/sales). Configurable PDF template per city in V2.

---

5.2 — Competing informal parking operators undercut ParkEase

Trigger: Local entrepreneurs set up ad-hoc parking in nearby open plots at ₹50–100 — half ParkEase's price. Non-bookers flood the informal lots. Unregulated parking with drivers parking anywhere they can find space, including footpaths and no-parking zones, is endemic and documented across Indian metro cities.

Product response:

- ParkEase's response is not on price — it is on certainty and proximity. Informal lots are far, unmanaged, and have no guarantee. ParkEase's value is a named bay near the venue entry gate
    
- Venue partnership must include signage at all venue entry routes indicating pre-booked ParkEase parking — requires municipal permission, city by city
    
- At MVP: accepted as a market constraint. Compliance report tracks % of vehicles using ParkEase vs. total estimated vehicles at the venue — builds the case for reducing informal competition over time
    

Handled at: MVP — accepted constraint, differentiated on certainty not price (product strategy). Route signage partnership in V2.

---

5.3 — User disputes a charge after no-show

Trigger: User booked a spot, did not show up, demands a refund claiming non-receipt of confirmation or technical issue.

Product response:

- Cancellation and no-show policy displayed prominently at three points: venue page, booking flow, and confirmation screen
    
- All booking data — payment timestamp, confirmation sent timestamp, QR generation timestamp — logged and retrievable for dispute resolution
    
- Simple dispute resolution flow: user raises dispute, ParkEase ops reviews booking log within 48 hours, resolves with evidence
    
- RBI mandates auto-refund within T+1 for P2P UPI transactions — ParkEase's refund policy must align with this
    

Handled at: MVP — clear policy at three touchpoints (product/design). Dispute resolution flow in V2.

---

5.4 — Competitor already operating at the target venue

Trigger: ShowMyParking managed 25,000+ vehicles across 32 parking locations at IPL 2022 at Narendra Modi Stadium. ValetEZ has deployed smart parking systems in Bangalore, Hyderabad, and Delhi NCR. If ParkEase approaches a venue where a competitor already has a relationship, the immediate B2B objection is: "We already have a parking partner."

What breaks: The sales motion stalls before the product is even demonstrated. The venue sees no reason to change.

Product response:

- ParkEase's differentiation from ShowMyParking and ValetEZ must be articulated clearly before the first sales call:
    

- ShowMyParking and ValetEZ are ground operations companies — they manage physical parking logistics but have no demand-shifting or redirect product. When their lots fill, they turn people away.
    
- ParkEase's entire value proposition is what happens after the lot fills — the redirect, the compliance data, the dashboard. That gap is the differentiation.
    

- The B2B pitch must lead with the compliance report and redirect data, not the parking management feature — because parking management is table stakes. Demand shifting is not.
    
- At MVP: target venues where no competitor relationship exists. Map competitor presence across Tier 1 city venues before building the sales pipeline.
    

Handled at: MVP — competitor mapping before sales outreach (ops/sales), differentiated pitch (product strategy).

---

---

## Section 6 — Risks & Open Questions

This section documents what we know is dangerous and what we genuinely do not know yet. Risks are threats we can partially mitigate but not eliminate. Open questions require real-world validation through the MVP before confident decisions can be made.

---

### Part A — Risks

---

R1 — The core hypothesis may be wrong

The entire ParkEase thesis rests on one behavioural bet: when shown a parking full screen, Indian event-goers will change their commute behaviour and book a cab or shuttle instead of finding informal alternatives. If the redirect compliance rate at MVP falls below 20%, the demand-shifting mechanism has failed and the product's core differentiation does not exist.

This risk cannot be eliminated before the first event. It can only be measured. The MVP is specifically designed to test this hypothesis at minimum cost before investing in automation, sensor infrastructure, or multi-city expansion.

Mitigation: Redirect screen design must be optimised for conversion — clear value framing, fare estimate, three platform options, and honest copy about surge pricing. The screen is not informational. It is a conversion asset.

Compliance calibration plan: Event 1 data becomes the new baseline. Re-run the financial model before the annual contract conversation. Never present 55% as confirmed — present it as the pre-pilot benchmark.

---

R2 — Venue partnership acquisition is harder and slower than expected

ParkEase has no consumer product without Siddharth saying yes. If event organisers are resistant — protecting existing informal parking revenue, locked into competitor contracts, or risk-averse to new vendors before a flagship event — the entire distribution channel is blocked.

The B2B sales cycle in India's events industry is relationship-driven and slow. A single sale can take 2–3 months. For an MVP that needs its first event to prove the thesis, this creates a real timeline risk.

Mitigation: Target event organisers immediately after a documented industry failure — JLN stampede, Diljit Delhi chaos — when the pain is acute and they are actively looking for solutions. The outreach email that references a specific recent failure converts faster than a cold pitch.

---

R3 — Ola/Uber deep-link redirect is reliable at MVP but V2 API access is uncertain

MVP uses deep-links — no API partnership required. But V2 conversion tracking depends on Ola/Uber providing a referral callback API. Startup access to these APIs is not guaranteed. Both platforms have selective partner programmes with revenue share requirements that may not be viable at early stage.

Mitigation: Rapido is a more accessible partner for early-stage startups and is already integrated with Indian event ticketing flows. Rapido as the primary V2 API partner reduces dependency on Ola/Uber's more restrictive requirements.

---

R4 — Manual inventory management becomes a bottleneck before automation is ready

MVP relies on a ParkEase ops team member physically mapping bays and manually seeding inventory for every event. For one event this is manageable. For five events across three cities simultaneously, this requires a team that does not yet exist and creates a capacity ceiling that limits growth before the product is proven.

Mitigation: Operator self-service inventory input — a simple form in the dashboard where the venue's own ops team enters bay data — reduces ParkEase's ops dependency. This is a V2 feature but should be prioritised early in V2 development to prevent the manual bottleneck from becoming a growth constraint.

---

R5 — Indian venue infrastructure limits the addressable market more than headline event numbers suggest

ParkEase's bay allocation model requires structured, numbered parking with pillar bay systems. Large open grounds used for concerts — NICE Grounds Bangalore, MMRDA Grounds Mumbai, open stadiums — often have no structured parking infrastructure at all. The addressable venue list is smaller than the total Indian live events market implies.

Mitigation: MVP venue selection must explicitly prioritise venues with existing structured parking — stadium complexes, mall-adjacent venues, purpose-built event grounds. A venue audit checklist must be part of the sales process before any partnership is signed.

---

R6 — A single high-profile event night failure creates disproportionate brand damage

ParkEase is a trust product. Unlike a consumer app where negative reviews accumulate gradually, a single event failure — app down at an IPL match, lot oversold, QR enforcement collapses — is instantly visible to 35,000 people simultaneously. Indian social media amplifies event failures rapidly, as JLN, Diljit Delhi, and the Coldplay gridlock all demonstrated.

The reputational risk of a bad first event is existential at MVP stage — before brand equity or track record exists to absorb the damage.

Mitigation: The first MVP event must be deliberately under-promised and over-delivered. A mid-sized concert at a well-mapped, structured venue with a conservative inventory limit (50–60% of total lot capacity pre-sold, not 90%) is safer than maximising revenue at the first event. Build trust before volume.

---

### Part B — Open Questions

---

OQ1 — What is the actual redirect compliance rate in the Indian market?

We have benchmarked 35–40% from Waze and Google Maps data but that is a Western market context with different trust levels, driving culture, and cab availability. The real India number is unknown until we run the first event. This is the single most important unknown in the entire product — everything downstream depends on it.

How we answer it: The first MVP event generates this number. We design the redirect screen for maximum conversion and measure tap rate and estimated compliance. The answer determines whether V2 investment is justified.

---

OQ2 — What is the right consumer pricing for ParkEase?

Informal unmanaged parking at Indian events costs ₹50–100 at the gate. ParkEase must price at a premium that reflects the certainty and proximity value while remaining affordable for price-sensitive segments like Rahul's group.

Proposed pricing range: ₹99–249 based on event scale:

|   |   |   |
|---|---|---|
|Event Scale|Attendees|Recommended Price|
|Small/mid concerts|10,000–20,000|₹99|
|Standard IPL matches|25,000–35,000|₹149|
|Large concerts (Diljit/Karan Aujla scale)|40,000+|₹199|
|Marquee events (Coldplay/Travis Scott scale)|60,000+|₹249|

Group split framing: ₹149 split 4 ways = ₹37 per person — less than informal parking per person in a group. This copy converts Rahul.

What we need to validate: Does attach rate at checkout respond meaningfully to price (price-elastic demand) or is the primary driver certainty value (price-inelastic)? Requires A/B testing at V2 stage.

---

OQ3 — Will event organisers accept ParkEase taking contractual liability?

The SLA clause where ParkEase accepts liability for the parking product is the strongest B2B conversion point. But it is also a meaningful financial risk as events scale. A 35,000-person event where ParkEase fails to deliver 500 confirmed spots could generate 500 refunds plus organiser compensation — significant liability at early stage with no insurance product in place.

How we answer it: Legal review of liability cap structures used by comparable Indian event-tech vendors. Cap total SLA liability at a fixed amount per event rather than unlimited exposure. This protects ParkEase while still being meaningfully more accountable than the alternative.

---

OQ4 — Which city and venue should be the first MVP event?

The choice matters more than it appears. A high-profile failure at a marquee venue causes irreversible damage at MVP stage. A quiet first event at a smaller venue gives room to learn and iterate.

Criteria for the right first MVP event:

- Structured parking infrastructure with numbered bays
    
- Event size 15,000–25,000 attendees — large enough to prove the thesis, small enough to manage
    
- Venue with a cooperative operations team willing to participate in bay mapping
    
- City with strong Ola/Uber/Rapido supply near the venue
    
- Organiser motivated by compliance protection, not just convenience
    

Bangalore is the strongest candidate — structured parking infrastructure at venues like Chinnaswamy, strong cab supply, tech-savvy audience likely to adopt pre-booking behaviour, and a recent documented failure (RCB stampede June 2025) that creates B2B urgency.

---

OQ5 — How does ParkEase handle the transition from manual to automated inventory at scale?

Manual seeding works for MVP. The architectural question for V2 is: do we build our own sensor network, partner with ValetEZ who already has sensors deployed in Hyderabad and Bangalore, or develop an operator self-service input tool?

Partnership with ValetEZ is the most efficient path — they already have ANPR cameras and sensor infrastructure at multiple Indian venues. A data-sharing arrangement where ValetEZ provides occupancy data and ParkEase provides the demand-shifting and booking layer could bypass the sensor investment entirely. This is a build vs. partner decision with significant cost and timeline implications that must be evaluated before V2 development begins.

---

OQ6 — How does ParkEase handle multi-zone events and festivals?

Some large events span multiple stages, gates, and parking zones. Does ParkEase manage one lot per event or can a single event have multiple parking zones with separate inventory, separate QR flows, and separate redirect thresholds per zone?

This is an architectural question that does not need to be answered for MVP (single venue, single lot) but must be resolved before V2 feature development begins. The data model either supports multi-zone natively or requires significant rearchitecture later. The decision made here has compounding implications for the operator dashboard design, bay mapping ops process, and compliance report structure.

---

## PRD Status

|   |   |
|---|---|
|Section|Status|
|Section 1 — Problem Statement|✅ Complete|
|Section 2 — Success Metrics|✅ Complete|
|Section 3 — User Journeys (all 4 personas)|✅ Complete|
|Section 4 — Feature List & Prioritization|✅ Complete|
|Section 5 — Edge Cases & Constraints|✅ Complete|
|Section 6 — Risks & Open Questions|✅ Complete|

Phase 2 — PRD: Complete

Next phase: Phase 3 — Business Model (unit economics, revenue model, go-to-market strategy, break-even analysis)

---

## Section 7 — Non-Goals & Launch Plan

These two sections close the gap between our PRD and industry standard. Non-goals define what ParkEase deliberately does not do. The launch plan defines the honest sequence from prototype to market — written for a two-person team, not a corporate org.

---

### 7.1 Non-Goals

These are explicit areas ParkEase does not address. They are as important as the goals — they prevent scope creep, keep the product focused, and make it clear to anyone reading this PRD where the product's responsibility begins and ends.

1. ParkEase does not operate or manage shuttle/bus fleets.

We redirect users to Ola, Uber, and Rapido — we do not procure, schedule, or operate vehicles. Running a proprietary fleet is a different business with entirely different capital requirements, regulatory burden, and operational complexity. This is out of scope permanently, not just at MVP.

2. ParkEase does not handle in-venue navigation.

Our product boundary ends at the parking entry gate. What happens inside the venue — finding a seat, locating food stalls, navigating between stages — is the venue's responsibility. We do not want to be a venue guide app.

3. ParkEase does not serve venues without structured, numbered parking.

Open grounds, roadside informal lots, and unmanaged open plots are not compatible with our named bay allocation model. We do not attempt to manage parking at venues where pillar bay infrastructure does not exist. This is a deliberate market constraint, not a temporary limitation.

4. ParkEase does not replace BookMyShow or event ticketing platforms.

We are a parking and transit layer on top of existing ticketing infrastructure. We do not sell event tickets, manage event access, or compete with the ticketing flow. Our product only works because BookMyShow and similar platforms exist.

5. ParkEase does not manage post-parking congestion inside the venue.

Crowd management within the venue gates, queuing at entry points, and security checks are entirely the venue's and organiser's responsibility. ParkEase's compliance report documents parking performance only — not overall event management.

6. ParkEase does not guarantee cab or shuttle availability at the redirect moment.

When parking fills and we redirect users to Ola/Uber/Rapido, we are facilitating access to third-party services. We take no responsibility for cab availability, driver cancellations, or surge pricing on those platforms. We mitigate this with three-platform deep-links and honest fare estimates — but we do not own the redirect outcome.

---

### 7.2 Launch Plan

This is not a corporate milestone table. It is the honest sequence of how ParkEase reaches the market — written for a two-person team where the founders own both product and operations.

---

Stage 1 — Prototype Validation (Phase 4 of this project)

Build the five core prototype screens. Demo to 3–5 potential event organiser contacts to validate the product concept before committing to a live event.

- What we build: S1 (Venue page), S2 (Booking flow), S3 (Confirmation), S4 (Redirect screen), S5 (Operator dashboard)
    
- What we test: Does the product story land? Does the operator dashboard convince Siddharth-type buyers?
    
- Exit criteria: At least one event organiser expresses genuine intent to pilot
    

---

Stage 2 — First Live Pilot Event

Single venue, single city (Bangalore recommended), 15,000–25,000 attendees, structured parking. Conservative inventory — 50–60% of lot capacity pre-sold, not 90%. Manual ops throughout.

- What we test: Redirect compliance rate (the most important unknown in the product), QR enforcement at gate, UPI booking flow under real conditions
    
- What we produce: First compliance report, first real redirect compliance data
    
- Exit criteria: Redirect compliance rate measured and above 20%, at least one post-event compliance report generated, zero catastrophic failures
    

Key risk: B2B sales cycle is the gating factor. If finding a willing pilot organiser takes 2–3 months, everything shifts. The JLN/Diljit documentation strategy — outreach timed to documented event failures — is the mitigation.

---

Stage 3 — Second Event with Refinements

Apply learnings from Stage 2. Same city, potentially same venue. Increase inventory confidence. Test WhatsApp CTA and UPI split at scale.

- What we fix: Redirect screen copy, notification timing, any ops gaps from Stage 2
    
- Exit criteria: Repeat booking rate measurable, organiser requests a second event
    

---

Stage 4 — Second City Expansion

Mumbai or Delhi depending on where the B2B relationship is strongest. Same playbook — single venue, conservative inventory, manual ops.

- Exit criteria: Two Tier 1 cities operational, one annual contract signed with an organiser
    

---

What determines the pace between stages:

Not a calendar. The B2B sales relationship. Each stage unlocks when Siddharth says yes — not when a sprint ends.

  
**