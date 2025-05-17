import { StyleSheet, Text, View, SafeAreaView } from "react-native";
import { Link, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import api from "../../utils/api";
import ThemedTitle from "../../components/ThemedTitle";
import ThemedContainer from "../../components/ThemedContainer";
import Spacer from "../../components/Spacer";

const TrainerProfile = () => {
  const { trainer_user_id } = useLocalSearchParams();

  interface Trainer {
    trainer_user_id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    years_experience: number;
    bio: string;
  }

  const [trainer, setTrainer] = useState<Trainer | null>(null);

  useEffect(() => {
    const fetchTrainer = async () => {
      try {
        const response = await api.get(`/trainers/${trainer_user_id}`);
        setTrainer(response.data);
      } catch (error) {
        console.error("Error fetching trainer:", error);
      }
    };
    if (trainer_user_id) {
      fetchTrainer();
    }
  }, [trainer_user_id]);

  return (
    <SafeAreaView>
      {trainer ? (
        <View>
          <ThemedTitle>{trainer.username} </ThemedTitle>
          <Spacer height={40} />
          <View style={styles.shadowCard}>
            <Text>Name</Text>
            <Text>
              {trainer.last_name},{trainer.first_name}
            </Text>
            <Text>Email</Text>
            <Text>{trainer.email}</Text>
            <Text>Years Experience</Text>
            <Text>{trainer.years_experience}</Text>
            <Text>Bio</Text>
            <Text>{trainer.bio}</Text>
          </View>
        </View>
      ) : (
        <Text>Loading...</Text>
      )}
    </SafeAreaView>
  );
};

export default TrainerProfile;

const styles = StyleSheet.create({
  shadowCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginVertical: 10,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
