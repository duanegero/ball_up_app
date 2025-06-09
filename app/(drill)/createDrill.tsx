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
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import Ionicons from "react-native-vector-icons/Ionicons";
import { createDrill } from "../../utils/apiServices";
import { DRILL_TYPES, LEVELS } from "../../components/constants";
import { styles } from "../../styles/createDrill.styles";

const CreateDrill: React.FC = () => {
  //instance of router
  const router = useRouter();

  //useState variables
  const [drill_type, setDrill_type] = useState("");
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [level, setLevel] = useState<number | null>(null);
  const [description, setDescription] = useState("");
  const [drill_name, setDrill_name] = useState("");
  const [submitting, setSubmitting] = useState(false);

  //async function to handle submit pressable
  const handleSubmit = async (): Promise<void> => {
    if (submitting) return;

    //checks on the data
    if (!drill_type || !description || level === null || !drill_name) {
      Alert.alert("Please fill out all fields before submitting.");
      return;
    }
    if (!drill_name.trim() || drill_name.trim().length < 3) {
      Alert.alert("Drill name must be at least 3 characters.");
      return;
    }

    if (!description.trim() || description.trim().length < 10) {
      Alert.alert("Description should be at least 10 characters.");
      return;
    }

    Keyboard.dismiss();
    setSubmitting(true);

    try {
      const result = await createDrill({
        drill_type,
        level,
        description,
        drill_name,
      });

      const drillLabel =
        DRILL_TYPES.find((d) => d.value === result.newDrill.drill_type)
          ?.label || result.newDrill.drill_type;

      Alert.alert(
        "New Drill Created",
        `${result.newDrill.drill_name} (${drillLabel})`
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

      const status = error.response?.status;
      let message = "An error occurred during creating new drill.";

      if (status === 400) {
        message = error.response?.data?.message || "Invalid input.";
      } else if (status === 401) {
        message = "Unauthorized. Please log in again.";
      } else if (status === 500) {
        message = "Server error. Please try again later.";
      }

      Alert.alert("Create Drill Failed", message);
    } finally {
      setSubmitting(false);
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
              <Text
                style={[
                  styles.drillTypeText,
                  !drill_type && styles.placeholderText,
                ]}>
                {drill_type
                  ? `Drill Type: ${
                      DRILL_TYPES.find((d) => d.value === drill_type)?.label
                    }`
                  : "Select Drill Type..."}
              </Text>
            </Pressable>

            <Modal
              visible={showTypeModal}
              transparent
              animationType="slide"
              accessible={true}
              accessibilityViewIsModal={true}
              onRequestClose={() => setShowTypeModal(false)}>
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
              disabled={submitting}
              style={({ pressed }) => [
                styles.button,
                pressed && !submitting && { opacity: 0.7 },
                submitting && styles.buttonDisabled,
              ]}>
              {submitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Submit</Text>
              )}
            </Pressable>
          </ScrollView>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default CreateDrill;
