import { apiClient } from "./client";

export type Achievement = {
  id: string;
  title: string;
  description: string;
  conditionType: string;
  conditionValue: number;
  unlocked: boolean;
  unlockedAt: string | null;
};

export async function getAchievements(): Promise<Achievement[]> {
  const { data } = await apiClient.get("/achievements");
  return data;
}
