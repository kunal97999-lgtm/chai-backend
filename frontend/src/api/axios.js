import axios from "axios";



const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1",
  withCredentials: true,
});

// Intercept 401s to attempt refresh token auto-renewal for logged-in sessions
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/users/login") &&
      !originalRequest.url?.includes("/users/refresh-token") &&
      !originalRequest.url?.includes("/users/current-user")
    ) {
      originalRequest._retry = true;
      try {
        await api.post("/users/refresh-token");
        return api(originalRequest);
      } catch {
        // Refresh token failed or expired
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
