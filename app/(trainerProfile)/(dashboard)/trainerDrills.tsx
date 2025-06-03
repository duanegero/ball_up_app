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
import Ionicons from "react-native-vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { Drill } from "../../../components/types";
import { deleteDrillById, getTrainerDrills } from "../../../utils/apiServices";

const TrainerDrills = () => {
  const router = useRouter();

  const [drills, setDrills] = useState<Drill[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTrainerDrills = async () => {
    try {
      const data = await getTrainerDrills();
      setDrills(data);
    } catch (error) {
      Alert.alert("Error", "Could not load drills.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
            await deleteDrillById(drill_id);
            setDrills((prevDrills) =>
              prevDrills.filter((d) => d.drill_id !== drill_id)
            );
          } catch (error) {
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
        {loading ? (
          <Text style={styles.loadingText}>Loading drills...</Text>
        ) : drills.length === 0 ? (
          <Text style={styles.noDrillsText}>No drills found.</Text>
        ) : (
          drills.map((drill) => (
            <View key={drill.drill_id} style={styles.card}>
              <Text style={styles.label}>Type:</Text>
              <Text style={styles.value}>{drill.drill_type}</Text>

              <Text style={styles.label}>Description:</Text>
              <Text style={styles.value}>{drill.description}</Text>

              <Text style={styles.label}>Level:</Text>
              <Text style={styles.value}>{drill.level}</Text>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(drill.drill_id)}
                accessibilityLabel={`Delete drill ${drill.drill_type}`}
                accessibilityRole="button">
                <Ionicons name="trash" size={20} color="#fff" />
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
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
    fontSize: 14,
    marginBottom: 4,
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
  loadingText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#666",
  },
  noDrillsText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#999",
  },
});
