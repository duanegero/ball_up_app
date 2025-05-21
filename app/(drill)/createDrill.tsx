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
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import api from "../../utils/api";
import ThemedText from "../../components/ThemedText";
import ThemedTitle from "../../components/ThemedTitle";

const CreateDrill = () => {
  //variable to handle router
  const router = useRouter();

  //typescript interface
  interface Drill {
    drill_type: string;
    description: string;
    level: number;
    trainer_user_id: number;
  }

  //state variables
  const [drill_type, setDrill_type] = useState("");
  const [level, setLevel] = useState(1);
  const [description, setDescription] = useState("");

  //function to handle submit
  const handleSubmit = async (): Promise<void> => {
    if (!drill_type || !description || !level) {
      Alert.alert("Please fill out all fields before submitting.");
      return;
    }

    //getting the id from storage
    const idString = await AsyncStorage.getItem("trainerId");

    //if nothing returned responed error
    if (!idString) {
      console.warn("No trainer ID found.");
      return;
    }

    //make id a number
    const trainer_user_id = parseInt(idString, 10);
    //variable to handle api call

    try {
      //variable to handle api call
      const response: {
        data: {
          drill_type: string;
          level: number;
          description: string;
          trainer_user_id: number;
        };
      } = await api.post("/drills", {
        drill_type,
        level,
        description,
        trainer_user_id,
      });

      //alert the user success
      Alert.alert("New Drill Created", `Type: ${response.data.drill_type}`);

      //clear the input
      setDescription("");

      //route back to drills list
      router.push("/trainerDrills");
    } catch (error: any) {
      //catch log and alert any errors
      console.error("Create drill error:", error);
      const message =
        error.response?.data?.message ||
        "An error occurred during creating new drill.";
      Alert.alert("Create Drill Failed", message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={{ backgroundColor: "#FFF0F5", flex: 1 }}>
          <ScrollView>
            <ThemedTitle>Create Drill</ThemedTitle>
            <View style={styles.drillCard}>
              <View style={{ width: "80%", alignSelf: "center" }}>
                <Picker
                  selectedValue={drill_type}
                  onValueChange={(itemValue, itemIndex) =>
                    setDrill_type(itemValue)
                  }>
                  <Picker.Item label="Select type..." value="" />
                  <Picker.Item label="Warm-Up" value="warmup" />
                  <Picker.Item label="Shooting" value="shoot" />
                  <Picker.Item label="Passing" value="pass" />
                  <Picker.Item label="Dribbling" value="dribble" />
                  <Picker.Item label="Rebound/Defence" value="reb_defence" />
                </Picker>
              </View>

              <View style={{ width: "80%", alignSelf: "center" }}>
                <ThemedText style={{ textAlign: "center" }}>
                  Description:
                </ThemedText>
                <TextInput
                  style={styles.input}
                  multiline={true}
                  onChangeText={setDescription}
                  value={description}></TextInput>
              </View>

              <View style={{ width: "80%", alignSelf: "center" }}>
                <Picker
                  selectedValue={level}
                  onValueChange={(itemValue, itemIndex) => setLevel(itemValue)}>
                  <Picker.Item label="Select level..." value="" />

                  <Picker.Item label="1" value={1} />
                  <Picker.Item label="2" value={2} />
                  <Picker.Item label="3" value={3} />
                  <Picker.Item label="4" value={4} />
                  <Picker.Item label="5" value={5} />
                </Picker>
              </View>
            </View>
          </ScrollView>
          <View style={styles.addPressContainer}>
            <Pressable
              onPress={handleSubmit}
              style={({ pressed }) => [
                styles.addPressButton,
                pressed && styles.addPressButtonPressed,
              ]}>
              <Text style={styles.addPressText}>Submit</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default CreateDrill;

const styles = StyleSheet.create({
  drillCard: {
    alignItems: "center",
    backgroundColor: "#FFF0F5",
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 14,
    marginBottom: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 4.84,
  },
  input: {
    backgroundColor: "white",
    color: "black",
    padding: 20,
    borderRadius: 2,
    height: 120,
    textAlignVertical: "top",
    textAlign: "left",
  },
  addPressContainer: {
    alignItems: "center",
    marginVertical: 10,
    paddingBottom: 5,
  },

  addPressButton: {
    backgroundColor: "#D6EAF8",
    paddingVertical: 16,
    paddingHorizontal: 52,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },

  addPressButtonPressed: {
    opacity: 0.7,
  },

  addPressText: {
    fontFamily: "Avenir",
    fontSize: 18,
    fontWeight: "700",
    color: "#2F4F4F",
    letterSpacing: 1.5,
    textAlign: "center",
    textTransform: "uppercase",
  },
});
