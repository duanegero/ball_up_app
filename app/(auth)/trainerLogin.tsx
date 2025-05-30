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
} from "react-native";
import { useRouter, Link } from "expo-router";
import { useState } from "react";
import api from "../../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TrainerLogin = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (): Promise<void> => {
    try {
      const response = await api.post("/trainer_login", {
        username,
        password,
      });

      const {
        token,
        username: loggedInUsername,
        trainer_user_id,
      } = response.data;

      await AsyncStorage.setItem("trainerToken", token);
      await AsyncStorage.setItem("trainerId", trainer_user_id.toString());

      Alert.alert("Login Successful", `Welcome ${loggedInUsername}!`);
      router.push("/trainerProfile");

      setUsername("");
      setPassword("");
    } catch (error: any) {
      console.error("Login error:", error);
      const message =
        error.response?.data?.message || "An error occurred during login.";
      Alert.alert("Login Failed", message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Text style={styles.title}>Trainer Access Portal</Text>
          <Text style={styles.subtitle}>
            Log in to manage and monitor athletes
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#6b7280"
            onChangeText={setUsername}
            value={username}
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#6b7280"
            onChangeText={setPassword}
            value={password}
            secureTextEntry
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.linkText}>
            Don’t have an account?{" "}
            <Link href="/trainerSignUp" style={styles.link}>
              Sign Up
            </Link>
          </Text>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default TrainerLogin;

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
    textAlign: "center",
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
    backgroundColor: "#2563eb",
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
});
