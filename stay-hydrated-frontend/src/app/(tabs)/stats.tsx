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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { SvgXml } from "react-native-svg";
import { Colors } from "../constants/colors";
import {
  getTodayStats,
  getWeeklyStats,
  type TodayStats,
  type WeeklyStats,
  type LogEntry,
} from "../api/stats";
import { EMPTY_STATE_SVG } from "../constants/svg-assets";

const MAX_BAR_HEIGHT = 110;
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function WeeklyChart({ data }: { data: WeeklyStats }) {
  const anims = useRef(data.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    anims.forEach((a) => a.setValue(0));
    Animated.stagger(
      55,
      anims.map((anim) =>
        Animated.timing(anim, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        })
      )
    ).start();
  }, [data]);

  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <View style={chartStyles.row}>
      {data.map((day, i) => {
        const pct = day.goalMl > 0 ? Math.min(day.totalIntakeMl / day.goalMl, 1) : 0;
        const isToday = day.date.startsWith(todayStr);
        const barHeight = anims[i].interpolate({
          inputRange: [0, 1],
          outputRange: [0, Math.max(pct * MAX_BAR_HEIGHT, pct > 0 ? 4 : 0)],
        });
        const [y, m, d] = day.date.split("-").map(Number);
        const dayLabel = DAY_NAMES[new Date(y, m - 1, d).getDay()];

        return (
          <View key={day.date} style={chartStyles.col}>
            <Text style={chartStyles.mlAbove}>
              {day.totalIntakeMl > 0
                ? day.totalIntakeMl >= 1000
                  ? `${(day.totalIntakeMl / 1000).toFixed(1)}L`
                  : `${day.totalIntakeMl}`
                : ""}
            </Text>
            <View style={[chartStyles.track, { height: MAX_BAR_HEIGHT }]}>
              <Animated.View
                style={[
                  chartStyles.fill,
                  { height: barHeight },
                  isToday ? chartStyles.fillToday : chartStyles.fillPast,
                ]}
              />
            </View>
            <Text style={[chartStyles.dayLabel, isToday && chartStyles.dayLabelToday]}>
              {dayLabel}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const chartStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  col: { flex: 1, alignItems: "center", gap: 4 },
  mlAbove: {
    fontSize: 8,
    color: Colors.lightTextMuted,
    fontWeight: "600",
    height: 14,
    textAlign: "center",
  },
  track: {
    width: 28,
    backgroundColor: "rgba(0,99,133,0.08)",
    borderRadius: 8,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  fill: { width: "100%", borderRadius: 8 },
  fillPast: { backgroundColor: Colors.accentMid, opacity: 0.6 },
  fillToday: { backgroundColor: Colors.primary },
  dayLabel: { fontSize: 10, color: Colors.lightTextMuted, fontWeight: "600" },
  dayLabelToday: { color: Colors.primary, fontWeight: "800" },
});

function LogItem({ entry }: { entry: LogEntry }) {
  const time = new Date(entry.loggedAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <View style={logStyles.row}>
      <View style={logStyles.icon}>
        <Ionicons name="water" size={16} color={Colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={logStyles.amount}>{entry.amountMl} ml</Text>
        <Text style={logStyles.time}>{time}</Text>
      </View>
      <View style={logStyles.badge}>
        <Text style={logStyles.badgeText}>
          {(entry.amountMl / 1000).toFixed(2)} L
        </Text>
      </View>
    </View>
  );
}

const logStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,99,133,0.06)",
  },
  icon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#e8f4fd",
    alignItems: "center",
    justifyContent: "center",
  },
  amount: { fontSize: 14, fontWeight: "600", color: Colors.lightText },
  time: { fontSize: 11, color: Colors.lightTextMuted, marginTop: 1 },
  badge: {
    backgroundColor: "rgba(0,99,133,0.08)",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: { fontSize: 11, fontWeight: "600", color: Colors.primary },
});

