import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
  Pressable,
} from "react-native";
import api from "../../utils/api";
import ThemedTitle from "../../components/ThemedTitle";
import ThemedText from "../../components/ThemedText";

const AthleteSession = () => {
  const router = useRouter();
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    fetchAthleteSessions();
  }, []);

  const fetchAthleteSessions = async () => {
    try {
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
      console.error("Error fetching athlete sessions", error);
    }
  };

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

  return (
    <SafeAreaView style={styles.container}>
      <ThemedTitle style={styles.title}>Athlete Sessions</ThemedTitle>
      <ScrollView>
        {sessions.map((item: any, index: number) => {
          const { session } = item;
          return (
            <View
              key={item.session_id}
              style={[
                styles.sessionContainer,
                index % 2 === 0 ? styles.rowEven : styles.rowOdd,
              ]}>
              <View style={styles.sessionHeader}>
                <ThemedText style={styles.sessionName}>
                  {session.session_name}
                </ThemedText>
                <Text style={styles.sessionInfo}>
                  Length: {session.length} mins | Level: {session.level}
                </Text>
              </View>

              {session.Session_Drill.length > 0 ? (
                <View style={styles.drillList}>
                  {session.Session_Drill.map((item: any, i: number) => (
                    <View key={i} style={styles.drillItem}>
                      <Text style={styles.drillText}>
                        • {item.drill.drill_type.toUpperCase()} (Lv
                        {item.drill.level}): {item.drill.description.trim()}
                      </Text>
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={styles.noDrills}>No drills in this session.</Text>
              )}
              <Pressable
                style={styles.completeButton}
                onPress={() =>
                  handleComplete(item.athlete_user_id, item.session_id)
                }>
                <Text style={styles.completeButtonText}>Mark Completed</Text>
              </Pressable>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AthleteSession;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    marginBottom: 20,
  },
  sessionContainer: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  rowEven: {
    backgroundColor: "#f9f9f9",
  },
  rowOdd: {
    backgroundColor: "#e8f0ff",
  },
  sessionHeader: {
    marginBottom: 8,
  },
  sessionName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  sessionInfo: {
    fontSize: 14,
    color: "#333",
  },
  drillList: {
    marginTop: 10,
    paddingLeft: 10,
  },
  drillItem: {
    marginBottom: 5,
  },
  drillText: {
    fontSize: 14,
    color: "#444",
  },
  noDrills: {
    fontStyle: "italic",
    color: "#888",
    marginTop: 10,
  },
  completeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#28a745",
    borderRadius: 8,
    alignItems: "center",
  },
  completeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
