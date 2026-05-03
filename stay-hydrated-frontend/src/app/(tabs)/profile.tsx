import { useCallback, useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Colors } from "../constants/colors";
import { useAuthStore } from "../store/auth-store";
import {
  getProfile,
  updateProfile,
  setGoal,
  type ProfileData,
} from "../api/profile";
import { useToast } from "../components/toast";
import { ConfirmModal } from "../components/confirm-modal";

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
  return (
    <View style={avatarStyles.circle}>
      <Text style={avatarStyles.text}>{initials || "?"}</Text>
    </View>
  );
}

const avatarStyles = StyleSheet.create({
  circle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  text: { fontSize: 30, fontWeight: "800", color: Colors.white },
});

function StatPill({
  label,
  value,
  unit,
}: {
  label: string;
  value: string | number;
  unit?: string;
}) {
  return (
    <View style={statStyles.pill}>
      <Text style={statStyles.value}>
        {value}
        {unit ? <Text style={statStyles.unit}> {unit}</Text> : null}
      </Text>
      <Text style={statStyles.label}>{label}</Text>
    </View>
  );
}

const statStyles = StyleSheet.create({
  pill: { flex: 1, alignItems: "center", gap: 2 },
  value: { fontSize: 20, fontWeight: "800", color: Colors.lightText },
  unit: { fontSize: 12, fontWeight: "600", color: Colors.lightTextSub },
  label: {
    fontSize: 10,
    fontWeight: "600",
    color: Colors.lightTextMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const logout = useAuthStore((s) => s.logout);
  const { toast, ToastOverlay } = useToast();
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [editingName, setEditingName] = useState(false);
  const [nameText, setNameText] = useState("");
  const [savingName, setSavingName] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [savingPw, setSavingPw] = useState(false);

  const [goal, setGoalLocal] = useState(2500);
  const [originalGoal, setOriginalGoal] = useState(2500);
  const [savingGoal, setSavingGoal] = useState(false);

  const load = useCallback(async (showRefresh = false) => {
    try {
      const data = await getProfile();
      setProfile(data);
      setNameText(data.name);
      setGoalLocal(data.dailyGoalMl);
      setOriginalGoal(data.dailyGoalMl);
    } catch {
      // keep previous state on error
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

  const saveName = async () => {
    if (!nameText.trim() || savingName) return;
    setSavingName(true);
    try {
      const updated = await updateProfile({ name: nameText.trim() });
      setProfile(updated);
      setNameText(updated.name);
      setEditingName(false);
      toast.success("Name updated");
    } catch {
      toast.error("Failed to update name");
    } finally {
      setSavingName(false);
    }
  };

  const savePassword = async () => {
    if (!currentPw || !newPw || savingPw) return;
    if (newPw.length < 6) {
      toast.error("Password too short", "Must be at least 6 characters.");
      return;
    }
    setSavingPw(true);
    try {
      await updateProfile({
        name: profile?.name ?? nameText,
        currentPassword: currentPw,
        newPassword: newPw,
      });
      setCurrentPw("");
      setNewPw("");
      setShowPassword(false);
      toast.success("Password updated");
    } catch (e: any) {
      toast.error("Update failed", e.response?.data?.message ?? "Failed to update password.");
    } finally {
      setSavingPw(false);
    }
  };

  const saveGoal = async () => {
    if (savingGoal) return;
    setSavingGoal(true);
    try {
      await setGoal(goal);
      setOriginalGoal(goal);
      setProfile((prev) => (prev ? { ...prev, dailyGoalMl: goal } : prev));
      toast.success("Goal saved", `Daily target set to ${(goal / 1000).toFixed(2)} L`);
    } catch {
      toast.error("Failed to update goal");
    } finally {
      setSavingGoal(false);
    }
  };

  const handleLogout = () => setLogoutModalVisible(true);

  const lifetimeL = profile ? (profile.lifetimeTotalMl / 1000).toFixed(1) : "—";

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.screen}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 90 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Colors.primary}
            />
          }
        >
          {loading ? (
            <Text style={styles.muted}>Loading profile...</Text>
          ) : (
            <>
              {/* Identity card */}
              <View style={styles.card}>
                <View style={styles.identityRow}>
                  <Avatar name={profile?.name ?? ""} />
                  <View style={{ flex: 1, gap: 4 }}>
                    {editingName ? (
                      <View style={styles.nameEditRow}>
                        <TextInput
                          style={styles.nameInput}
                          value={nameText}
                          onChangeText={setNameText}
                          autoFocus
                          returnKeyType="done"
                          onSubmitEditing={saveName}
                        />
                        <TouchableOpacity
                          onPress={saveName}
                          disabled={savingName}
                          style={styles.iconBtn}
                        >
                          <Ionicons
                            name={savingName ? "hourglass-outline" : "checkmark"}
                            size={20}
                            color={Colors.primary}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => {
                            setEditingName(false);
                            setNameText(profile?.name ?? "");
                          }}
                          style={styles.iconBtn}
                        >
                          <Ionicons name="close" size={20} color={Colors.lightTextMuted} />
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <TouchableOpacity
                        style={styles.nameRow}
                        onPress={() => setEditingName(true)}
                      >
                        <Text style={styles.profileName}>{profile?.name}</Text>
                        <Ionicons name="pencil-outline" size={14} color={Colors.lightTextMuted} />
                      </TouchableOpacity>
                    )}
                    <Text style={styles.profileEmail}>{profile?.email}</Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.statsRow}>
                  <StatPill label="Lifetime" value={lifetimeL} unit="L" />
                  <View style={styles.statDivider} />
                  <StatPill label="Streak" value={profile?.currentStreak ?? 0} unit="days" />
                  <View style={styles.statDivider} />
                  <StatPill label="Best" value={profile?.longestStreak ?? 0} unit="days" />
                </View>
              </View>

              {/* Daily goal */}
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Ionicons name="flag-outline" size={18} color={Colors.primary} />
                  <Text style={styles.cardTitle}>Daily Goal</Text>
                </View>

                <View style={styles.goalRow}>
                  <TouchableOpacity
                    style={styles.adjustBtn}
                    onPress={() => setGoalLocal((g) => Math.max(500, g - 50))}
                  >
                    <Ionicons name="remove" size={22} color={Colors.primary} />
                  </TouchableOpacity>
                  <View style={styles.goalCenter}>
                    <Text style={styles.goalValue}>{(goal / 1000).toFixed(2)}</Text>
                    <Text style={styles.goalUnit}>L / day</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.adjustBtn}
                    onPress={() => setGoalLocal((g) => Math.min(10000, g + 50))}
                  >
                    <Ionicons name="add" size={22} color={Colors.primary} />
                  </TouchableOpacity>
                </View>

                {goal !== originalGoal && (
                  <TouchableOpacity
                    style={[styles.saveBtn, savingGoal && { opacity: 0.6 }]}
                    onPress={saveGoal}
                    disabled={savingGoal}
                  >
                    <Text style={styles.saveBtnText}>
                      {savingGoal ? "Saving..." : "Save Goal"}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Security */}
              <View style={styles.card}>
                <TouchableOpacity
                  style={styles.cardHeader}
                  onPress={() => setShowPassword((s) => !s)}
                >
                  <Ionicons name="lock-closed-outline" size={18} color={Colors.primary} />
                  <Text style={[styles.cardTitle, { flex: 1 }]}>Change Password</Text>
                  <Ionicons
                    name={showPassword ? "chevron-up" : "chevron-down"}
                    size={18}
                    color={Colors.lightTextMuted}
                  />
                </TouchableOpacity>

                {showPassword && (
                  <View style={styles.passwordSection}>
                    <TextInput
                      style={styles.textField}
                      placeholder="Current password"
                      placeholderTextColor={Colors.lightTextMuted}
                      secureTextEntry
                      value={currentPw}
                      onChangeText={setCurrentPw}
                    />
                    <TextInput
                      style={styles.textField}
                      placeholder="New password (min 6 chars)"
                      placeholderTextColor={Colors.lightTextMuted}
                      secureTextEntry
                      value={newPw}
                      onChangeText={setNewPw}
                    />
                    <TouchableOpacity
                      style={[styles.saveBtn, savingPw && { opacity: 0.6 }]}
                      onPress={savePassword}
                      disabled={savingPw}
                    >
                      <Text style={styles.saveBtnText}>
                        {savingPw ? "Saving..." : "Update Password"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              {/* Navigation links */}
              <View style={styles.card}>
                <TouchableOpacity
                  style={styles.menuRow}
                  onPress={() => router.push("/achievements")}
                >
                  <Ionicons name="trophy-outline" size={20} color={Colors.primary} />
                  <Text style={styles.menuText}>Achievements</Text>
                  <Ionicons name="chevron-forward" size={16} color={Colors.lightTextMuted} />
                </TouchableOpacity>

                <View style={styles.menuDivider} />

                <TouchableOpacity
                  style={styles.menuRow}
                  onPress={() => router.push("/preferences")}
                >
                  <Ionicons name="notifications-outline" size={20} color={Colors.primary} />
                  <Text style={styles.menuText}>Notification Preferences</Text>
                  <Ionicons name="chevron-forward" size={16} color={Colors.lightTextMuted} />
                </TouchableOpacity>
              </View>

              {/* Logout */}
              <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={20} color={Colors.error} />
                <Text style={styles.logoutText}>Log Out</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>

        {ToastOverlay}

        <ConfirmModal
          visible={logoutModalVisible}
          title="Log Out"
          message="Are you sure you want to log out of Stay Hydrated?"
          confirmText="Log Out"
          cancelText="Cancel"
          destructive
          onConfirm={async () => {
            setLogoutModalVisible(false);
            await logout();
          }}
          onCancel={() => setLogoutModalVisible(false)}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.lightBackground },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: "rgba(255,255,255,0.6)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.3)",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: Colors.primary,
    letterSpacing: -0.5,
  },
  scroll: { flex: 1 },
  content: { padding: 20, gap: 16 },
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

  identityRow: { flexDirection: "row", alignItems: "center", gap: 16 },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  nameEditRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  profileName: { fontSize: 18, fontWeight: "700", color: Colors.lightText },
  profileEmail: { fontSize: 13, color: Colors.lightTextMuted },
  nameInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    color: Colors.lightText,
    borderBottomWidth: 1,
    borderBottomColor: Colors.primary,
    padding: 0,
  },
  iconBtn: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },

  divider: { height: 1, backgroundColor: "rgba(0,99,133,0.08)" },
  statsRow: { flexDirection: "row", alignItems: "center" },
  statDivider: { width: 1, height: 32, backgroundColor: "rgba(0,0,0,0.08)" },

  goalRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  adjustBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "rgba(0,99,133,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  goalCenter: { alignItems: "center" },
  goalValue: { fontSize: 40, fontWeight: "800", color: Colors.lightText },
  goalUnit: { fontSize: 14, fontWeight: "600", color: Colors.lightTextSub, marginTop: -4 },

  saveBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  saveBtnText: { fontSize: 14, fontWeight: "700", color: Colors.white },

  passwordSection: { gap: 10 },
  textField: {
    backgroundColor: "rgba(0,99,133,0.06)",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: Colors.lightText,
    borderWidth: 1,
    borderColor: "rgba(0,99,133,0.12)",
  },

  menuRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 4 },
  menuText: { flex: 1, fontSize: 14, fontWeight: "600", color: Colors.lightText },
  menuDivider: { height: 1, backgroundColor: "rgba(0,99,133,0.06)" },

  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "rgba(186,26,26,0.08)",
    borderRadius: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "rgba(186,26,26,0.15)",
  },
  logoutText: { fontSize: 15, fontWeight: "700", color: Colors.error },
});
