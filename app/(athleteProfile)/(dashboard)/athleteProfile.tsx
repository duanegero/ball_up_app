//imports to use in app
import {
  Text,
  View,
  SafeAreaView,
  ScrollView,
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
import { styles } from "../../../styles/athleteProfile.styles";

const AthleteProfile = () => {
  //variable to handle router
  const router = useRouter();

  //useState varibles
  const [athlete, setAthlete] = useState<Athlete | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);

  //async function to fetch and load athlete
  const loadAthlete = useCallback(async () => {
    setIsRetrying(true);
    try {
      const data = await fetchAthlete();
      if (data) {
        setAthlete(data);
        setError(null);
      } else {
        setError("Failed to load profile. Please try again later.");
        console.error("fetchAthlete returned null or undefined");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again later.");
      console.error("Error loading athlete profile:", err);
    } finally {
      setIsRetrying(false);
    }
  }, []);

  //useFocusEffect runs everytime screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadAthlete();
    }, [])
  );

  //function to handle logout press click
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
          <Pressable
            onPress={loadAthlete}
            style={[styles.retryButton, isRetrying && { opacity: 0.5 }]}
            disabled={isRetrying}>
            <Text style={styles.retryText}>
              {isRetrying ? "Retrying..." : "Retry"}
            </Text>
          </Pressable>
        </View>
      ) : athlete ? (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.topButtonRow}>
            <Pressable
              accessible={true}
              accessibilityLabel="Log out"
              onPress={handleLogout}
              style={styles.iconButton}>
              <Ionicons name="log-out-outline" size={20} color="#ef4444" />
            </Pressable>
          </View>

          <View style={styles.profileImagePlaceholder}>
            <Text style={styles.profileInitials}>
              {athlete.first_name?.[0] ?? "?"}
              {athlete.last_name?.[0] ?? "?"}
            </Text>
          </View>

          <Text style={styles.title}>{athlete.first_name}'s Profile</Text>

          <View style={styles.card}>
            <View style={styles.cardTopRight}>
              <Pressable
                onPress={() =>
                  router.push("(athleteProfile)/athleteEditProfile")
                }
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
              {athlete.first_name ?? "N/A"} {athlete.last_name ?? "N/A"}
            </Text>

            <Text style={styles.label}>Age</Text>
            <Text style={styles.value}>{athlete.age ?? "N/A"}</Text>

            <Text style={styles.label}>Level</Text>
            <Text style={styles.value}>{athlete.level ?? "N/A"}</Text>

            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{athlete.email ?? "N/A"}</Text>
          </View>

          <View style={styles.card}>
            {athlete.trainer ? (
              <>
                <Text style={styles.sectionTitle}>Trainer Details</Text>
                <Text style={styles.label}>Trainer</Text>
                <Text style={styles.value}>
                  {athlete.trainer.first_name ?? "N/A"}{" "}
                  {athlete.trainer.last_name ?? "N/A"}
                </Text>

                <Text style={styles.label}>Experience</Text>
                <Text style={styles.value}>
                  {athlete.trainer.years_experience ?? "N/A"} years
                </Text>

                <Text style={styles.label}>Trainer Bio</Text>
                <Text style={styles.value}>{athlete.trainer.bio ?? "N/A"}</Text>
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
