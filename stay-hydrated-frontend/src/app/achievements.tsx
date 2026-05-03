import { useCallback, useEffect, useRef, useState } from "react";
import {
  InteractionManager,
  RefreshControl,
  ScrollView,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { SvgXml } from "react-native-svg";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { captureRef } from "react-native-view-shot";
import * as Sharing from "expo-sharing";
import { Colors } from "./constants/colors";
import { getAchievements, type Achievement } from "./api/achievements";
import {
  BADGE_FIRST_SIP_SVG,
  BADGE_STREAK_7_SVG,
  BADGE_STREAK_30_SVG,
  BADGE_HYDRATION_PRO_SVG,
  BADGE_WAVE_MAKER_SVG,
  BADGE_ALL_STAR_SVG,
} from "./constants/svg-assets";

// ─── Badge metadata ───────────────────────────────────────────────────────────

const SHARE_CARD_WIDTH = 320;

type BadgeMeta = {
  svg: string;
  emoji: string;
  shareTitle: string;
  motivational: string;
  hashtags: string;
};

function getBadgeMeta(a: Achievement): BadgeMeta {
  const t = a.title.toLowerCase();
  const ct = a.conditionType.toLowerCase();

  if (t.includes("first") || t.includes("sip"))
    return {
      svg: BADGE_FIRST_SIP_SVG,
      emoji: "💧",
      shareTitle: "First Sip — The Journey Begins!",
      motivational: "Every great hydration journey starts with a single sip. I just took mine! 🌊",
      hashtags: "#StayHydrated #FirstStep #HydrationJourney #DrinkWater",
    };
  if (ct === "streak" && a.conditionValue <= 7)
    return {
      svg: BADGE_STREAK_7_SVG,
      emoji: "🔥",
      shareTitle: `${a.conditionValue}-Day Streak — On Fire!`,
      motivational: "Consistency is the secret sauce. A full week of hitting my hydration goals! 💪",
      hashtags: "#StayHydrated #7DayStreak #HydrationGoals #HealthyHabits",
    };
  if (ct === "streak" && a.conditionValue > 7)
    return {
      svg: BADGE_STREAK_30_SVG,
      emoji: "🏆",
      shareTitle: `${a.conditionValue}-Day Hydration Champion!`,
      motivational: "30 days of staying hydrated without missing a beat — officially unstoppable! 🚀",
      hashtags: "#StayHydrated #30DayChallenge #HydrationChampion #HealthGoals",
    };
  if (t.includes("wave"))
    return {
      svg: BADGE_WAVE_MAKER_SVG,
      emoji: "🌊",
      shareTitle: "Wave Maker — Riding the Hydration Wave!",
      motivational: "Making waves in my health journey! My body is loving every drop. 🌊",
      hashtags: "#StayHydrated #WaveMaker #HydrationNation #WaterIsLife",
    };
  if (t.includes("pro") || t.includes("hydration"))
    return {
      svg: BADGE_HYDRATION_PRO_SVG,
      emoji: "⭐",
      shareTitle: "Hydration Pro — Leveled Up!",
      motivational: "Officially reached Pro status on my hydration journey. The grind pays off! ⭐",
      hashtags: "#StayHydrated #HydrationPro #LevelUp #WaterGoals",
    };
  if (t.includes("star") || t.includes("all"))
    return {
      svg: BADGE_ALL_STAR_SVG,
      emoji: "🌟",
      shareTitle: "All-Star Hydrator — Every Badge Collected!",
      motivational: "Unlocked every badge — the ultimate hydration all-star. No drops wasted. 🌟",
      hashtags: "#StayHydrated #AllStar #HydrationGoals #Achievement",
    };
  if (ct === "daily_goal")
    return {
      svg: BADGE_HYDRATION_PRO_SVG,
      emoji: "💪",
      shareTitle: "Daily Goal Crusher!",
      motivational: "Smashing my daily water goals and feeling amazing for it. Keep going! 💦",
      hashtags: "#StayHydrated #DailyGoal #DrinkWater #HealthyLife",
    };
  return {
    svg: BADGE_ALL_STAR_SVG,
    emoji: "🎖️",
    shareTitle: a.title,
    motivational: "Staying hydrated and loving every milestone! 💦",
    hashtags: "#StayHydrated #HydrationGoals #DrinkWater",
  };
}

function buildShareText(a: Achievement): { message: string; title: string } {
  const meta = getBadgeMeta(a);
  const date = a.unlockedAt
    ? new Date(a.unlockedAt).toLocaleDateString([], { month: "long", day: "numeric", year: "numeric" })
    : "today";
  const message = [
    `🎉 Achievement Unlocked on Stay Hydrated!\n`,
    `${meta.emoji}  ${meta.shareTitle}`,
    ``,
    `"${a.description}"`,
    ``,
    meta.motivational,
    ``,
    `📅 Unlocked on ${date}`,
    ``,
    meta.hashtags,
  ].join("\n");
  return { message, title: `${meta.emoji} ${meta.shareTitle}` };
}

// ─── Off-screen share card (captured as PNG) ──────────────────────────────────

function ShareableCard({ achievement }: { achievement: Achievement }) {
  const meta = getBadgeMeta(achievement);
  const date = achievement.unlockedAt
    ? new Date(achievement.unlockedAt).toLocaleDateString([], {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "today";

  return (
    <LinearGradient
      colors={["#002e3f", "#005470", "#006385"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={shareCardStyles.outer}
    >
      {/* App branding */}
      <View style={shareCardStyles.appRow}>
        <Ionicons name="water" size={13} color="rgba(105,229,255,0.8)" />
        <Text style={shareCardStyles.appName}>Stay Hydrated</Text>
      </View>

      {/* Badge */}
      <View style={shareCardStyles.badgeRing}>
        <SvgXml xml={meta.svg} width={130} height={130} />
      </View>

      {/* Labels */}
      <Text style={shareCardStyles.unlockedLabel}>🎉  ACHIEVEMENT UNLOCKED</Text>
      <Text style={shareCardStyles.badgeTitle}>{meta.shareTitle}</Text>
      <Text style={shareCardStyles.badgeDesc}>"{achievement.description}"</Text>
      <Text style={shareCardStyles.motivational}>{meta.motivational}</Text>

      <View style={shareCardStyles.datePill}>
        <Text style={shareCardStyles.dateText}>📅  Unlocked {date}</Text>
      </View>

      {/* Footer */}
      <View style={shareCardStyles.footer}>
        <Text style={shareCardStyles.footerHashtags}>{meta.hashtags}</Text>
      </View>
    </LinearGradient>
  );
}

const shareCardStyles = StyleSheet.create({
  outer: {
    width: SHARE_CARD_WIDTH,
    paddingHorizontal: 26,
    paddingVertical: 26,
    alignItems: "center",
    gap: 11,
    borderRadius: 28,
  },
  appRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    alignSelf: "flex-start",
  },
  appName: {
    fontSize: 10,
    fontWeight: "800",
    color: "rgba(255,255,255,0.55)",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  badgeRing: {
    width: 168,
    height: 168,
    borderRadius: 84,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 2,
  },
  unlockedLabel: {
    fontSize: 10,
    color: "rgba(105,229,255,0.9)",
    fontWeight: "800",
    letterSpacing: 1.4,
  },
  badgeTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#ffffff",
    textAlign: "center",
    letterSpacing: -0.2,
    lineHeight: 23,
  },
  badgeDesc: {
    fontSize: 12,
    color: "rgba(255,255,255,0.68)",
    textAlign: "center",
    lineHeight: 17,
    fontStyle: "italic",
    paddingHorizontal: 6,
  },
  motivational: {
    fontSize: 12,
    color: "rgba(255,255,255,0.88)",
    textAlign: "center",
    lineHeight: 17,
    fontWeight: "500",
    paddingHorizontal: 4,
  },
  datePill: {
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    marginTop: 2,
  },
  dateText: {
    fontSize: 11,
    color: "rgba(255,255,255,0.68)",
    fontWeight: "600",
  },
  footer: {
    marginTop: 2,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
    width: "100%",
    alignItems: "center",
  },
  footerHashtags: {
    fontSize: 10,
    color: "rgba(105,229,255,0.65)",
    fontWeight: "600",
    letterSpacing: 0.3,
    textAlign: "center",
  },
});

// ─── Badge card (grid cell) ───────────────────────────────────────────────────

function BadgeCard({
  item,
  onShare,
  sharing,
}: {
  item: Achievement;
  onShare: () => void;
  sharing: boolean;
}) {
  const meta = getBadgeMeta(item);

  return (
    <View style={[cardStyles.card, !item.unlocked && cardStyles.locked]}>
      <View style={cardStyles.svgWrap}>
        <SvgXml xml={meta.svg} width={72} height={72} />
        {!item.unlocked && (
          <View style={cardStyles.lockOverlay}>
            <Ionicons name="lock-closed" size={22} color="rgba(255,255,255,0.9)" />
          </View>
        )}
      </View>

      <Text
        style={[cardStyles.title, !item.unlocked && cardStyles.titleLocked]}
        numberOfLines={2}
      >
        {item.title}
      </Text>

      <Text style={cardStyles.desc} numberOfLines={3}>
        {item.description}
      </Text>

      {item.unlocked && item.unlockedAt && (
        <Text style={cardStyles.date}>
          {new Date(item.unlockedAt).toLocaleDateString([], {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </Text>
      )}

      {item.unlocked && (
        <TouchableOpacity
          style={[cardStyles.shareBtn, sharing && cardStyles.shareBtnActive]}
          onPress={onShare}
          disabled={sharing}
          activeOpacity={0.75}
        >
          <Ionicons
            name={sharing ? "hourglass-outline" : "share-social-outline"}
            size={12}
            color={Colors.primary}
          />
          <Text style={cardStyles.shareBtnText}>{sharing ? "Sharing…" : "Share"}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const cardStyles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 18,
    padding: 14,
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.5)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  locked: { opacity: 0.5 },
  svgWrap: {
    position: "relative",
    width: 72,
    height: 72,
    alignItems: "center",
    justifyContent: "center",
  },
  lockOverlay: {
    position: "absolute",
    inset: 0,
    borderRadius: 36,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.lightText,
    textAlign: "center",
  },
  titleLocked: { color: Colors.lightTextMuted },
  desc: {
    fontSize: 11,
    color: Colors.lightTextSub,
    textAlign: "center",
    lineHeight: 15,
  },
  date: {
    fontSize: 10,
    fontWeight: "600",
    color: Colors.primary,
  },
  shareBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: "rgba(0,99,133,0.07)",
    borderWidth: 1,
    borderColor: "rgba(0,99,133,0.14)",
    marginTop: 2,
  },
  shareBtnActive: { opacity: 0.6 },
  shareBtnText: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.primary,
  },
});

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function AchievementsScreen() {
  const insets = useSafeAreaInsets();
  const [items, setItems] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const [shareTarget, setShareTarget] = useState<Achievement | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const shareCardRef = useRef<View>(null);

  const load = useCallback(async (showRefresh = false) => {
    setError(null);
    try {
      const data = await getAchievements();
      setItems(data);
    } catch (e: any) {
      setError(e.message ?? "Failed to load achievements");
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

  const handleShareBadge = useCallback(async (item: Achievement) => {
    if (isSharing) return;
    setIsSharing(true);
    setShareTarget(item);

    // Wait for React to re-render the off-screen card and for SVG to paint
    await new Promise<void>((resolve) =>
      InteractionManager.runAfterInteractions(() => setTimeout(resolve, 200))
    );

    try {
      const uri = await captureRef(shareCardRef, { format: "png", quality: 1 });
      const sharingAvailable = await Sharing.isAvailableAsync();
      if (sharingAvailable) {
        await Sharing.shareAsync(uri, {
          mimeType: "image/png",
          dialogTitle: getBadgeMeta(item).shareTitle,
        });
      } else {
        throw new Error("sharing not available");
      }
    } catch {
      // react-native-view-shot not available in Expo Go → fall back to text
      const { message, title } = buildShareText(item);
      await Share.share({ message, title }).catch(() => {});
    } finally {
      setShareTarget(null);
      setIsSharing(false);
    }
  }, [isSharing]);

  const handleShareAll = useCallback(async () => {
    const unlocked = items.filter((a) => a.unlocked);
    if (unlocked.length === 0) return;
    const lines: string[] = [
      `🏆 My Stay Hydrated Achievements (${unlocked.length}/${items.length} unlocked)\n`,
    ];
    unlocked.forEach((a) => {
      const meta = getBadgeMeta(a);
      lines.push(`${meta.emoji}  ${a.title}`);
      lines.push(`    ${a.description}`);
    });
    lines.push("");
    lines.push("Tracking my daily water intake with Stay Hydrated! 💧");
    lines.push("#StayHydrated #HydrationGoals #DrinkWater");
    await Share.share({
      message: lines.join("\n"),
      title: "My Stay Hydrated Achievements",
    }).catch(() => {});
  }, [items]);

  const unlocked = items.filter((a) => a.unlocked);
  const rows: Achievement[][] = [];
  for (let i = 0; i < items.length; i += 2) {
    rows.push(items.slice(i, i + 2));
  }

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Achievements</Text>
        {!loading && items.length > 0 && (
          <View style={styles.headerRight}>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{unlocked.length}/{items.length}</Text>
            </View>
            {unlocked.length > 0 && (
              <TouchableOpacity style={styles.shareAllBtn} onPress={handleShareAll}>
                <Ionicons name="share-social-outline" size={17} color={Colors.primary} />
              </TouchableOpacity>
            )}
          </View>
        )}
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
          <Text style={styles.muted}>Loading achievements...</Text>
        ) : error ? (
          <Text style={[styles.muted, { color: Colors.error }]}>{error}</Text>
        ) : items.length === 0 ? (
          <Text style={styles.muted}>No achievements yet.</Text>
        ) : (
          <>
            {/* Progress card */}
            {unlocked.length > 0 && (
              <View style={styles.progressCard}>
                <Text style={styles.progressTitle}>
                  {unlocked.length === items.length
                    ? "All achievements unlocked! 🎉"
                    : `${unlocked.length} of ${items.length} unlocked`}
                </Text>
                <View style={styles.progressTrack}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${(unlocked.length / items.length) * 100}%` as any },
                    ]}
                  />
                </View>
                <TouchableOpacity style={styles.shareAllRow} onPress={handleShareAll}>
                  <Ionicons name="share-social-outline" size={13} color={Colors.primary} />
                  <Text style={styles.shareAllText}>
                    Share all {unlocked.length} badge{unlocked.length !== 1 ? "s" : ""}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Badge grid */}
            {rows.map((row, ri) => (
              <View key={ri} style={styles.row}>
                {row.map((item) => (
                  <BadgeCard
                    key={item.id}
                    item={item}
                    onShare={() => handleShareBadge(item)}
                    sharing={isSharing && shareTarget?.id === item.id}
                  />
                ))}
                {row.length === 1 && <View style={{ flex: 1 }} />}
              </View>
            ))}
          </>
        )}
      </ScrollView>

      {/* Off-screen share card — captured by react-native-view-shot */}
      <View
        ref={shareCardRef}
        // Positioned far off-screen to the left so it renders but isn't visible
        style={{ position: "absolute", left: -1200, top: 200, width: SHARE_CARD_WIDTH }}
        collapsable={false}
      >
        {shareTarget && <ShareableCard achievement={shareTarget} />}
      </View>
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
  headerRight: { flexDirection: "row", alignItems: "center", gap: 8 },
  countBadge: {
    backgroundColor: "rgba(0,99,133,0.1)",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  countText: { fontSize: 13, fontWeight: "700", color: Colors.primary },
  shareAllBtn: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: "rgba(0,99,133,0.08)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(0,99,133,0.12)",
  },
  scroll: { flex: 1 },
  content: { padding: 16, gap: 12 },
  muted: {
    fontSize: 13,
    color: Colors.lightTextMuted,
    textAlign: "center",
    paddingVertical: 40,
  },
  progressCard: {
    backgroundColor: "rgba(255,255,255,0.85)",
    borderRadius: 16,
    padding: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.5)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  progressTitle: { fontSize: 14, fontWeight: "700", color: Colors.lightText, textAlign: "center" },
  progressTrack: {
    height: 8,
    backgroundColor: "rgba(0,99,133,0.1)",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: { height: "100%", backgroundColor: Colors.primary, borderRadius: 4 },
  shareAllRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingTop: 2,
  },
  shareAllText: { fontSize: 12, fontWeight: "700", color: Colors.primary },
  row: { flexDirection: "row", gap: 12 },
});
