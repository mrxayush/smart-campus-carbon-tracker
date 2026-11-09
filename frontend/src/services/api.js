import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Bearer token to all outgoing requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Catch 401/403 and handle token expiry gracefully
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // If unauthorized, clean up expired state if on a protected route
      if (!window.location.pathname.includes('/login') && error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
      }
    }
    return Promise.reject(error);
  }
);

// Auth Service Endpoints
export const authService = {
  login: async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', response.data.username);
      localStorage.setItem('role', response.data.role);
    }
    return response.data;
  },

  register: async (username, password, role) => {
    const response = await api.post('/auth/register', { username, password, role });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', response.data.username);
      localStorage.setItem('role', response.data.role);
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
  },

  getCurrentUser: () => localStorage.getItem('user'),
  getRole: () => localStorage.getItem('role'),
  isAdmin: () => localStorage.getItem('role') === 'ROLE_ADMIN',
  isAuthenticated: () => !!localStorage.getItem('token'),
};

// Energy Records Service Endpoints
export const recordService = {
  getAllRecords: async (department = '') => {
    const url = department ? `/records?department=${encodeURIComponent(department)}` : '/records';
    const response = await api.get(url);
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/records/stats');
    return response.data;
  },

  createRecord: async (recordData) => {
    const response = await api.post('/records', recordData);
    return response.data;
  },

  updateRecord: async (id, recordData) => {
    const response = await api.put(`/records/${id}`, recordData);
    return response.data;
  },

  deleteRecord: async (id) => {
    const response = await api.delete(`/records/${id}`);
    return response.data;
  },
};

export default api;
