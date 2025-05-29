import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../utils/api"; // Axios instance with baseURL

const EditProfileScreen = () => {
  const [athleteId, setAthleteId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    age: "",
    level: "",
  });

  const fetchProfile = async () => {
    try {
      const idString = await AsyncStorage.getItem("athleteId");
      if (!idString) {
        Alert.alert("Error", "No athlete ID found.");
        return;
      }

      const id = parseInt(idString, 10);
      setAthleteId(id);

      const res = await api.get(`/athletes/${id}`);
      if (res.data) {
        const { first_name, last_name, email, age, level } = res.data;
        setFormData({
          first_name: first_name || "",
          last_name: last_name || "",
          email: email || "",
          age: age?.toString() || "",
          level: level || "",
        });
      }
    } catch (error) {
      console.error("Error fetching profile", error);
      Alert.alert("Error", "Could not fetch profile.");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
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

      const res = await api.put(`/athletes/${athleteId}`, filteredData);
      if (res.status === 200) {
        Alert.alert("Success", "Profile updated successfully!");
      } else {
        Alert.alert("Update failed", "Unexpected server response.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Could not update profile.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>

      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={formData.first_name}
        onChangeText={(value) => handleChange("first_name", value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={formData.last_name}
        onChangeText={(value) => handleChange("last_name", value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={formData.email}
        onChangeText={(value) => handleChange("email", value)}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Age"
        value={formData.age}
        onChangeText={(value) => handleChange("age", value)}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Level"
        value={formData.level}
        onChangeText={(value) => handleChange("level", value)}
      />

      <View style={styles.buttonContainer}>
        <Button title="Save Changes" onPress={handleSubmit} color="#007AFF" />
      </View>
    </ScrollView>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flexGrow: 1,
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
});
