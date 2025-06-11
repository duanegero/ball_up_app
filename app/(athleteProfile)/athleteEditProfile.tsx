//imports to use in app
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  ScrollView,
  Pressable,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "react-native-vector-icons/Ionicons";
import { router } from "expo-router";
import {
  fetchAthleteProfile,
  updateAthleteProfile,
} from "../../utils/apiServices";
import { styles } from "../../styles/athleteEditProfile.styles";
import {
  APP_ACTIVITY_INDICATOR_COLOR,
  APP_ACTIVITY_INDICATOR_SIZE,
} from "../../components/constants";

const EditProfileScreen = () => {
  //useState varibles
  const [athleteId, setAthleteId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    age: null as number | null,
    level: null as number | null,
  });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  //async function to fetch profile
  const fetchProfile = async () => {
    setLoading(true);
    try {
      const idString = await AsyncStorage.getItem("athleteId");
      if (!idString) {
        Alert.alert("Error", "No athlete ID found.");
        return;
      }

      const athlete_user_id = parseInt(idString, 10);
      setAthleteId(athlete_user_id);

      const data = await fetchAthleteProfile(athlete_user_id);
      const { first_name, last_name, email, age, level } = data;
      setFormData({
        first_name: first_name || "",
        last_name: last_name || "",
        email: email || "",
        age: typeof age === "number" ? age : parseInt(age, 10) || null,
        level: typeof level === "number" ? level : parseInt(level, 10) || null,
      });
    } catch (error) {
      console.error("Error fetching profile", error);
      Alert.alert("Error", "Could not fetch profile.");
    } finally {
      setLoading(false);
    }
  };

  //useEffect to call function
  useEffect(() => {
    fetchProfile();
  }, []);

  //async function to handle submit pressable
  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      if (!athleteId) return;

      //convert the formData object into an array of key-value pairs, then filter out entries
      const filteredData = Object.fromEntries(
        Object.entries(formData).filter(([_, value]) => {
          return (
            value !== null &&
            value !== undefined &&
            !(typeof value === "string" && value.trim() === "")
          );
        })
      ) as { [key: string]: string | number };

      if (Object.keys(filteredData).length === 0) {
        Alert.alert("No Changes", "Please update at least one field.");
        setSubmitting(false);
        return;
      }

      if (filteredData.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(filteredData.email as string)) {
          Alert.alert("Invalid Email", "Please enter a valid email address.");
          setSubmitting(false);
          return;
        }
      }

      if (
        typeof formData.age !== "number" ||
        isNaN(formData.age) ||
        formData.age <= 0 ||
        formData.age > 120
      ) {
        Alert.alert("Invalid Age", "Please enter a valid age.");
        setSubmitting(false);
        return;
      }

      const res = await updateAthleteProfile(athleteId, filteredData);
      if (res.status === 200) {
        Alert.alert("Success", "Profile updated successfully!", [
          { text: "OK", onPress: () => router.push("/athleteProfile") },
        ]);
      } else {
        Alert.alert("Update failed", "Unexpected server response.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Could not update profile.");
    } finally {
      setSubmitting(false);
    }
  };

  //function to handle change in form
  const handleChange = (field: string, value: string | number | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size={APP_ACTIVITY_INDICATOR_SIZE}
          color={APP_ACTIVITY_INDICATOR_COLOR}
        />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      accessibilityLabel="Edit Profile Form"
      accessibilityHint="Edit your profile details here">
      <View style={styles.backIconContainer}>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          accessibilityHint="Navigates to the previous screen">
          <Ionicons name="chevron-back" size={24} color="#2563eb" />
        </Pressable>
      </View>

      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContainer}>
        <Text
          style={styles.title}
          accessibilityRole="header"
          accessibilityLabel="Edit Profile">
          Edit Profile
        </Text>

        {/* First Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={styles.input}
            value={formData.first_name}
            onChangeText={(value) => handleChange("first_name", value)}
            placeholder="First Name"
            accessibilityLabel="First Name"
            accessibilityHint="Enter your first name"
          />
        </View>

        {/* Last Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={styles.input}
            value={formData.last_name}
            onChangeText={(value) => handleChange("last_name", value)}
            placeholder="Last Name"
            accessibilityLabel="Last Name"
            accessibilityHint="Enter your last name"
          />
        </View>

        {/* Email */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={formData.email}
            onChangeText={(value) => handleChange("email", value)}
            placeholder="Email"
            keyboardType="email-address"
            accessibilityLabel="Email"
            accessibilityHint="Enter your email address"
          />
        </View>

        {/* Age */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Age</Text>
          <TextInput
            style={styles.input}
            value={formData.age?.toString() || ""}
            onChangeText={(value) => {
              const num = parseInt(value, 10);
              handleChange("age", isNaN(num) ? null : num);
            }}
            placeholder="Age"
            keyboardType="numeric"
            accessibilityLabel="Age"
            accessibilityHint="Enter your age in numbers"
          />
        </View>

        {/* Level */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Level</Text>
          <TextInput
            style={styles.input}
            value={formData.level?.toString() || ""}
            onChangeText={(value) => {
              const num = parseInt(value, 10);
              if (/^[1-5]$/.test(value)) {
                handleChange("level", num);
              } else if (value === "") {
                handleChange("level", null);
              }
            }}
            placeholder="Level (1–5)"
            keyboardType="numeric"
            accessibilityLabel="Level"
            accessibilityHint="Enter your skill level from 1 to 5"
          />
        </View>

        {/* Save Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.saveButton,
              submitting && { backgroundColor: "#ccc" },
            ]}
            onPress={handleSubmit}
            disabled={submitting}
            accessibilityRole="button"
            accessibilityLabel="Save changes"
            accessibilityHint="Saves the form and updates your profile">
            <Text style={styles.saveButtonText}>
              {submitting ? "Saving..." : "Save Changes"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default EditProfileScreen;
