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
            onChangeText={setEmail}
            value={email}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#999"
          />

          <TextInput
            style={styles.input}
            placeholder="Username"
            onChangeText={setUsername}
            value={username}
            autoCapitalize="none"
            placeholderTextColor="#999"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            onChangeText={setPassword}
            value={password}
            secureTextEntry
            placeholderTextColor="#999"
          />

          <TextInput
            style={styles.input}
            placeholder="Firstname"
            onChangeText={setFirst_name}
            value={first_name}
            autoCapitalize="words"
            placeholderTextColor="#999"
          />

          <TextInput
            style={styles.input}
            placeholder="Lastname"
            onChangeText={setLast_name}
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
