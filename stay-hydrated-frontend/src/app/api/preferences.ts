import { apiClient } from "./client";

export type Preferences = {
  notificationsEnabled: boolean;
  reminderIntervalMinutes: number;
  startHour: number;
  endHour: number;
};

export async function getPreferences(): Promise<Preferences> {
  const { data } = await apiClient.get("/preferences");
  return data;
}

export async function savePreferences(prefs: Preferences): Promise<Preferences> {
  const { data } = await apiClient.post("/preferences", prefs);
  return data;
}
