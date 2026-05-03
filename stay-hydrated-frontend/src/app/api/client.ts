import axios from "axios";
import * as SecureStore from "expo-secure-store";

export const BASE_URL = "http://10.151.255.32:8080/api";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach access token to every request

apiClient.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// On 401/403, try refreshing the token
// (Spring Security 6 returns 403 by default for unauthenticated requests)

apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;
    if ((status === 401 || status === 403) && !original._retry) {
      original._retry = true;
      try {
        const refreshToken = await SecureStore.getItemAsync("refreshToken");
        const { data } = await axios.post(
          `${BASE_URL}/auth/refresh`,
          { refreshToken },
          { timeout: 5000 }
        );
        await SecureStore.setItemAsync("accessToken", data.accessToken);
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return apiClient(original);
      } catch {
        try {
          await SecureStore.deleteItemAsync("accessToken");
          await SecureStore.deleteItemAsync("refreshToken");
        } catch {}
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  },
);
