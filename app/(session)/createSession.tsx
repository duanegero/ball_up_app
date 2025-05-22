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
import ThemedTitle from "../../components/ThemedTitle";
import ThemedText from "../../components/ThemedText";
import ThemedTextInput from "../../components/ThemedTextInput";

const CreateSession = () => {
  //variable to handle router
  const router = useRouter();

  //interface for typescript
  interface Session {
    length: number;
    level: number;
    session_name: string;
    trainer_user_id: number;
  }

  //state variables to handle user data
  const [length, setLength] = useState(0);
  const [level, setLevel] = useState(1);
  const [session_name, setSession_name] = useState("");

  //function to handle submit
  const handleSubmit = async (): Promise<void> => {
    //if all fields not filled alert
    if (!length || !level || !session_name) {
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

    try {
      //varaible to handle api call
      const response: {
        data: {
          length: number;
          level: number;
          session_name: string;
          trainer_user_id: number;
        };
      } = await api.post("/sessions", {
        length,
        level,
        session_name,
        trainer_user_id,
      });

      //alert the user success
      Alert.alert("New Session Created");

      //clear the input field
      setSession_name("");

      //route back to sessions screen
      router.push("/trainerSession");
    } catch (error: any) {
      //catch log and alert any errors
      console.error("Create session error:", error);
      const message =
        error.response?.data?.message ||
        "An error occurred during creating new session.";
      Alert.alert("Create Session Failed", message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={{ backgroundColor: "#ccffe5", flex: 1 }}>
          <ScrollView>
            <ThemedTitle>Create Session</ThemedTitle>
            <View>
              <View style={{ width: "80%", alignSelf: "center" }}>
                <ThemedText style={{ textAlign: "center" }}>
                  Session Name:
                </ThemedText>
                <ThemedTextInput
                  onChangeText={setSession_name}
                  value={session_name}></ThemedTextInput>
              </View>

              <View style={{ width: "80%", alignSelf: "center" }}>
                <Picker
                  selectedValue={length}
                  onValueChange={(itemValue, itemIndex) =>
                    setLength(itemValue)
                  }>
                  <Picker.Item label="Select length..." value="" />
                  <Picker.Item label="30 minutes" value={30} />
                  <Picker.Item label="45 minutes" value={45} />
                  <Picker.Item label="1 hour" value={60} />
                  <Picker.Item label="1 hour 30 minutes" value={90} />
                </Picker>
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
              <Text style={styles.addPressText}>Add New</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default CreateSession;

const styles = StyleSheet.create({
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
    backgroundColor: "#ffd1b3",
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
