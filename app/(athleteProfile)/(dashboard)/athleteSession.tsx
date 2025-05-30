import React, { useCallback, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
  Pressable,
  FlatList,
} from "react-native";
import api from "../../../utils/api";
import { AthleteSessionItem } from "../../../components/types";

const AthleteSession = () => {
  const [sessions, setSessions] = useState<AthleteSessionItem[]>([]);

  const [loading, setLoading] = useState(true);

  const fetchAthleteSessions = useCallback(async () => {
    try {
      setLoading(true);
      const idString = await AsyncStorage.getItem("athleteId");
      if (!idString) {
        console.warn("No athlete ID found.");
        return;
      }

      const athlete_user_id = parseInt(idString, 10);
      const response = await api.get(
        `/athletes/athlete_sessions/${athlete_user_id}`
      );

      if (response.data?.athlete_sessions) {
        setSessions(response.data.athlete_sessions);
      } else {
        console.warn("No sessions found.");
      }
    } catch (error) {
      console.error("[AthleteSession] Error fetching sessions", error);
      Alert.alert("Error", "Could not load your sessions. Try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAthleteSessions();
  }, [fetchAthleteSessions]);

  const handleComplete = async (
    athlete_user_id: number,
    session_id: number
  ) => {
    try {
      await api.delete(`/athletes/session/${athlete_user_id}/${session_id}`);

      Alert.alert("Session Completed", "Session has been marked as complete.");
      fetchAthleteSessions();
    } catch (error) {
      console.error("Error completing session:", error);
      Alert.alert("Error", "Could not mark session as complete.");
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
                <Text style={styles.sessionName}>{session.session_name}</Text>
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

                <Pressable
                  style={styles.button}
                  onPress={handlePress(item.athlete_user_id, item.session_id)}
                  accessibilityRole="button"
                  accessibilityLabel={`Mark ${session.session_name} as completed`}>
                  <Text style={styles.buttonText}>Mark Completed</Text>
                </Pressable>
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
});
