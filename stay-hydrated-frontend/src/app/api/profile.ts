import { apiClient } from "./client";

export type ProfileData = {
  name: string;
  email: string;
  lifetimeTotalMl: number;
  currentStreak: number;
  longestStreak: number;
  dailyGoalMl: number;
};

export type UpdateProfileRequest = {
  name: string;
  currentPassword?: string;
  newPassword?: string;
};

export async function getProfile(): Promise<ProfileData> {
  const { data } = await apiClient.get("/profile");
  return data;
}

export async function updateProfile(req: UpdateProfileRequest): Promise<ProfileData> {
  const { data } = await apiClient.put("/profile", req);
  return data;
}

export async function setGoal(dailyGoalMl: number): Promise<void> {
  await apiClient.post("/goals", { dailyGoalMl });
}
