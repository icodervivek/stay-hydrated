import { apiClient } from "./client";

export type RecentLog = {
  id: string;
  amountMl: number;
  createdAt: string;
};

export type DashboardData = {
  name: string;
  todayTotalML: number;
  goalMl: number;
  completionPercentage: number;
  currentStreak: number;
  longestStreak: number;
  recentLogs: RecentLog[];
};

export async function getDashboard(): Promise<DashboardData> {
  const { data } = await apiClient.get("/dashboard");
  return data;
}
