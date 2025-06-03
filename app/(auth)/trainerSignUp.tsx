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

import { signUpTrainer } from "../../utils/apiServices";

const TrainerSignUp = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [first_name, setFirst_name] = useState("");
  const [last_name, setLast_name] = useState("");
  const [years_experience, setYears_experience] = useState("");
  const [bio, setBio] = useState("");

  const handleSubmit = async () => {
    const years_experience_number = parseInt(years_experience, 10);

    if (
      !email ||
      !username ||
      !password ||
      !first_name ||
      !last_name ||
      !years_experience ||
      !bio
    ) {
      Alert.alert("All fields are required.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert("Invalid email format.");
      return;
    }

    if (isNaN(years_experience_number)) {
      Alert.alert("Years of experience must be numbers.");
      return;
    }
    try {
      const response = await signUpTrainer({
        email,
        username,
        password,
        first_name,
        last_name,
        years_experience: years_experience_number,
        bio,
      });

      const { message, username: signedUpUsername } = response;

      Alert.alert(`${message} Username: ${signedUpUsername}`, "", [
        {
          text: "OK",
          onPress: () => router.replace("/trainerLogin"),
        },
      ]);

      setEmail("");
      setUsername("");
      setPassword("");
      setFirst_name("");
      setLast_name("");
      setYears_experience("");
      setBio("");
    } catch (error: any) {
      Alert.alert("Sign Up Failed", error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Trainer Sign Up</Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            onChangeText={(text) => setEmail(text.trim())}
            value={email}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Username"
            onChangeText={(text) => setUsername(text.trim())}
            value={username}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            onChangeText={(text) => setPassword(text.trim())}
            value={password}
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            placeholder="First Name"
            onChangeText={(text) => setFirst_name(text.trim())}
            value={first_name}
            autoCapitalize="words"
          />
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            onChangeText={(text) => setLast_name(text.trim())}
            value={last_name}
            autoCapitalize="words"
          />
          <TextInput
            style={styles.input}
            placeholder="Years Experience"
            onChangeText={setYears_experience}
            value={years_experience}
            keyboardType="numeric"
          />
          <TextInput
            style={[styles.input, styles.bioInput]}
            placeholder="Bio"
            onChangeText={setBio}
            value={bio}
            multiline
            numberOfLines={4}
          />

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default TrainerSignUp;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 26,
    fontWeight: "600",
    marginBottom: 32,
    color: "#333",
  },
  input: {
    width: "100%",
    padding: 14,
    marginBottom: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    fontSize: 16,
  },
  bioInput: {
    height: 100,
    textAlignVertical: "top",
  },
  button: {
    width: "100%",
    backgroundColor: "#2f80ed",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});
