import { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { resetAthletePassword } from "../../utils/apiServices";

const AthletePasswordReset = () => {
  const params = useLocalSearchParams();

  const athleteIdParam = params.athleteId;

  const athleteUserIdFromParam =
    typeof athleteIdParam === "string"
      ? parseInt(athleteIdParam, 10)
      : Array.isArray(athleteIdParam) && athleteIdParam.length > 0
        ? parseInt(athleteIdParam[0], 10)
        : null;

  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [athleteUserId, setAthleteUserId] = useState<number | null>(
    athleteUserIdFromParam
  );

  useEffect(() => {
    // If no athleteUserId passed via param, try to get it from AsyncStorage
    if (athleteUserIdFromParam === null) {
      const getUserId = async () => {
        const idString = await AsyncStorage.getItem("athlete_user_id");
        const id = idString ? parseInt(idString, 10) : null;
        setAthleteUserId(id);
      };
      getUserId();
    }
  }, [athleteUserIdFromParam]);

  const handleSubmit = async () => {
    if (!athleteUserId) {
      setErrorMessage("User ID not found.");
      return;
    }

    if (!currentPassword || !newPassword) {
      setErrorMessage("Both fields are required.");
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage("New password must be at least 6 characters.");
      return;
    }

    try {
      setSubmitting(true);
      setErrorMessage("");

      // Replace this with your real API call
      await resetAthletePassword(athleteUserId, currentPassword, newPassword);

      Alert.alert("Success", "Your password has been updated.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      setErrorMessage("Password reset failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.inner}>
          <Text style={styles.title}>Reset Password</Text>

          {errorMessage ? (
            <Text style={styles.error} accessibilityLiveRegion="polite">
              {errorMessage}
            </Text>
          ) : null}

          <TextInput
            style={styles.input}
            placeholder="Current Password"
            secureTextEntry
            value={currentPassword}
            onChangeText={setCurrentPassword}
            accessibilityLabel="Current password"
          />
          <TextInput
            style={styles.input}
            placeholder="New Password"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
            accessibilityLabel="New password"
          />

          <View style={styles.buttonContainer}>
            {submitting ? (
              <ActivityIndicator size="small" color="#34C759" />
            ) : (
              <Button
                title="Save Password"
                onPress={handleSubmit}
                color="#2563eb"
                accessibilityLabel="Save new password"
              />
            )}
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default AthletePasswordReset;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  inner: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  buttonContainer: {
    marginTop: 8,
  },
  error: {
    color: "#FF3B30",
    marginBottom: 12,
    textAlign: "center",
  },
});
