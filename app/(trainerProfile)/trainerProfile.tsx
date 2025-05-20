import { StyleSheet, Text, View, SafeAreaView, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import api from "../../utils/api";
import ThemedTitle from "../../components/ThemedTitle";
import ThemedCircle from "../../components/ThemedCircle";
import ThemedText from "../../components/ThemedText";
import ThemedLable from "../../components/ThemedLable";
import ThemedCard from "../../components/ThemedCard";
import Spacer from "../../components/Spacer";

const TrainerProfile = () => {
  //interface for typescript
  interface Trainer {
    trainer_user_id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    years_experience: number;
    bio: string;
  }

  //state vaiable
  const [trainer, setTrainer] = useState<Trainer | null>(null);

  useEffect(() => {
    //async function to fetch
    const fetchTrainer = async () => {
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

        //variable to handle api call
        const response = await api.get(`/trainers/${trainer_user_id}`);
        //set state variable with response
        setTrainer(response.data);
      } catch (error) {
        //catch and log if any errors
        console.error("Error fetching trainer:", error);
      }
    };
    //call function
    fetchTrainer();
  }, []);

  return (
    <SafeAreaView style={{ backgroundColor: "#FFF0F5", flex: 1 }}>
      {trainer ? (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View>
            <ThemedTitle style={{ marginTop: 30 }}>Your Profile </ThemedTitle>
            <Spacer height={50} />
            <ThemedCard>
              <ThemedLable>Name</ThemedLable>
              <ThemedText>
                {trainer.last_name},{trainer.first_name}
              </ThemedText>
              <ThemedLable>Email</ThemedLable>
              <ThemedText>{trainer.email}</ThemedText>
              <ThemedLable>Bio</ThemedLable>
              <ThemedText>{trainer.bio}</ThemedText>
            </ThemedCard>
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

const styles = StyleSheet.create({});
