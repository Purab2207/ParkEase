import { useState, useEffect, useRef, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import { fetchEvent } from '../api';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

let _supabase = null;
function getSupabase() {
  if (!_supabase && SUPABASE_URL && SUPABASE_ANON_KEY) {
    _supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return _supabase;
}

export default function useLiveSpots(eventId) {
  const [spotsRemaining, setSpotsRemaining] = useState(null);
  const [bookedSpots, setBookedSpots] = useState(null);
  const [fillPercent, setFillPercent] = useState(null);
  const [totalSpots, setTotalSpots] = useState(null);
  const [redirectActive, setRedirectActive] = useState(false);
  const [connected, setConnected] = useState(false);

  const channelRef = useRef(null);

  const applyEventData = useCallback((data) => {
    const total = data.total_spots ?? null;
    const remaining = data.spots_remaining ?? null;
    const booked = (total != null && remaining != null) ? total - remaining : (data.booked_spots ?? null);
    const fill = data.fill_percent ?? (total ? Math.round(((total - (remaining ?? 0)) / total) * 100) : null);
    setSpotsRemaining(remaining);
    setBookedSpots(booked);
    setFillPercent(fill);
    setTotalSpots(total);
    setRedirectActive(data.redirect_active ?? false);
  }, []);

  useEffect(() => {
    if (!eventId) return;
    let isMounted = true;

    // Initial load via API
    fetchEvent(eventId).then(data => {
      if (isMounted) applyEventData(data);
    }).catch(() => {});

    // Supabase Realtime: watch events table for spots_remaining changes
    const supabase = getSupabase();
    if (supabase) {
      const channel = supabase
        .channel(`event-spots-${eventId}`)
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'events', filter: `id=eq.${eventId}` },
          (payload) => {
            if (!isMounted) return;
            const row = payload.new;
            const total = row.total_spots;
            const remaining = row.spots_remaining;
            const booked = total - remaining;
            setSpotsRemaining(remaining);
            setBookedSpots(booked);
            setFillPercent(total ? Math.round((booked / total) * 100) : 0);
            setTotalSpots(total);
            setRedirectActive(booked >= total * 0.9);
          }
        )
        .subscribe((status) => {
          if (isMounted) setConnected(status === 'SUBSCRIBED');
        });
      channelRef.current = channel;
    }

    // Polling fallback every 30s when Realtime isn't available
    const pollInterval = setInterval(() => {
      if (!isMounted) return;
      fetchEvent(eventId).then(data => {
        if (isMounted) applyEventData(data);
      }).catch(() => {});
    }, 30000);

    return () => {
      isMounted = false;
      clearInterval(pollInterval);
      const sb = getSupabase();
      if (sb && channelRef.current) {
        sb.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [eventId, applyEventData]);

  return { spotsRemaining, bookedSpots, fillPercent, totalSpots, redirectActive, connected };
}
