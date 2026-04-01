import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const fetchEvents = () => api.get('/api/events').then(r => r.data);
export const fetchEvent = (eventId) => api.get(`/api/events/${eventId}`).then(r => r.data);
export const fetchBays = (eventId, lotId) => {
  const params = lotId ? { lot_id: lotId } : {};
  return api.get(`/api/events/${eventId}/bays`, { params }).then(r => r.data);
};
export const fetchEventStats = (eventId) => api.get(`/api/events/${eventId}/stats`).then(r => r.data);
export const createBooking = (data) => api.post('/api/bookings', data).then(r => r.data);
export const fetchBooking = (bookingId) => api.get(`/api/bookings/${bookingId}`).then(r => r.data);

export default api;