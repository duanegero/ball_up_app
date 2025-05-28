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

const AthleteProfile = () => {
  //interface for typescript
  interface Athlete {
    athlete_user_id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    age: number;
    level: number;
  }

  //state vaiable
  const [athlete, setAthlete] = useState<Athlete | null>(null);

  useEffect(() => {
    //async function to fetch
    const fetchAthlete = async () => {
      try {
        //getting the id from storage
        const idString = await AsyncStorage.getItem("athleteId");

        //if nothing returned responed error
        if (!idString) {
          console.warn("No athlete ID found.");
          return;
        }

        //make id a number
        const athlete_user_id = parseInt(idString, 10);

        //variable to handle api call
        const response = await api.get(`/athletes/${athlete_user_id}`);

        //set state variable with response
        setAthlete(response.data);
      } catch (error) {
        //catch and log if any errors
        console.error("Error fetching trainer:", error);
      }
    };
    //call function
    fetchAthlete();
  }, []);

  return (
    <SafeAreaView style={{ backgroundColor: "#FFF0F5", flex: 1 }}>
      {athlete ? (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View>
            <ThemedTitle style={{ marginTop: 30 }}>Your Profile</ThemedTitle>
            <Spacer height={50} />
            <ThemedCard>
              <ThemedLable>Name</ThemedLable>
              <ThemedText>
                {athlete.last_name}, {athlete.first_name}
              </ThemedText>

              <ThemedLable>Email</ThemedLable>
              <ThemedText>{athlete.email}</ThemedText>

              <ThemedLable>Username</ThemedLable>
              <ThemedText>{athlete.username}</ThemedText>
            </ThemedCard>

            <View style={{ alignItems: "center" }}>
              <ThemedLable>Age</ThemedLable>
              <ThemedCircle value={athlete.age} />

              <Spacer height={20} />

              <ThemedLable>Level</ThemedLable>
              <ThemedCircle value={athlete.level} />
            </View>
          </View>
        </ScrollView>
      ) : (
        <Text>Loading...</Text>
      )}
    </SafeAreaView>
  );
};

export default AthleteProfile;
