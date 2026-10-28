import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  console.warn('Diqqat: VITE_API_BASE_URL muhit o\'zgaruvchisi topilmadi. .env faylini tekshiring.');
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor to attach JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('med_admin_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for unified error formatting and 401 handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Optional auto-logout on unauthorized
      const currentPath = window.location.pathname;
      if (currentPath !== '/login') {
        localStorage.removeItem('med_admin_token');
        localStorage.removeItem('med_admin_user');
      }
    }
    const message =
      error.response?.data?.message ||
      error.response?.data?.error?.message ||
      error.message ||
      'Serverda noma\'lum xatolik yuz berdi';
    return Promise.reject(new Error(message));
  }
);

