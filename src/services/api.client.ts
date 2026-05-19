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

// Refresh state
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            // Avoid infinite loop if the refresh endpoint itself fails
            if (originalRequest.url?.includes('/auth/refresh')) {
                return Promise.reject(error);
            }

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers['Authorization'] = `Bearer ${token}`;
                    return apiClient(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Dynamically import storage to ensure no circular deps or early execution issues
                const { TokenStorage } = await import('./storage');
                const refreshToken = await TokenStorage.getRefreshToken();

                if (!refreshToken) {
                    // No refresh token means we are fully logged out.
                    const { authEvents } = await import('./auth.events');
                    await TokenStorage.clearTokens();
                    authEvents.triggerLogout();
                    return Promise.reject(error);
                }

                // Perform refresh using a clean axios call to avoid interceptors
                const response = await axios.post(`${API_URL}/auth/refresh`, {
                    refreshToken,
                });

                const { accessToken, refreshToken: newRefreshToken } = response.data;

                // Update storage - if backend doesn't return a new refresh token, keep the old one
                // Note: With rotation, backend SHOULD return a new one.
                await TokenStorage.setTokens(accessToken, newRefreshToken || refreshToken);

                // Update defaults
                apiClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

                // Process queue
                processQueue(null, accessToken);

                // Retry original request
                originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
                return apiClient(originalRequest);
            } catch (refreshError) {
                // Refresh failed
                processQueue(refreshError, null);

                const { TokenStorage } = await import('./storage');
                const { authEvents } = await import('./auth.events');

                await TokenStorage.clearTokens();
                authEvents.triggerLogout();

                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }
        return Promise.reject(error);
    }
);
