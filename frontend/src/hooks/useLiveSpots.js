import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchEvent } from '../api';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';

function getWsUrl(eventId) {
  // Always match the page protocol: wss:// on HTTPS, ws:// on HTTP.
  // /^http/ would leave "http://" → "ws://" even when the page is HTTPS,
  // which browsers block as mixed content with no thrown error.
  const proto = window.location.protocol === 'https:' ? 'wss' : 'ws';
  const host = BACKEND_URL.replace(/^https?:\/\//, '') || window.location.host;
  return `${proto}://${host}/api/ws/events/${eventId}/live`;
}

export default function useLiveSpots(eventId) {
  const [spotsRemaining, setSpotsRemaining] = useState(null);
  const [bookedSpots, setBookedSpots] = useState(null);
  const [fillPercent, setFillPercent] = useState(null);
  const [totalSpots, setTotalSpots] = useState(null);
  const [redirectActive, setRedirectActive] = useState(false);
  const [connected, setConnected] = useState(false);

  const wsRef = useRef(null);
  const reconnectTimer = useRef(null);
  const pingTimer = useRef(null);

  const applyUpdate = useCallback((data) => {
    if (data.type === 'live_count') {
      setSpotsRemaining(data.spots_remaining);
      setBookedSpots(data.booked_spots);
      setFillPercent(data.fill_percent);
      setTotalSpots(data.total_spots);
      setRedirectActive(data.redirect_active);
    }
  }, []);

  // Polling fallback
  const pollOnce = useCallback(() => {
    if (!eventId) return;
    fetchEvent(eventId)
      .then(data => {
        setSpotsRemaining(data.spots_remaining);
        setBookedSpots(data.booked_spots);
        setFillPercent(data.fill_percent);
        setTotalSpots(data.total_spots);
        setRedirectActive(data.redirect_active);
      })
      .catch(() => {});
  }, [eventId]);

  useEffect(() => {
    if (!eventId) return;

    let isMounted = true;

    const connect = () => {
      if (!isMounted) return;
      const url = getWsUrl(eventId);
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        if (!isMounted) return;
        setConnected(true);
        // Send pings every 25s to keep alive
        pingTimer.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send('ping');
          }
        }, 25000);
      };

      ws.onmessage = (event) => {
        if (!isMounted) return;
        try {
          const data = JSON.parse(event.data);
          applyUpdate(data);
        } catch (e) { /* ignore */ }
      };

      ws.onclose = () => {
        if (!isMounted) return;
        setConnected(false);
        clearInterval(pingTimer.current);
        // Reconnect after 3s
        reconnectTimer.current = setTimeout(connect, 3000);
      };

      ws.onerror = () => {
        ws.close();
      };
    };

    connect();

    // Initial poll as fallback (WebSocket might take a moment)
    pollOnce();

    // Poll every 10s as fallback if WebSocket disconnects
    const pollInterval = setInterval(() => {
      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
        pollOnce();
      }
    }, 10000);

    return () => {
      isMounted = false;
      clearTimeout(reconnectTimer.current);
      clearInterval(pingTimer.current);
      clearInterval(pollInterval);
      if (wsRef.current) {
        wsRef.current.onclose = null;
        wsRef.current.close();
      }
    };
  }, [eventId, applyUpdate, pollOnce]);

  return { spotsRemaining, bookedSpots, fillPercent, totalSpots, redirectActive, connected };
}