import React, { useCallback, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Alert,
  Pressable,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AthleteSessionItem } from "../../../components/types";
import {
  fetchAthleteSessions,
  completeAthleteSession,
  deleteAthleteSession,
} from "../../../utils/apiServices";

const AthleteSession = () => {
  //useStates
  const [sessions, setSessions] = useState<AthleteSessionItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSessions = useCallback(async () => {
    try {
      setLoading(true);
      const sessions = await fetchAthleteSessions();

      const sortedSessions = sessions.sort(
        (a: { completed: any }, b: { completed: any }) => {
          return Number(a.completed) - Number(b.completed);
        }
      );

      setSessions(sortedSessions);
    } catch (error) {
      console.error("[AthleteSession] Error fetching sessions", error);
      Alert.alert("Error", "Could not load your sessions. Try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const handleComplete = async (
    athlete_user_id: number,
    session_id: number
  ) => {
    try {
      await completeAthleteSession(athlete_user_id, session_id);
      Alert.alert("Session Completed", "Session has been marked as complete.");
      fetchSessions();
    } catch (error) {
      Alert.alert("Error", "Could not mark session as complete.");
    }
  };

  const handleDelete = async (athlete_user_id: number, session_id: number) => {
    try {
      await deleteAthleteSession(athlete_user_id, session_id);
      Alert.alert("Session Deleted", "Session has been deleted from list.");
      fetchSessions();
    } catch (error) {
      Alert.alert("Error", "Could not detele session.");
    }
  };

  const handlePress = (athleteId: number, sessionId: number) => () => {
    handleComplete(athleteId, sessionId);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>My Training Sessions</Text>

      {loading ? (
        <Text style={{ textAlign: "center", marginTop: 20 }}>
          Loading sessions...
        </Text>
      ) : sessions.length === 0 ? (
        <Text style={{ textAlign: "center", marginTop: 20 }}>
          No training sessions available.
        </Text>
      ) : (
        <FlatList
          data={sessions}
          keyExtractor={(item) => item.session_id.toString()}
          renderItem={({ item }) => {
            const { session } = item;

            return (
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.sessionName}>{session.session_name}</Text>
                  <Pressable
                    onPress={() =>
                      handleDelete(item.athlete_user_id, item.session_id)
                    }>
                    <Ionicons name="trash-outline" size={20} color="#d11a2a" />
                  </Pressable>
                </View>

                <Text style={styles.detail}>
                  Length: {session.length} mins | Level: {session.level}
                </Text>

                {session.Session_Drill.length > 0 ? (
                  <View style={styles.drillList}>
                    {session.Session_Drill.map((drillItem, i) => (
                      <Text key={i} style={styles.drillText}>
                        • {drillItem.drill.drill_type.toUpperCase()} (Lv
                        {drillItem.drill.level}):{" "}
                        {drillItem.drill.description.trim()}
                      </Text>
                    ))}
                  </View>
                ) : (
                  <Text style={styles.noDrills}>
                    No drills in this session.
                  </Text>
                )}

                {item.completed ? (
                  <View style={[styles.button, styles.buttonDisabled]}>
                    <Text style={styles.buttonText}>✔ Completed</Text>
                  </View>
                ) : (
                  <Pressable
                    style={styles.button}
                    onPress={handlePress(
                      item.athlete_user_id,
                      item.session_id
                    )}>
                    <Text style={styles.buttonText}>Mark Completed</Text>
                  </Pressable>
                )}
              </View>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
};

export default AthleteSession;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
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
  sessionName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  detail: {
    fontSize: 14,
    color: "#333",
    marginBottom: 6,
  },
  drillList: {
    marginVertical: 6,
  },
  drillText: {
    fontSize: 14,
    color: "#444",
    marginBottom: 4,
  },
  noDrills: {
    fontStyle: "italic",
    color: "#888",
    marginVertical: 6,
  },
  button: {
    backgroundColor: "#28a745",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
});
