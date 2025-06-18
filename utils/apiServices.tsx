import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api";
import {
  Athlete,
  Trainer,
  DrillResponse,
  SessionDrill,
} from "../components/types";

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

//function to fetch a athlete profile
export const fetchAthleteProfile = async (athlete_user_id: number) => {
  const response = await api.get(`/athletes/${athlete_user_id}`);
  return response.data;
};

//function to update a athlete profile
export const updateAthleteProfile = async (
  athlete_user_id: number,
  data: { [key: string]: string | number }
) => {
  const res = await api.put(`/athletes/${athlete_user_id}`, data);
  return res;
};

//function to update a trainer profile
export const updateTrainerProfile = async (
  trainer_user_id: number,
  data: { [key: string]: string | number }
) => {
  const res = await api.put(`/trainers/${trainer_user_id}`, data);
  return res;
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

// function to mark session as complete for the athlete
export const completeAthleteSession = async (
  athlete_user_id: number,
  session_id: number
): Promise<void> => {
  try {
    await api.put(
      `/athletes/athlete_sessions/${athlete_user_id}/${session_id}`,
      {
        completed: true,
      }
    );
  } catch (error) {
    console.error("Error completing session:", error);
    throw error;
  }
};

//function to fetch all trainers from api/db
export const fetchTrainers = async (): Promise<Trainer[]> => {
  try {
    const response = await api.get("/trainers");
    return response.data;
  } catch (error) {
    console.error("Error fetching trainers:", error);
    throw error;
  }
};

//function to fetch trainer profile
export const fetchTrainerProfile = async (trainer_user_id: number) => {
  try {
    const response = await api.get(`/trainers/${trainer_user_id}`);
    return response.data; // return only data for easier use
  } catch (error) {
    console.error("Error fetching trainer profile:", error);
    // Optionally, wrap and throw a custom error or return null
    throw new Error("Unable to fetch trainer profile");
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

// function to check athlete login
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

// function to try athlete sign up
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

//function to check trainer login
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

// function to try trainer sign up
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

//function to create a new drill
export const createDrill = async ({
  drill_type,
  level,
  description,
  drill_name,
}: {
  drill_type: string;
  level: number;
  description: string;
  drill_name: string;
}): Promise<DrillResponse> => {
  const idString = await AsyncStorage.getItem("trainerId");
  if (!idString) {
    throw new Error("No trainer ID found.");
  }

  const trainer_user_id = parseInt(idString, 10);

  const response = await api.post<DrillResponse>("/drills", {
    drill_type,
    level,
    description,
    trainer_user_id,
    drill_name,
  });

  return response.data;
};

//function to create new session
export const createSession = async ({
  length,
  level,
  session_name,
  trainer_user_id,
}: {
  length: number;
  level: number;
  session_name: string;
  trainer_user_id: number;
}) => {
  return await api.post("/sessions", {
    length,
    level,
    session_name,
    trainer_user_id,
  });
};

//function to fetch session drills
export const fetchSessionDrills = async (sessionId: string) => {
  try {
    const response = await api.get(`/sessions/session_drills/${sessionId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching session drills:", error);
    throw error;
  }
};

//function to fetch trainer drills
export const fetchTrainerDrills = async (trainerId: number) => {
  try {
    const response = await api.get(`/trainers/drills/${trainerId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching trainer drills:", error);
    throw error;
  }
};

//function to add a drill to a session
export const addDrillToSession = async (sessionId: string, drillId: number) => {
  try {
    await api.post(`/sessions/session_drills/${sessionId}`, {
      drill_id: drillId,
    });
  } catch (error) {
    console.error("Failed to add drill to session:", error);
    throw error;
  }
};

//function to remove a drill from a session
export const removeDrillFromSession = async (
  sessionId: string,
  drillId: number
) => {
  try {
    await api.delete(`/sessions/session_drills/${drillId}`, {
      data: { session_id: Number(sessionId) },
    });
  } catch (error) {
    console.error("Failed to delete session drill:", error);
    throw error;
  }
};

//function to fetch trainer data
export const fetchTrainerData = async (): Promise<{
  trainer_user_id: number;
  sessions: any[];
  athletes: any[];
} | null> => {
  try {
    const idString = await AsyncStorage.getItem("trainerId");
    if (!idString) {
      console.warn("No trainer ID found.");
      return null;
    }

    const trainer_user_id = parseInt(idString, 10);

    const [sessionsRes, athletesRes] = await Promise.all([
      api.get(`/trainers/sessions/${trainer_user_id}`),
      api.get(`/trainers/athletes/${trainer_user_id}`),
    ]);

    return {
      trainer_user_id,
      sessions: sessionsRes.data,
      athletes: athletesRes.data,
    };
  } catch (error) {
    console.error("Error fetching trainer data", error);
    throw error;
  }
};

//function to get athlete session
export const getAthleteSessions = async (athleteId: number) => {
  try {
    const response = await api.get(`/athletes/athlete_sessions/${athleteId}`);
    return response.data.athlete_sessions; // return just the array
  } catch (error) {
    console.error("Error fetching athlete sessions", error);
    throw error;
  }
};

//function to assign session to athlete
export const putSessionToAthlete = async (
  sessionId: number,
  athleteUserId: number
) => {
  try {
    const response = await api.post(`/athletes/athlete_sessions/${sessionId}`, {
      athlete_user_id: athleteUserId,
    });
    return response.data;
  } catch (error) {
    console.error("Error assigning session to athlete:", error);
    throw error;
  }
};

//function to remove athlete from trainer
export const removeAthleteFromTrainer = async (athleteUserId: number) => {
  try {
    const idString = await AsyncStorage.getItem("trainerId");
    const trainer_user_id = idString ? parseInt(idString, 10) : null;

    if (!trainer_user_id) {
      throw new Error("Trainer ID not found in storage.");
    }

    const response = await api.delete(`/trainers/athlete/${athleteUserId}`, {
      data: { trainer_user_id },
    });

    return response.data;
  } catch (error) {
    console.error("API error removing athlete:", error);
    throw error;
  }
};

//function to get trainer drills
export const getTrainerDrills = async () => {
  try {
    const idString = await AsyncStorage.getItem("trainerId");
    if (!idString) {
      throw new Error("No trainer ID found.");
    }

    const trainer_user_id = Number(idString);
    if (isNaN(trainer_user_id)) {
      throw new Error("Invalid trainer ID.");
    }

    const response = await api.get(`/trainers/drills/${trainer_user_id}`);
    return response.data;
  } catch (error) {
    console.error("API error fetching trainer drills:", error);
    throw error;
  }
};

//function to delete a drill
export const deleteDrillById = async (drill_id: number) => {
  try {
    await api.delete(`/drills/${drill_id}`);
  } catch (error) {
    console.error("API error deleting drill:", error);
    throw error;
  }
};

//function to get trainer
export const getTrainerById = async () => {
  try {
    const idString = await AsyncStorage.getItem("trainerId");

    if (!idString) {
      throw new Error("Trainer ID not found.");
    }

    const trainer_user_id = parseInt(idString, 10);
    if (isNaN(trainer_user_id)) {
      throw new Error("Invalid trainer ID.");
    }

    const response = await api.get(`/trainers/${trainer_user_id}`);
    return response.data;
  } catch (error) {
    console.error("API error fetching trainer:", error);
    throw error;
  }
};

//function to get all trainer session
export const getTrainerSessions = async () => {
  try {
    const idString = await AsyncStorage.getItem("trainerId");

    if (!idString) {
      throw new Error("Trainer ID not found.");
    }

    const trainer_user_id = parseInt(idString, 10);
    if (isNaN(trainer_user_id)) {
      throw new Error("Invalid trainer ID.");
    }

    const response = await api.get(`/trainers/sessions/${trainer_user_id}`);
    return response.data;
  } catch (error) {
    console.error("API error fetching trainer sessions:", error);
    throw error;
  }
};

//function to get sessio n drills
export const getSessionDrills = async (
  sessionId: number
): Promise<SessionDrill[]> => {
  try {
    const response = await api.get(`/sessions/session_drills/${sessionId}`);
    return response.data;
  } catch (error) {
    console.error("API error fetching session drills:", error);
    throw new Error("Could not fetch drills");
  }
};

//function to delete trainer session
export const deleteTrainerSession = async (
  sessionId: number
): Promise<void> => {
  try {
    await api.delete(`/sessions/${sessionId}`);
  } catch (error) {
    console.error("API error deleting session:", error);
    throw new Error("Could not delete session");
  }
};

//function to delete athlete session
export const deleteAthleteSession = async (
  athlete_user_id: number,
  session_id: number
): Promise<void> => {
  try {
    console.log("Deleting session with:", athlete_user_id, session_id);

    await api.delete(`athletes/session/${athlete_user_id}/${session_id}`);
  } catch (error) {
    console.error("API error deleting session:", error);
    throw new Error("Could not delete session");
  }
};

export const resetAthletePassword = async (
  athlete_user_id: number,
  currentPassword: string,
  newPassword: string
): Promise<void> => {
  try {
    await api.put(`athletes/password/${athlete_user_id}`, {
      currentPassword,
      newPassword,
    });
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error(
        "An unexpected error occurred while resetting the password."
      );
    }
  }
};

export const resetTrainerPassword = async (
  trainer_user_id: number,
  currentPassword: string,
  newPassword: string
): Promise<void> => {
  try {
    await api.put(`trainers/password/${trainer_user_id}`, {
      currentPassword,
      newPassword,
    });
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error(
        "An unexpected error occurred while resetting the password."
      );
    }
  }
};
