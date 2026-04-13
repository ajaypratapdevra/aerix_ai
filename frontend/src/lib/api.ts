import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' }
});

// Attach JWT token to every request if available
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('aerix_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally (token expired)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('aerix_token');
      localStorage.removeItem('aerix_user');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// ─── Auth ─────────────────────────────────────────────────────
export const authAPI = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data: any) => api.put('/auth/profile', data),
};

// ─── Workshops ────────────────────────────────────────────────
export const workshopsAPI = {
  getAll: () => api.get('/workshops'),
  getOne: (id: string) => api.get(`/workshops/${id}`),
  create: (data: any) => api.post('/workshops', data),
  update: (id: string, data: any) => api.put(`/workshops/${id}`, data),
  delete: (id: string) => api.delete(`/workshops/${id}`),
};

// ─── Bookings ─────────────────────────────────────────────────
export const bookingsAPI = {
  create: (data: any) => api.post('/bookings', data),
  getMy: () => api.get('/bookings/my'),
  getAll: (params?: any) => api.get('/bookings', { params }),
  updateStatus: (id: string, data: any) => api.put(`/bookings/${id}/status`, data),
};

// ─── Products ─────────────────────────────────────────────────
export const productsAPI = {
  getAll: (params?: any) => api.get('/products', { params }),
  getOne: (id: string) => api.get(`/products/${id}`),
  create: (data: any) => api.post('/products', data),
  update: (id: string, data: any) => api.put(`/products/${id}`, data),
  delete: (id: string) => api.delete(`/products/${id}`),
};

// ─── Requests ─────────────────────────────────────────────────
export const requestsAPI = {
  create: (data: any) => api.post('/requests', data),
  getMy: () => api.get('/requests/my'),
  getAll: (params?: any) => api.get('/requests', { params }),
  updateStatus: (id: string, data: any) => api.put(`/requests/${id}/status`, data),
};

// ─── Inquiries ────────────────────────────────────────────────
export const inquiriesAPI = {
  create: (data: any) => api.post('/inquiries', data),
  getAll: (params?: any) => api.get('/inquiries', { params }),
  updateStatus: (id: string, data: any) => api.put(`/inquiries/${id}/status`, data),
};

// ─── Chat ─────────────────────────────────────────────────────
export const chatAPI = {
  send: (data: any) => api.post('/chat', data),
  getMyLogs: () => api.get('/chat/logs/my'),
  getAllLogs: (params?: any) => api.get('/chat/logs', { params }),
};

// ─── Admin ────────────────────────────────────────────────────
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getUsers: (params?: any) => api.get('/admin/users', { params }),
  toggleUser: (id: string) => api.put(`/admin/users/${id}/toggle`),
  changeRole: (id: string, role: string) => api.put(`/admin/users/${id}/role`, { role }),
};

export default api;
