import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import api from "../../../utils/api";

const TrainerProfile = () => {
  const router = useRouter();

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
    <SafeAreaView style={styles.container}>
      {trainer ? (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.heading}>Your Profile</Text>

          <View style={styles.card}>
            <Text style={styles.label}>Name</Text>
            <Text style={styles.value}>
              {trainer.first_name} {trainer.last_name}
            </Text>

            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{trainer.email}</Text>

            <Text style={styles.label}>Bio</Text>
            <Text style={styles.value}>{trainer.bio}</Text>

            <Text style={styles.label}>Years of Experience</Text>
            <Text style={styles.experience}>{trainer.years_experience}</Text>
          </View>
          <View style={styles.editButtonContainer}>
            <Pressable
              style={styles.editButton}
              onPress={() => router.push("/editProfile")}>
              <Text style={styles.editButtonText}>Edit</Text>
            </Pressable>
          </View>
        </ScrollView>
      ) : (
        <Text style={styles.loading}>Loading...</Text>
      )}
    </SafeAreaView>
  );
};

export default TrainerProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 24,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    marginTop: 4,
  },
  experience: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#007BFF",
    textAlign: "center",
    marginTop: 10,
  },
  loading: {
    marginTop: 20,
    textAlign: "center",
  },
  editButtonContainer: {
    alignItems: "center",
    marginTop: 10,
  },

  editButton: {
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },

  editButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});
