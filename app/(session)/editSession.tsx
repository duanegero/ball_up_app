import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Button, Alert, Pressable } from "react-native";
import { Picker } from "@react-native-picker/picker";
import api from "../../utils/api";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import Ionicons from "react-native-vector-icons/Ionicons";

type Drill = {
  drill_id: number;
  drill_name: string;
  drill_type: string;
  description: string;
  level: number;
};

type SessionDrill = {
  drill_id: number;
  session_id: number;
  drill: Drill;
};

const EditSession = () => {
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  const [drills, setDrills] = useState<Drill[]>([]);
  const [selectedDrill, setSelectedDrill] = useState<string>("");
  const [sessionDrills, setSessionDrills] = useState<SessionDrill[]>([]);

  useEffect(() => {
    const fetchSessionDrills = async () => {
      try {
        const response = await api.get(`/sessions/session_drills/${sessionId}`);
        setSessionDrills(response.data);
      } catch (error) {
        console.error("Error fetching session drills:", error);
      }
    };

    fetchSessionDrills();
  }, [sessionId]);

  useEffect(() => {
    //async function to fetch
    const fetchTrainerDrills = async () => {
      try {
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
        const response = await api.get(`/trainers/drills/${trainer_user_id}`);
        //set state variable with response
        setDrills(response.data);
      } catch (error) {
        //catch and log if any errors
        console.error("Error fetching trainer drills", error);
      }
    };
    //call function
    fetchTrainerDrills();
  }, []);

  const handleAddDrill = async () => {
    if (!selectedDrill) return;

    const drillId = parseInt(selectedDrill, 10);

    // Prevent duplicates
    const alreadyAdded = sessionDrills.some((d) => d.drill_id === drillId);
    if (alreadyAdded) {
      console.warn("Drill already added to session.");
      Alert.alert("Drill already added to session.");
      return;
    }

    const drillToAdd = drills.find((d) => d.drill_id === drillId);
    if (!drillToAdd) return;

    try {
      await api.post(`/sessions/session_drills/${sessionId}`, {
        drill_id: drillToAdd.drill_id,
      });

      setSessionDrills((prev) => [
        ...prev,
        {
          drill_id: drillToAdd.drill_id,
          session_id: Number(sessionId), // ensure sessionId is a number
          drill: drillToAdd,
        },
      ]);

      setSelectedDrill("");
    } catch (error) {
      console.error("Failed to add drill to session:", error);
    }
  };

  return (
    <SafeAreaView>
      <View style={{ position: "absolute", top: 50, left: 25, zIndex: 10 }}>
        <Pressable onPress={() => router.push("/trainerSession")}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="list" size={32} color="#708090" />
            <Text style={{ marginLeft: 8, fontSize: 16, color: "#708090" }}>
              Sessions
            </Text>
          </View>
        </Pressable>
      </View>

      <View style={{ marginTop: 70 }}>
        <Text>Select a Drill to Add:</Text>
        <Picker
          selectedValue={selectedDrill}
          onValueChange={(itemValue) => setSelectedDrill(itemValue)}>
          <Picker.Item label="Select a drill..." value="" />
          {drills.map((drill) => (
            <Picker.Item
              key={drill.drill_id}
              label={`${drill.drill_name} (Level ${drill.level})`}
              value={drill.drill_id.toString()}
            />
          ))}
        </Picker>
      </View>

      <View style={{ marginVertical: 10 }}>
        <Button title="Add Drill to Session" onPress={handleAddDrill} />
      </View>

      <Text style={{ fontWeight: "bold", marginTop: 20 }}>Session Drills:</Text>
      <FlatList
        data={sessionDrills}
        keyExtractor={(item, index) => `${item.drill?.drill_name}-${index}`}
        renderItem={({ item }) => (
          <View style={{ marginVertical: 5 }}>
            <Text>
              {item.drill?.drill_name} - Level {item.drill?.level}
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default EditSession;
