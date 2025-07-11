//imports to use in the app
import React, { useState, useEffect, useCallback } from "react";
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
  ActivityIndicator,
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
import { styles } from "../../styles/editSession.styles";
import {
  APP_ACTIVITY_INDICATOR_COLOR,
  APP_ACTIVITY_INDICATOR_SIZE,
} from "../../components/constants";

const EditSession = () => {
  //variable to handle ID
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();

  //check if ID a number
  if (!sessionId || isNaN(Number(sessionId))) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.emptyText}>Invalid session ID.</Text>
      </SafeAreaView>
    );
  }

  //useState variables
  const [drills, setDrills] = useState<Drill[]>([]);
  const [sessionDrills, setSessionDrills] = useState<SessionDrill[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [loadingDrills, setLoadingDrills] = useState(false);
  const [addingDrillId, setAddingDrillId] = useState<number | null>(null);
  const [removingDrillId, setRemovingDrillId] = useState<number | null>(null);

  //async function to get session drills
  const getDrills = async () => {
    setLoadingDrills(true);
    try {
      if (!sessionId) {
        console.warn("No sessionId found.");
        return;
      }
      const data = await fetchSessionDrills(sessionId);
      setSessionDrills(data);
    } catch (error) {
      console.error("Failed to load session drills in EditSession", error);
    } finally {
      setLoadingDrills(false);
    }
  };

  //async function to get all trainer drills
  const loadTrainerDrills = async () => {
    try {
      const idString = await AsyncStorage.getItem("trainerId");
      if (!idString) {
        console.warn("No trainer ID found.");
        return;
      }
      const trainerId = parseInt(idString, 10);
      const drillsData = await fetchTrainerDrills(trainerId);
      const sortedDrills = drillsData.sort(
        (a: { drill_name: string }, b: { drill_name: any }) =>
          a.drill_name.localeCompare(b.drill_name)
      );

      setDrills(sortedDrills);
    } catch (error) {
      console.error("Failed to load trainer drills:", error);
    }
  };

  //useEffects calling functions
  useEffect(() => {
    getDrills();
  }, [sessionId]);

  useEffect(() => {
    loadTrainerDrills();
  }, []);

  //async function to handle adding a drill
  const handleAddDrill = useCallback(
    async (drill: Drill) => {
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
        setAddingDrillId(drill.drill_id);
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
        Alert.alert("Error", "Something went wrong while adding the drill.");
      } finally {
        setAddingDrillId(null);
      }
    },
    [sessionId, sessionDrills]
  );

  //async function to handle removing a drill
  const handleRemove = useCallback(
    async (drill_id: number, session_id_str?: string) => {
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
                d.drill_id === drill_id &&
                d.session_id === Number(session_id_str)
              )
          )
        );
      } catch (error) {
        console.error("Failed to delete session drill:", error);
        Alert.alert("Error", "Failed to remove drill.");
      }
    },
    [setSessionDrills]
  );

  return (
    <SafeAreaView
      style={styles.container}
      accessibilityLabel="Edit Session Drills screen"
      accessibilityHint="Manage drills for your training session">
      <View>
        <Pressable
          onPress={() => router.push("/trainerSession")}
          accessibilityRole="button"
          accessibilityLabel="Back button"
          accessibilityHint="Go back to the sessions list">
          <Ionicons name="chevron-back" size={24} color="#2563eb" />
        </Pressable>
      </View>

      <Text
        style={styles.title}
        accessibilityRole="header"
        accessibilityLabel="Edit Session Drills">
        Edit Session Drills
      </Text>

      <View style={{ marginVertical: 10 }}>
        <Button
          title="Select Drill"
          onPress={() => setModalVisible(true)}
          accessibilityLabel="Select Drill button"
        />
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        accessibilityViewIsModal={true}
        accessible={true}
        accessibilityLabel="Select Drill Modal"
        accessibilityHint="Tap a drill to add it to the session">
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text
              style={styles.label}
              accessibilityRole="header"
              accessibilityLabel="Select a drill to add">
              Tap a drill to add:
            </Text>

            <FlatList
              data={drills}
              keyExtractor={(item) => item.drill_id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  disabled={addingDrillId !== null}
                  style={styles.drillButton}
                  onPress={() => handleAddDrill(item)}
                  accessibilityRole="button"
                  accessibilityLabel={`${item.drill_name}, Level ${item.level}`}
                  accessibilityState={{ disabled: addingDrillId !== null }}
                  accessibilityHint="Adds this drill to the session">
                  <Text style={styles.drillButtonText}>
                    {addingDrillId === item.drill_id
                      ? "Adding..."
                      : `${item.drill_name} (Level ${item.level})`}
                  </Text>
                </TouchableOpacity>
              )}
            />

            <View style={styles.modalButtons}>
              <Button
                title="Cancel"
                color="gray"
                disabled={addingDrillId !== null}
                onPress={() => setModalVisible(false)}
                accessibilityLabel="Cancel button"
              />
            </View>
          </View>
        </View>
      </Modal>

      <Text
        style={styles.sectionTitle}
        accessibilityRole="header"
        accessibilityLabel="Drills section">
        Drills
      </Text>

      {sessionDrills.length === 0 && !loadingDrills && (
        <View style={{ alignItems: "center", marginTop: 20 }}>
          <Text style={styles.emptyText} accessibilityLiveRegion="polite">
            No drills added yet.
          </Text>
          <Button
            title="Add Your First Drill"
            onPress={() => setModalVisible(true)}
            accessibilityLabel="Add Your First Drill button"
          />
        </View>
      )}

      {loadingDrills ? (
        <ActivityIndicator
          size={APP_ACTIVITY_INDICATOR_SIZE}
          color={APP_ACTIVITY_INDICATOR_COLOR}
          style={{ marginTop: 20 }}
          accessibilityLabel="Loading drills"
        />
      ) : (
        <FlatList
          data={sessionDrills}
          keyExtractor={(item) => `${item.session_id}-${item.drill_id}`}
          renderItem={({ item }) => (
            <View
              style={styles.drillItem}
              accessible={true}
              accessibilityLabel={`${item.drill?.drill_name}, Level ${item.drill?.level}`}>
              <Text style={styles.drillText}>
                {item.drill?.drill_name} - Level {item.drill?.level}
              </Text>
              <Pressable
                style={styles.removeButton}
                onPress={() => {
                  if (sessionId) {
                    setRemovingDrillId(item.drill_id);
                    handleRemove(item.drill_id, sessionId).finally(() =>
                      setRemovingDrillId(null)
                    );
                  }
                }}
                accessibilityRole="button"
                accessibilityLabel={`Remove ${item.drill?.drill_name} drill`}
                accessibilityHint="Removes this drill from the session">
                <Text style={styles.removeText}>
                  {removingDrillId === item.drill_id ? "Removing..." : "Remove"}
                </Text>
              </Pressable>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default EditSession;
