import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api";
import { Athlete } from "../components/types";

export const fetchAthlete = async (): Promise<Athlete | null> => {
  try {
    const idString = await AsyncStorage.getItem("athleteId");
    if (!idString) {
      console.warn("No athlete ID found.");
      return null;
    }

    const athlete_user_id = parseInt(idString, 10);
    const response = await api.get(`/athletes/${athlete_user_id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching athlete:", error);
    return null;
  }
};

export const logoutAthlete = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem("athleteId");
  } catch (error) {
    console.error("Error logging out:", error);
  }
};
