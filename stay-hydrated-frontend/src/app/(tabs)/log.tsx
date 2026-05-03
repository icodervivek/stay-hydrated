import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Colors } from "../constants/colors";
import { logIntake, getHistory, type IntakeHistoryEntry } from "../api/intake";
import { uploadToCloudinary } from "../api/cloudinary";
import { verifyWaterImage } from "../api/groq";
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET, GROQ_API_KEY } from "../constants/env";

const PRESETS = [100, 250, 500, 750, 1000];

type LogStep = "idle" | "uploading" | "analyzing" | "logging";

function formatTime(iso: string): string {
  const d = new Date(iso);
  const today = new Date();
  const time = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  if (d.toDateString() === today.toDateString()) return time;
  return `${d.toLocaleDateString([], { month: "short", day: "numeric" })} · ${time}`;
}

const STEP_LABELS: Record<LogStep, string> = {
  idle: "Log Water",
  uploading: "Uploading photo...",
  analyzing: "Analyzing with AI...",
  logging: "Logging...",
};

const credentialsReady =
  GROQ_API_KEY.length > 0 &&
  CLOUDINARY_CLOUD_NAME.length > 0 &&
  CLOUDINARY_UPLOAD_PRESET.length > 0;

export default function LogScreen() {
  const [amount, setAmount] = useState(250);
  const [customText, setCustomText] = useState("250");
  const [step, setStep] = useState<LogStep>("idle");
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isWaterResult, setIsWaterResult] = useState<boolean | null>(null);

  const [pickedImage, setPickedImage] = useState<string | null>(null);

  const [history, setHistory] = useState<IntakeHistoryEntry[]>([]);
  const [nextPage, setNextPage] = useState(0);
  const [isLast, setIsLast] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const insets = useSafeAreaInsets();
  const busy = step !== "idle";

  const fetchHistory = useCallback(async (pageNum: number, reset: boolean) => {
    try {
      const res = await getHistory(pageNum, 20);
      setHistory((prev) => (reset ? res.content : [...prev, ...res.content]));
      setNextPage(pageNum + 1);
      setIsLast(res.last);
    } catch {
      // non-fatal
    } finally {
      setHistoryLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => { fetchHistory(0, true); }, [fetchHistory]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchHistory(0, true);
  }, [fetchHistory]);

  const handleAmountChange = (val: number) => {
    const clamped = Math.max(50, val);
    setAmount(clamped);
    setCustomText(String(clamped));
  };

  const handleCustomText = (text: string) => {
    setCustomText(text);
    const n = parseInt(text, 10);
    if (!isNaN(n) && n >= 50) setAmount(n);
  };

  const pickImage = async (source: "camera" | "gallery") => {
    if (!credentialsReady) {
      Alert.alert(
        "Setup required",
        "Fill in GROQ_API_KEY, CLOUDINARY_CLOUD_NAME, and CLOUDINARY_UPLOAD_PRESET in src/app/constants/env.ts to enable photo verification."
      );
      return;
    }

    let result: ImagePicker.ImagePickerResult;

    if (source === "camera") {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission needed", "Camera access is required to take a photo.");
        return;
      }
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: "images",
        quality: 0.7,
        allowsEditing: true,
        aspect: [4, 3],
      });
    } else {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission needed", "Photo library access is required to pick a photo.");
        return;
      }
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        quality: 0.7,
        allowsEditing: true,
        aspect: [4, 3],
      });
    }

    if (!result.canceled && result.assets[0]) {
      setPickedImage(result.assets[0].uri);
      setSuccessMsg(null);
      setIsWaterResult(null);
    }
  };

  const handleLog = async () => {
    if (amount < 50 || busy) return;
    setSuccessMsg(null);
    setIsWaterResult(null);

    let cloudinaryUrl: string | null = null;
    let aiLabel: string | null = null;
    let waterResult: boolean | null = null;

    if (pickedImage) {
      try {
        setStep("uploading");
        cloudinaryUrl = await uploadToCloudinary(pickedImage);
      } catch {
        Alert.alert("Upload failed", "Could not upload the photo. Logging without image.");
        cloudinaryUrl = null;
      }

      if (cloudinaryUrl) {
        try {
          setStep("analyzing");
          const result = await verifyWaterImage(cloudinaryUrl);
          aiLabel = result.message;
          waterResult = result.isWater;
        } catch {
          aiLabel = "Image uploaded, AI analysis unavailable.";
          waterResult = null;
        }
      }
    }

    try {
      setStep("logging");
      const res = await logIntake(amount, cloudinaryUrl, aiLabel);
      setHistory((prev) => [
        {
          id: res.logId,
          amountMl: res.amountMl,
          imageUrl: res.imageUrl,
          aiLabel: res.aiLabel,
          loggedAt: res.loggedAt,
        },
        ...prev,
      ]);

      const msg = aiLabel ?? `Logged ${amount} ml! Keep it up 💧`;
      setSuccessMsg(msg);
      setIsWaterResult(waterResult);
      setPickedImage(null);
    } catch {
      Alert.alert("Error", "Failed to log intake. Try again.");
    } finally {
      setStep("idle");
    }
  };

  const loadMore = () => {
    if (isLast || loadingMore) return;
    setLoadingMore(true);
    fetchHistory(nextPage, false);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.screen}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <Text style={styles.headerTitle}>Log Water</Text>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 90 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
          }
        >
          {/* Log card */}
          <View style={styles.card}>
            <Text style={styles.cardSectionLabel}>AMOUNT</Text>

            <View style={styles.amountRow}>
              <TouchableOpacity
                style={styles.adjustBtn}
                onPress={() => handleAmountChange(amount - 50)}
                disabled={busy}
              >
                <Ionicons name="remove" size={22} color={Colors.primary} />
              </TouchableOpacity>

              <View style={styles.amountCenter}>
                <TextInput
                  style={styles.amountInput}
                  value={customText}
                  onChangeText={handleCustomText}
                  keyboardType="number-pad"
                  selectTextOnFocus
                  editable={!busy}
                />
                <Text style={styles.amountUnit}>ml</Text>
              </View>

              <TouchableOpacity
                style={styles.adjustBtn}
                onPress={() => handleAmountChange(amount + 50)}
                disabled={busy}
              >
                <Ionicons name="add" size={22} color={Colors.primary} />
              </TouchableOpacity>
            </View>

            <View style={styles.presets}>
              {PRESETS.map((p) => (
                <TouchableOpacity
                  key={p}
                  style={[styles.preset, amount === p && styles.presetActive]}
                  onPress={() => handleAmountChange(p)}
                  disabled={busy}
                >
                  <Text style={[styles.presetText, amount === p && styles.presetTextActive]}>
                    {p >= 1000 ? `${p / 1000}L` : `${p}`}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Photo section */}
            <View style={styles.divider} />
            <Text style={styles.cardSectionLabel}>PHOTO PROOF (OPTIONAL)</Text>

            {pickedImage ? (
              <View style={styles.imagePreviewWrap}>
                <Image
                  source={{ uri: pickedImage }}
                  style={styles.imagePreview}
                  contentFit="cover"
                />
                <TouchableOpacity
                  style={styles.removeImageBtn}
                  onPress={() => { setPickedImage(null); setSuccessMsg(null); setIsWaterResult(null); }}
                  disabled={busy}
                >
                  <Ionicons name="close-circle" size={26} color="#ba1a1a" />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.photoPickerRow}>
                <TouchableOpacity
                  style={styles.photoBtn}
                  onPress={() => pickImage("camera")}
                  disabled={busy}
                >
                  <Ionicons name="camera-outline" size={20} color={Colors.primary} />
                  <Text style={styles.photoBtnText}>Camera</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.photoBtn}
                  onPress={() => pickImage("gallery")}
                  disabled={busy}
                >
                  <Ionicons name="images-outline" size={20} color={Colors.primary} />
                  <Text style={styles.photoBtnText}>Gallery</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Success / AI result banner */}
            {successMsg !== null && (
              <View
                style={[
                  styles.resultBanner,
                  isWaterResult === false ? styles.resultBannerWarn : styles.resultBannerSuccess,
                ]}
              >
                <Ionicons
                  name={isWaterResult === false ? "alert-circle" : "checkmark-circle"}
                  size={16}
                  color={isWaterResult === false ? "#92400e" : "#15803d"}
                />
                <Text
                  style={[
                    styles.resultText,
                    isWaterResult === false ? styles.resultTextWarn : styles.resultTextSuccess,
                  ]}
                >
                  {successMsg}
                </Text>
              </View>
            )}

            {/* Log button */}
            <TouchableOpacity
              style={[styles.logBtn, busy && { opacity: 0.6 }]}
              onPress={handleLog}
              disabled={busy}
              activeOpacity={0.85}
            >
              {busy ? (
                <>
                  <ActivityIndicator size="small" color={Colors.white} />
                  <Text style={styles.logBtnText}>{STEP_LABELS[step]}</Text>
                </>
              ) : (
                <>
                  <Ionicons name="water" size={20} color={Colors.white} />
                  <Text style={styles.logBtnText}>Log Water</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* History card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="time-outline" size={18} color={Colors.primary} />
              <Text style={styles.cardTitle}>History</Text>
            </View>

            {historyLoading ? (
              <Text style={styles.mutedText}>Loading history...</Text>
            ) : history.length === 0 ? (
              <Text style={styles.mutedText}>No logs yet. Add your first sip above!</Text>
            ) : (
              <>
                {history.map((entry) => (
                  <View key={entry.id} style={styles.historyRow}>
                    {entry.imageUrl ? (
                      <Image
                        source={{ uri: entry.imageUrl }}
                        style={styles.historyThumb}
                        contentFit="cover"
                      />
                    ) : (
                      <View style={styles.historyIcon}>
                        <Ionicons name="water" size={15} color={Colors.primary} />
                      </View>
                    )}
                    <View style={{ flex: 1 }}>
                      <Text style={styles.historyAmount}>{entry.amountMl} ml</Text>
                      {!!entry.aiLabel && (
                        <Text style={styles.historyLabel}>{entry.aiLabel}</Text>
                      )}
                      <Text style={styles.historyTime}>{formatTime(entry.loggedAt)}</Text>
                    </View>
                    <View style={styles.historyBadge}>
                      <Text style={styles.historyBadgeText}>
                        {(entry.amountMl / 1000).toFixed(2)} L
                      </Text>
                    </View>
                  </View>
                ))}
                {!isLast && (
                  <TouchableOpacity
                    style={styles.loadMoreBtn}
                    onPress={loadMore}
                    disabled={loadingMore}
                  >
                    <Text style={styles.loadMoreText}>
                      {loadingMore ? "Loading..." : "Load more"}
                    </Text>
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
        </ScrollView>
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
  cardTitle: { fontSize: 15, fontWeight: "700", color: Colors.lightText, flex: 1 },
  cardSectionLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: Colors.lightTextMuted,
    letterSpacing: 1.5,
  },
  divider: { height: 1, backgroundColor: "rgba(0,99,133,0.06)" },
  amountRow: {
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
  amountCenter: { flexDirection: "row", alignItems: "baseline", gap: 4 },
  amountInput: {
    fontSize: 52,
    fontWeight: "800",
    color: Colors.lightText,
    minWidth: 100,
    textAlign: "center",
    padding: 0,
  },
  amountUnit: { fontSize: 18, fontWeight: "600", color: Colors.lightTextSub },
  presets: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  preset: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "rgba(0,99,133,0.06)",
    borderWidth: 1,
    borderColor: "rgba(0,99,133,0.1)",
  },
  presetActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  presetText: { fontSize: 13, fontWeight: "600", color: Colors.lightTextSub },
  presetTextActive: { color: Colors.white },

  photoPickerRow: {
    flexDirection: "row",
    gap: 10,
  },
  photoBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: "rgba(0,99,133,0.06)",
    borderWidth: 1,
    borderColor: "rgba(0,99,133,0.12)",
    borderStyle: "dashed",
  },
  photoBtnText: { fontSize: 13, fontWeight: "600", color: Colors.primary },

  imagePreviewWrap: { position: "relative" },
  imagePreview: {
    width: "100%",
    height: 180,
    borderRadius: 14,
    backgroundColor: "rgba(0,99,133,0.06)",
  },
  removeImageBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: Colors.white,
    borderRadius: 13,
  },

  resultBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
  },
  resultBannerSuccess: { backgroundColor: "#f0fdf4", borderColor: "#bbf7d0" },
  resultBannerWarn: { backgroundColor: "#fffbeb", borderColor: "#fde68a" },
  resultText: { flex: 1, fontSize: 13, fontWeight: "600", lineHeight: 18 },
  resultTextSuccess: { color: "#15803d" },
  resultTextWarn: { color: "#92400e" },

  logBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 15,
  },
  logBtnText: { fontSize: 16, fontWeight: "700", color: Colors.white },

  mutedText: {
    fontSize: 13,
    color: Colors.lightTextMuted,
    textAlign: "center",
    paddingVertical: 12,
  },
  historyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,99,133,0.06)",
  },
  historyIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#e8f4fd",
    alignItems: "center",
    justifyContent: "center",
  },
  historyThumb: {
    width: 36,
    height: 36,
    borderRadius: 10,
  },
  historyAmount: { fontSize: 14, fontWeight: "600", color: Colors.lightText },
  historyLabel: {
    fontSize: 11,
    color: Colors.lightTextSub,
    fontStyle: "italic",
    marginTop: 1,
  },
  historyTime: { fontSize: 11, color: Colors.lightTextMuted, marginTop: 1 },
  historyBadge: {
    backgroundColor: "rgba(0,99,133,0.08)",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  historyBadgeText: { fontSize: 11, fontWeight: "600", color: Colors.primary },
  loadMoreBtn: { alignItems: "center", paddingVertical: 12, marginTop: 4 },
  loadMoreText: { fontSize: 13, fontWeight: "600", color: Colors.primary },
});
