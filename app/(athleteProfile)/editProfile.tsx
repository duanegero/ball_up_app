//imports to use in app
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
  SafeAreaView,
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

const EditProfileScreen = () => {
  const [athleteId, setAthleteId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    age: "",
    level: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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
        age: age?.toString() || "",
        level: level || "",
      });
    } catch (error) {
      console.error("Error fetching profile", error);
      Alert.alert("Error", "Could not fetch profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      if (!athleteId) return;

      const filteredData: { [key: string]: string | number } =
        Object.fromEntries(
          Object.entries(formData).filter(([_, value]) => value !== "")
        );

      if (filteredData.age) {
        const parsedAge = parseInt(filteredData.age as string, 10);
        if (!isNaN(parsedAge)) {
          filteredData.age = parsedAge;
        }
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

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}>
      <View style={styles.backIconContainer}>
        <Pressable onPress={() => router.push("/athleteProfile")}>
          <Ionicons name="chevron-back" size={24} color="#2563eb" />
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Edit Profile</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={styles.input}
            value={formData.first_name}
            onChangeText={(value) => handleChange("first_name", value)}
            placeholder="First Name"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={styles.input}
            value={formData.last_name}
            onChangeText={(value) => handleChange("last_name", value)}
            placeholder="Last Name"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={formData.email}
            onChangeText={(value) => handleChange("email", value)}
            placeholder="Email"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Age</Text>
          <TextInput
            style={styles.input}
            value={formData.age}
            onChangeText={(value) => handleChange("age", value)}
            placeholder="Age"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Level</Text>
          <TextInput
            style={styles.input}
            value={formData.level}
            onChangeText={(value) => {
              // Allow only numbers 1 to 5
              if (/^[1-5]$/.test(value) || value === "") {
                handleChange("level", value);
              }
            }}
            placeholder="Level (1–5)"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.saveButton,
              submitting && { backgroundColor: "#ccc" },
            ]}
            onPress={handleSubmit}
            disabled={submitting}>
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

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    alignSelf: "center",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 15,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 10,
  },
  backIconContainer: {
    marginTop: Platform.OS === "ios" ? 50 : 20,
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  inputGroup: {
    marginBottom: 15,
  },

  label: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
    fontWeight: "500",
  },
  scrollContainer: {
    padding: 20,
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
