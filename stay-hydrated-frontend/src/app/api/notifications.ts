import Constants from "expo-constants";
import { Platform } from "react-native";

const CHANNEL_ID = "hydration";

const MESSAGES = [
  { title: "Stay Hydrated!", body: "Time for a water break. Your body will thank you." },
  { title: "Drink Up!", body: "Keep your streak going — grab a glass of water." },
  { title: "Hydration Check", body: "A little water goes a long way. Sip up!" },
  { title: "Water Break", body: "You're doing great! Don't forget to hydrate." },
];

// expo-notifications push infra was removed from Expo Go in SDK 53+.
export function notificationsAvailable(): boolean {
  return Constants.executionEnvironment !== "storeClient";
}

function getNotifications() {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return require("expo-notifications") as typeof import("expo-notifications");
}

function getTimeSlots(startHour: number, endHour: number, intervalMinutes: number) {
  const slots: { hour: number; minute: number }[] = [];
  const startMins = startHour * 60;
  const endMins = endHour * 60;
  for (let m = startMins; m <= endMins; m += intervalMinutes) {
    slots.push({ hour: Math.floor(m / 60), minute: m % 60 });
  }
  return slots;
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!notificationsAvailable()) return false;
  try {
    const Notifications = getNotifications();
    const { status: existing } = await Notifications.getPermissionsAsync();
    if (existing === "granted") return true;
    const { status } = await Notifications.requestPermissionsAsync();
    return status === "granted";
  } catch {
    return false;
  }
}

export async function scheduleHydrationReminders(
  intervalMinutes: number,
  startHour: number,
  endHour: number
): Promise<void> {
  if (!notificationsAvailable()) return;
  try {
    const Notifications = getNotifications();
    await Notifications.cancelAllScheduledNotificationsAsync();

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
        name: "Hydration Reminders",
        importance: Notifications.AndroidImportance.DEFAULT,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#006385",
      });
    }

    const slots = getTimeSlots(startHour, endHour, intervalMinutes);
    let msgIndex = 0;

    for (const { hour, minute } of slots) {
      const { title, body } = MESSAGES[msgIndex % MESSAGES.length];
      msgIndex++;
      await Notifications.scheduleNotificationAsync({
        content: { title, body, sound: true },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour,
          minute,
          channelId: CHANNEL_ID,
        } as import("expo-notifications").DailyTriggerInput,
      });
    }
  } catch {
    // silently skip — notifications not available in this environment
  }
}

export async function cancelAllHydrationReminders(): Promise<void> {
  if (!notificationsAvailable()) return;
  try {
    const Notifications = getNotifications();
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch {
    // silently skip
  }
}
