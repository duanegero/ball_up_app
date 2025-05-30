import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Pressable,
  Dimensions,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";

import api from "../../../utils/api";

const { width } = Dimensions.get("window");

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

  const handleLogout = async () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.removeItem("trainerId");
          router.replace("/");
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {trainer ? (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.topButtonRow}>
            <Pressable onPress={handleLogout} style={styles.iconButton}>
              <Ionicons name="log-out-outline" size={20} color="#ef4444" />
            </Pressable>
          </View>

          <View style={styles.profileImagePlaceholder}>
            <Text style={styles.profileInitials}>
              {trainer.first_name[0]}
              {trainer.last_name[0]}
            </Text>
          </View>
          <Text style={styles.title}>{trainer.username}'s Profile</Text>

          <View style={styles.card}>
            <View style={styles.cardTopRight}>
              <Pressable
                onPress={() => router.push("/editProfile")}
                hitSlop={10}>
                <Ionicons
                  name="ellipsis-horizontal"
                  size={24}
                  color="#2563eb"
                />
              </Pressable>
            </View>
            <Text style={styles.sectionTitle}>Trainer Details</Text>
            <Text style={styles.label}>Name</Text>
            <Text style={styles.value}>
              {trainer.first_name} {trainer.last_name}
            </Text>

            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{trainer.email}</Text>

            <Text style={styles.label}>Years of Experience</Text>
            <Text style={styles.value}>{trainer.years_experience}</Text>

            <Text style={styles.label}>Bio</Text>
            <Text style={styles.value}>{trainer.bio}</Text>
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
  safeArea: {
    flex: 1,
    backgroundColor: "#f2f4f7",
  },
  scrollContainer: {
    padding: 20,
    flexGrow: 1,
  },
  title: {
    fontSize: width * 0.07,
    fontWeight: "700",
    color: "#1f2937",
    textAlign: "center",
    marginBottom: 30,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },

  heading: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6b7280",
    marginTop: 12,
  },
  value: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111827",
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
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#3b82f6",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 16,
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  profileInitials: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#ffffff",
  },
  topButtonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 2,
    marginBottom: 12,
  },
  cardTopRight: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 1,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2563eb", // blue-600
  },
  logoutButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6b7280", // gray-500
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 10,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fee2e2",
    justifyContent: "center",
    alignItems: "center",
  },
});
