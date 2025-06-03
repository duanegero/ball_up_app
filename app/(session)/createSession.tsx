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
} from "react-native";
import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import Ionicons from "react-native-vector-icons/Ionicons";
import { createSession } from "../../utils/apiServices";

const CreateSession = () => {
  const router = useRouter();

  const [length, setLength] = useState<number | null>(null);
  const [level, setLevel] = useState<number | null>(null);
  const [session_name, setSession_name] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (): Promise<void> => {
    const trimmedName = session_name.trim();

    if (length === null || level === null || !trimmedName) {
      Alert.alert("Please fill out all fields before submitting.");
      return;
    }

    const idString = await AsyncStorage.getItem("trainerId");
    if (!idString) {
      console.warn("No trainer ID found.");
      return;
    }

    const trainer_user_id = parseInt(idString, 10);

    setLoading(true);

    try {
      await createSession({
        length,
        level,
        session_name: trimmedName,
        trainer_user_id,
      });

      Alert.alert("New Session Created");
      setSession_name("");
      router.push("/trainerSession");
    } catch (error: any) {
      console.error("Create session error:", error);
      const message =
        error.response?.data?.message ||
        "An error occurred while creating a session.";
      Alert.alert("Create Session Failed", message);
    } finally {
      setLoading(false);
    }
  };

  const lengthOptions = [30, 45, 60, 90];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.container}>
          <ScrollView contentContainerStyle={styles.inner}>
            <View>
              <Pressable onPress={() => router.push("/trainerSession")}>
                <Ionicons name="chevron-back" size={24} color="#2563eb" />
              </Pressable>
            </View>
            <Text style={styles.title}>Create Session</Text>

            <Text style={styles.label}>Session Name</Text>
            <TextInput
              placeholder="Enter session name"
              value={session_name}
              onChangeText={(text) => setSession_name(text.trimStart())}
              style={[styles.input, styles.centeredBox]}
            />

            <Text style={styles.label}>Session Length</Text>
            <Pressable
              style={[styles.selector, styles.centeredBox]}
              onPress={() => setShowModal(true)}>
              <Text style={styles.selectorText}>
                {length ? `${length} mins` : "Choose length"}
              </Text>
            </Pressable>

            <Text style={styles.label}>Level</Text>
            <View style={[styles.levelContainer, styles.centeredBox]}>
              {[1, 2, 3, 4, 5].map((lvl) => (
                <Pressable
                  key={lvl}
                  onPress={() => setLevel(lvl)}
                  style={[
                    styles.levelButton,
                    level === lvl && styles.levelButtonSelected,
                  ]}>
                  <Text
                    style={[
                      styles.levelText,
                      level === lvl && styles.levelTextSelected,
                    ]}>
                    {lvl}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Pressable
              style={[styles.submitButton, styles.centeredBox]}
              onPress={handleSubmit}>
              <Text style={styles.submitText}>Create Session</Text>
            </Pressable>
          </ScrollView>

          {/* Modal */}
          <Modal transparent visible={showModal} animationType="slide">
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Select Session Length</Text>
                {lengthOptions.map((option) => (
                  <Pressable
                    key={option}
                    onPress={() => {
                      Keyboard.dismiss();
                      setLength(option);
                      setShowModal(false);
                    }}
                    style={styles.modalOption}>
                    <Text style={styles.modalOptionText}>{option} minutes</Text>
                  </Pressable>
                ))}
                <Pressable onPress={() => setShowModal(false)}>
                  <Text style={styles.modalCancel}>Cancel</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default CreateSession;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
  },
  inner: {
    paddingTop: 40,
    paddingBottom: 20,
  },
  centeredBox: {
    width: "90%",
    alignSelf: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    fontWeight: "600",
    textAlign: "center",
  },
  input: {
    backgroundColor: "#f2f2f2",
    padding: 14,
    borderRadius: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  selector: {
    backgroundColor: "#f2f2f2",
    padding: 14,
    borderRadius: 10,
    marginBottom: 20,
  },
  selectorText: {
    fontSize: 16,
    color: "#333",
  },
  levelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  levelButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#e6e6e6",
  },
  levelButtonSelected: {
    backgroundColor: "#007AFF",
  },
  levelText: {
    fontSize: 16,
    color: "#333",
  },
  levelTextSelected: {
    color: "#fff",
    fontWeight: "600",
  },
  submitButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
  modalOption: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalOptionText: {
    fontSize: 16,
    textAlign: "center",
  },
  modalCancel: {
    marginTop: 16,
    fontSize: 16,
    textAlign: "center",
    color: "#FF3B30",
  },
});
