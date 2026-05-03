import { apiClient } from "./client";

export type LogEntry = {
  id: string;
  amountMl: number;
  imageUrl: string | null;
  aiLabel: string | null;
  loggedAt: string;
};

export type DayStats = {
  date: string;
  totalIntakeMl: number;
  goalMl: number;
  completionPercentage: number;
};

export type TodayStats = {
  date: string;
  totalIntakeMl: number;
  goalMl: number;
  completionPercentage: number;
  logs: LogEntry[];
};

export type WeeklyStats = DayStats[];

export async function getTodayStats(): Promise<TodayStats> {
  const { data } = await apiClient.get("/stats/today");
  return data;
}

export async function getWeeklyStats(): Promise<WeeklyStats> {
  const { data } = await apiClient.get("/stats/weekly");
  return data.days ?? [];
}
