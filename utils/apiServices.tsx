import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api";
import { Athlete, Trainer } from "../components/types";

//function to fetch athlete from api/db
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

//function to fetch athlete sessions from api/db
export const fetchAthleteSessions = async () => {
  const idString = await AsyncStorage.getItem("athleteId");
  if (!idString) {
    throw new Error("No athlete ID found.");
  }

  const athlete_user_id = parseInt(idString, 10);
  const response = await api.get(
    `/athletes/athlete_sessions/${athlete_user_id}`
  );

  if (response.data?.athlete_sessions) {
    return response.data.athlete_sessions;
  } else {
    return [];
  }
};

// Mark a session as complete for the athlete
export const completeAthleteSession = async (
  athlete_user_id: number,
  session_id: number
): Promise<void> => {
  try {
    await api.delete(`/athletes/session/${athlete_user_id}/${session_id}`);
  } catch (error) {
    console.error("Error completing session:", error);
    throw error;
  }
};

//function to fetch trainer from api/db
export const fetchTrainers = async (): Promise<Trainer[]> => {
  try {
    const response = await api.get("/trainers");
    return response.data;
  } catch (error) {
    console.error("Error fetching trainers:", error);
    throw error;
  }
};

//function to assign trainer to an athlete in api/db
export const assignTrainerToAthlete = async (
  trainer_user_id: number
): Promise<void> => {
  try {
    const idString = await AsyncStorage.getItem("athleteId");
    if (!idString) {
      throw new Error("Missing Athlete ID.");
    }

    const athlete_user_id = parseInt(idString, 10);

    await api.put(`/athletes/assign_trainer/${athlete_user_id}`, {
      trainer_user_id,
    });
  } catch (error) {
    console.error("Error assigning trainer:", error);
    throw error;
  }
};

// Athlete login
export const loginAthlete = async (username: string, password: string) => {
  try {
    const response = await api.post("/athlete_login", {
      username,
      password,
    });

    const {
      token,
      username: loggedInUsername,
      athlete_user_id,
    } = response.data;

    await AsyncStorage.setItem("athleteToken", token);
    await AsyncStorage.setItem("athleteId", athlete_user_id.toString());

    return { loggedInUsername };
  } catch (error: any) {
    console.error("Login error:", error);
    const message =
      error.response?.data?.message || "An error occurred during login.";
    throw new Error(message);
  }
};

// Athlete sign up
export const signUpAthlete = async (athleteData: {
  email: string;
  username: string;
  password: string;
  first_name: string;
  last_name: string;
  age: number;
  level: number;
}) => {
  try {
    const response = await api.post("/athletes", athleteData);
    return response.data;
  } catch (error: any) {
    console.error("Sign up error:", error);
    const message =
      error.response?.data?.message || "An error occurred during sign up.";
    throw new Error(message);
  }
};

// Trainer login
export const loginTrainer = async (
  username: string,
  password: string
): Promise<{ loggedInUsername: string }> => {
  try {
    const response = await api.post("/trainer_login", {
      username,
      password,
    });

    const {
      token,
      username: loggedInUsername,
      trainer_user_id,
    } = response.data;

    await AsyncStorage.setItem("trainerToken", token);
    await AsyncStorage.setItem("trainerId", trainer_user_id.toString());

    return { loggedInUsername };
  } catch (error: any) {
    console.error("Login error:", error);
    const message =
      error.response?.data?.message || "An error occurred during login.";
    throw new Error(message);
  }
};

// Trainer sign up
export const signUpTrainer = async (trainerData: {
  email: string;
  username: string;
  password: string;
  first_name: string;
  last_name: string;
  years_experience: number;
  bio: string;
}) => {
  try {
    const response = await api.post("/trainers", trainerData);
    return response.data;
  } catch (error: any) {
    console.error("Trainer sign up error:", error);
    const message =
      error.response?.data?.message || "An error occurred during sign up.";
    throw new Error(message);
  }
};
