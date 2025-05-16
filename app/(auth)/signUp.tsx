import {
  StyleSheet,
  Text,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Link, useRouter } from "expo-router";
import ThemedContainer from "../../components/ThemedContainer";
import ThemedTitle from "../../components/ThemedTitle";
import ThemedButton from "../../components/ThemedButton";
import ThemedTextInput from "../../components/ThemedTextInput";
import ThemedLink from "../../components/ThemedLink";
import { useState } from "react";
import Spacer from "../../components/Spacer";
import api from "../../utils/api";

const SignUp = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [first_name, setFirst_name] = useState("");
  const [last_name, setLast_name] = useState("");
  const [years_experience, setYears_experience] = useState("");
  const [bio, setBio] = useState("");

  const handleSubmit = async (): Promise<void> => {
    const years_experience_number = parseInt(years_experience, 10);

    try {
      const response: {
        data: {
          message: string;
          username: string;
        };
      } = await api.post("/trainers", {
        email,
        username,
        password,
        first_name,
        last_name,
        years_experience: years_experience_number,
        bio,
      });

      const { message, username: signedUpUsername } = response.data;

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
      //catch log and alert any errors
      console.error("Sign up error:", error);
      const message =
        error.response?.data?.message || "An error occurred during sign up.";
      Alert.alert("Sign Up Failed", message);
    }

    console.log(
      "Sign Up Pressed",
      email,
      username,
      password,
      first_name,
      last_name,
      years_experience_number,
      bio
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled">
          <ThemedContainer>
            <ThemedTitle>Sign Up</ThemedTitle>

            <Spacer height={20} />

            <ThemedTextInput
              style={{ width: "80%", marginBottom: 20 }}
              placeholder="Email"
              onChangeText={setEmail}
              value={email}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <ThemedTextInput
              style={{ width: "80%", marginBottom: 20 }}
              placeholder="Username"
              onChangeText={setUsername}
              value={username}
              autoCapitalize="none"
            />

            <ThemedTextInput
              style={{ width: "80%", marginBottom: 20 }}
              placeholder="Password"
              onChangeText={setPassword}
              value={password}
              secureTextEntry
            />

            <ThemedTextInput
              style={{ width: "80%", marginBottom: 20 }}
              placeholder="Firstname"
              onChangeText={setFirst_name}
              value={first_name}
              autoCapitalize="words"
            />

            <ThemedTextInput
              style={{ width: "80%", marginBottom: 20 }}
              placeholder="Lastname"
              onChangeText={setLast_name}
              value={last_name}
              autoCapitalize="words"
            />

            <ThemedTextInput
              style={{ width: "80%", marginBottom: 20 }}
              placeholder="Years Experience"
              onChangeText={setYears_experience}
              value={years_experience}
              keyboardType="numeric"
            />

            <ThemedTextInput
              style={{
                width: "80%",
                marginBottom: 20,
                height: 80,
                textAlignVertical: "top",
              }}
              placeholder="Bio"
              onChangeText={setBio}
              value={bio}
            />

            <ThemedButton onPress={handleSubmit}>
              <Text style={{ color: "white" }}>Sign Up</Text>
            </ThemedButton>

            {/* <Link href={"/login"} style={styles.link}>
          Login Page
        </Link> */}
          </ThemedContainer>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default SignUp;
const styles = StyleSheet.create({});
