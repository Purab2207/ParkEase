// ParkEase API layer — app/ (Vite)
// GET endpoints: direct Supabase client calls (anon key, RLS-protected).
// POST endpoints: Supabase Edge Functions (service-role key, server-side only).
// Falls back to FALLBACK_EVENTS when Supabase isn't configured.

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const FUNCTIONS_URL = SUPABASE_URL ? `${SUPABASE_URL}/functions/v1` : '';

let _supabase = null;
function getSupabase() {
  if (!_supabase && SUPABASE_URL && SUPABASE_ANON_KEY) {
    _supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return _supabase;
}

// ---------------------------------------------------------------------------
// Fallback event data — used when Supabase isn't reachable.
// Add new events here when onboarding new organisers.
// ---------------------------------------------------------------------------
export const FALLBACK_EVENTS = {
  'karan-aujla-jln-2026': {
    event_id: 'karan-aujla-jln-2026',
    hero_image: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&q=80&auto=format&fit=crop',
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
    parking_lat: 28.5673,
    parking_lng: 77.2431,
  },
  'arijit-singh-dy-patil-2026': {
    event_id: 'arijit-singh-dy-patil-2026',
    hero_image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80&auto=format&fit=crop',
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
    parking_lat: 19.0444,
    parking_lng: 73.0169,
  },
  'coldplay-nms-2026': {
    event_id: 'coldplay-nms-2026',
    hero_image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80&auto=format&fit=crop',
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
    parking_lat: 23.0922,
    parking_lng: 72.5952,
  },
  'diljit-dosanjh-pca-2026': {
    event_id: 'diljit-dosanjh-pca-2026',
    hero_image: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800&q=80&auto=format&fit=crop',
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
    parking_lat: 30.6942,
    parking_lng: 76.7236,
  },
  'csk-kkr-ipl-2026': {
    event_id: 'csk-kkr-ipl-2026',
    hero_image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&q=80&auto=format&fit=crop',
    event_name: 'CSK vs KKR',
    sub_title: 'IPL 2026 · League Stage',
    venue: 'MA Chidambaram Stadium',
    city: 'Chennai',
    date: 'Sat, 18 Apr 2026',
    doors_open: '5:00 PM',
    show_time: '7:30 PM',
    total_spots: 350,
    spots_remaining: 142,
    consumer_price: 129,
    venue_base_rate: 80,
    park_ease_fee: 49,
    event_tier: 'Standard',
    distance_to_gate_metres: 140,
    gate_name: 'Gate A',
    covered_parking: false,
    entry_windows: ['4:00–5:30 PM', '5:30–7:00 PM'],
    lots: [
      { id: 'north', name: 'North Lot', total: 200, distance_m: 140, gate_name: 'Gate A' },
      { id: 'south', name: 'South Lot', total: 150, distance_m: 210, gate_name: 'Gate C' },
    ],
    prohibited_items: ['Professional cameras / DSLR', 'Outside food & beverages', 'Laser pointers', 'Banners larger than A4'],
    amenities: ['Pillar-mapped bays', 'QR entry enforcement', 'Pre-assigned bay number'],
    booking_count: 208,
    parking_lat: 13.0604,
    parking_lng: 80.2789,
  },
  'mi-srh-ipl-2026': {
    event_id: 'mi-srh-ipl-2026',
    hero_image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&q=80&auto=format&fit=crop',
    event_name: 'MI vs SRH',
    sub_title: 'IPL 2026 · League Stage',
    venue: 'Wankhede Stadium',
    city: 'Mumbai',
    date: 'Sun, 26 Apr 2026',
    doors_open: '5:30 PM',
    show_time: '7:30 PM',
    total_spots: 300,
    spots_remaining: 178,
    consumer_price: 129,
    venue_base_rate: 80,
    park_ease_fee: 49,
    event_tier: 'Standard',
    distance_to_gate_metres: 120,
    gate_name: 'Gate 1',
    covered_parking: false,
    entry_windows: ['4:30–6:00 PM', '6:00–7:30 PM'],
    lots: [
      { id: 'north', name: 'North Lot', total: 180, distance_m: 120, gate_name: 'Gate 1' },
      { id: 'south', name: 'South Lot', total: 120, distance_m: 200, gate_name: 'Gate 3' },
    ],
    prohibited_items: ['Professional cameras / DSLR', 'Outside food & beverages', 'Laser pointers', 'Banners larger than A4'],
    amenities: ['Pillar-mapped bays', 'QR entry enforcement', 'Pre-assigned bay number'],
    booking_count: 122,
    parking_lat: 18.9388,
    parking_lng: 72.8258,
  },
};

export const FALLBACK_EVENTS_LIST = Object.values(FALLBACK_EVENTS);

// ---------------------------------------------------------------------------
// Normalize a raw Supabase events row to the shape the frontend expects.
// ---------------------------------------------------------------------------
function normalizeEvent(e) {
  const total = e.total_spots ?? 0;
  const remaining = e.spots_remaining ?? 0;
  const booked = total - remaining;
  const fillPercent = total > 0 ? Math.round((booked / total) * 100) : 0;
  return {
    ...e,
    event_id: e.id ?? e.event_id,
    event_name: e.name ?? e.event_name,
    consumer_price: e.price ?? e.consumer_price,
    booked_spots: booked,
    fill_percent: fillPercent,
    booking_count: booked,
    redirect_active: booked >= Math.floor(total * 0.9),
  };
}

// ---------------------------------------------------------------------------
// GET endpoints — direct Supabase client (anon key, no backend needed)
// ---------------------------------------------------------------------------

export async function fetchEvents() {
  try {
    const sb = getSupabase();
    if (!sb) return FALLBACK_EVENTS_LIST;
    const { data, error } = await sb.from('events').select('*');
    if (error) throw error;
    return data.map(normalizeEvent);
  } catch {
    return FALLBACK_EVENTS_LIST;
  }
}

export async function fetchEvent(eventId) {
  try {
    const sb = getSupabase();
    if (!sb) return FALLBACK_EVENTS[eventId] ?? null;
    const { data, error } = await sb.from('events').select('*').eq('id', eventId).single();
    if (error) throw error;
    return normalizeEvent(data);
  } catch {
    return FALLBACK_EVENTS[eventId] ?? null;
  }
}

export async function fetchBays(eventId) {
  try {
    const sb = getSupabase();
    if (!sb) return null;
    const { data, error } = await sb
      .from('bays')
      .select('event_id,lot_id,pillar_code,status')
      .eq('event_id', eventId);
    if (error) throw error;
    return data;
  } catch {
    return null;
  }
}

export async function fetchBooking(bookingId) {
  try {
    const sb = getSupabase();
    if (!sb) return null;
    const { data: booking, error } = await sb
      .from('bookings')
      .select('*')
      .eq('booking_id', bookingId)
      .single();
    if (error) throw error;

    const { data: event } = await sb.from('events').select('*').eq('id', booking.event_id).single();

    let bayLot = {};
    if (booking.bay_id && event) {
      const { data: bay } = await sb.from('bays').select('*').eq('id', booking.bay_id).single();
      if (bay) {
        const lots = event.lots || [];
        const lotInfo = lots.find(l => l.id === bay.lot_id) || {};
        bayLot = {
          bay_pillar_code: bay.pillar_code,
          lot_name: lotInfo.name || '',
          distance_to_gate_metres: lotInfo.distance_m || 0,
          gate_name: lotInfo.gate_name || '',
        };
      }
    }

    return {
      ...booking,
      event_name: event?.name || '',
      venue: event ? `${event.venue}, ${event.city}` : '',
      date: event?.date || '',
      consumer_price: event?.price || 0,
      ...bayLot,
    };
  } catch {
    return null;
  }
}

export async function fetchStats(eventId) {
  try {
    const sb = getSupabase();
    if (!sb) return null;
    const { data: event, error } = await sb.from('events').select('*').eq('id', eventId).single();
    if (error) throw error;

    const total = event.total_spots;
    const remaining = event.spots_remaining;
    const booked = total - remaining;
    const fillPercent = total > 0 ? Math.round((booked / total) * 100) : 0;
    const redirectThreshold = Math.floor(total * 0.9);
    const redirectCtaTaps = fillPercent > 50 ? Math.max(0, Math.round((fillPercent - 50) * 2.36)) : 0;

    const lots = event.lots || [];
    const lotStats = await Promise.all(lots.map(async lot => {
      const { data: bays } = await sb
        .from('bays')
        .select('status')
        .eq('event_id', eventId)
        .eq('lot_id', lot.id);
      const lotBooked = bays?.filter(b => b.status === 'booked').length || 0;
      return {
        name: lot.name,
        total: lot.total,
        booked: lotBooked,
        percent: lot.total > 0 ? Math.round((lotBooked / lot.total) * 100) : 0,
      };
    }));

    return {
      event_name: event.name,
      venue: `${event.venue}, ${event.city}`,
      date: event.date,
      event_status: 'live',
      total_spots: total,
      booked_spots: booked,
      spots_remaining: remaining,
      fill_percent: fillPercent,
      redirect_cta_taps: redirectCtaTaps,
      compliance_rate: 0.55,
      redirect_threshold_spots: redirectThreshold,
      redirect_active: booked >= redirectThreshold,
      lots: lotStats,
      last_updated: new Date().toISOString().slice(11, 16),
    };
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// POST endpoints — Supabase Edge Functions (server-side secrets)
// ---------------------------------------------------------------------------

export async function requestOtp(phone, email) {
  if (!FUNCTIONS_URL) throw new Error('Supabase not configured');
  const res = await fetch(`${FUNCTIONS_URL}/request-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, email }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || body.detail || 'Failed to send OTP');
  }
  return res.json();
}

export async function verifyOtp(email, code, phone) {
  if (!FUNCTIONS_URL) throw new Error('Supabase not configured');
  const res = await fetch(`${FUNCTIONS_URL}/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, code, phone }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || body.detail || 'Invalid OTP');
  }
  return res.json();
}

export async function createBooking(payload) {
  if (!FUNCTIONS_URL) throw new Error('Supabase not configured');
  const res = await fetch(`${FUNCTIONS_URL}/create-booking`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || body.error || `HTTP ${res.status}`);
  }
  return res.json();
}
