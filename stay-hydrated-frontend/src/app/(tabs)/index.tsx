import { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { getDashboard, type DashboardData } from "../api/dashboard";
import { SvgXml } from "react-native-svg";
import { Colors } from "../constants/colors";
import { GOAL_COMPLETE_SVG } from "../constants/svg-assets";

const BOTTLE_HEIGHT = 240;

function WaterBottle({
  percentage,
  totalMl,
}: {
  percentage: number;
  totalMl: number;
}) {
  const fillAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fillAnim, {
      toValue: Math.min(Math.max(percentage, 0), 100) / 100,
      duration: 1200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [percentage]);

  const fillHeight = fillAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, BOTTLE_HEIGHT],
  });

  return (
    <View style={bottleStyles.bottle}>
      <Animated.View style={[bottleStyles.fillWrapper, { height: fillHeight }]}>
        <LinearGradient
          colors={["#69e5ff", "#007ea7"]}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />
      </Animated.View>
      <View style={bottleStyles.textOverlay}>
        <Text style={bottleStyles.currentLabel}>CURRENT</Text>
        <Text style={bottleStyles.mlValue}>{totalMl.toLocaleString()}</Text>
        <Text style={bottleStyles.mlUnit}>ml</Text>
      </View>
    </View>
  );
}

const bottleStyles = StyleSheet.create({
  bottle: {
    width: 160,
    height: BOTTLE_HEIGHT,
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 40,
    borderWidth: 2.5,
    borderColor: "rgba(255,255,255,0.6)",
    overflow: "hidden",
    shadowColor: Colors.accentMid,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  fillWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  textOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  currentLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: Colors.primary,
    letterSpacing: 1.5,
    opacity: 0.8,
    marginBottom: 4,
  },
  mlValue: {
    fontSize: 42,
    fontWeight: "800",
    color: Colors.lightText,
    lineHeight: 46,
  },
  mlUnit: {
    fontSize: 13,
    fontWeight: "500",
    color: Colors.lightTextSub,
    marginTop: 2,
  },
});

