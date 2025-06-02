import {
  StyleSheet,
  Text,
  View,
  Alert,
  Keyboard,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter, Link } from "expo-router";
import { useState } from "react";
import api from "../../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { loginAthlete } from "../../utils/apiServices";

const AthleteLogin = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async () => {
    if (!username || !password) {
      setErrorMessage("Both fields are required.");
      return;
    }

    try {
      const { loggedInUsername } = await loginAthlete(username, password);
      Alert.alert("Login Successful", `Welcome ${loggedInUsername}!`);
      router.push("/athleteProfile");

      setUsername("");
      setPassword("");
      setErrorMessage("");
    } catch (error: any) {
      setErrorMessage(error.message);
      Alert.alert("Login Failed", error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Text style={styles.title}>Athlete Login</Text>
          <Text style={styles.subtitle}>
            Enter your credentials to continue
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#6b7280"
            onChangeText={(text) => {
              setUsername(text);
              setErrorMessage("");
            }}
            value={username}
            autoCapitalize="none"
            accessibilityLabel="Username input"
            accessible={true}
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#6b7280"
            onChangeText={(text) => {
              setPassword(text);
              setErrorMessage("");
            }}
            value={password}
            secureTextEntry
            accessibilityLabel="Password input"
            accessible={true}
          />

          {errorMessage !== "" && (
            <Text style={styles.errorText}>{errorMessage}</Text>
          )}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.linkText}>
            Don’t have an account?{" "}
            <Link href="/athleteSignUp" asChild>
              <Text style={styles.link}>Sign Up</Text>
            </Link>
          </Text>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default AthleteLogin;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f2f4f7",
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 40,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 40,
    paddingHorizontal: 16,
  },
  input: {
    width: "100%",
    backgroundColor: "#ffffff",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    fontSize: 16,
    color: "#111827",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  buttonContainer: {
    width: "100%",
    gap: 20,
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#2563eb", // blue-600
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  linkText: {
    color: "#6b7280",
    fontSize: 14,
  },
  link: {
    color: "#2563eb",
    fontWeight: "600",
  },
  errorText: {
    color: "#dc2626",
    fontSize: 14,
    marginBottom: 12,
    textAlign: "center",
  },
});
