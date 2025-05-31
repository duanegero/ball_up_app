import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput,
  Modal,
  TouchableOpacity,
} from "react-native";
import api from "../../utils/api";
import Ionicons from "react-native-vector-icons/Ionicons";

type DrillResponse = {
  message: string;
  newDrill: {
    drill_id: number;
    drill_name: string;
    drill_type: string;
    description: string;
    level: number;
    trainer_user_id: number;
    created_at: string; // or `Date` if you want to parse it
  };
};

const DRILL_TYPES = [
  { label: "Warm-Up", value: "warmup" },
  { label: "Shooting", value: "shoot" },
  { label: "Passing", value: "pass" },
  { label: "Dribbling", value: "dribble" },
  { label: "Rebound/Defence", value: "reb_defence" },
];

const LEVELS = [1, 2, 3, 4, 5];

const CreateDrill: React.FC = () => {
  const router = useRouter();

  const [drill_type, setDrill_type] = useState("");
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [level, setLevel] = useState<number | null>(null);
  const [description, setDescription] = useState("");
  const [drill_name, setDrill_name] = useState("");

  const handleSubmit = async (): Promise<void> => {
    if (!drill_type || !description || !level || !drill_name) {
      Alert.alert("Please fill out all fields before submitting.");
      return;
    }

    const idString = await AsyncStorage.getItem("trainerId");

    if (!idString) {
      console.warn("No trainer ID found.");
      return;
    }

    const trainer_user_id = parseInt(idString, 10);

    try {
      const response = await api.post<DrillResponse>("/drills", {
        drill_type,
        level,
        description,
        trainer_user_id,
        drill_name,
      });

      Alert.alert(
        "New Drill Created",
        `Type: ${response.data.newDrill.drill_type}`
      );

      setDescription("");
      setDrill_type("");
      setLevel(null);
      setDrill_name("");
      router.push("/trainerDrills");
    } catch (error: any) {
      console.error(
        "Create drill error:",
        error?.response?.data || error.message
      );
      const message =
        error.response?.data?.message ||
        "An error occurred during creating new drill.";
      Alert.alert("Create Drill Failed", message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View>
              <Pressable onPress={() => router.push("/trainerDrills")}>
                <Ionicons name="chevron-back" size={24} color="#2563eb" />
              </Pressable>
            </View>
            <Text style={styles.title}>Create Drill</Text>

            <Text style={styles.label}>Drill Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Drill Name"
              value={drill_name}
              onChangeText={setDrill_name}
            />

            <Text style={styles.label}>Drill Type</Text>
            <Pressable
              onPress={() => setShowTypeModal(true)}
              style={styles.modalSelector}>
              <Text style={{ color: drill_type ? "#000" : "#aaa" }}>
                {drill_type
                  ? `Drill Type: ${
                      DRILL_TYPES.find((d) => d.value === drill_type)?.label
                    }`
                  : "Select Drill Type..."}
              </Text>
            </Pressable>

            <Modal visible={showTypeModal} transparent animationType="slide">
              <View style={styles.modalOverlay}>
                <TouchableWithoutFeedback
                  onPress={() => setShowTypeModal(false)}>
                  <View style={{ flex: 1 }} />
                </TouchableWithoutFeedback>

                <View style={styles.modalContent}>
                  {DRILL_TYPES.map((type) => (
                    <TouchableOpacity
                      key={type.value}
                      onPress={() => {
                        setDrill_type(type.value);
                        setShowTypeModal(false);
                      }}
                      style={styles.modalOption}>
                      <Text>{type.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </Modal>

            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="A short description of the drill"
              value={description}
              onChangeText={setDescription}
              multiline
            />

            <Text style={styles.label}>Level</Text>
            <View style={styles.segmentContainer}>
              {LEVELS.map((lvl) => (
                <Pressable
                  key={lvl}
                  onPress={() => setLevel(lvl)}
                  style={[
                    styles.segmentButton,
                    level === lvl && styles.segmentSelected,
                  ]}>
                  <Text
                    style={[
                      styles.segmentText,
                      level === lvl && styles.segmentTextSelected,
                    ]}>
                    {lvl}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Pressable
              onPress={handleSubmit}
              style={({ pressed }) => [
                styles.button,
                pressed && { opacity: 0.7 },
              ]}>
              <Text style={styles.buttonText}>Submit</Text>
            </Pressable>
          </ScrollView>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default CreateDrill;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
    color: "#111",
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 6,
    marginTop: 10,
    color: "#333",
  },
  input: {
    backgroundColor: "#F1F1F1",
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    marginBottom: 16,
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
  modalSelector: {
    backgroundColor: "#F1F1F1",
    padding: 14,
    borderRadius: 8,
    marginBottom: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
    paddingHorizontal: 40,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  modalOption: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
  segmentContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  segmentButton: {
    flex: 1,
    backgroundColor: "#E0E0E0",
    marginHorizontal: 4,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  segmentSelected: {
    backgroundColor: "#3D7BF7",
  },
  segmentText: {
    color: "#333",
    fontWeight: "500",
  },
  segmentTextSelected: {
    color: "#fff",
  },
  button: {
    backgroundColor: "#3D7BF7",
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 12,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    textTransform: "uppercase",
  },
});
