//imports to use in app
import { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Button,
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
import { styles } from "../../styles/athletePasswordReset.styles";

const AthletePasswordReset = () => {
  const params = useLocalSearchParams();

  //variable to handle id from params
  const athleteIdParam = params.athleteId;

  //converting the id from param to a number
  const athleteUserIdFromParam =
    typeof athleteIdParam === "string"
      ? parseInt(athleteIdParam, 10)
      : Array.isArray(athleteIdParam) && athleteIdParam.length > 0
        ? parseInt(athleteIdParam[0], 10)
        : null;

  //useState variables
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [athleteUserId, setAthleteUserId] = useState<number | null>(
    athleteUserIdFromParam
  );

  useEffect(() => {
    //if no athleteUserId passed via param, try to get it from AsyncStorage
    if (athleteUserIdFromParam === null) {
      const getUserId = async () => {
        const idString = await AsyncStorage.getItem("athlete_user_id");
        const id = idString ? parseInt(idString, 10) : null;
        setAthleteUserId(id);
      };
      getUserId();
    }
  }, [athleteUserIdFromParam]);

  //variable to handle submit press in form
  const handleSubmit = async () => {
    //checks to the data
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
