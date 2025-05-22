import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  SafeAreaView,
} from "react-native";
import api from "../../utils/api";
import ThemedTitle from "../../components/ThemedTitle";
import ThemedText from "../../components/ThemedText";
import Ionicons from "react-native-vector-icons/Ionicons";

const TrainerSession = () => {
  const router = useRouter();

  interface Session {
    length: number;
    level: number;
    session_name: string;
    trainer_user_id: number;
  }

  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    const fetchTrainerSessions = async () => {
      try {
        //getting the id from storage
        const idString = await AsyncStorage.getItem("trainerId");

        //if nothing returned responed error
        if (!idString) {
          console.warn("No trainer ID found.");
          return;
        }
        //make id a number
        const trainer_user_id = parseInt(idString, 10);

        const response = await api.get(`trainers/sessions/${trainer_user_id}`);

        setSessions(response.data);
      } catch (error) {
        //catch and log if any errors
        console.error("Error fetching trainer sessions", error);
      }
    };
    fetchTrainerSessions();
  }, []);

  return (
    <SafeAreaView style={{ backgroundColor: "#ccffe5", flex: 1 }}>
      <ScrollView>
        <View style={{ backgroundColor: "#ccffe5" }}>
          <ThemedTitle>Your Sessions</ThemedTitle>
        </View>

        <View style={styles.headerRow}>
          <View style={styles.headerCell}>
            <Text style={styles.headerText}>Session Name</Text>
          </View>
          <View style={styles.headerCell}>
            <Text style={styles.headerText}>Length</Text>
          </View>
          <View style={styles.headerCell}>
            <Text style={styles.headerText}>Level</Text>
          </View>
          <View style={styles.headerCell}>
            <Text style={styles.headerText}>Edit</Text>
          </View>
        </View>

        {sessions.map((session: any, index: number) => (
          <Pressable
            key={index}
            onPress={() => {
              console.log(session.session_name);
            }}
            style={[
              styles.dataRow,
              index % 2 === 0 ? styles.rowEven : styles.rowOdd,
            ]}>
            <View
              key={index}
              style={[
                styles.dataRow,
                index % 2 === 0 ? styles.rowEven : styles.rowOdd,
              ]}>
              <View style={styles.cell}>
                <ThemedText>{session.session_name}</ThemedText>
              </View>
              <View style={styles.cell}>
                <ThemedText>{session.length}</ThemedText>
              </View>
              <View style={styles.cell}>
                <ThemedText>{session.level}</ThemedText>
              </View>
              <View style={styles.cell}>
                <Pressable>
                  <Ionicons name="create-outline" size={24} color={"#708090"} />
                </Pressable>
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>
      <View style={styles.addPressContainer}>
        <Pressable
          onPress={() => router.push("/createSession")}
          style={({ pressed }) => [
            styles.addPressButton,
            pressed && styles.addPressButtonPressed,
          ]}>
          <Text style={styles.addPressText}>Add New</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    backgroundColor: "#eee",
    paddingVertical: 10,
  },
  dataRow: {
    flexDirection: "row",
    paddingVertical: 10,
    alignItems: "center",
  },
  headerCell: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    fontFamily: "Avenir",
    letterSpacing: 2,
  },
  cell: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  rowEven: {
    backgroundColor: "#f9f9f9",
  },
  rowOdd: {
    backgroundColor: "#ccffe5",
  },
  addPressContainer: {
    alignItems: "center",
    marginVertical: 10,
    paddingBottom: 5,
  },
  addPressButton: {
    backgroundColor: "#ffd1b3",
    paddingVertical: 16,
    paddingHorizontal: 52,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  addPressButtonPressed: {
    opacity: 0.7,
  },
  addPressText: {
    fontFamily: "Avenir",
    fontSize: 18,
    fontWeight: "700",
    color: "#2F4F4F",
    letterSpacing: 1.5,
    textAlign: "center",
    textTransform: "uppercase",
  },
});

export default TrainerSession;
