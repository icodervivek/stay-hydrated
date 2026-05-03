import { apiClient } from "./client";
import * as SecureStore from "expo-secure-store";

export async function login(email: string, password: string) {
    const { data } = await apiClient.post("/auth/login", { email, password });
    await SecureStore.setItemAsync("accessToken", data.accessToken);
    await SecureStore.setItemAsync("refreshToken", data.refreshToken);
    return data.user;
}

export async function register(name: string, email: string, password: string) {
    const { data } = await apiClient.post("/auth/register", {
        name,
        email,
        password,
    });
    await SecureStore.setItemAsync("accessToken", data.accessToken);
    await SecureStore.setItemAsync("refreshToken", data.refreshToken);
    return data.user;
}

export async function logout() {
    const refreshToken = await SecureStore.getItemAsync("refreshToken");
    await apiClient.post("/auth/logout", { refreshToken }).catch(() => {});
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("refreshToken");
}