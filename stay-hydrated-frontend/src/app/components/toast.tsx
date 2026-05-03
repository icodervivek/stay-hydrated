import { useCallback, useRef, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "../constants/colors";

type ToastType = "success" | "error" | "info";

type ToastState = {
  visible: boolean;
  type: ToastType;
  title: string;
  message?: string;
};

const CONFIG: Record<ToastType, { icon: string; bg: string; border: string; iconColor: string; titleColor: string }> = {
  success: {
    icon: "checkmark-circle",
    bg: "#f0fdf4",
    border: "#bbf7d0",
    iconColor: "#22c55e",
    titleColor: "#15803d",
  },
  error: {
    icon: "close-circle",
    bg: "#fff1f2",
    border: "#fecdd3",
    iconColor: "#ef4444",
    titleColor: "#b91c1c",
  },
  info: {
    icon: "information-circle",
    bg: "#eff6ff",
    border: "#bfdbfe",
    iconColor: Colors.primary,
    titleColor: Colors.primaryDark,
  },
};

export function useToast() {
  const [state, setState] = useState<ToastState>({
    visible: false,
    type: "info",
    title: "",
  });
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const insets = useSafeAreaInsets();

  const show = useCallback(
    (type: ToastType, title: string, message?: string) => {
      if (timerRef.current) clearTimeout(timerRef.current);

      setState({ visible: true, type, title, message });
      slideAnim.setValue(-100);
      opacityAnim.setValue(0);

      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          speed: 20,
          bounciness: 6,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      timerRef.current = setTimeout(() => {
        Animated.parallel([
          Animated.timing(slideAnim, {
            toValue: -100,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
          }),
        ]).start(() => setState((s) => ({ ...s, visible: false })));
      }, 3000);
    },
    []
  );

  const toast = {
    success: (title: string, message?: string) => show("success", title, message),
    error: (title: string, message?: string) => show("error", title, message),
    info: (title: string, message?: string) => show("info", title, message),
  };

  const cfg = CONFIG[state.type];

  const ToastOverlay = state.visible ? (
    <Animated.View
      style={[
        toastStyles.container,
        { top: insets.top + 12, opacity: opacityAnim, transform: [{ translateY: slideAnim }] },
        { backgroundColor: cfg.bg, borderColor: cfg.border },
      ]}
      pointerEvents="none"
    >
      <Ionicons name={cfg.icon as any} size={22} color={cfg.iconColor} />
      <View style={{ flex: 1 }}>
        <Text style={[toastStyles.title, { color: cfg.titleColor }]}>{state.title}</Text>
        {!!state.message && (
          <Text style={toastStyles.message}>{state.message}</Text>
        )}
      </View>
    </Animated.View>
  ) : null;

  return { toast, ToastOverlay };
}

const toastStyles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 16,
    right: 16,
    zIndex: 999,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  title: { fontSize: 14, fontWeight: "700" },
  message: { fontSize: 12, color: Colors.lightTextSub, marginTop: 2 },
});
