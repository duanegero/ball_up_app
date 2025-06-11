//imports to use in app
import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Alert,
  Pressable,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AthleteSessionItem } from "../../../components/types";
import {
  fetchAthleteSessions,
  completeAthleteSession,
  deleteAthleteSession,
} from "../../../utils/apiServices";
import { useFocusEffect } from "expo-router";
import { styles } from "../../../styles/athleteSession.styles";
import {
  APP_ACTIVITY_INDICATOR_COLOR,
  APP_ACTIVITY_INDICATOR_SIZE,
} from "../../../components/constants";

const AthleteSession = () => {
  //useState variables
  const [sessions, setSessions] = useState<AthleteSessionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  //async function to fetch sessions
  const fetchSessions = useCallback(async () => {
    try {
      setLoading(true);
      const sessions = await fetchAthleteSessions();

      const sortedSessions = sessions.sort(
        (a: AthleteSessionItem, b: AthleteSessionItem) =>
          Number(a.completed) - Number(b.completed)
      );

      setSessions(sortedSessions);
    } catch (error) {
      console.error("[AthleteSession] Error fetching sessions", error);
      Alert.alert("Error", "Could not load your sessions. Try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  //useEffect to call function
  useFocusEffect(
    useCallback(() => {
      fetchSessions();
    }, [fetchSessions])
  );

  //async function to refresh
  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchSessions();
    } finally {
      setRefreshing(false);
    }
  };

  //async function to handle complete pressable
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

  //async function to handle delete pressable
  const handleDelete = async (athlete_user_id: number, session_id: number) => {
    try {
      await deleteAthleteSession(athlete_user_id, session_id);
      Alert.alert("Session Deleted", "Session has been deleted from the list.");
      fetchSessions();
    } catch (error) {
      Alert.alert("Error", "Could not delete session.");
    }
  };

  //function to handle the action button
  const SessionActionButton = ({
    isCompleted,
    onPress,
  }: {
    isCompleted: boolean;
    onPress?: () => void;
  }) => {
    return isCompleted ? (
      <View style={[styles.button, styles.buttonDisabled]}>
        <Text style={styles.buttonText}>✔ Completed</Text>
      </View>
    ) : (
      <Pressable
        style={styles.button}
        onPress={onPress}
        accessibilityLabel="Mark session as complete"
        accessibilityRole="button"
        accessibilityHint="Marks this session as completed">
        <Text style={styles.buttonText}>Mark Completed</Text>
      </Pressable>
    );
  };

  return (
    <SafeAreaView
      style={styles.container}
      accessible={true}
      accessibilityRole="summary"
      accessibilityLabel="My Training Sessions screen">
      <Text
        style={styles.heading}
        accessibilityRole="header"
        accessibilityLabel="My Training Sessions">
        My Training Sessions
      </Text>

      {loading ? (
        <ActivityIndicator
          size={APP_ACTIVITY_INDICATOR_SIZE}
          color={APP_ACTIVITY_INDICATOR_COLOR}
          style={{ marginTop: 20 }}
          accessibilityRole="progressbar"
          accessibilityLabel="Loading training sessions"
        />
      ) : sessions.length === 0 ? (
        <Text
          style={{ textAlign: "center", marginTop: 20 }}
          accessibilityRole="text"
          accessibilityLabel="No training sessions available">
          No training sessions available.
        </Text>
      ) : (
        <FlatList
          refreshing={refreshing}
          onRefresh={onRefresh}
          data={sessions}
          keyExtractor={(item) => item.session_id.toString()}
          accessibilityRole="list"
          accessibilityLabel="List of training sessions"
          renderItem={({ item }) => {
            if (!item || !item.session || !item.session_id) return null;
            const { session } = item;
            const isCompleted = item.completed;

            return (
              <View
                style={styles.card}
                accessible={true}
                accessibilityLabel={`Training session: ${session.session_name}`}>
                <View style={styles.cardHeader}>
                  <Text
                    style={styles.sessionName}
                    accessibilityRole="text"
                    accessibilityLabel={`Session name: ${session.session_name}`}>
                    {session.session_name}
                  </Text>
                  <Pressable
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel="Delete session"
                    accessibilityHint="Deletes this training session"
                    onPress={() =>
                      handleDelete(item.athlete_user_id, item.session_id)
                    }>
                    <Ionicons name="trash-outline" size={20} color="#d11a2a" />
                  </Pressable>
                </View>

                <Text
                  style={styles.detail}
                  accessibilityRole="text"
                  accessibilityLabel={`Session length: ${session.length} minutes, Level: ${session.level}`}>
                  Length: {session.length} mins | Level: {session.level}
                </Text>

                {Array.isArray(session.Session_Drill) &&
                session.Session_Drill.length > 0 ? (
                  <View
                    style={styles.drillList}
                    accessible={true}
                    accessibilityRole="list"
                    accessibilityLabel="List of drills in this session">
                    {session.Session_Drill.map((drillItem, i) => (
                      <Text
                        key={`drill-${i}`}
                        style={styles.drillText}
                        accessibilityRole="text"
                        accessibilityLabel={`Drill ${i + 1}: ${
                          drillItem?.drill?.drill_type?.toUpperCase() ??
                          "Unknown"
                        }, level ${
                          drillItem?.drill?.level ?? "unknown"
                        }, description: ${
                          drillItem?.drill?.description?.trim() ??
                          "No description"
                        }`}>
                        •{" "}
                        {typeof drillItem?.drill?.drill_type === "string"
                          ? drillItem.drill.drill_type.toUpperCase()
                          : "UNKNOWN"}{" "}
                        (Lv {drillItem?.drill?.level ?? "?"}):{" "}
                        {typeof drillItem?.drill?.description === "string"
                          ? drillItem.drill.description.trim()
                          : "No description"}
                      </Text>
                    ))}
                  </View>
                ) : (
                  <Text
                    style={styles.noDrills}
                    accessibilityRole="text"
                    accessibilityLabel="No drills in this session">
                    No drills in this session.
                  </Text>
                )}

                <SessionActionButton
                  isCompleted={isCompleted}
                  onPress={() =>
                    handleComplete(item.athlete_user_id, item.session_id)
                  }
                />
              </View>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
};

export default AthleteSession;
