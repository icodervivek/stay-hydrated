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
import { LOGO_HORIZONTAL_SVG, GOAL_SETUP_SVG } from "../constants/svg-assets";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { register, error } = useAuthStore();
  const router = useRouter();

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert("Please fill in all fields");
      return;
    }
    if (password.length < 8) {
      Alert.alert("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    try {
      await register(name.trim(), email.trim(), password);
    } catch {
      // error already set in store
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={["#ECFEFF", "#DBEAFE"]}
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

          {/* Illustration */}
          <View style={styles.heroCard}>
            <SvgXml xml={GOAL_SETUP_SVG} width={240} height={240} />
          </View>

          {/* Form card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Create your account</Text>

            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              placeholderTextColor="#94a3b8"
            />

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
              placeholder="At least 8 characters"
              placeholderTextColor="#94a3b8"
              secureTextEntry
            />

            {error && <Text style={styles.errorText}>{error}</Text>}

            <TouchableOpacity
              style={styles.button}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <Text style={styles.buttonText}>Create Account</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.back()} style={styles.link}>
              <Text style={styles.linkText}>
                Already have an account?{" "}
                <Text style={styles.linkAccent}>Log in</Text>
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
  scroll: { padding: 24, paddingTop: 60, gap: 16 },
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
