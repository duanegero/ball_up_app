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
  const [refreshing, setRefreshing] = useState(false);

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
    const loadData = async () => {
      await Promise.all([loadAthlete(), loadTrainers()]);
    };
    loadData();
  }, []);

  //async function to assign a trainer
  const assignTrainer = async (trainer_user_id: number) => {
    if (assigning) return;
    setAssigning(true);
    try {
      await assignTrainerToAthlete(trainer_user_id);
      setSelectedTrainerId(trainer_user_id);
      Alert.alert("Success", "The trainer has been assigned successfully.");
    } catch (error) {
      Alert.alert("Error", "Failed to assign the trainer. Please try again.");
    } finally {
      setAssigning(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTrainers();
    setRefreshing(false);
  };

  return (
    <SafeAreaView
      style={styles.container}
      accessible={true}
      accessibilityRole="summary"
      accessibilityLabel="Available trainers screen">
      <Text
        style={styles.heading}
        accessibilityRole="header"
        accessibilityLabel="Available Trainers">
        Available Trainers
      </Text>

      {loading ? (
        <ActivityIndicator
          size={APP_ACTIVITY_INDICATOR_SIZE}
          color={APP_ACTIVITY_INDICATOR_COLOR}
          style={{ marginTop: 20 }}
          accessibilityLabel="Loading trainers"
          accessibilityRole="progressbar"
        />
      ) : (
        <FlatList
          refreshing={refreshing}
          onRefresh={onRefresh}
          initialNumToRender={5}
          contentContainerStyle={{ paddingBottom: 20 }}
          data={trainers}
          keyExtractor={(item) => item.trainer_user_id.toString()}
          accessibilityRole="list"
          accessibilityLabel="List of available trainers"
          renderItem={({ item }) => (
            <View
              style={styles.card}
              accessible={true}
              accessibilityLabel={`Trainer: ${item.first_name} ${item.last_name}`}>
              <Text
                style={styles.name}
                accessibilityRole="text"
                accessibilityLabel={`Name: ${item.first_name} ${item.last_name}`}>
                {item.first_name} {item.last_name}
              </Text>
              <Text
                style={styles.detail}
                accessibilityRole="text"
                accessibilityLabel={`Email: ${item.email}`}>
                Email: {item.email}
              </Text>
              <Text
                style={styles.detail}
                accessibilityRole="text"
                accessibilityLabel={`Experience: ${item.years_experience} years`}>
                Experience: {item.years_experience} years
              </Text>
              <Text
                style={styles.bio}
                accessibilityRole="text"
                accessibilityLabel={`Bio: ${item.bio}`}>
                {item.bio}
              </Text>
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
                onPress={() => assignTrainer(item.trainer_user_id)}
                accessibilityRole="button"
                accessibilityLabel={
                  selectedTrainerId === item.trainer_user_id
                    ? "Trainer assigned"
                    : assigning
                      ? "Assigning trainer"
                      : "Select trainer"
                }
                accessibilityHint="Selects this trainer for assignment">
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
