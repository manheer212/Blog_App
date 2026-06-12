import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
const API_URL = `${API_BASE_URL}/posts`;

const authHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const postService = {
    getAll: () => axios.get(API_URL, { headers: authHeaders() }).then(res => res.data),
    get: (id) => axios.get(`${API_URL}/${id}`, { headers: authHeaders() }).then(res => res.data),
    create: (data) => axios.post(API_URL, data, { headers: authHeaders() }).then(res => res.data),
    update: (id, data) => axios.put(`${API_URL}/${id}`, data, { headers: authHeaders() }).then(res => res.data),
    delete: (id) => axios.delete(`${API_URL}/${id}`, { headers: authHeaders() }).then(res => res.data),
    deleteAll: () => axios.delete(`${API_URL}/all`, { headers: authHeaders() }).then(res => res.data),
};
