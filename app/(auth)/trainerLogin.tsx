//imports to use in app
import {
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
import { useRef, useState } from "react";
import { loginTrainer } from "../../utils/apiServices";
import { styles } from "../../styles/trainerLogin.styles";

const TrainerLogin = () => {
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
  const handleSubmit = async (): Promise<void> => {
    if (!username || !password) {
      setErrorMessage("Both fields are required.");
      return;
    }

    setSubmitting(true);
    try {
      const { loggedInUsername } = await loginTrainer(username, password);
      Alert.alert("Login Successful", `Welcome ${loggedInUsername}!`);
      router.push("/trainerProfile");

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
            <Text style={styles.title}>Trainer Access Portal</Text>
            <Text style={styles.subtitle}>
              Log in to manage and monitor athletes
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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default TrainerLogin;
