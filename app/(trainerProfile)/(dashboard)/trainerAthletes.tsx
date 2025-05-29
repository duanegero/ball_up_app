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
import api from "../../../utils/api";
import ThemedTitle from "../../../components/ThemedTitle";
import ThemedText from "../../../components/ThemedText";
import { Ionicons } from "@expo/vector-icons";

const TrainerAthletes = () => {
  //interface for typescript
  interface Session {
    session_id: number;
    session_name: string;
    length: number;
    level: number;
    trainer_user_id: number;
  }

  interface Athlete {
    athlete_user_id: number;
    first_name: string;
    last_name: string;
    email: string;
    age: number;
    level: number;
  }
  const [trainerId, setTrainerId] = useState<number | null>(null);

  //state variable to set athletes
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    const fetchTrainerSessions = async () => {
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

        const response = await api.get(`trainers/sessions/${trainer_user_id}`);

        setSessions(response.data);
      } catch (error) {
        //catch and log if any errors
        console.error("Error fetching trainer sessions", error);
      }
    };
    fetchTrainerSessions();
  }, []);

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
        setTrainerId(trainer_user_id);
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

  const handlePress = async (athlete: Athlete) => {
    try {
      const sessionRes = await api.get(
        `/athletes/athlete_sessions/${athlete.athlete_user_id}`
      );
      const athleteSessions = sessionRes.data.athlete_sessions;

      const sessionNames =
        athleteSessions.length > 0
          ? athleteSessions
              .map((s: any, index: number) => s.session.session_name)
              .join("\n")
          : "No sessions assigned.";

      Alert.alert(
        `${athlete.first_name} ${athlete.last_name}`,
        `Current Sessions:\n${sessionNames}`,
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Add Session",
            onPress: () => {
              if (sessions.length === 0) {
                Alert.alert("No sessions found for this trainer.");
                return;
              }

              Alert.alert(
                "Select a Session",
                "Assign a session to this athlete:",
                sessions.map((session) => ({
                  text: session.session_name,
                  onPress: async () => {
                    try {
                      await api.post(
                        `/athletes/athlete_sessions/${session.session_id}`,
                        {
                          athlete_user_id: athlete.athlete_user_id,
                        }
                      );
                      Alert.alert("Success", "Session assigned to athlete.");
                    } catch (error) {
                      console.error("Error assigning session:", error);
                      Alert.alert("Error", "Failed to assign session.");
                    }
                  },
                }))
              );
            },
          },
          {
            text: "Remove",
            style: "destructive",
            onPress: () => {
              Alert.alert(
                "Confirm Delete",
                `Are you sure you want to remove "${athlete.first_name} ${athlete.last_name}"?`,
                [
                  {
                    text: "Cancel",
                    style: "cancel",
                  },
                  {
                    text: "Yes, Remove",
                    style: "destructive",
                    onPress: async () => {
                      try {
                        const idString =
                          await AsyncStorage.getItem("trainerId");
                        const trainerId = idString
                          ? parseInt(idString, 10)
                          : null;

                        await api.delete(
                          `/trainers/athlete/${athlete.athlete_user_id}`,
                          {
                            data: {
                              trainer_user_id: trainerId,
                            },
                          }
                        );

                        setAthletes((prev) =>
                          prev.filter(
                            (a) => a.athlete_user_id !== athlete.athlete_user_id
                          )
                        );

                        Alert.alert("Success", "Athlete removed successfully.");
                      } catch (error) {
                        console.error("Failed to remove athlete", error);
                        Alert.alert("Error", "Failed to remove athlete.");
                      }
                    },
                  },
                ]
              );
            },
          },
        ],
        { cancelable: true }
      );
    } catch (error) {
      console.error("Failed to fetch athlete sessions:", error);
      Alert.alert("Error", "Could not retrieve athlete sessions.");
    }
  };

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
          </View>

          {athletes.map((athlete: any, index: number) => (
            <Pressable
              key={index}
              onPress={() => handlePress(athlete)}
              style={[
                styles.dataRow,
                index % 2 === 0 ? styles.rowEven : styles.rowOdd,
              ]}>
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
              </View>
            </Pressable>
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
