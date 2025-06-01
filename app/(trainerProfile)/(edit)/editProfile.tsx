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
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../../utils/api"; // Your configured Axios instance
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const EditTrainerProfile = () => {
  const [trainerId, setTrainerId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    years_experience: "",
    bio: "",
  });

  useEffect(() => {
    fetchTrainerProfile();
  }, []);

  const fetchTrainerProfile = async () => {
    try {
      const idString = await AsyncStorage.getItem("trainerId");
      if (!idString) return Alert.alert("Error", "Trainer ID not found");

      const id = parseInt(idString, 10);
      setTrainerId(id);

      const res = await api.get(`/trainers/${id}`);
      if (res.data) {
        const {
          username,
          first_name,
          last_name,
          email,
          years_experience,
          bio,
        } = res.data;

        setFormData({
          username: username || "",
          first_name: first_name || "",
          last_name: last_name || "",
          email: email || "",
          years_experience: years_experience?.toString() || "",
          bio: bio || "",
        });
      }
    } catch (err) {
      console.error("Failed to load trainer", err);
      Alert.alert("Error", "Unable to load profile");
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      if (!trainerId) return;

      // Basic email validation (only if email is not empty)
      if (
        formData.email &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
      ) {
        return Alert.alert(
          "Invalid Email",
          "Please enter a valid email address."
        );
      }

      if (
        formData.years_experience &&
        isNaN(Number(formData.years_experience))
      ) {
        return Alert.alert(
          "Invalid Input",
          "Years of experience must be a number."
        );
      }

      const filteredData: { [key: string]: string | number } =
        Object.fromEntries(
          Object.entries(formData).filter(([_, val]) => val !== "")
        );

      if (filteredData.years_experience) {
        filteredData.years_experience = parseInt(
          filteredData.years_experience as string,
          10
        );
      }

      const res = await api.put(`/trainers/${trainerId}`, filteredData);

      if (res.status === 200) {
        Alert.alert("Success", "Profile updated!");
      } else {
        Alert.alert("Update failed", "Unexpected response.");
      }
    } catch (err) {
      console.error("Update error", err);
      Alert.alert("Error", "Failed to update trainer profile.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}>
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

            <TextInput
              style={styles.input}
              placeholder="Username"
              value={formData.username}
              onChangeText={(text) => handleChange("username", text)}
            />
            <TextInput
              style={styles.input}
              placeholder="First Name"
              value={formData.first_name}
              onChangeText={(text) => handleChange("first_name", text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Last Name"
              value={formData.last_name}
              onChangeText={(text) => handleChange("last_name", text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={formData.email}
              onChangeText={(text) => handleChange("email", text)}
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              placeholder="Years of Experience"
              value={formData.years_experience}
              onChangeText={(text) => handleChange("years_experience", text)}
              keyboardType="numeric"
            />
            <TextInput
              style={[styles.input, styles.bioInput]}
              placeholder="Bio"
              value={formData.bio}
              onChangeText={(text) => handleChange("bio", text)}
              multiline
            />

            <View style={styles.buttonContainer}>
              <Button
                title="Save Changes"
                onPress={handleSave}
                color="#007AFF"
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default EditTrainerProfile;

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
  scrollContainer: {
    padding: 20,
    flexGrow: 1,
  },
  bioInput: {
    height: 100,
  },
});