export default function DashboardScreen() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const fetchDashboard = async () => {
    setError(null);
    try {
      const result = await getDashboard();
      setData(result);
    } catch (e: any) {
      setError(`Failed to load: ${e.message}`);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { paddingTop: insets.top }]}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.loadingContainer, { paddingTop: insets.top }]}>
        <Text style={[styles.loadingText, { color: Colors.error, marginBottom: 16 }]}>{error}</Text>
        <TouchableOpacity
          style={{ backgroundColor: Colors.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 10 }}
          onPress={() => { setLoading(true); fetchDashboard(); }}
        >
          <Text style={{ color: Colors.white, fontWeight: "700" }}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const goalMl = data?.goalMl ?? 2500;
  const totalMl = data?.todayTotalML ?? 0;
  const percentage = data?.completionPercentage ?? 0;
  const remainingMl = Math.max(0, goalMl - totalMl);
  const streak = data?.currentStreak ?? 0;
  const userName = (data?.name ?? "there").split(" ")[0];

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View>
          <Text style={styles.helloText}>Hello, {userName} 👋</Text>
          <Text style={styles.appName}>Stay Hydrated</Text>
        </View>
        <TouchableOpacity
          style={styles.settingsBtn}
          onPress={() => router.push("/(tabs)/profile")}
        >
          <Ionicons name="settings-outline" size={22} color={Colors.lightTextSub} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 90 },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
          />
        }
      >
        {/* Milestone toast */}
        {percentage >= 50 && percentage < 100 && (
          <View style={styles.toastCard}>
            <View style={styles.toastIcon}>
              <Ionicons name="checkmark-circle" size={24} color="#22c55e" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.toastTitle}>Target almost reached!</Text>
              <Text style={styles.toastSub}>
                You're {percentage}% done today. Great job! 💧
              </Text>
            </View>
          </View>
        )}
        {percentage >= 100 && (
          <View style={styles.celebrationCard}>
            <View style={styles.celebrationIllustration}>
              <SvgXml xml={GOAL_COMPLETE_SVG} width={120} height={107} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.celebrationTitle}>Goal achieved! 🎉</Text>
              <Text style={styles.celebrationSub}>
                You've hit your daily target. Amazing!
              </Text>
            </View>
          </View>
        )}

        {/* Bottle hero */}
        <View style={styles.heroSection}>
          <View style={styles.bottleRow}>
            <WaterBottle percentage={percentage} totalMl={totalMl} />
            <View style={styles.percentBadge}>
              <Text style={styles.percentValue}>{percentage}%</Text>
              <Text style={styles.percentLabel}>Goal</Text>
            </View>
          </View>
          <View style={styles.heroText}>
            <Text style={styles.heroTitle}>
              {percentage >= 100 ? "Daily goal reached! 🎉" : "Stay refreshed!"}
            </Text>
            <Text style={styles.heroSub}>
              {remainingMl > 0
                ? `${remainingMl.toLocaleString()} ml remaining to reach goal`
                : `Goal of ${goalMl.toLocaleString()} ml completed`}
            </Text>
          </View>
        </View>

        {/* Streak card */}
        <LinearGradient
          colors={["#006385", "#007ea7", "#69e5ff"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.streakCard}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.streakLabel}>Ongoing Streak</Text>
            <Text style={styles.streakDays}>
              {streak} {streak === 1 ? "Day" : "Days"} 🔥
            </Text>
            <Text style={styles.streakSub}>
              {streak === 0
                ? "Log water today to start your streak!"
                : `${streak} day${streak !== 1 ? "s" : ""} in a row — keep it up!`}
            </Text>
          </View>
          <View style={styles.streakIcon}>
            <Ionicons name="flame" size={32} color="white" />
          </View>
        </LinearGradient>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: "#eff6ff" }]}>
              <Ionicons name="water" size={22} color="#3b82f6" />
            </View>
            <View>
              <Text style={styles.statLabel}>Today</Text>
              <Text style={styles.statValue}>
                {(totalMl / 1000).toFixed(1)} L
              </Text>
            </View>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: "#faf5ff" }]}>
              <Ionicons name="flame" size={22} color="#a855f7" />
            </View>
            <View>
              <Text style={styles.statLabel}>Best Streak</Text>
              <Text style={styles.statValue}>
                {data?.longestStreak ?? 0} days
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, { bottom: insets.bottom + 76 }]}
        onPress={() => router.push("/(tabs)/log")}
        activeOpacity={0.85}
      >
        <LinearGradient
          colors={["#006385", "#007ea7"]}
          style={styles.fabGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons name="add" size={32} color="white" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.lightBackground },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.lightBackground,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: { color: Colors.primary, fontSize: 16 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: "rgba(255,255,255,0.6)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.3)",
  },
  helloText: { fontSize: 12, color: Colors.lightTextSub, fontWeight: "500" },
  appName: {
    fontSize: 20,
    fontWeight: "800",
    color: Colors.primary,
    letterSpacing: -0.5,
  },
  settingsBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.8)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.5)",
  },
  scroll: { flex: 1 },
  content: { padding: 20, gap: 16 },
  toastCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "rgba(255,255,255,0.7)",
    borderRadius: 12,
    padding: 14,
    borderLeftWidth: 4,
    borderLeftColor: "#22c55e",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
  },
  toastIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0fdf4",
    alignItems: "center",
    justifyContent: "center",
  },
  toastTitle: { fontWeight: "600", color: Colors.lightText, fontSize: 14 },
  toastSub: { fontSize: 11, color: Colors.lightTextSub, marginTop: 2 },
  heroSection: { alignItems: "center", paddingVertical: 16 },
  bottleRow: { flexDirection: "row", alignItems: "center" },
  percentBadge: {
    marginLeft: 12,
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: "rgba(255,255,255,0.85)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(0,99,133,0.2)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  percentValue: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.primary,
    lineHeight: 20,
  },
  percentLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: Colors.lightTextMuted,
    textTransform: "uppercase",
  },
  heroText: { alignItems: "center", marginTop: 20 },
  heroTitle: { fontSize: 22, fontWeight: "700", color: Colors.lightText },
  heroSub: { fontSize: 14, color: Colors.lightTextSub, marginTop: 4 },
  streakCard: {
    borderRadius: 24,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
  },
  streakLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "rgba(255,255,255,0.7)",
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
  streakDays: {
    fontSize: 40,
    fontWeight: "800",
    color: "white",
    letterSpacing: -1,
    marginTop: 4,
  },
  streakSub: {
    fontSize: 12,
    color: "rgba(255,255,255,0.75)",
    marginTop: 4,
  },
  streakIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 16,
  },
  statsRow: { flexDirection: "row", gap: 12 },
  statCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "rgba(255,255,255,0.85)",
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.5)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  statLabel: {
    fontSize: 10,
    color: Colors.lightTextMuted,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.lightText,
    marginTop: 2,
  },
  fab: {
    position: "absolute",
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 18,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  fabGradient: {
    width: 60,
    height: 60,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  celebrationCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "rgba(255,255,255,0.85)",
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(0,126,167,0.2)",
    shadowColor: Colors.accentMid,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
    paddingRight: 16,
  },
  celebrationIllustration: {
    width: 120,
    height: 107,
    overflow: "hidden",
  },
  celebrationTitle: {
    fontWeight: "700",
    color: Colors.lightText,
    fontSize: 15,
  },
  celebrationSub: {
    fontSize: 12,
    color: Colors.lightTextSub,
    marginTop: 4,
  },
});
