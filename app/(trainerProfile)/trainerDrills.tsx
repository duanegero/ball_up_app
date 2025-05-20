import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import api from "../../utils/api";
import ThemedTitle from "../../components/ThemedTitle";
import Ionicons from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";

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
    <SafeAreaView>
      <ScrollView>
        <View>
          <ThemedTitle>Drills </ThemedTitle>
          <View style={styles.headerRow}>
            <View style={styles.headerCell}>
              <Text>Type</Text>
            </View>
            <View style={styles.headerCell}>
              <Text>Description</Text>
            </View>
            <View style={styles.headerCell}>
              <Text>Level</Text>
            </View>
            <View style={styles.headerCell}>
              <Text>Delete</Text>
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
                <Text>{drill.drill_type}</Text>
              </View>
              <View style={styles.cell}>
                <Text>{drill.description}</Text>
              </View>
              <View style={styles.cell}>
                <Text>{drill.level}</Text>
              </View>
              <View style={styles.cell}>
                <Pressable>
                  <Ionicons name="trash" size={24} color={"red"} />
                </Pressable>
              </View>

              {/* <View style={styles.cell}>
                <Pressable>
                  <Text>delete</Text>
                </Pressable>
              </View> */}
            </View>
          ))}
        </View>
      </ScrollView>
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
});

export default TrainerDrills;
