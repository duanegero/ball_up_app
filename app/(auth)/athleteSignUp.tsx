import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Alert,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import api from "../../utils/api";

const AthleteSignUp = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [first_name, setFirst_name] = useState("");
  const [last_name, setLast_name] = useState("");
  const [age, setAge] = useState("");
  const [level, setLevel] = useState("");

  const handleSubmit = async (): Promise<void> => {
    const age_number = parseInt(age, 10);
    const level_number = parseInt(level, 10);

    if (
      !email ||
      !username ||
      !password ||
      !first_name ||
      !last_name ||
      !age ||
      !level
    ) {
      Alert.alert("All fields are required.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert("Invalid email format.");
      return;
    }
    if (isNaN(age_number) || isNaN(level_number)) {
      Alert.alert("Age and Level must be numbers.");
      return;
    }

    try {
      const response = await api.post("/athletes", {
        email,
        username,
        password,
        first_name,
        last_name,
        age: age_number,
        level: level_number,
      });

      const { message, username: signedUpUsername } = response.data;

      Alert.alert(`${message} Username: ${signedUpUsername}`, "", [
        {
          text: "OK",
          onPress: () => router.replace("/athleteLogin"),
        },
      ]);

      setEmail("");
      setUsername("");
      setPassword("");
      setFirst_name("");
      setLast_name("");
      setAge("");
      setLevel("");
    } catch (error: any) {
      console.error("Sign up error:", error);
      const message =
        error.response?.data?.message || "An error occurred during sign up.";
      Alert.alert("Sign Up Failed", message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.wrapper}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Create Account</Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            onChangeText={(text) => setEmail(text.trim())}
            value={email}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#999"
          />

          <TextInput
            style={styles.input}
            placeholder="Username"
            onChangeText={(text) => setUsername(text.trim())}
            value={username}
            autoCapitalize="none"
            placeholderTextColor="#999"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            onChangeText={(text) => setPassword(text.trim())}
            value={password}
            secureTextEntry
            placeholderTextColor="#999"
          />

          <TextInput
            style={styles.input}
            placeholder="First Name"
            onChangeText={(text) => setFirst_name(text.trim())}
            value={first_name}
            autoCapitalize="words"
            placeholderTextColor="#999"
          />

          <TextInput
            style={styles.input}
            placeholder="Last Name"
            onChangeText={(text) => setLast_name(text.trim())}
            value={last_name}
            autoCapitalize="words"
            placeholderTextColor="#999"
          />

          <TextInput
            style={styles.input}
            placeholder="Age"
            onChangeText={setAge}
            value={age}
            keyboardType="numeric"
            placeholderTextColor="#999"
          />

          <TextInput
            style={styles.input}
            placeholder="Level"
            onChangeText={setLevel}
            value={level}
            keyboardType="numeric"
            placeholderTextColor="#999"
          />

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/athleteLogin")}>
            <Text style={{ color: "#0066cc", marginTop: 20 }}>
              Already have an account? Login
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default AthleteSignUp;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  container: {
    flexGrow: 1,
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "600",
    color: "#222",
    marginBottom: 30,
  },
  input: {
    width: "100%",
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: "#fff",
    color: "#333",
  },
  button: {
    width: "100%",
    padding: 16,
    backgroundColor: "#0066cc",
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});
