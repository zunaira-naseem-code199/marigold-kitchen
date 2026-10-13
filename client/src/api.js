const BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
const TOKEN_KEY = 'mk_admin_token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t) => (t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY));

export class ApiError extends Error {
  constructor(message, status, fieldErrors) {
    super(message);
    this.status = status;
    this.fieldErrors = fieldErrors || {};
  }
}

async function request(path, { method = 'GET', body, auth = false } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth && getToken()) headers.Authorization = `Bearer ${getToken()}`;

  let res;
  try {
    res = await fetch(`${BASE}/api${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined });
  } catch {
    throw new ApiError('Cannot reach the server. Please check your connection and try again.', 0);
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401 && auth) {
      setToken(null);
      window.dispatchEvent(new Event('mk-auth-expired'));
    }
    throw new ApiError(data.message || 'Something went wrong', res.status, data.errors);
  }
  return data;
}

export const api = {
  // public
  menu: (params = '') => request(`/menu${params}`),
  reviews: (featured = true) => request(`/reviews${featured ? '?featured=true' : ''}`),
  availability: (date) => request(`/reservations/availability?date=${encodeURIComponent(date)}`),
  reserve: (payload) => request('/reservations', { method: 'POST', body: payload }),
  enquire: (payload) => request('/enquiries', { method: 'POST', body: payload }),
  // auth
  login: (email, password) => request('/auth/login', { method: 'POST', body: { email, password } }),
  me: () => request('/auth/me', { auth: true }),
  // admin
  stats: () => request('/admin/stats', { auth: true }),
  adminMenu: () => request('/admin/menu', { auth: true }),
  createMenuItem: (body) => request('/admin/menu', { method: 'POST', body, auth: true }),
  updateMenuItem: (id, body) => request(`/admin/menu/${id}`, { method: 'PUT', body, auth: true }),
  patchMenuItem: (id, body) => request(`/admin/menu/${id}`, { method: 'PATCH', body, auth: true }),
  deleteMenuItem: (id) => request(`/admin/menu/${id}`, { method: 'DELETE', auth: true }),
  adminReservations: (query = '') => request(`/admin/reservations${query}`, { auth: true }),
  setReservationStatus: (id, status) =>
    request(`/admin/reservations/${id}/status`, { method: 'PATCH', body: { status }, auth: true }),
  adminEnquiries: () => request('/admin/enquiries', { auth: true }),
  setEnquiryStatus: (id, status) => request(`/admin/enquiries/${id}`, { method: 'PATCH', body: { status }, auth: true }),
};
