import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  Alert,
  Pressable,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  addDrillToSession,
  fetchSessionDrills,
  fetchTrainerDrills,
  removeDrillFromSession,
} from "../../utils/apiServices";

import { Drill, SessionDrill } from "../../components/types";

const EditSession = () => {
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();

  const [drills, setDrills] = useState<Drill[]>([]);
  const [sessionDrills, setSessionDrills] = useState<SessionDrill[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const getDrills = async () => {
    try {
      if (!sessionId) {
        console.warn("No sessionId found.");
        return;
      }
      const data = await fetchSessionDrills(sessionId);
      setSessionDrills(data);
    } catch (error) {
      console.error("Failed to load session drills in EditSession", error);
    }
  };

  const loadTrainerDrills = async () => {
    try {
      const idString = await AsyncStorage.getItem("trainerId");
      if (!idString) {
        console.warn("No trainer ID found.");
        return;
      }
      const trainerId = parseInt(idString, 10);
      const drillsData = await fetchTrainerDrills(trainerId);
      setDrills(drillsData);
    } catch (error) {
      console.error("Failed to load trainer drills:", error);
    }
  };

  useEffect(() => {
    getDrills();
  }, [sessionId]);

  useEffect(() => {
    loadTrainerDrills();
  }, []);

  const handleAddDrill = async (drill: Drill) => {
    const alreadyAdded = sessionDrills.some(
      (d) => d.drill_id === drill.drill_id
    );
    if (alreadyAdded) {
      Alert.alert(
        "Duplicate Drill",
        "This drill is already part of the session."
      );
      return;
    }

    try {
      await addDrillToSession(sessionId, drill.drill_id);

      setSessionDrills((prev) => [
        ...prev,
        {
          drill_id: drill.drill_id,
          session_id: Number(sessionId),
          drill,
        },
      ]);
      setModalVisible(false);
    } catch (error) {
      console.error("Failed to add drill to session:", error);
    }
  };

  const handleRemove = async (drill_id: number, session_id_str?: string) => {
    if (!session_id_str) {
      console.warn("No session ID for drill removal.");
      return;
    }
    try {
      await removeDrillFromSession(session_id_str, drill_id);

      setSessionDrills((prevDrills) =>
        prevDrills.filter(
          (d) =>
            !(
              d.drill_id === drill_id && d.session_id === Number(session_id_str)
            )
        )
      );
    } catch (error) {
      console.error("Failed to delete session drill:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Pressable onPress={() => router.push("/trainerSession")}>
          <Ionicons name="chevron-back" size={24} color="#2563eb" />
        </Pressable>
      </View>

      <Text style={styles.title}>Edit Session Drills</Text>

      <View style={{ marginVertical: 10 }}>
        <Button title="Select Drill" onPress={() => setModalVisible(true)} />
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.label}>Tap a drill to add:</Text>
            <FlatList
              data={drills}
              keyExtractor={(item) => item.drill_id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.drillButton}
                  onPress={() => handleAddDrill(item)}>
                  <Text style={styles.drillButtonText}>
                    {item.drill_name} (Level {item.level})
                  </Text>
                </TouchableOpacity>
              )}
            />
            <View style={styles.modalButtons}>
              <Button
                title="Cancel"
                color="gray"
                onPress={() => setModalVisible(false)}
              />
            </View>
          </View>
        </View>
      </Modal>

      <Text style={styles.sectionTitle}>Drills </Text>

      {sessionDrills.length === 0 && (
        <Text style={styles.emptyText}>
          No drills added to this session yet.
        </Text>
      )}

      <FlatList
        data={sessionDrills}
        keyExtractor={(item) => `${item.session_id}-${item.drill_id}`}
        renderItem={({ item }) => (
          <View style={styles.drillItem}>
            <Text style={styles.drillText}>
              {item.drill?.drill_name} - Level {item.drill?.level}
            </Text>
            <Pressable
              style={styles.removeButton}
              onPress={() => {
                if (sessionId) {
                  handleRemove(item.drill_id, sessionId);
                }
              }}>
              <Text style={styles.removeText}>Remove</Text>
            </Pressable>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default EditSession;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F9F9F9",
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
    color: "#111",
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 8,
  },
  drillItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 10,
    borderRadius: 6,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  drillText: {
    fontSize: 16,
  },
  removeButton: {
    backgroundColor: "#FF6B6B",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  removeText: {
    color: "#fff",
    fontWeight: "600",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    elevation: 5,
    maxHeight: "80%",
  },
  modalButtons: {
    marginTop: 16,
    alignItems: "center",
  },
  drillButton: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  drillButtonText: {
    fontSize: 16,
  },
  emptyText: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginTop: 20,
  },
});
