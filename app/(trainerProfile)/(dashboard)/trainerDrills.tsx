import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "react-native-vector-icons/Ionicons";
import api from "../../../utils/api";
import { useRouter } from "expo-router";

const TrainerDrills = () => {
  const router = useRouter();

  interface Drill {
    drill_id: number;
    drill_type: string;
    description: string;
    level: string;
    trainer_user_id: number;
  }

  const [drills, setDrills] = useState<Drill[]>([]);

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
        Alert.alert("Error", "Could not load drills.");
      }
    };

    fetchTrainerDrills();
  }, []);

  const handleDelete = (drill_id: number) => {
    Alert.alert("Delete Drill", "Are you sure you want to delete this drill?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await api.delete(`/drills/${drill_id}`);
            setDrills((prevDrills) =>
              prevDrills.filter((d) => d.drill_id !== drill_id)
            );
          } catch (error) {
            console.error("Error deleting drill", error);
            Alert.alert("Error", "Failed to delete drill.");
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>My Drills</Text>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {drills.map((drill) => (
          <View key={drill.drill_id} style={styles.card}>
            <Text style={styles.label}>
              Type: <Text style={styles.value}>{drill.drill_type}</Text>
            </Text>
            <Text style={styles.label}>
              Description: <Text style={styles.value}>{drill.description}</Text>
            </Text>
            <Text style={styles.label}>
              Level: <Text style={styles.value}>{drill.level}</Text>
            </Text>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDelete(drill.drill_id)}>
              <Ionicons name="trash" size={20} color="#fff" />
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("/createDrill")}>
        <Text style={styles.addText}>Add New Drill</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default TrainerDrills;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  value: {
    fontWeight: "normal",
  },
  deleteButton: {
    flexDirection: "row",
    backgroundColor: "#FF4C4C",
    padding: 8,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  deleteText: {
    color: "#fff",
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: "#007BFF",
    padding: 14,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },
  addText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
