import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
} from "react-native";
import api from "../../utils/api";
import ThemedTitle from "../../components/ThemedTitle";
import ThemedText from "../../components/ThemedText";
import Ionicons from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";

const TrainerDrills = () => {
  interface Drill {
    drill_id: number;
    drill_type: string;
    description: string;
    level: string;
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
      }
    };
    fetchTrainerDrills();
  }, []);

  const handleDelete = async (drill_id: number): Promise<void> => {
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
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={{ backgroundColor: "#FFF0F5", flex: 1 }}>
      <ScrollView>
        <View style={{ backgroundColor: "FFF0F5" }}>
          <ThemedTitle>Drills</ThemedTitle>
          <View style={styles.headerRow}>
            <View style={styles.headerCell}>
              <Text style={styles.headerText}>Type</Text>
            </View>
            <View style={styles.headerCell}>
              <Text style={styles.headerText}>Description</Text>
            </View>
            <View style={styles.headerCell}>
              <Text style={styles.headerText}>Level</Text>
            </View>
            <View style={styles.headerCell}>
              <Text style={styles.headerText}>Delete</Text>
            </View>
          </View>

          {drills.map((drill: any, index: number) => (
            <View
              key={index}
              style={[
                styles.dataRow,
                index % 2 === 0 ? styles.rowEven : styles.rowOdd,
              ]}>
              <View style={styles.cell}>
                <ThemedText>{drill.drill_type}</ThemedText>
              </View>
              <View style={styles.cell}>
                <ThemedText>{drill.description}</ThemedText>
              </View>
              <View style={styles.cell}>
                <ThemedText>{drill.level}</ThemedText>
              </View>
              <View style={styles.cell}>
                <Pressable onPress={() => handleDelete(drill.drill_id)}>
                  <Ionicons name="trash" size={24} color={"red"} />
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      <View>
        <Pressable>
          <Text style={styles.addPress}>Add New</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    backgroundColor: "#eee",
    paddingVertical: 10,
  },
  dataRow: {
    flexDirection: "row",
    paddingVertical: 10,
    alignItems: "center",
  },
  headerCell: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    fontFamily: "Avenir",
    letterSpacing: 2,
  },
  cell: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  rowEven: {
    backgroundColor: "#f9f9f9",
  },
  rowOdd: {
    backgroundColor: "#FFF0F5",
  },
  addPress: {
    fontFamily: "Avenir",
    fontSize: 40,
    letterSpacing: 4,
    fontWeight: "700",
    color: "#708090",
    textAlign: "center",
    justifyContent: "center",
    backgroundColor: "#D6EAF8",
  },
});

export default TrainerDrills;
