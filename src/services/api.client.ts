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

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            // Avoid infinite loop if the refresh endpoint itself fails
            if (originalRequest.url?.includes('/auth/refresh')) {
                return Promise.reject(error);
            }

            originalRequest._retry = true;

            try {
                // Dynamically import storage to ensure no circular deps or early execution issues
                const { TokenStorage } = await import('./storage');
                const refreshToken = await TokenStorage.getRefreshToken();

                if (!refreshToken) {
                    // No refresh token means we are fully logged out.
                    // Clear storage just in case and reject.
                    await TokenStorage.clearTokens();
                    return Promise.reject(error);
                }

                // Perform refresh using a clean axios call to avoid interceptors
                const response = await axios.post(`${API_URL}/auth/refresh`, {
                    refreshToken,
                });

                const { accessToken, refreshToken: newRefreshToken } = response.data;

                // Update storage
                await TokenStorage.setTokens(accessToken, newRefreshToken);

                // Update defaults and original request
                apiClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
                originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

                return apiClient(originalRequest);
            } catch (refreshError) {
                // Refresh failed - clear tokens so app can logout cleanly
                const { TokenStorage } = await import('./storage');
                const { authEvents } = await import('./auth.events');

                await TokenStorage.clearTokens();
                authEvents.triggerLogout();

                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);
