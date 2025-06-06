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
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.fullScreen}>
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
              autoCorrect={false}
              autoCapitalize="none"
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
              submitBehavior="blurAndSubmit"
              accessibilityLabel="Username input"
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
              accessibilityLabel="Password input"
            />

            {errorMessage !== "" && (
              <Text style={styles.errorText}>{errorMessage}</Text>
            )}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={buttonStyle}
                onPress={handleSubmit}
                disabled={submitting || !username || !password}
                accessibilityRole="button"
                accessible={true}
                accessibilityLabel="Login button"
                accessibilityHint="Attempts to log you in with entered credentials">
                <Text style={styles.buttonText}>
                  {submitting ? "Logging in..." : "Login"}
                </Text>
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
    </SafeAreaView>
  );
};

export default AthleteLogin;
