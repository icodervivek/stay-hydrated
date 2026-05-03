import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Colors } from "./constants/colors";
import {
  getPreferences,
  savePreferences,
  type Preferences,
} from "./api/preferences";
import {
  notificationsAvailable,
  requestNotificationPermission,
  scheduleHydrationReminders,
  cancelAllHydrationReminders,
} from "./api/notifications";

const INTERVAL_OPTIONS = [
  { label: "15 min", value: 15 },
  { label: "30 min", value: 30 },
  { label: "1 hr", value: 60 },
  { label: "2 hr", value: 120 },
  { label: "4 hr", value: 240 },
];

function formatHour(h: number): string {
  if (h === 0) return "12 AM";
  if (h === 12) return "12 PM";
  return h < 12 ? `${h} AM` : `${h - 12} PM`;
}

function HourPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <View style={pickerStyles.wrap}>
      <Text style={pickerStyles.label}>{label}</Text>
      <View style={pickerStyles.row}>
        <TouchableOpacity
          style={pickerStyles.btn}
          onPress={() => onChange(Math.max(0, value - 1))}
        >
          <Ionicons name="remove" size={18} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={pickerStyles.value}>{formatHour(value)}</Text>
        <TouchableOpacity
          style={pickerStyles.btn}
          onPress={() => onChange(Math.min(23, value + 1))}
        >
          <Ionicons name="add" size={18} color={Colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const pickerStyles = StyleSheet.create({
  wrap: { flex: 1, alignItems: "center", gap: 8 },
  label: {
    fontSize: 11,
    fontWeight: "600",
    color: Colors.lightTextMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  btn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(0,99,133,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  value: { fontSize: 15, fontWeight: "700", color: Colors.lightText, minWidth: 52, textAlign: "center" },
});

export default function PreferencesScreen() {
  const insets = useSafeAreaInsets();

  const [prefs, setPrefs] = useState<Preferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [dirty, setDirty] = useState(false);

  // Local editable state
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [interval, setIntervalVal] = useState(60);
  const [startHour, setStartHour] = useState(7);
  const [endHour, setEndHour] = useState(22);

  const load = useCallback(async (showRefresh = false) => {
    try {
      const data = await getPreferences();
      setPrefs(data);
      setNotificationsEnabled(data.notificationsEnabled);
      setIntervalVal(data.reminderIntervalMinutes);
      setStartHour(data.startHour);
      setEndHour(data.endHour);
      setDirty(false);
    } catch {
      // keep defaults
    } finally {
      setLoading(false);
      if (showRefresh) setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    load(true);
  }, [load]);

  const markDirty = <T,>(setter: React.Dispatch<React.SetStateAction<T>>) =>
    (v: T) => { setter(v); setDirty(true); };

  const handleSave = async () => {
    if (!dirty || saving) return;
    if (startHour >= endHour) {
      Alert.alert("Invalid hours", "Start time must be before end time.");
      return;
    }
    setSaving(true);
    try {
      await savePreferences({
        notificationsEnabled,
        reminderIntervalMinutes: interval,
        startHour,
        endHour,
      });

      if (notificationsEnabled) {
        if (!notificationsAvailable()) {
          setDirty(false);
          Alert.alert(
            "Saved (Expo Go Limitation)",
            "Preferences saved to the server, but scheduled notifications require a development build — they don't run inside Expo Go."
          );
          setSaving(false);
          return;
        }
        const granted = await requestNotificationPermission();
        if (!granted) {
          Alert.alert(
            "Permission Required",
            "Please enable notifications for this app in your device settings to receive reminders."
          );
          setSaving(false);
          return;
        }
        await scheduleHydrationReminders(interval, startHour, endHour);
      } else {
        await cancelAllHydrationReminders();
      }

      setDirty(false);
      Alert.alert("Saved", "Notification preferences updated.");
    } catch {
      Alert.alert("Error", "Failed to save preferences.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Preferences</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
          />
        }
      >
        {loading ? (
          <Text style={styles.muted}>Loading preferences...</Text>
        ) : (
          <>
            {/* Notifications toggle */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons name="notifications-outline" size={18} color={Colors.primary} />
                <Text style={styles.cardTitle}>Reminders</Text>
              </View>

              <View style={styles.toggleRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.toggleLabel}>Enable notifications</Text>
                  <Text style={styles.toggleSub}>Get reminders to drink water</Text>
                </View>
                <Switch
                  value={notificationsEnabled}
                  onValueChange={markDirty(setNotificationsEnabled)}
                  trackColor={{ false: "rgba(0,0,0,0.1)", true: Colors.primary }}
                  thumbColor={Colors.white}
                />
              </View>
            </View>

            {/* Reminder interval */}
            {notificationsEnabled && (
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Ionicons name="timer-outline" size={18} color={Colors.primary} />
                  <Text style={styles.cardTitle}>Reminder Interval</Text>
                </View>

                <View style={styles.intervals}>
                  {INTERVAL_OPTIONS.map((opt) => (
                    <TouchableOpacity
                      key={opt.value}
                      style={[
                        styles.intervalChip,
                        interval === opt.value && styles.intervalChipActive,
                      ]}
                      onPress={() => { markDirty(setIntervalVal)(opt.value); }}
                    >
                      <Text
                        style={[
                          styles.intervalText,
                          interval === opt.value && styles.intervalTextActive,
                        ]}
                      >
                        {opt.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Active hours */}
            {notificationsEnabled && (
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Ionicons name="time-outline" size={18} color={Colors.primary} />
                  <Text style={styles.cardTitle}>Active Hours</Text>
                </View>
                <Text style={styles.hoursHint}>Reminders will only be sent during this window</Text>

                <View style={styles.hoursRow}>
                  <HourPicker
                    label="Start"
                    value={startHour}
                    onChange={markDirty(setStartHour)}
                  />
                  <View style={styles.hoursSep}>
                    <Text style={styles.hoursSepText}>to</Text>
                  </View>
                  <HourPicker
                    label="End"
                    value={endHour}
                    onChange={markDirty(setEndHour)}
                  />
                </View>
              </View>
            )}

            {/* Save button */}
            <TouchableOpacity
              style={[styles.saveBtn, (!dirty || saving) && styles.saveBtnDisabled]}
              onPress={handleSave}
              disabled={!dirty || saving}
            >
              <Ionicons name="checkmark-circle-outline" size={20} color={Colors.white} />
              <Text style={styles.saveBtnText}>
                {saving ? "Saving..." : "Save Preferences"}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.lightBackground },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: "rgba(255,255,255,0.6)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.3)",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "rgba(0,99,133,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: Colors.primary,
    letterSpacing: -0.5,
    flex: 1,
  },
  scroll: { flex: 1 },
  content: { padding: 16, gap: 16 },
  muted: {
    fontSize: 13,
    color: Colors.lightTextMuted,
    textAlign: "center",
    paddingVertical: 40,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.85)",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.5)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    gap: 14,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  cardTitle: { fontSize: 15, fontWeight: "700", color: Colors.lightText },

  toggleRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  toggleLabel: { fontSize: 14, fontWeight: "600", color: Colors.lightText },
  toggleSub: { fontSize: 12, color: Colors.lightTextMuted, marginTop: 2 },

  intervals: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  intervalChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(0,99,133,0.06)",
    borderWidth: 1,
    borderColor: "rgba(0,99,133,0.1)",
  },
  intervalChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  intervalText: { fontSize: 13, fontWeight: "600", color: Colors.lightTextSub },
  intervalTextActive: { color: Colors.white },

  hoursHint: { fontSize: 12, color: Colors.lightTextMuted, marginTop: -6 },
  hoursRow: { flexDirection: "row", alignItems: "center" },
  hoursSep: { paddingHorizontal: 8 },
  hoursSepText: { fontSize: 13, color: Colors.lightTextMuted, fontWeight: "600" },

  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 15,
  },
  saveBtnDisabled: { opacity: 0.45 },
  saveBtnText: { fontSize: 16, fontWeight: "700", color: Colors.white },
});
