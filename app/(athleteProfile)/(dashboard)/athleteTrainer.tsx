import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../../utils/api";
import { Trainer } from "../../../components/types";
import {
  fetchAthlete,
  fetchTrainers,
  assignTrainerToAthlete,
} from "../../../utils/apiServices";

const AthleteTrainerScreen = () => {
  const [athleteUserId, setAthleteUserId] = useState<number | null>(null);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [selectedTrainerId, setSelectedTrainerId] = useState<number | null>(
    null
  );

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTrainers = async () => {
      try {
        setLoading(true);
        const trainersData = await fetchTrainers();
        setTrainers(trainersData);
      } catch (error) {
        console.error("Error loading trainers:", error);
        Alert.alert("Error", "Something went wrong loading trainers.");
      } finally {
        setLoading(false);
      }
    };

    loadTrainers();
  }, []);

  useEffect(() => {
    const loadAthlete = async () => {
      try {
        const athlete = await fetchAthlete();
        if (athlete && athlete.athlete_user_id) {
          setAthleteUserId(athlete.athlete_user_id);
        } else {
          console.warn("Athlete data not found.");
        }
      } catch (error) {
        console.error("Error loading athlete:", error);
      }
    };

    loadAthlete();
  }, []);

  const assignTrainer = async (trainer_user_id: number) => {
    setSelectedTrainerId(trainer_user_id);

    try {
      await assignTrainerToAthlete(trainer_user_id);
      Alert.alert("Success", "The trainer has been assigned successfully.");
    } catch (error) {
      Alert.alert("Error", "Failed to assign the trainer. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Available Trainers</Text>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#007BFF"
          style={{ marginTop: 20 }}
        />
      ) : (
        <FlatList
          initialNumToRender={5}
          contentContainerStyle={{ paddingBottom: 20 }}
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
                style={[
                  styles.button,
                  selectedTrainerId === item.trainer_user_id &&
                    styles.buttonDisabled,
                ]}
                disabled={selectedTrainerId === item.trainer_user_id}
                onPress={() => assignTrainer(item.trainer_user_id)}>
                <Text style={styles.buttonText}>
                  {selectedTrainerId === item.trainer_user_id
                    ? "Assigned"
                    : "Select Trainer"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
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
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
});
