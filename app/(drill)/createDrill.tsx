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
      style={styles.container}
      accessibilityLabel="Create Drill screen"
      accessibilityHint="Fill out the form to create a new drill">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <SafeAreaView style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View>
              <Pressable
                onPress={() => router.push("/trainerDrills")}
                accessibilityRole="button"
                accessibilityLabel="Back button"
                accessibilityHint="Navigates back to trainer drills list">
                <Ionicons name="chevron-back" size={24} color="#2563eb" />
              </Pressable>
            </View>

            <Text
              style={styles.title}
              accessibilityRole="header"
              accessibilityLabel="Create Drill title">
              Create Drill
            </Text>

            <Text style={styles.label} accessibilityRole="text">
              Drill Name
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Drill Name"
              value={drill_name}
              onChangeText={setDrill_name}
              accessibilityLabel="Drill Name input"
              accessibilityHint="Enter the name of the drill"
              accessibilityRole="text"
            />

            <Text style={styles.label} accessibilityRole="text">
              Drill Type
            </Text>
            <Pressable
              onPress={() => setShowTypeModal(true)}
              style={styles.modalSelector}
              accessibilityRole="button"
              accessibilityLabel="Select Drill Type"
              accessibilityHint={
                drill_type
                  ? `Current drill type is ${
                      DRILL_TYPES.find((d) => d.value === drill_type)?.label
                    }. Tap to change drill type`
                  : "No drill type selected. Tap to select drill type"
              }>
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
              onRequestClose={() => setShowTypeModal(false)}
              accessibilityLabel="Drill Type selection modal"
              accessibilityHint="Select a drill type from the list">
              <View style={styles.modalOverlay}>
                <TouchableWithoutFeedback
                  onPress={() => setShowTypeModal(false)}
                  accessible={false}>
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
                      style={styles.modalOption}
                      accessibilityRole="button"
                      accessibilityLabel={`Select drill type ${type.label}`}
                      accessibilityHint={`Select ${type.label} as the drill type`}>
                      <Text>{type.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </Modal>

            <Text style={styles.label} accessibilityRole="text">
              Description
            </Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="A short description of the drill"
              value={description}
              onChangeText={setDescription}
              multiline
              accessibilityLabel="Description input"
              accessibilityHint="Enter a short description of the drill"
              accessibilityRole="text"
            />

            <Text style={styles.label} accessibilityRole="text">
              Level
            </Text>
            <View
              style={styles.segmentContainer}
              accessibilityRole="radiogroup">
              {LEVELS.map((lvl) => (
                <Pressable
                  key={lvl}
                  onPress={() => setLevel(lvl)}
                  style={[
                    styles.segmentButton,
                    level === lvl && styles.segmentSelected,
                  ]}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: level === lvl }}
                  accessibilityLabel={`Level ${lvl}`}
                  accessibilityHint={`Select level ${lvl} for the drill`}>
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
              ]}
              accessibilityRole="button"
              accessibilityLabel="Submit button"
              accessibilityHint="Submit the drill creation form"
              accessible={true}>
              {submitting ? (
                <ActivityIndicator
                  color="#fff"
                  accessibilityLabel="Loading indicator"
                />
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
