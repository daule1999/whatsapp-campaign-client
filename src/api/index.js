import axios from 'axios';
import config from '../config';

const api = axios.create({
    baseURL: config.apiUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor - handle token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                try {
                    const { data } = await axios.post(`${config.apiUrl}/auth/refresh`, { refreshToken });

                    localStorage.setItem('accessToken', data.data.accessToken);
                    localStorage.setItem('refreshToken', data.data.refreshToken);

                    originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
                    return api(originalRequest);
                } catch (refreshError) {
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    window.location.href = '/login';
                }
            } else {
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

// Auth API
export const authApi = {
    login: (email, password) => api.post('/auth/login', { email, password }),
    register: (data) => api.post('/auth/register', data),
    getMe: () => api.get('/auth/me'),
    logout: () => api.post('/auth/logout'),
};

// Templates API
export const templatesApi = {
    getAll: (params) => api.get('/templates', { params }),
    getById: (id) => api.get(`/templates/${id}`),
    create: (data) => api.post('/templates', data),
    update: (id, data) => api.put(`/templates/${id}`, data),
    delete: (id) => api.delete(`/templates/${id}`),
};

// Contacts API (Legacy - use personsApi instead)
export const contactsApi = {
    getAll: (params) => api.get('/contacts', { params }),
    getById: (id) => api.get(`/contacts/${id}`),
    create: (data) => api.post('/contacts', data),
    update: (id, data) => api.put(`/contacts/${id}`, data),
    delete: (id) => api.delete(`/contacts/${id}`),
    bulkDelete: (ids) => api.post('/contacts/bulk-delete', { ids }),
    importCsv: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return api.post('/contacts/import', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
    importApi: (data) => api.post('/contacts/import-api', data),
};

// Persons API (New)
export const personsApi = {
    getAll: (params) => api.get('/persons', { params }),
    getById: (id) => api.get(`/persons/${id}`),
    create: (data) => api.post('/persons', data),
    update: (id, data) => api.put(`/persons/${id}`, data),
    delete: (id) => api.delete(`/persons/${id}`),
    bulkDelete: (ids) => api.post('/persons/bulk-delete', { ids }),
    addTags: (id, tags) => api.post(`/persons/${id}/tags`, { tags }),
    importCsv: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return api.post('/persons/import', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
};

// Campaigns API
export const campaignsApi = {
    getAll: (params) => api.get('/campaigns', { params }),
    getById: (id) => api.get(`/campaigns/${id}`),
    create: (data) => api.post('/campaigns', data),
    update: (id, data) => api.put(`/campaigns/${id}`, data),
    delete: (id) => api.delete(`/campaigns/${id}`),
    addContacts: (id, contactIds) => api.post(`/campaigns/${id}/contacts`, { contact_ids: contactIds }),
    removeContacts: (id, contactIds) => api.delete(`/campaigns/${id}/contacts`, { data: { contact_ids: contactIds } }),
    send: (id) => api.post(`/campaigns/${id}/send`),
};

// Audit API
export const auditApi = {
    getAll: (params) => api.get('/audit', { params }),
};

// Admin API
export const adminApi = {
    getUsers: () => api.get('/admin/users'),
    activateUser: (id) => api.post(`/admin/users/${id}/activate`),
    deactivateUser: (id) => api.post(`/admin/users/${id}/deactivate`),
    updateUserRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),
    generateApiKey: (id) => api.post(`/admin/users/${id}/api-key`),
    deleteUser: (id) => api.delete(`/admin/users/${id}`),
};

// Dashboard API
export const dashboardApi = {
    getStats: () => api.get('/dashboard'),
    getHealth: () => api.get('/health'),
};

export default api;

