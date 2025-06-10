//imports to use in app
import React, { useState, useEffect, useCallback } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import {
  View,
  Text,
  Alert,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Session } from "../../../components/types";
import { SessionDrill } from "../../../components/types";
import {
  deleteTrainerSession,
  getSessionDrills,
  getTrainerSessions,
} from "../../../utils/apiServices";
import {
  APP_ACTIVITY_INDICATOR_COLOR,
  APP_ACTIVITY_INDICATOR_SIZE,
} from "../../../components/constants";
import { styles } from "../../../styles/trainerSession.styles";

const TrainerSession = () => {
  //variable to handle router
  const router = useRouter();

  //useState varibles
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingSessionId, setDeletingSessionId] = useState<number | null>(
    null
  );
  const [refreshing, setRefreshing] = useState(false);

  //async function to fetch and load trainer sessions
  const fetchTrainerSessions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const sessionsData = await getTrainerSessions();
      if (sessionsData) {
        setSessions(sessionsData);
      } else {
        setError("No session data received. Please try again.");
        console.error("Fetch Trainer Sessions returned null or undefined");
        Alert.alert("Data error");
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again later.");
      console.error("Failed to fetch trainer sessions", error);
      Alert.alert("Error", "Unable to load sessions. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  //useFocusEffect runs everytime screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (!refreshing) {
        fetchTrainerSessions();
      }
    }, [])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchTrainerSessions();
    setRefreshing(false);
  }, [fetchTrainerSessions]);

  //async function to handle pressable
  const handlePress = async (session: Session) => {
    try {
      const drills = await getSessionDrills(session.session_id);
      const drillNames = formatDrillNames(drills);
      showSessionOptions(session, drillNames);
    } catch (error) {
      Alert.alert("Error", "Could not fetch drills for this session.");
      console.error("Failed to fetch drills for session:", error);
    }
  };

  //function to handle showing session options
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
            if (deletingSessionId !== null) {
              Alert.alert("Please wait", "A session is already being deleted.");
              return;
            }
            Alert.alert(
              "Confirm Delete",
              `Are you sure you want to delete "${session.session_name}"?`,
              [
                {
                  text: "Yes, Delete",
                  onPress: async () => {
                    setDeletingSessionId(session.session_id);
                    try {
                      await deleteTrainerSession(session.session_id);
                      setSessions((prev) =>
                        prev.filter((s) => s.session_id !== session.session_id)
                      );
                      Alert.alert(
                        "Success",
                        `"${session.session_name}" has been deleted.`
                      );
                      setError(null);
                    } catch (error) {
                      console.error("Failed to delete session", error);
                      Alert.alert(
                        "Error",
                        "Could not delete session. Please try again."
                      );
                    } finally {
                      setDeletingSessionId(null);
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

  //function to handle formatting drill names
  const formatDrillNames = (drills: SessionDrill[]) => {
    if (!drills || drills.length === 0) return "No drills added.";
    const names = drills.map((d) => `• ${d.drill.drill_name}`);
    return names.length > 5
      ? [...names.slice(0, 5), "• ...and more"].join("\n")
      : names.join("\n");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Your Sessions</Text>
      {error && !loading && <Text style={styles.errorText}>{error}</Text>}

      {loading && !refreshing ? (
        <ActivityIndicator
          size={APP_ACTIVITY_INDICATOR_SIZE}
          color={APP_ACTIVITY_INDICATOR_COLOR}
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
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#9ca3af"
            />
          }
          renderItem={({ item }) => {
            const isDeleting = deletingSessionId === item.session_id;

            return (
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
                  style={[
                    styles.actionButton,

                    isDeleting && styles.actionButtonDisabled,
                  ]}
                  onPress={() => handlePress(item)}
                  disabled={isDeleting}
                  accessibilityLabel={
                    isDeleting
                      ? `Deleting session ${item.session_name}`
                      : `View or edit session ${item.session_name}`
                  }
                  accessibilityRole="button">
                  {isDeleting ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Ionicons name="create-outline" size={20} color="#fff" />
                  )}
                  <Text style={styles.actionText}>
                    {isDeleting ? "Deleting..." : "View / Edit"}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          }}
        />
      )}

      {!loading && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("/createSession")}
          accessibilityLabel="Add New Session"
          accessibilityRole="button">
          <Text style={styles.addText}>Add New Session</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

export default TrainerSession;
