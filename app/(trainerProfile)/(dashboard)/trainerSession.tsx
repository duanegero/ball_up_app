import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import api from "../../../utils/api";
import ThemedTitle from "../../../components/ThemedTitle";
import ThemedText from "../../../components/ThemedText";
import Ionicons from "react-native-vector-icons/Ionicons";

const TrainerSession = () => {
  const router = useRouter();

  interface Session {
    session_id: number;
    session_name: string;
    length: number;
    level: number;
    trainer_user_id: number;
  }

  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    const fetchTrainerSessions = async () => {
      try {
        const idString = await AsyncStorage.getItem("trainerId");

        if (!idString) {
          console.warn("No trainer ID found.");
          return;
        }

        const trainer_user_id = parseInt(idString, 10);
        const response = await api.get(`trainers/sessions/${trainer_user_id}`);

        setSessions(response.data);
      } catch (error) {
        console.error("Error fetching trainer sessions", error);
      }
    };
    fetchTrainerSessions();
  }, []);

  const handlePress = async (session: any) => {
    try {
      const response = await api.get(
        `sessions/session_drills/${session.session_id}`
      );
      const drills = response.data;

      const drillNames = drills
        .map((d: any) => `• ${d.drill.drill_name}`)
        .join("\n");

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
                          prev.filter(
                            (s) => s.session_id !== session.session_id
                          )
                        );
                      } catch (error) {
                        console.error("Failed to delete session", error);
                      }
                    },
                    style: "destructive",
                  },
                  {
                    text: "Cancel",
                    style: "cancel",
                  },
                ],
                { cancelable: true }
              );
            },
            style: "destructive",
          },
          {
            text: "Cancel",
            style: "cancel",
          },
        ],
        { cancelable: true }
      );
    } catch (error) {
      console.error("Failed to fetch drills", error);
      Alert.alert("Error", "Could not fetch drills for this session.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Your Sessions</Text>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {sessions.map((session: any) => (
          <View key={session.session_id} style={styles.card}>
            <Text style={styles.label}>
              Name: <Text style={styles.value}>{session.session_name}</Text>
            </Text>
            <Text style={styles.label}>
              Length: <Text style={styles.value}>{session.length}</Text>
            </Text>
            <Text style={styles.label}>
              Level: <Text style={styles.value}>{session.level}</Text>
            </Text>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handlePress(session)} // or call another function if you want a modal
            >
              <Ionicons name="create-outline" size={20} color="#fff" />
              <Text style={styles.deleteText}>View/Edit</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("/createSession")}>
        <Text style={styles.addText}>Add New Session</Text>
      </TouchableOpacity>
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
  deleteButton: {
    flexDirection: "row",
    backgroundColor: "#FF4C4C",
    padding: 8,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  deleteText: {
    color: "#fff",
    fontWeight: "bold",
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
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
  },
});

export default TrainerSession;
