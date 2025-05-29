import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../../utils/api";

const AthleteTrainerScreen = () => {
  interface Trainer {
    trainer_user_id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    years_experience: number;
    bio: string;
  }

  const [athleteUserId, setAthleteUserId] = useState<number | null>(null);
  const [trainers, setTrainers] = useState<Trainer[]>([]);

  useEffect(() => {
    const fetchAthleteIdAndTrainers = async () => {
      try {
        const idString = await AsyncStorage.getItem("athleteId");
        if (!idString) {
          console.warn("No athlete ID found.");
          return;
        }

        const parsedId = parseInt(idString, 10);
        setAthleteUserId(parsedId);

        const response = await api.get("/trainers");
        setTrainers(response.data);
      } catch (error) {
        console.error("Error loading data:", error);
        Alert.alert("Error", "Something went wrong loading data.");
      }
    };

    fetchAthleteIdAndTrainers();
  }, []);

  const assignTrainer = async (trainer_user_id: number) => {
    if (!athleteUserId) {
      Alert.alert("Missing Athlete ID", "Cannot assign without athlete ID.");
      return;
    }

    try {
      await api.put(`/athletes/assign_trainer/${athleteUserId}`, {
        trainer_user_id,
      });
      Alert.alert("Success", "Trainer assigned successfully!");
    } catch (error) {
      console.error("Error assigning trainer:", error);
      Alert.alert("Error", "Failed to assign trainer.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Available Trainers</Text>
      <FlatList
        data={trainers}
        keyExtractor={(item) => item.trainer_user_id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>
              {item.first_name} {item.last_name}
            </Text>
            <Text style={styles.detail}>Email: {item.email}</Text>
            <Text style={styles.detail}>
              Experience: {item.years_experience} years
            </Text>
            <Text style={styles.bio}>{item.bio}</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => assignTrainer(item.trainer_user_id)}>
              <Text style={styles.buttonText}>Select Trainer</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default AthleteTrainerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  detail: {
    fontSize: 14,
    marginVertical: 2,
  },
  bio: {
    fontStyle: "italic",
    marginTop: 6,
  },
  button: {
    backgroundColor: "#007BFF",
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
