import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(async (config) => {
    const token = await import('./storage').then(m => m.TokenStorage.getAccessToken());
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
