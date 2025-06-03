//imports to use in app
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Pressable,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Athlete } from "../../../components/types";
import { fetchAthlete } from "../../../utils/apiServices";

//variable to handle width of window
const { width } = Dimensions.get("window");

const AthleteProfile = () => {
  //variable to handle router
  const router = useRouter();

  //useState varaibles
  const [athlete, setAthlete] = useState<Athlete | null>(null);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      //async function to load athletes
      const loadAthlete = async () => {
        const data = await fetchAthlete();
        if (data) {
          setAthlete(data);
        } else {
          setError("Failed to load profile. Please try again later.");
        }
      };

      loadAthlete();
    }, [])
  );

  const handleLogout = async () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.removeItem("athleteId");
          router.replace("/");
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {error ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loading}>{error}</Text>
        </View>
      ) : athlete ? (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.topButtonRow}>
            <Pressable onPress={handleLogout} style={styles.iconButton}>
              <Ionicons name="log-out-outline" size={20} color="#ef4444" />
            </Pressable>
          </View>

          <View style={styles.profileImagePlaceholder}>
            <Text style={styles.profileInitials}>
              {athlete.first_name[0]}
              {athlete.last_name[0]}
            </Text>
          </View>

          <Text style={styles.title}>{athlete.first_name}'s Profile</Text>

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

            <Text style={styles.sectionTitle}>Athlete Details</Text>

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
                <Text style={styles.sectionTitle}>Trainer Details</Text>
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
    paddingHorizontal: 2,
    marginBottom: 12,
  },
  cardTopRight: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 1,
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
