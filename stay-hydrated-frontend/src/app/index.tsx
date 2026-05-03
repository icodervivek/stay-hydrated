import { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { SvgXml } from "react-native-svg";
import * as SplashScreen from "expo-splash-screen";
import { useAuthStore } from "./store/auth-store";
import { APP_ICON_SVG } from "./constants/svg-assets";

export default function Index() {
  const { isAuthenticated, isLoading } = useAuthStore();
  const [animDone, setAnimDone] = useState(false);

  const logoScale = useSharedValue(0.3);
  const logoOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(28);
  const textOpacity = useSharedValue(0);
  const taglineOpacity = useSharedValue(0);
  const screenOpacity = useSharedValue(1);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTranslateY.value }],
  }));

  const taglineStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
  }));

  const screenStyle = useAnimatedStyle(() => ({
    opacity: screenOpacity.value,
  }));

  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {});
    logoScale.value = withSpring(1, { damping: 9, stiffness: 70 });
    logoOpacity.value = withTiming(1, { duration: 550 });
    textOpacity.value = withDelay(380, withTiming(1, { duration: 480 }));
    textTranslateY.value = withDelay(380, withSpring(0, { damping: 14, stiffness: 100 }));
    taglineOpacity.value = withDelay(680, withTiming(1, { duration: 500 }));
  }, []);

  useEffect(() => {
    if (isLoading) return;
    const timer = setTimeout(() => {
      screenOpacity.value = withTiming(0, { duration: 360 }, (finished) => {
        if (finished) runOnJS(setAnimDone)(true);
      });
    }, 1800);
    return () => clearTimeout(timer);
  }, [isLoading]);

  if (animDone) {
    return <Redirect href={isAuthenticated ? "/(tabs)" : "/(auth)/login"} />;
  }

  return (
    <Animated.View style={[StyleSheet.absoluteFill, screenStyle]}>
      <LinearGradient
        colors={["#0C7DBF", "#0EA5E9", "#22D3EE", "#67E8F9"]}
        start={{ x: 0.15, y: 0 }}
        end={{ x: 0.85, y: 1 }}
        style={styles.container}
      >
        <View style={styles.circle1} />
        <View style={styles.circle2} />
        <View style={styles.circle3} />

        <Animated.View style={[styles.logoWrap, logoStyle]}>
          <SvgXml xml={APP_ICON_SVG} width={148} height={148} />
        </Animated.View>

        <Animated.Text style={[styles.appName, textStyle]}>
          Stay Hydrated
        </Animated.Text>

        <Animated.Text style={[styles.tagline, taglineStyle]}>
          DRINK · TRACK · GLOW
        </Animated.Text>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 18,
  },
  circle1: {
    position: "absolute",
    width: 340,
    height: 340,
    borderRadius: 170,
    backgroundColor: "rgba(255,255,255,0.07)",
    top: -80,
    right: -90,
  },
  circle2: {
    position: "absolute",
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "rgba(255,255,255,0.05)",
    bottom: 30,
    left: -70,
  },
  circle3: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(255,255,255,0.06)",
    top: "40%",
    right: -30,
  },
  logoWrap: {
    borderRadius: 36,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.22,
    shadowRadius: 22,
    elevation: 14,
  },
  appName: {
    fontSize: 36,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.5,
    textShadowColor: "rgba(0,0,0,0.18)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  tagline: {
    fontSize: 12,
    fontWeight: "600",
    color: "rgba(255,255,255,0.72)",
    letterSpacing: 3.5,
    marginTop: -4,
  },
});
