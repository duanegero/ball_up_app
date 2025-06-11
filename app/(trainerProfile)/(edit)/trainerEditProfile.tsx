import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  ScrollView,
  SafeAreaView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
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
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator
                size={APP_ACTIVITY_INDICATOR_SIZE}
                color={APP_ACTIVITY_INDICATOR_COLOR}
              />
            </View>
          ) : (
            <ScrollView contentContainerStyle={styles.scrollContainer}>
              <View>
                <Pressable
                  onPress={() => router.back()}
                  accessibilityLabel="Go back"
                  hitSlop={10}>
                  <Ionicons name="chevron-back" size={24} color="#2563eb" />
                </Pressable>
              </View>
              <Text style={styles.title}>Edit Trainer Profile</Text>

              {error && (
                <Text style={styles.errorText} accessibilityLiveRegion="polite">
                  {error}
                </Text>
              )}

              <TextInput
                style={styles.input}
                placeholder="Username"
                value={formData.username}
                onChangeText={(text) => handleChange("username", text)}
                returnKeyType="next"
              />
              <TextInput
                style={styles.input}
                placeholder="First Name"
                value={formData.first_name}
                onChangeText={(text) => handleChange("first_name", text)}
                returnKeyType="next"
                autoCapitalize="words"
                autoCorrect
              />
              <TextInput
                style={styles.input}
                placeholder="Last Name"
                value={formData.last_name}
                onChangeText={(text) => handleChange("last_name", text)}
                returnKeyType="next"
                autoCapitalize="words"
                autoCorrect
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={formData.email}
                onChangeText={(text) => handleChange("email", text)}
                keyboardType="email-address"
                returnKeyType="next"
              />
              <TextInput
                style={styles.input}
                placeholder="Years of Experience"
                value={formData.years_experience}
                onChangeText={(text) => handleChange("years_experience", text)}
                keyboardType="numeric"
                returnKeyType="next"
              />
              <TextInput
                style={[styles.input, styles.bioInput]}
                placeholder="Bio"
                value={formData.bio}
                onChangeText={(text) => handleChange("bio", text)}
                multiline
                returnKeyType="next"
              />

              <View style={styles.buttonContainer}>
                <Button
                  title={submitting ? "Saving..." : "Save Changes"}
                  onPress={handleSubmit}
                  color="#007AFF"
                  disabled={submitting || loading}
                />
              </View>
            </ScrollView>
          )}
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default EditTrainerProfile;
