import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  ScrollView,
  SafeAreaView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  updateTrainerProfile,
  fetchTrainerProfile,
} from "../../../utils/apiServices";
import {
  TrainerUpdatePayload,
  TrainerFormData,
} from "../../../components/types";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import {
  APP_ACTIVITY_INDICATOR_COLOR,
  APP_ACTIVITY_INDICATOR_SIZE,
} from "../../../components/constants";
import { styles } from "../../../styles/trainerEditProfile.styles";

const EditTrainerProfile = () => {
  //useState variable
  const [trainerId, setTrainerId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<TrainerFormData>({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    years_experience: "",
    bio: "",
  });

  //async function to fetch the trianer profile
  const fetchTrainerProfileFromAPI = async () => {
    setLoading(true);
    setError(null);
    try {
      const idString = await AsyncStorage.getItem("trainerId");

      if (!idString) {
        setLoading(false);
        setError("Trainer ID not found");
        return;
      }

      const trainer_user_id = parseInt(idString, 10);
      setTrainerId(trainer_user_id);

      const data = await fetchTrainerProfile(trainer_user_id);
      if (data) {
        setFormData({
          username: data.username || "",
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          email: data.email || "",
          years_experience: data.years_experience?.toString() || "",
          bio: data.bio || "",
        });
      }
    } catch (err) {
      console.error("Failed to load trainer", err);
      setError("Unable to load profile");
    } finally {
      setLoading(false);
    }
  };

  //useFocusEffect runs everytime screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchTrainerProfileFromAPI();
    }, [])
  );

  //function to handle change in the form
  const handleChange = (field: keyof TrainerFormData, value: string) => {
    if (error) setError(null);
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  //async function to handle user submit
  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      //checking the data
      if (!trainerId) {
        setError("Trainer ID is missing. Please reload the app.");
        return;
      }

      if (
        formData.email &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
      ) {
        setError("Please enter a valid email address.");
        setSubmitting(false);
        return;
      }

      if (
        formData.years_experience &&
        isNaN(Number(formData.years_experience))
      ) {
        setError("Years of experience must be a number.");
        setSubmitting(false);
        return;
      }

      //handling the data
      const rawData = {
        ...formData,
        years_experience:
          formData.years_experience.trim() !== ""
            ? parseInt(formData.years_experience, 10)
            : undefined,
      };

      //trim and filter the data
      const trimmedData = Object.fromEntries(
        Object.entries(rawData).map(([key, val]) => [
          key,
          typeof val === "string" ? val.trim() : val,
        ])
      );

      const filteredData: TrainerUpdatePayload = Object.fromEntries(
        Object.entries(trimmedData).filter(
          ([_, val]) => val !== "" && val !== undefined
        )
      ) as TrainerUpdatePayload;

      //check the filtered data
      if (Object.keys(filteredData).length === 0) {
        setError("Please change at least one field before saving.");
        setSubmitting(false);
        return;
      }

      const res = await updateTrainerProfile(trainerId, filteredData);

      if (res.status === 200) {
        Alert.alert("Success", "Profile updated!", [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]);
      } else {
        setError("Unexpected response.");
      }
    } catch (err: any) {
      console.error("Update error", err);
      const message =
        err.response?.data?.message || "Failed to update trainer profile.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView
      style={styles.container}
      accessibilityLabel="Edit Trainer Profile screen">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}>
          {loading ? (
            <View
              style={styles.loadingContainer}
              accessibilityRole="alert"
              accessibilityLabel="Loading edit profile screen"
              accessibilityLiveRegion="assertive">
              <ActivityIndicator
                size={APP_ACTIVITY_INDICATOR_SIZE}
                color={APP_ACTIVITY_INDICATOR_COLOR}
                accessibilityLabel="Loading"
              />
            </View>
          ) : (
            <ScrollView contentContainerStyle={styles.scrollContainer}>
              <View>
                <Pressable
                  onPress={() => router.back()}
                  accessibilityRole="button"
                  accessibilityLabel="Go back to previous screen"
                  hitSlop={10}>
                  <Ionicons name="chevron-back" size={24} color="#2563eb" />
                </Pressable>
              </View>

              <Text
                style={styles.title}
                accessibilityRole="header"
                accessibilityLabel="Edit Trainer Profile">
                Edit Trainer Profile
              </Text>

              {error && (
                <Text
                  style={styles.errorText}
                  accessibilityRole="alert"
                  accessibilityLiveRegion="polite"
                  accessibilityLabel={`Error: ${error}`}>
                  {error}
                </Text>
              )}

              <TextInput
                style={styles.input}
                placeholder="Username"
                value={formData.username}
                onChangeText={(text) => handleChange("username", text)}
                returnKeyType="next"
                accessible={true}
                accessibilityLabel="Username input"
                accessibilityHint="Enter your username"
                importantForAccessibility="yes"
                autoComplete="username"
                textContentType="username"
              />
              <TextInput
                style={styles.input}
                placeholder="First Name"
                value={formData.first_name}
                onChangeText={(text) => handleChange("first_name", text)}
                returnKeyType="next"
                autoCapitalize="words"
                autoCorrect
                accessible={true}
                accessibilityLabel="First Name input"
                accessibilityHint="Enter your first name"
                importantForAccessibility="yes"
                autoComplete="name-given"
                textContentType="givenName"
              />
              <TextInput
                style={styles.input}
                placeholder="Last Name"
                value={formData.last_name}
                onChangeText={(text) => handleChange("last_name", text)}
                returnKeyType="next"
                autoCapitalize="words"
                autoCorrect
                accessible={true}
                accessibilityLabel="Last Name input"
                accessibilityHint="Enter your last name"
                importantForAccessibility="yes"
                autoComplete="name-family"
                textContentType="familyName"
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={formData.email}
                onChangeText={(text) => handleChange("email", text)}
                keyboardType="email-address"
                returnKeyType="next"
                accessible={true}
                accessibilityLabel="Email input"
                accessibilityHint="Enter your email address"
                importantForAccessibility="yes"
                autoComplete="email"
                textContentType="emailAddress"
              />
              <TextInput
                style={styles.input}
                placeholder="Years of Experience"
                value={formData.years_experience}
                onChangeText={(text) => handleChange("years_experience", text)}
                keyboardType="numeric"
                returnKeyType="next"
                accessible={true}
                accessibilityLabel="Years of experience input"
                accessibilityHint="Enter your years of experience"
                importantForAccessibility="yes"
                autoComplete="off"
                textContentType="none"
              />
              <TextInput
                style={[styles.input, styles.bioInput]}
                placeholder="Bio"
                value={formData.bio}
                onChangeText={(text) => handleChange("bio", text)}
                multiline
                returnKeyType="done"
                accessible={true}
                accessibilityLabel="Bio input"
                accessibilityHint="Enter your biography or description"
                importantForAccessibility="yes"
                textContentType="none"
              />

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[
                    styles.saveButton,
                    submitting && { backgroundColor: "#ccc" },
                  ]}
                  onPress={handleSubmit}
                  disabled={submitting || loading}
                  accessibilityLabel={
                    submitting ? "Saving changes" : "Save changes"
                  }
                  accessibilityState={{
                    disabled: submitting || loading,
                    busy: submitting,
                  }}>
                  <Text style={styles.saveButtonText}>
                    {submitting ? "Saving..." : "Save Changes"}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.updateButton}
                  onPress={() => router.push("/(auth)/trainerPasswordReset")}
                  accessibilityRole="button"
                  accessibilityLabel="Change password"
                  accessibilityHint="Navigates to the password reset screen">
                  <Text style={styles.updateButtonText}>Update Password</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default EditTrainerProfile;
