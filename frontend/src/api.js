import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL;
const DASHBOARD_KEY = process.env.REACT_APP_DASHBOARD_KEY || '';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Operator-only instance — attaches the dashboard key header
const operatorApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-Dashboard-Key': DASHBOARD_KEY,
  },
});

export const fetchEvents = () => api.get('/api/events').then(r => r.data);
export const fetchEvent = (eventId) => api.get(`/api/events/${eventId}`).then(r => r.data);
export const fetchBays = (eventId, lotId) => {
  const params = lotId ? { lot_id: lotId } : {};
  return api.get(`/api/events/${eventId}/bays`, { params }).then(r => r.data);
};
// Stats endpoint requires operator key — uses operatorApi
export const fetchEventStats = (eventId) =>
  operatorApi.get(`/api/events/${eventId}/stats`).then(r => r.data);
export const createBooking = (data) => api.post('/api/bookings', data).then(r => r.data);
export const fetchBooking = (bookingId, email) => {
  const params = email ? { email } : {};
  return api.get(`/api/bookings/${bookingId}`, { params }).then(r => r.data);
};

export default api;
