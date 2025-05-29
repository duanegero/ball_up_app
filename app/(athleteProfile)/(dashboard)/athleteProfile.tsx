import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import api from "../../../utils/api";

const { width } = Dimensions.get("window");

const AthleteProfile = () => {
  const router = useRouter();

  interface Athlete {
    athlete_user_id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    age: number;
    level: number;
  }

  const [athlete, setAthlete] = useState<Athlete | null>(null);

  useEffect(() => {
    const fetchAthlete = async () => {
      try {
        const idString = await AsyncStorage.getItem("athleteId");
        if (!idString) {
          console.warn("No athlete ID found.");
          return;
        }
        const athlete_user_id = parseInt(idString, 10);
        const response = await api.get(`/athletes/${athlete_user_id}`);
        setAthlete(response.data);
      } catch (error) {
        console.error("Error fetching athlete:", error);
      }
    };
    fetchAthlete();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      {athlete ? (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Profile Initials Placeholder */}
          <View style={styles.profileImagePlaceholder}>
            <Text style={styles.profileInitials}>
              {athlete.first_name[0]}
              {athlete.last_name[0]}
            </Text>
          </View>

          {/* Username as title */}
          <Text style={styles.title}>{athlete.username}</Text>

          {/* Profile info card */}
          <View style={styles.card}>
            <Text style={styles.label}>Full Name</Text>
            <Text style={styles.value}>
              {athlete.first_name} {athlete.last_name}
            </Text>

            <Text style={styles.label}>Age</Text>
            <Text style={styles.value}>{athlete.age}</Text>

            <Text style={styles.label}>Level</Text>
            <Text style={styles.value}>{athlete.level}</Text>

            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{athlete.email}</Text>
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
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.loading}>Loading Profile...</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default AthleteProfile;

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
  profileImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#d1d5db",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 16,
  },
  profileInitials: {
    fontSize: 28,
    fontWeight: "700",
    color: "#374151",
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
  levelContainer: {
    alignItems: "center",
    marginTop: 10,
  },
  levelLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6b7280",
    marginBottom: 16,
  },
  levelCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#2563eb",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  levelValue: {
    fontSize: 32,
    fontWeight: "800",
    color: "#ffffff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loading: {
    fontSize: 16,
    textAlign: "center",
    color: "#6b7280",
    marginTop: 20,
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
