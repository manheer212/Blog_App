import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

const authHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const authService = {
  login: (data) => axios.post(`${API_BASE_URL}/login`, data).then((res) => res.data),
  register: (data) => axios.post(`${API_BASE_URL}/register`, data).then((res) => res.data),
  logout: () => axios.post(`${API_BASE_URL}/logout`, {}, { headers: authHeaders() }).then((res) => res.data),
};
