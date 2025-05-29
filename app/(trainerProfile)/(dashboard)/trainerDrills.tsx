import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useLocalSearchParams, useRouter } from "expo-router";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
} from "react-native";
import api from "../../../utils/api";
import ThemedTitle from "../../../components/ThemedTitle";
import ThemedText from "../../../components/ThemedText";
import Ionicons from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";

const TrainerDrills = () => {
  const router = useRouter();

  //interface for typescript
  interface Drill {
    drill_id: number;
    drill_type: string;
    description: string;
    level: string;
    trainer_user_id: number;
  }

  //state variable to set drills
  const [drills, setDrills] = useState<Drill[]>([]);

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

  //async function to handle delete press
  const handleDelete = async (drill_id: number): Promise<void> => {
    //alert user to confirm
    Alert.alert("Delete Drill", "Are you sure you want to delete this drill?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            //api call to delete
            await api.delete(`/drills/${drill_id}`);

            //reset drills with new list
            setDrills((prevDrills) =>
              prevDrills.filter((d) => d.drill_id !== drill_id)
            );
          } catch (error) {
            //catch and log if any errors
            console.error("Error deleting drill", error);
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={{ backgroundColor: "#FFF0F5", flex: 1 }}>
      <ScrollView>
        <View style={{ backgroundColor: "#FFF0F5" }}>
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
      <View style={styles.addPressContainer}>
        <Pressable
          onPress={() => router.push("/createDrill")}
          style={({ pressed }) => [
            styles.addPressButton,
            pressed && styles.addPressButtonPressed,
          ]}>
          <Text style={styles.addPressText}>Add New</Text>
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

export default TrainerDrills;
