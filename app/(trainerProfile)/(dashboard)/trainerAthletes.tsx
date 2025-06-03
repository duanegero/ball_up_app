import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  SafeAreaView,
} from "react-native";

import { Session, Athlete } from "../../../components/types";
import {
  fetchTrainerData,
  getAthleteSessions,
  putSessionToAthlete,
  removeAthleteFromTrainer,
} from "../../../utils/apiServices";

const TrainerAthletes = () => {
  const [trainerId, setTrainerId] = useState<number | null>(null);
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);

  const loadTrainerData = async () => {
    try {
      const data = await fetchTrainerData();
      if (data) {
        setTrainerId(data.trainer_user_id);
        setSessions(data.sessions);
        setAthletes(data.athletes);
      }
    } catch (error) {
      console.error("Failed to load trainer data:", error);
    }
  };

  useEffect(() => {
    loadTrainerData();
  }, []);

  const handlePress = async (athlete: Athlete) => {
    try {
      const athleteSessions = await getAthleteSessions(athlete.athlete_user_id);

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
            onPress: () => showSessionPicker(athlete),
          },
          {
            text: "Remove",
            style: "destructive",
            onPress: () => confirmRemoveAthlete(athlete),
          },
        ],
        { cancelable: true }
      );
    } catch (error) {
      Alert.alert("Error", "Could not retrieve athlete sessions.");
    }
  };

  const confirmRemoveAthlete = (athlete: Athlete) => {
    Alert.alert(
      "Confirm Delete",
      `Are you sure you want to remove "${athlete.first_name} ${athlete.last_name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes, Remove",
          style: "destructive",
          onPress: () => removeAthlete(athlete),
        },
      ]
    );
  };

  const assignSessionToAthlete = async (session: Session, athlete: Athlete) => {
    try {
      await putSessionToAthlete(session.session_id, athlete.athlete_user_id);
      Alert.alert("Success", "Session assigned to athlete.");
    } catch (error) {
      Alert.alert("Error", "Failed to assign session.");
    }
  };

  const showSessionPicker = (athlete: Athlete) => {
    if (sessions.length === 0) {
      Alert.alert("No sessions found for this trainer.");
      return;
    }

    Alert.alert(
      "Select a Session",
      "Assign a session to this athlete:",
      sessions.map((session) => ({
        text: session.session_name,
        onPress: () => assignSessionToAthlete(session, athlete),
      }))
    );
  };

  const removeAthlete = async (athlete: Athlete) => {
    try {
      await removeAthleteFromTrainer(athlete.athlete_user_id);

      setAthletes((prev) =>
        prev.filter((a) => a.athlete_user_id !== athlete.athlete_user_id)
      );

      Alert.alert("Success", "Athlete removed successfully.");
    } catch (error) {
      Alert.alert("Error", "Failed to remove athlete.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>My Athletes</Text>

        {athletes.map((athlete) => (
          <Pressable
            key={athlete.athlete_user_id}
            onPress={() => handlePress(athlete)}
            style={styles.card}>
            <Text style={styles.cardName}>
              {athlete.first_name} {athlete.last_name}
            </Text>
            <Text style={styles.cardDetail}>Age: {athlete.age}</Text>
            <Text style={styles.cardDetail}>Level: {athlete.level}</Text>
            <Text style={styles.cardDetail}>Email: {athlete.email}</Text>
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
  cardName: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
    color: "#333",
  },
  cardDetail: {
    fontSize: 16,
    color: "#666",
    marginBottom: 4,
  },
});

export default TrainerAthletes;
