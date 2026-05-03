import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import Constants from "expo-constants";
import { useAuthStore } from "./store/auth-store";

// expo-notifications push infra was removed from Expo Go in SDK 53.
// Guard every call so the app doesn't crash when running in Expo Go.
if (Constants.executionEnvironment !== "storeClient") {
  try {
    // Imported lazily so the module doesn't load at all in Expo Go
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Notifications = require("expo-notifications");
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowAlert: true,
      }),
    });
  } catch {
    // silently skip — notifications not available in this environment
  }
}

export default function RootLayout() {
  const { isAuthenticated, isLoading, initialize } = useAuthStore();
  const router = useRouter();
  const segments = useSegments();
  // Use the first segment string (primitive) so the effect only fires when
  // the actual group changes, not on every render (useSegments returns a new
  // array reference each time, which would fire the effect on every render).
  const firstSegment = segments[0] as string | undefined;

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    if (isLoading) return;
    if (firstSegment === undefined) return; // index.tsx handles routing after splash
    const inAuth = firstSegment === "(auth)";
    if (!isAuthenticated && !inAuth) router.replace("/(auth)/login");
    if (isAuthenticated && inAuth) router.replace("/(tabs)");
  }, [isAuthenticated, isLoading, firstSegment]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="achievements" />
      <Stack.Screen name="preferences" />
    </Stack>
  );
}
