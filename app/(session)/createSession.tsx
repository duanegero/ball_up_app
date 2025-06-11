//imports to use in the app
import {
  View,
  Text,
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
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import Ionicons from "react-native-vector-icons/Ionicons";
import { createSession } from "../../utils/apiServices";
import { LENGTH_OPTIONS, LEVELS } from "../../components/constants";
import { styles } from "../../styles/createSession.styles";

const CreateSession = () => {
  //instance of router
  const router = useRouter();

  //useState variables
  const [length, setLength] = useState<number | null>(null);
  const [level, setLevel] = useState<number | null>(null);
  const [session_name, setSession_name] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  //async function to handle submit pressable
  const handleSubmit = async (): Promise<void> => {
    const trimmedName = session_name.trim();

    //checks on the data
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
    if (isNaN(trainer_user_id)) {
      Alert.alert("Error", "Invalid trainer ID.");
      return;
    }

    if (trimmedName.length < 3) {
      Alert.alert("Session name must be at least 3 characters.");
      return;
    }

    Keyboard.dismiss();
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
        error?.response?.data?.message ||
        error?.message ||
        "An unexpected error occurred.";
      Alert.alert("Create Session Failed", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      accessibilityLabel="Create Session screen"
      accessibilityHint="Fill out the form to create a new training session">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <SafeAreaView style={styles.container}>
          <ScrollView
            contentContainerStyle={styles.inner}
            keyboardShouldPersistTaps="handled">
            <View>
              <Pressable
                onPress={() => router.push("/trainerSession")}
                accessibilityRole="button"
                accessibilityLabel="Back button"
                accessibilityHint="Navigate back to the session list">
                <Ionicons name="chevron-back" size={24} color="#2563eb" />
              </Pressable>
            </View>

            <Text
              style={styles.title}
              accessibilityRole="header"
              accessibilityLabel="Create Session">
              Create Session
            </Text>

            <Text style={styles.label} accessibilityRole="text">
              Session Name
            </Text>
            <TextInput
              placeholder="Enter session name"
              value={session_name}
              onChangeText={(text) => setSession_name(text.trimStart())}
              style={[styles.input, styles.centeredBox]}
              accessibilityLabel="Session Name input"
              accessibilityHint="Enter the name of the session"
              accessibilityRole="text"
            />

            <Text style={styles.label} accessibilityRole="text">
              Session Length
            </Text>
            <Pressable
              style={[styles.selector, styles.centeredBox]}
              onPress={() => setShowModal(true)}
              accessibilityRole="button"
              accessibilityLabel="Select Session Length"
              accessibilityHint={
                length
                  ? `Current session length is ${length} minutes. Tap to change`
                  : "No session length selected. Tap to select session length"
              }
              accessible={true}>
              <Text style={styles.selectorText}>
                {length ? `${length} mins` : "Choose length"}
              </Text>
            </Pressable>

            <Text style={styles.label} accessibilityRole="text">
              Level
            </Text>
            <View
              style={[styles.levelContainer, styles.centeredBox]}
              accessibilityRole="radiogroup"
              accessibilityLabel="Session level selection">
              {LEVELS.map((lvl) => (
                <Pressable
                  key={lvl}
                  onPress={() => setLevel(lvl)}
                  style={[
                    styles.levelButton,
                    level === lvl && styles.levelButtonSelected,
                  ]}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: level === lvl }}
                  accessibilityLabel={`Level ${lvl}`}
                  accessibilityHint={`Select level ${lvl} for the session`}>
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
              style={[
                styles.submitButton,
                styles.centeredBox,
                loading && { opacity: 0.6 },
              ]}
              onPress={handleSubmit}
              disabled={loading}
              accessibilityRole="button"
              accessibilityLabel="Create Session button"
              accessibilityHint="Submit the form to create the session"
              accessible={true}>
              {loading ? (
                <ActivityIndicator
                  color="#fff"
                  accessibilityLabel="Loading indicator"
                />
              ) : (
                <Text style={styles.submitText}>Create Session</Text>
              )}
            </Pressable>
          </ScrollView>

          <Modal
            transparent
            visible={showModal}
            animationType="slide"
            accessibilityViewIsModal={true}
            accessible={true}
            accessibilityLabel="Session Length selection modal"
            accessibilityHint="Select the length of the session"
            onRequestClose={() => setShowModal(false)}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle} accessibilityRole="header">
                  Select Session Length
                </Text>
                {LENGTH_OPTIONS.map((option) => (
                  <Pressable
                    key={option}
                    onPress={() => {
                      Keyboard.dismiss();
                      setLength(option);
                      setShowModal(false);
                    }}
                    disabled={loading}
                    style={styles.modalOption}
                    accessibilityRole="button"
                    accessibilityLabel={`${option} minutes`}
                    accessibilityHint={`Select session length of ${option} minutes`}>
                    <Text style={styles.modalOptionText}>{option} minutes</Text>
                  </Pressable>
                ))}
                <Pressable
                  onPress={() => setShowModal(false)}
                  accessibilityRole="button"
                  accessibilityLabel="Cancel button"
                  accessibilityHint="Close the session length selection modal without choosing">
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
