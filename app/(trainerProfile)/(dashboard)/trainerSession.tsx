import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import api from "../../../utils/api";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Session } from "../../../components/types";
import { SessionDrill } from "../../../components/types";

const TrainerSession = () => {
  const router = useRouter();

  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchTrainerSessions();
  }, []);

  const fetchTrainerSessions = async () => {
    try {
      setLoading(true);
      const idString = await AsyncStorage.getItem("trainerId");

      if (!idString) {
        console.warn("No trainer ID found.");
        return;
      }

      const trainer_user_id = parseInt(idString, 10);
      const response = await api.get(`trainers/sessions/${trainer_user_id}`);

      setSessions(response.data);
    } catch (error) {
      console.error("Failed to fetch trainer sessions", error);
      Alert.alert("Error", "Unable to load sessions. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchDrills = async (sessionId: number): Promise<SessionDrill[]> => {
    try {
      const response = await api.get(`sessions/session_drills/${sessionId}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch drills", error);
      throw new Error("Could not fetch drills");
    }
  };

  const formatDrillNames = (drills: SessionDrill[]) => {
    return drills.map((d) => `• ${d.drill.drill_name}`).join("\n");
  };

  const showSessionOptions = (session: Session, drillNames: string) => {
    Alert.alert(
      `${session.session_name}`,
      `Drills:\n\n${drillNames}`,
      [
        {
          text: "Edit",
          onPress: () =>
            router.push({
              pathname: "/editSession",
              params: { sessionId: session.session_id },
            }),
        },
        {
          text: "Delete",
          onPress: () => {
            Alert.alert(
              "Confirm Delete",
              `Are you sure you want to delete "${session.session_name}"?`,
              [
                {
                  text: "Yes, Delete",
                  onPress: async () => {
                    try {
                      await api.delete(`sessions/${session.session_id}`);
                      setSessions((prev) =>
                        prev.filter((s) => s.session_id !== session.session_id)
                      );
                    } catch (error) {
                      console.error("Failed to delete session", error);
                      Alert.alert(
                        "Error",
                        "Could not delete session. Please try again."
                      );
                    }
                  },
                  style: "destructive",
                },
                { text: "Cancel", style: "cancel" },
              ],
              { cancelable: true }
            );
          },
          style: "destructive",
        },
        { text: "Cancel", style: "cancel" },
      ],
      { cancelable: true }
    );
  };

  const handlePress = async (session: Session) => {
    try {
      const drills = await fetchDrills(session.session_id);
      const drillNames = formatDrillNames(drills);
      showSessionOptions(session, drillNames);
    } catch (error) {
      Alert.alert("Error", "Could not fetch drills for this session.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Your Sessions</Text>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#007BFF"
          style={{ marginTop: 20 }}
        />
      ) : (
        <FlatList
          data={sessions}
          keyExtractor={(item) => item.session_id.toString()}
          contentContainerStyle={styles.scrollContainer}
          ListEmptyComponent={
            <Text style={styles.noSessionsText}>
              No sessions found. Tap below to create one.
            </Text>
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.label}>
                Name: <Text style={styles.value}>{item.session_name}</Text>
              </Text>
              <Text style={styles.label}>
                Length: <Text style={styles.value}>{item.length}</Text>
              </Text>
              <Text style={styles.label}>
                Level: <Text style={styles.value}>{item.level}</Text>
              </Text>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handlePress(item)}>
                <Ionicons name="create-outline" size={20} color="#fff" />
                <Text style={styles.actionText}>View/Edit</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      {!loading && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("/createSession")}>
          <Text style={styles.addText}>Add New Session</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  actionButton: {
    flexDirection: "row",
    backgroundColor: "#FF4C4C",
    padding: 8,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  actionText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 6,
  },
  value: {
    fontWeight: "normal",
  },
  addButton: {
    backgroundColor: "#007BFF",
    padding: 14,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },
  addText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  scrollContainer: {
    paddingBottom: 20,
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
  noSessionsText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#888",
  },
});

export default TrainerSession;
