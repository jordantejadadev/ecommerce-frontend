import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// --- NUEVO: interceptor de respuesta ---
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const isAuthError =
      error.response?.status === 401 || error.response?.status === 403;

    // Evita loop infinito: solo reintenta UNA vez, y nunca en /auth/refresh o /auth/login
    if (
      isAuthError &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh") &&
      !originalRequest.url.includes("/auth/login")
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const { data } = await axios.post(
          "http://localhost:8080/api/auth/refresh",
          { refreshToken },
        );

        localStorage.setItem("token", data.token);

        originalRequest.headers.Authorization = `Bearer ${data.token}`;

        return api(originalRequest); // reintenta la petición original
      } catch (refreshError) {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
