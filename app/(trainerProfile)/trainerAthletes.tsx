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
  SafeAreaView,
} from "react-native";
import api from "../../utils/api";
import ThemedTitle from "../../components/ThemedTitle";
import ThemedText from "../../components/ThemedText";
import { Ionicons } from "@expo/vector-icons";

const TrainerAthletes = () => {
  //interface for typescript
  interface Athlete {
    athlete_user_id: number;
    first_name: string;
    last_name: string;
    email: string;
    age: number;
    level: number;
  }

  //state variable to set athletes
  const [athletes, setAthletes] = useState<Athlete[]>([]);

  useEffect(() => {
    //async function to fetch
    const fetchTrainerAthletes = async () => {
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
        const response = await api.get(`/trainers/athletes/${trainer_user_id}`);
        //set state variable with response
        setAthletes(response.data);
      } catch (error) {
        //catch and log if any errors
        console.error("Error fetching trainer athletes", error);
      }
    };

    //call function
    fetchTrainerAthletes();
  }, []);

  return (
    <SafeAreaView style={{ backgroundColor: "#ccffe5", flex: 1 }}>
      <ScrollView>
        <View style={{ backgroundColor: "#ccffe5" }}>
          <ThemedTitle>Your Athletes</ThemedTitle>

          <View style={styles.headerRow}>
            <View style={styles.headerCell}>
              <Text style={styles.headerText}>Name</Text>
            </View>
            <View style={styles.headerCell}>
              <Text style={styles.headerText}>Age</Text>
            </View>
            <View style={styles.headerCell}>
              <Text style={styles.headerText}>Level</Text>
            </View>
            <View style={styles.headerCell}>
              <Text style={styles.headerText}>Sessions</Text>
            </View>
          </View>

          {athletes.map((athlete: any, index: number) => (
            <View
              key={index}
              style={[
                styles.dataRow,
                index % 2 === 0 ? styles.rowEven : styles.rowOdd,
              ]}>
              <View style={styles.cell}>
                <ThemedText>{athlete.first_name}</ThemedText>
              </View>
              <View style={styles.cell}>
                <ThemedText>{athlete.age}</ThemedText>
              </View>
              <View style={styles.cell}>
                <ThemedText>{athlete.level}</ThemedText>
              </View>
              <View style={styles.cell}>
                <Pressable>
                  <Ionicons
                    name="basketball-outline"
                    size={24}
                    color={"orange"}
                  />
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      {/* <View style={styles.addPressContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.addPressButton,
            pressed && styles.addPressButtonPressed,
          ]}>
          <Text style={styles.addPressText}>Add New</Text>
        </Pressable>
      </View> */}
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
    backgroundColor: "#ccffe5",
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

export default TrainerAthletes;