export default function StatsScreen() {
  const [today, setToday] = useState<TodayStats | null>(null);
  const [weekly, setWeekly] = useState<WeeklyStats>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();

  const fetchStats = async () => {
    setError(null);
    try {
      const [todayData, weeklyData] = await Promise.all([
        getTodayStats(),
        getWeeklyStats(),
      ]);
      setToday(todayData);
      setWeekly(weeklyData);
    } catch (e: any) {
      const msg =
        e.name === "AbortError"
          ? "Request timed out — check backend is running"
          : `Failed to load: ${e.message}`;
      setError(msg);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    let active = true;
    const safetyTimer = setTimeout(() => {
      if (active) {
        setLoading(false);
        setError("Timed out. Is the backend running on the correct IP?");
      }
    }, 12000);

    fetchStats().finally(() => {
      active = false;
      clearTimeout(safetyTimer);
    });

    return () => {
      active = false;
      clearTimeout(safetyTimer);
    };
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchStats();
  }, []);

  if (loading) {
    return (
      <View style={[styles.center, { paddingTop: insets.top }]}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.center, { paddingTop: insets.top }]}>
        <Text style={[styles.loadingText, { color: Colors.error, marginBottom: 16 }]}>
          {error}
        </Text>
        <TouchableOpacity
          style={styles.retryBtn}
          onPress={() => { setLoading(true); fetchStats(); }}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const totalMl = today?.totalIntakeMl ?? 0;
  const goalMl = today?.goalMl ?? 2500;
  const pct = today?.completionPercentage ?? 0;
  const entries = today?.logs ?? [];

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Text style={styles.headerTitle}>Statistics</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 90 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
          />
        }
      >
        {/* Today summary */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="today-outline" size={18} color={Colors.primary} />
            <Text style={styles.cardTitle}>Today</Text>
          </View>

          <View style={styles.todayRow}>
            <View style={styles.todayStat}>
              <Text style={styles.todayValue}>{(totalMl / 1000).toFixed(2)} L</Text>
              <Text style={styles.todayLabel}>Consumed</Text>
            </View>
            <View style={styles.todayDivider} />
            <View style={styles.todayStat}>
              <Text style={styles.todayValue}>{(goalMl / 1000).toFixed(1)} L</Text>
              <Text style={styles.todayLabel}>Goal</Text>
            </View>
            <View style={styles.todayDivider} />
            <View style={styles.todayStat}>
              <Text
                style={[
                  styles.todayValue,
                  { color: pct >= 100 ? "#22c55e" : Colors.primary },
                ]}
              >
                {pct}%
              </Text>
              <Text style={styles.todayLabel}>Complete</Text>
            </View>
          </View>

          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${Math.min(pct, 100)}%` as any },
                pct >= 100 && { backgroundColor: "#22c55e" },
              ]}
            />
          </View>
          <Text style={styles.progressLabel}>
            {pct >= 100
              ? "Daily goal reached! 🎉"
              : `${Math.max(0, goalMl - totalMl).toLocaleString()} ml remaining`}
          </Text>
        </View>

        {/* Weekly bar chart */}
        {weekly.length > 0 && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="bar-chart-outline" size={18} color={Colors.primary} />
              <Text style={styles.cardTitle}>This Week</Text>
            </View>
            <WeeklyChart data={weekly} />
            <View style={styles.legendRow}>
              <View style={styles.legendDot} />
              <Text style={styles.legendText}>Today</Text>
              <View style={[styles.legendDot, { backgroundColor: Colors.accentMid, opacity: 0.6 }]} />
              <Text style={styles.legendText}>Past days</Text>
            </View>
          </View>
        )}

        {/* Today's log entries */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="list-outline" size={18} color={Colors.primary} />
            <Text style={styles.cardTitle}>Today's Logs</Text>
            {entries.length > 0 && (
              <View style={styles.countBadge}>
                <Text style={styles.countText}>{entries.length}</Text>
              </View>
            )}
          </View>
          {entries.length === 0 ? (
            <View style={styles.emptyState}>
              <SvgXml xml={EMPTY_STATE_SVG} width={220} height={171} />
            </View>
          ) : (
            [...entries].reverse().map((entry) => (
              <LogItem key={entry.id} entry={entry} />
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.lightBackground },
  center: {
    flex: 1,
    backgroundColor: Colors.lightBackground,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: { color: Colors.primary, fontSize: 16 },
  retryBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  retryText: { color: Colors.white, fontWeight: "700" },
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
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.lightText,
    flex: 1,
  },
  countBadge: {
    backgroundColor: "rgba(0,99,133,0.1)",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  countText: { fontSize: 12, fontWeight: "700", color: Colors.primary },
  todayRow: { flexDirection: "row", alignItems: "center" },
  todayStat: { flex: 1, alignItems: "center", gap: 2 },
  todayDivider: { width: 1, height: 32, backgroundColor: "rgba(0,0,0,0.08)" },
  todayValue: { fontSize: 22, fontWeight: "800", color: Colors.lightText },
  todayLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: Colors.lightTextMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  progressTrack: {
    height: 8,
    backgroundColor: "rgba(0,99,133,0.1)",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  progressLabel: {
    fontSize: 12,
    color: Colors.lightTextSub,
    textAlign: "center",
    marginTop: -8,
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    justifyContent: "center",
    marginTop: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  legendText: { fontSize: 11, color: Colors.lightTextMuted, marginRight: 8 },
  emptyState: { alignItems: "center", paddingVertical: 8 },
});
