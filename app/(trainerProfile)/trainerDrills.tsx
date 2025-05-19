import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet } from "react-native";
import api from "../../utils/api";

const TrainerDrills = () => {
  const [drills, setDrills] = useState([]);

  useEffect(() => {
    const fetchTrainerDrills = async () => {
      try {
        const idString = await AsyncStorage.getItem("trainerId");

        if (!idString) {
          console.warn("No trainer ID found.");
          return;
        }

        const trainer_user_id = parseInt(idString, 10);
        const response = await api.get(`/trainers/drills/${trainer_user_id}`);
        setDrills(response.data);
      } catch (error) {
        console.error("Error fetching trainer drills", error);
      }
    };
    fetchTrainerDrills();
  }, []);

  return (
    <View>
      <Text>Drills</Text>
      {drills.map((drill: any) => (
        <Text>
          {drill.drill_type} {drill.description}
          {drill.level}
        </Text>
      ))}
    </View>
  );
};

export default TrainerDrills;
