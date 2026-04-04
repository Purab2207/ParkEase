// ParkEase API layer — app/ (Vite)
// Tries the real FastAPI backend first, falls back to local data if unavailable.
// This means the Vercel deploy (no backend) always works via fallback,
// and local dev with backend running gets live data automatically.

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

async function apiFetch(path) {
  const res = await fetch(`${BACKEND_URL}${path}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// ---------------------------------------------------------------------------
// Fallback event data — used when backend is unreachable (e.g. Vercel deploy)
// Add new events here when onboarding new organisers.
// ---------------------------------------------------------------------------
export const FALLBACK_EVENTS = {
  'karan-aujla-jln-2026': {
    event_id: 'karan-aujla-jln-2026',
    event_name: 'Karan Aujla',
    sub_title: 'The Bombairiya Tour',
    venue: 'Jawaharlal Nehru Stadium',
    city: 'Delhi',
    date: 'Sat, 12 Apr 2026',
    doors_open: '6:00 PM',
    show_time: '8:00 PM',
    total_spots: 500,
    spots_remaining: 47,
    consumer_price: 169,
    venue_base_rate: 120,
    park_ease_fee: 49,
    event_tier: 'Standard',
    distance_to_gate_metres: 180,
    gate_name: 'Gate 2',
    covered_parking: true,
    entry_windows: ['5:30–7:00 PM', '7:00–8:30 PM'],
    lots: [
      { id: 'north', name: 'North Lot', total: 300, distance_m: 180, gate_name: 'Gate 2' },
      { id: 'south', name: 'South Lot', total: 200, distance_m: 280, gate_name: 'Gate 4' },
    ],
    prohibited_items: ['Professional cameras / DSLR', 'Outside food & beverages', 'Laser pointers', 'Selfie sticks / tripods', 'Power banks above 20,000 mAh'],
    amenities: ['Covered parking', 'Pillar-mapped bays', 'QR entry enforcement', 'Pre-assigned bay number'],
    booking_count: 453,
  },
  'arijit-singh-dy-patil-2026': {
    event_id: 'arijit-singh-dy-patil-2026',
    event_name: 'Arijit Singh',
    sub_title: 'Arijit Singh Live in Concert',
    venue: 'DY Patil Stadium',
    city: 'Navi Mumbai',
    date: 'Fri, 18 Apr 2026',
    doors_open: '5:30 PM',
    show_time: '7:30 PM',
    total_spots: 600,
    spots_remaining: 120,
    consumer_price: 149,
    venue_base_rate: 100,
    park_ease_fee: 49,
    event_tier: 'Standard',
    distance_to_gate_metres: 150,
    gate_name: 'Gate 1',
    covered_parking: false,
    entry_windows: ['4:30–6:00 PM', '6:00–7:30 PM'],
    lots: [
      { id: 'north', name: 'North Lot', total: 350, distance_m: 150, gate_name: 'Gate 1' },
      { id: 'south', name: 'South Lot', total: 250, distance_m: 250, gate_name: 'Gate 3' },
    ],
    prohibited_items: ['Professional cameras / DSLR', 'Outside food & beverages', 'Laser pointers', 'Drones'],
    amenities: ['Pillar-mapped bays', 'QR entry enforcement', 'Pre-assigned bay number'],
    booking_count: 480,
  },
  'coldplay-nms-2026': {
    event_id: 'coldplay-nms-2026',
    event_name: 'Coldplay',
    sub_title: 'Music of the Spheres World Tour',
    venue: 'Narendra Modi Stadium',
    city: 'Ahmedabad',
    date: 'Sun, 26 Jan 2026',
    doors_open: '4:00 PM',
    show_time: '6:00 PM',
    total_spots: 800,
    spots_remaining: 12,
    consumer_price: 199,
    venue_base_rate: 150,
    park_ease_fee: 49,
    event_tier: 'Premium',
    distance_to_gate_metres: 200,
    gate_name: 'Gate A',
    covered_parking: true,
    entry_windows: ['3:00–5:00 PM', '5:00–6:00 PM'],
    lots: [
      { id: 'north', name: 'North Lot', total: 500, distance_m: 200, gate_name: 'Gate A' },
      { id: 'south', name: 'South Lot', total: 300, distance_m: 300, gate_name: 'Gate D' },
    ],
    prohibited_items: ['Professional cameras / DSLR', 'Outside food & beverages', 'Laser pointers', 'Selfie sticks / tripods', 'Power banks above 20,000 mAh', 'Confetti cannons'],
    amenities: ['Covered parking', 'Pillar-mapped bays', 'QR entry enforcement', 'Pre-assigned bay number', 'EV charging bays'],
    booking_count: 788,
  },
  'diljit-dosanjh-pca-2026': {
    event_id: 'diljit-dosanjh-pca-2026',
    event_name: 'Diljit Dosanjh',
    sub_title: 'Dil-Luminati Tour',
    venue: 'PCA Cricket Stadium',
    city: 'Mohali',
    date: 'Sat, 10 May 2026',
    doors_open: '5:00 PM',
    show_time: '7:00 PM',
    total_spots: 400,
    spots_remaining: 89,
    consumer_price: 169,
    venue_base_rate: 120,
    park_ease_fee: 49,
    event_tier: 'Standard',
    distance_to_gate_metres: 160,
    gate_name: 'Gate 3',
    covered_parking: false,
    entry_windows: ['4:00–5:30 PM', '5:30–7:00 PM'],
    lots: [
      { id: 'north', name: 'North Lot', total: 250, distance_m: 160, gate_name: 'Gate 3' },
      { id: 'south', name: 'South Lot', total: 150, distance_m: 220, gate_name: 'Gate 5' },
    ],
    prohibited_items: ['Professional cameras / DSLR', 'Outside food & beverages', 'Laser pointers'],
    amenities: ['Pillar-mapped bays', 'QR entry enforcement', 'Pre-assigned bay number'],
    booking_count: 311,
  },
};

export const FALLBACK_EVENTS_LIST = Object.values(FALLBACK_EVENTS);

// ---------------------------------------------------------------------------
// API functions — each falls back to local data on network failure
// ---------------------------------------------------------------------------

export async function fetchEvents() {
  try {
    return await apiFetch('/api/events');
  } catch {
    return FALLBACK_EVENTS_LIST;
  }
}

export async function fetchEvent(eventId) {
  try {
    return await apiFetch(`/api/events/${eventId}`);
  } catch {
    return FALLBACK_EVENTS[eventId] || FALLBACK_EVENTS['karan-aujla-jln-2026'];
  }
}

export async function fetchBays(eventId) {
  try {
    return await apiFetch(`/api/events/${eventId}/bays`);
  } catch {
    return null; // caller falls back to generic bay grid
  }
}

export async function fetchBooking(bookingId) {
  try {
    return await apiFetch(`/api/bookings/${bookingId}`);
  } catch {
    return null;
  }
}
