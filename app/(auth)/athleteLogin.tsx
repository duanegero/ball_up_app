//imports to use in app
import {
  Text,
  View,
  Alert,
  Keyboard,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native";
import { useRouter, Link } from "expo-router";
import { useState, useRef } from "react";

import { loginAthlete } from "../../utils/apiServices";
import { styles } from "../../styles/athleteLogin.styles";

const AthleteLogin = () => {
  //useState variables
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  //create a reference to the password text input
  const passwordRef = useRef<TextInput>(null);

  //variable to handle the state of button
  const buttonStyle =
    submitting || !username || !password
      ? [styles.button, styles.buttonDisabled]
      : styles.button;

  //async function to handle submit pressable
  const handleSubmit = async () => {
    if (!username || !password) {
      setErrorMessage("Both fields are required.");
      return;
    }
    setSubmitting(true);
    try {
      const { loggedInUsername } = await loginAthlete(username, password);
      Alert.alert("Login Successful", `Welcome ${loggedInUsername}!`);
      router.push("/athleteProfile");
      setUsername("");
      setPassword("");
      setErrorMessage("");
    } catch (error: any) {
      if (error.response?.status === 401) {
        setErrorMessage("Invalid username or password.");
      } else {
        setErrorMessage("Something went wrong. Please try again.");
        Alert.alert(
          "Login Failed",
          error?.message || "Unexpected error occurred."
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView
      style={styles.safeArea}
      accessibilityRole="summary"
      accessibilityLabel="Athlete login screen"
      accessibilityHint="Allows athletes to log in with their credentials">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.fullScreen}>
        <TouchableWithoutFeedback
          onPress={Keyboard.dismiss}
          accessible={false} // disables this from being a focusable accessibility element
        >
          <View
            style={styles.container}
            accessibilityLabel="Login form"
            accessibilityHint="Enter your username and password to log in">
            <Text
              style={styles.title}
              accessibilityRole="header"
              accessibilityLabel="Athlete Login">
              Athlete Login
            </Text>

            <Text
              style={styles.subtitle}
              accessibilityLabel="Enter your credentials to continue">
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
              autoCorrect={false}
              autoCapitalize="none"
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
              submitBehavior="blurAndSubmit"
              accessibilityLabel="Username input field"
              accessibilityHint="Enter your athlete username"
              accessibilityRole="text"
            />

            <TextInput
              ref={passwordRef}
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#6b7280"
              onChangeText={(text) => {
                setPassword(text);
                setErrorMessage("");
              }}
              value={password}
              secureTextEntry
              textContentType="password"
              autoComplete="password"
              returnKeyType="done"
              onSubmitEditing={handleSubmit}
              accessibilityLabel="Password input field"
              accessibilityHint="Enter your athlete password"
              accessibilityRole="text"
            />

            {errorMessage !== "" && (
              <Text
                style={styles.errorText}
                accessibilityRole="alert"
                accessibilityLabel={`Login error: ${errorMessage}`}>
                {errorMessage}
              </Text>
            )}

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={buttonStyle}
                onPress={handleSubmit}
                disabled={submitting || !username || !password}
                accessibilityRole="button"
                accessibilityLabel="Login"
                accessibilityHint="Attempts to log you in with the provided credentials">
                <Text style={styles.buttonText}>
                  {submitting ? "Logging in..." : "Login"}
                </Text>
              </TouchableOpacity>
            </View>

            <Text
              style={styles.linkText}
              accessibilityLabel="Don't have an account?"
              accessibilityHint="Navigate to the sign up screen">
              Don’t have an account?{" "}
              <Link href="/athleteSignUp" asChild>
                <Text
                  style={styles.link}
                  accessibilityRole="link"
                  accessibilityLabel="Sign Up"
                  accessibilityHint="Navigates to the athlete registration page">
                  Sign Up
                </Text>
              </Link>
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AthleteLogin;
