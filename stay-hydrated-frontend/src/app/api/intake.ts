import { apiClient } from "./client";

export type IntakeResponse = {
  logId: string;
  amountMl: number;
  imageUrl: string | null;
  aiLabel: string | null;
  loggedAt: string;
  todayTotalMl: number;
  goalMl: number;
  completionPercentage: number;
};

export type IntakeHistoryEntry = {
  id: string;
  amountMl: number;
  imageUrl: string | null;
  aiLabel: string | null;
  loggedAt: string;
};

export type HistoryPage = {
  content: IntakeHistoryEntry[];
  totalPages: number;
  totalElements: number;
  number: number;
  last: boolean;
};

export async function logIntake(
  amountMl: number,
  imageUrl?: string | null,
  aiLabel?: string | null
): Promise<IntakeResponse> {
  const { data } = await apiClient.post("/intake", {
    amountMl,
    ...(imageUrl ? { imageUrl } : {}),
    ...(aiLabel ? { aiLabel } : {}),
  });
  return data;
}

export async function getHistory(page = 0, size = 20): Promise<HistoryPage> {
  const { data } = await apiClient.get("/intake/history", {
    params: { page, size },
  });
  return data;
}
