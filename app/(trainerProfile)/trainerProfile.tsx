import { StyleSheet, Text, View, SafeAreaView, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import api from "../../utils/api";
import ThemedTitle from "../../components/ThemedTitle";
import ThemedCircle from "../../components/ThemedCircle";
import ThemedText from "../../components/ThemedText";
import ThemedLable from "../../components/ThemedLable";
import Spacer from "../../components/Spacer";

const TrainerProfile = () => {
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
        const idString = await AsyncStorage.getItem("trainerId");

        if (!idString) {
          console.warn("No trainer ID found.");
          return;
        }

        const trainer_user_id = parseInt(idString, 10);

        const response = await api.get(`/trainers/${trainer_user_id}`);
        setTrainer(response.data);
      } catch (error) {
        console.error("Error fetching trainer:", error);
      }
    };

    fetchTrainer();
  }, []);

  return (
    <SafeAreaView style={{ backgroundColor: "#FFF0F5", flex: 1 }}>
      {trainer ? (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View>
            <ThemedTitle style={{ marginTop: 30 }}>Your Profile </ThemedTitle>
            <Spacer height={50} />
            <View style={styles.shadowCard}>
              <ThemedLable>Name</ThemedLable>
              <ThemedText>
                {trainer.last_name},{trainer.first_name}
              </ThemedText>
              <ThemedLable>Email</ThemedLable>
              <ThemedText>{trainer.email}</ThemedText>
              <ThemedLable>Bio</ThemedLable>
              <ThemedText>{trainer.bio}</ThemedText>
            </View>
            <View style={{ alignItems: "center" }}>
              <ThemedLable>Years Experience</ThemedLable>
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
  lable: {
    fontFamily: "Avenir",
    fontWeight: "bold",
    fontSize: 24,
    color: "#708090",
    letterSpacing: 2,
    marginVertical: 10,
    borderBottomWidth: 2,
    paddingHorizontal: 10,
    borderColor: "#708090",
  },
});
