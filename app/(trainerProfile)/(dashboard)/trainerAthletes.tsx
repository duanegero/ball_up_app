import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
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

const TrainerAthletes = () => {
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
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    const fetchTrainerSessions = async () => {
      try {
        const idString = await AsyncStorage.getItem("trainerId");
        if (!idString) return console.warn("No trainer ID found.");
        const trainer_user_id = parseInt(idString, 10);
        const response = await api.get(`trainers/sessions/${trainer_user_id}`);
        setSessions(response.data);
      } catch (error) {
        console.error("Error fetching trainer sessions", error);
      }
    };
    fetchTrainerSessions();
  }, []);

  useEffect(() => {
    const fetchTrainerAthletes = async () => {
      try {
        const idString = await AsyncStorage.getItem("trainerId");
        if (!idString) return console.warn("No trainer ID found.");
        const trainer_user_id = parseInt(idString, 10);
        setTrainerId(trainer_user_id);
        const response = await api.get(`/trainers/athletes/${trainer_user_id}`);
        setAthletes(response.data);
      } catch (error) {
        console.error("Error fetching trainer athletes", error);
      }
    };
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
          ? athleteSessions.map((s: any) => s.session.session_name).join("\n")
          : "No sessions assigned.";

      Alert.alert(
        `${athlete.first_name} ${athlete.last_name}`,
        `Current Sessions:\n${sessionNames}`,
        [
          { text: "Cancel", style: "cancel" },
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
                  { text: "Cancel", style: "cancel" },
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
                            data: { trainer_user_id: trainerId },
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
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>My Athletes</Text>

        <View style={styles.headerRow}>
          <Text style={styles.headerCell}>Name</Text>
          <Text style={styles.headerCell}>Age</Text>
          <Text style={styles.headerCell}>Level</Text>
        </View>

        {athletes.map((athlete, index) => (
          <Pressable
            key={athlete.athlete_user_id}
            onPress={() => handlePress(athlete)}
            style={[
              styles.dataRow,
              { backgroundColor: index % 2 === 0 ? "#f1f1f1" : "#ffffff" },
            ]}>
            <Text style={styles.cell}>{athlete.first_name}</Text>
            <Text style={styles.cell}>{athlete.age}</Text>
            <Text style={styles.cell}>{athlete.level}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 16,
    color: "#333",
    textAlign: "center",
  },
  headerRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 8,
    marginBottom: 8,
  },
  headerCell: {
    flex: 1,
    fontWeight: "600",
    fontSize: 26,
    color: "#555",
    textAlign: "center",
  },
  dataRow: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ddd",
  },
  cell: {
    flex: 1,
    textAlign: "center",
    fontSize: 24,
    color: "#333",
  },
});

export default TrainerAthletes;
