import {
  Text,
  ScrollView,
  Pressable,
  Alert,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Session, Athlete } from "../../../components/types";
import {
  fetchTrainerData,
  getAthleteSessions,
  putSessionToAthlete,
  removeAthleteFromTrainer,
} from "../../../utils/apiServices";
import { styles } from "../../../styles/trainerAthletes.styles";

const TrainerAthletes = () => {
  const [trainerId, setTrainerId] = useState<number | null>(null);
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true); // for initial load
  const [assigningSession, setAssigningSession] = useState(false);
  const [removingAthleteId, setRemovingAthleteId] = useState<number | null>(
    null
  );

  const loadTrainerData = async () => {
    setLoading(true);
    try {
      const data = await fetchTrainerData();
      if (data) {
        setTrainerId(data.trainer_user_id);
        setSessions(data.sessions);
        setAthletes(
          data.athletes.sort((a, b) => a.first_name.localeCompare(b.first_name))
        );
      }
    } catch (error) {
      console.error("Failed to load trainer data:", error);
      Alert.alert("Error", "Failed to load trainer info.");
    } finally {
      setLoading(false);
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

  const assignSessionToAthlete = async (session: Session, athlete: Athlete) => {
    setAssigningSession(true);
    try {
      await putSessionToAthlete(session.session_id, athlete.athlete_user_id);
      Alert.alert("Success", "Session assigned to athlete.");
    } catch (error) {
      Alert.alert("Error", "Failed to assign session.");
    } finally {
      setAssigningSession(false);
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

  const removeAthlete = async (athlete: Athlete) => {
    setRemovingAthleteId(athlete.athlete_user_id);
    try {
      await removeAthleteFromTrainer(athlete.athlete_user_id);

      setAthletes((prev) =>
        prev.filter((a) => a.athlete_user_id !== athlete.athlete_user_id)
      );

      Alert.alert("Success", "Athlete removed successfully.");
    } catch (error) {
      Alert.alert("Error", "Failed to remove athlete.");
    } finally {
      setRemovingAthleteId(null);
    }
  };

  if (loading) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}>
        <ActivityIndicator size="large" color="#333" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {assigningSession && (
        <SafeAreaView style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#333" />
        </SafeAreaView>
      )}
      <ScrollView>
        <Text style={styles.title}>My Athletes</Text>

        {athletes.length === 0 && (
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            No athletes found.
          </Text>
        )}

        {athletes.map((athlete) => (
          <Pressable
            key={athlete.athlete_user_id}
            onPress={() => handlePress(athlete)}
            style={styles.card}
            disabled={
              assigningSession || removingAthleteId === athlete.athlete_user_id
            }>
            {removingAthleteId === athlete.athlete_user_id ? (
              <ActivityIndicator size="small" color="#333" />
            ) : (
              <>
                <Text style={styles.cardName}>
                  {athlete.first_name} {athlete.last_name}
                </Text>
                <Text style={styles.cardDetail}>Age: {athlete.age}</Text>
                <Text style={styles.cardDetail}>Level: {athlete.level}</Text>
                <Text style={styles.cardDetail}>Email: {athlete.email}</Text>
              </>
            )}
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default TrainerAthletes;
