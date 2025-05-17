import { StyleSheet, Text, View, SafeAreaView, ScrollView } from "react-native";
import { Link, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import api from "../../utils/api";
import ThemedTitle from "../../components/ThemedTitle";
import ThemedCircle from "../../components/ThemedCircle";
import ThemedText from "../../components/ThemedText";
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
    <SafeAreaView style={{ backgroundColor: "#FFF0F5", flex: 1 }}>
      {trainer ? (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View>
            <ThemedTitle style={{ marginTop: 30 }}>Your Profile </ThemedTitle>
            <Spacer height={140} />
            <View style={styles.shadowCard}>
              <ThemedText
                style={{
                  marginVertical: 10,
                  borderBottomWidth: 1,
                  paddingHorizontal: 10,
                }}>
                Name
              </ThemedText>
              <ThemedText>
                {trainer.last_name},{trainer.first_name}
              </ThemedText>
              <ThemedText
                style={{
                  marginVertical: 10,
                  borderBottomWidth: 1,
                  paddingHorizontal: 10,
                }}>
                Email
              </ThemedText>
              <ThemedText>{trainer.email}</ThemedText>
              <ThemedText
                style={{
                  marginVertical: 10,
                  borderBottomWidth: 1,
                  paddingHorizontal: 10,
                }}>
                Bio
              </ThemedText>
              <ThemedText>{trainer.bio}</ThemedText>
            </View>
            <View style={{ alignItems: "center" }}>
              <ThemedText>Years Experience</ThemedText>
              <ThemedCircle value={trainer.years_experience} />
            </View>
          </View>
        </ScrollView>
      ) : (
        <Text>Loading...</Text>
      )}
    </SafeAreaView>
  );
};

export default TrainerProfile;

const styles = StyleSheet.create({
  shadowCard: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 24,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
  },
});
