import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/posts';

export const postService = {
    getAll: () => axios.get(API_URL).then(res => res.data),
    get: (id) => axios.get(`${API_URL}/${id}`).then(res => res.data),
    create: (data) => axios.post(API_URL, data).then(res => res.data),
    update: (id, data) => axios.put(`${API_URL}/${id}`, data).then(res => res.data),
    delete: (id) => axios.delete(`${API_URL}/${id}`).then(res => res.data),
};
