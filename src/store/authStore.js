import { create } from 'zustand';
import { authApi } from '../api';

const useAuthStore = create((set, get) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true,

    // Initialize auth state from localStorage
    init: async () => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            try {
                const { data } = await authApi.getMe();
                set({ user: data.data, isAuthenticated: true, isLoading: false });
            } catch (error) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                set({ user: null, isAuthenticated: false, isLoading: false });
            }
        } else {
            set({ isLoading: false });
        }
    },

    // Login
    login: async (email, password) => {
        const { data } = await authApi.login(email, password);
        localStorage.setItem('accessToken', data.data.accessToken);
        localStorage.setItem('refreshToken', data.data.refreshToken);
        set({ user: data.data.user, isAuthenticated: true });
        return data;
    },

    // Register
    register: async (userData) => {
        const { data } = await authApi.register(userData);
        localStorage.setItem('accessToken', data.data.accessToken);
        localStorage.setItem('refreshToken', data.data.refreshToken);
        set({ user: data.data.user, isAuthenticated: true });
        return data;
    },

    // Logout
    logout: async () => {
        try {
            await authApi.logout();
        } catch (error) {
            // Ignore errors
        }
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        set({ user: null, isAuthenticated: false });
    },
}));

export default useAuthStore;
