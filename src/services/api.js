import axios from 'axios';

const API_BASE_URL = 'https://warunggenz.my.id/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


const PUBLIC_ROUTES = [
  '/login',
  '/register',
  '/payment/create',      
  '/payment/notification' 
];

api.interceptors.request.use((config) => {
  const isPublic = PUBLIC_ROUTES.some(route => 
    config.url.startsWith(route)
  );

  if (!isPublic) {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

// Handle error 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      
      const isPublic = PUBLIC_ROUTES.some(route => 
        error.config?.url?.includes(route)
      );
      
      if (!isPublic) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
export { API_BASE_URL };