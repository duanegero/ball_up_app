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
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import api from "../../../utils/api";
import Ionicons from "react-native-vector-icons/Ionicons";

const { width } = Dimensions.get("window");

const AthleteProfile = () => {
  const router = useRouter();

  interface Trainer {
    first_name: string;
    last_name: string;
    bio: string;
    years_experience: number;
  }

  interface Athlete {
    athlete_user_id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    age: number;
    level: number;
    trainer?: Trainer;
  }

  const [athlete, setAthlete] = useState<Athlete | null>(null);

  // Replace useEffect with useFocusEffect
  useFocusEffect(
    useCallback(() => {
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
    }, [])
  );

  const handleLogout = async () => {
    await AsyncStorage.removeItem("athleteId");
    router.replace("/"); // or route to login screen
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {athlete ? (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.topButtonRow}>
            <Pressable onPress={handleLogout} hitSlop={10}>
              <Ionicons name="log-out-outline" size={24} color="#6b7280" />
            </Pressable>
          </View>

          <View style={styles.profileImagePlaceholder}>
            <Text style={styles.profileInitials}>
              {athlete.first_name[0]}
              {athlete.last_name[0]}
            </Text>
          </View>

          <Text style={styles.title}>{athlete.username}'s Proflie</Text>

          <View style={styles.card}>
            <View style={styles.cardTopRight}>
              <Pressable
                onPress={() => router.push("(athleteProfile)/editProfile")}
                hitSlop={10}>
                <Ionicons
                  name="ellipsis-horizontal"
                  size={24}
                  color="#2563eb"
                />
              </Pressable>
            </View>

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
          <View style={styles.card}>
            {athlete.trainer ? (
              <>
                <Text style={styles.label}>Trainer</Text>
                <Text style={styles.value}>
                  {athlete.trainer.first_name} {athlete.trainer.last_name}
                </Text>

                <Text style={styles.label}>Experience</Text>
                <Text style={styles.value}>
                  {athlete.trainer.years_experience} years
                </Text>

                <Text style={styles.label}>Trainer Bio</Text>
                <Text style={styles.value}>{athlete.trainer.bio}</Text>
              </>
            ) : (
              <>
                <Text style={styles.label}>Trainer</Text>
                <Text style={styles.value}>No trainer assigned</Text>
              </>
            )}
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
  topButtonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  cardTopRight: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 1,
  },
});
