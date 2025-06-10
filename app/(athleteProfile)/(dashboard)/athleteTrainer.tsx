//imports to use in app
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { Trainer } from "../../../components/types";
import {
  fetchAthlete,
  fetchTrainers,
  assignTrainerToAthlete,
} from "../../../utils/apiServices";
import { styles } from "../../../styles/athleteTrainer.styles";
import {
  APP_ACTIVITY_INDICATOR_COLOR,
  APP_ACTIVITY_INDICATOR_SIZE,
} from "../../../components/constants";

const AthleteTrainerScreen = () => {
  //useState varibles
  const [athleteUserId, setAthleteUserId] = useState<number | null>(null);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [selectedTrainerId, setSelectedTrainerId] = useState<number | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);

  //function to load all trainers
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

  //function to load signle athlete
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

  //useeffect calling above functions
  useEffect(() => {
    loadTrainers();
  }, []);

  useEffect(() => {
    loadAthlete();
  }, []);

  //async function to assign a trainer
  const assignTrainer = async (trainer_user_id: number) => {
    if (assigning) return;
    setAssigning(true);
    setSelectedTrainerId(trainer_user_id);
    try {
      await assignTrainerToAthlete(trainer_user_id);
      Alert.alert("Success", "The trainer has been assigned successfully.");
    } catch (error) {
      Alert.alert("Error", "Failed to assign the trainer. Please try again.");
    } finally {
      setAssigning(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Available Trainers</Text>

      {loading ? (
        <ActivityIndicator
          size={APP_ACTIVITY_INDICATOR_SIZE}
          color={APP_ACTIVITY_INDICATOR_COLOR}
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
                  selectedTrainerId === item.trainer_user_id || assigning
                    ? styles.buttonDisabled
                    : null,
                ]}
                disabled={
                  assigning && selectedTrainerId === item.trainer_user_id
                }
                onPress={() => assignTrainer(item.trainer_user_id)}>
                <Text style={styles.buttonText}>
                  {selectedTrainerId === item.trainer_user_id
                    ? "Assigned"
                    : assigning
                      ? "Assigning..."
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
