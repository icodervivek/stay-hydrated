import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SvgXml } from "react-native-svg";
import { Colors } from "../constants/colors";
import { useAuthStore } from "../store/auth-store";
import { LOGO_HORIZONTAL_SVG, WELCOME_HERO_SVG } from "../constants/svg-assets";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, error } = useAuthStore();

  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }
    setLoading(true);

    try {
      await login(email.trim(), password);
    } catch (err) {
      Alert.alert("Login Failed", error || "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={["#EBF8FF", "#DBEAFE"]}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.inner}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
        >
          {/* Logo */}
          <View style={styles.logoContainer}>
            <SvgXml xml={LOGO_HORIZONTAL_SVG} width={220} height={55} />
          </View>

          {/* Hero illustration */}
          <View style={styles.heroCard}>
            <SvgXml xml={WELCOME_HERO_SVG} width={280} height={210} />
          </View>

          {/* Form card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Welcome back</Text>

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor="#94a3b8"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              placeholderTextColor="#94a3b8"
              secureTextEntry
            />

            {error && <Text style={styles.errorText}>{error}</Text>}

            <TouchableOpacity
              style={styles.button}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <Text style={styles.buttonText}>Log In</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/(auth)/register")}
              style={styles.link}
            >
              <Text style={styles.linkText}>
                Don't have an account?{" "}
                <Text style={styles.linkAccent}>Sign up</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: "center", padding: 24, gap: 16 },
  logoContainer: {
    alignItems: "center",
    alignSelf: "center",
  },
  heroCard: {
    borderRadius: 20,
    overflow: "hidden",
    alignSelf: "center",
    shadowColor: "#0ea5e9",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 5,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.78)",
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(14,165,233,0.15)",
    shadowColor: "#0ea5e9",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 4,
  },
  label: {
    color: "#475569",
    fontSize: 14,
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.7)",
    borderRadius: 10,
    padding: 14,
    color: "#1e293b",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "rgba(14,165,233,0.2)",
  },
  errorText: {
    color: Colors.error,
    fontSize: 13,
    marginTop: 10,
    textAlign: "center",
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 24,
  },
  buttonText: { color: Colors.white, fontWeight: "700", fontSize: 16 },
  link: { alignItems: "center", marginTop: 16 },
  linkText: { color: "#475569", fontSize: 14 },
  linkAccent: { color: "#0EA5E9", fontWeight: "600" },
});
