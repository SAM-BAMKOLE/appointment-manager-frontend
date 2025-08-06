import axios from "axios";
import { useAuthStore } from "~/store/auth";
import Cookies from "js-cookie";

// Axios instance with interceptors
const axiosInstance = axios.create({
    baseURL: import.meta.env.API_URL,
    headers: { "Content-Type": "application/json" },
    withCredentials: true, // Required for HTTP-only cookies
});

axiosInstance.interceptors.request.use(
    (config) => {
        // const accessToken = useAuthStore.getState().accessToken;
        const accessToken = Cookies.get("accessToken");

        if (accessToken) {
            config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        console.log(error);
        Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const { data } = await axiosInstance.post("/auth/refresh");
                useAuthStore.getState().setAccessToken(data.data.accessToken);
                originalRequest.headers["Authorization"] = `Bearer ${data.data.accessToken}`;
                originalRequest._retry = false;
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                useAuthStore.getState().logout();
                return Promise.reject(refreshError);
            }
        }
        console.log(originalRequest);
        console.log(error);
        return Promise.reject(error);
    }
);

// export const register = (userData: any) => axiosInstance.post("/auth/register", userData);
// export const login = (credentials: any) => axiosInstance.post("/auth/login", credentials);
// export const logout = () => axiosInstance.post("/auth/logout");
// export const getProtectedData = () => axiosInstance.get("/protected"); // Example protected endpoint

export default axiosInstance;
