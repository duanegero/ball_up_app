import {
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Trainer } from "../../../components/types";
import { getTrainerById } from "../../../utils/apiServices";
import { styles } from "../../../styles/trainerProfile.styles";
import {
  APP_ACTIVITY_INDICATOR_COLOR,
  APP_ACTIVITY_INDICATOR_SIZE,
} from "../../../components/constants";

const TrainerProfile = () => {
  //variable to handle router
  const router = useRouter();

  //useState varaibles
  const [trainer, setTrainer] = useState<Trainer | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);

  //async callback function to fetch and load trainer
  const fetchTrainer = useCallback(async () => {
    setIsRetrying(true);
    try {
      const trainerData = await getTrainerById();
      if (trainerData) {
        setTrainer(trainerData);
        setError(null);
      } else {
        setError("Failed to load profile. Please try again later.");
        console.error("Fetch Trainer returned null or undefined");
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
      fetchTrainer();
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
          await AsyncStorage.removeItem("trainerId");
          router.replace("/");
        },
      },
    ]);
  };

  return (
    <SafeAreaView
      style={styles.safeArea}
      accessibilityLabel="Trainer profile screen">
      {error ? (
        <View
          style={styles.errorContainer}
          accessible={true}
          accessibilityRole="alert"
          accessibilityLiveRegion="assertive">
          <Text style={styles.errorText} accessibilityLabel={`Error: ${error}`}>
            {error}
          </Text>
          <Pressable
            onPress={fetchTrainer}
            style={[styles.retryButton, isRetrying && { opacity: 0.5 }]}
            disabled={isRetrying}
            accessibilityRole="button"
            accessibilityLabel="Retry loading trainer profile"
            accessibilityHint="Attempts to reload the trainer profile"
            accessibilityState={{ busy: isRetrying, disabled: isRetrying }}>
            <Text style={styles.retryText}>
              {isRetrying ? "Retrying..." : "Retry"}
            </Text>
          </Pressable>
        </View>
      ) : trainer ? (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.topButtonRow}>
            <Pressable
              onPress={handleLogout}
              style={styles.iconButton}
              accessibilityRole="button"
              accessibilityLabel="Log out"
              accessibilityHint="Logs out of the trainer account">
              <Ionicons name="log-out-outline" size={20} color="#ef4444" />
            </Pressable>
          </View>

          <View
            style={styles.profileImagePlaceholder}
            accessible={true}
            accessibilityLabel={`Profile initials: ${
              trainer?.first_name?.[0] ?? ""
            }${trainer?.last_name?.[0] ?? ""}`}
            accessibilityRole="image">
            <Text style={styles.profileInitials}>
              {trainer?.first_name?.[0] ?? ""}
              {trainer?.last_name?.[0] ?? ""}
            </Text>
          </View>

          <Text
            style={styles.title}
            accessibilityRole="header"
            accessibilityLabel={`${trainer.username}'s Profile`}>
            {trainer.username}'s Profile
          </Text>

          <View
            style={styles.card}
            accessible={true}
            accessibilityLabel="Trainer Details">
            <View style={styles.cardTopRight}>
              <Pressable
                onPress={() => router.push("/trainerEditProfile")}
                hitSlop={10}
                accessibilityRole="button"
                accessibilityLabel="Edit profile"
                accessibilityHint="Navigates to edit profile screen">
                <Ionicons
                  name="ellipsis-horizontal"
                  size={24}
                  color="#2563eb"
                  accessibilityIgnoresInvertColors={false}
                />
              </Pressable>
            </View>

            <Text style={styles.sectionTitle} accessibilityRole="header">
              Trainer Details
            </Text>

            <Text style={styles.label}>Name</Text>
            <Text
              style={styles.value}
              accessibilityLabel={`Name: ${trainer.first_name} ${trainer.last_name}`}>
              {trainer.first_name} {trainer.last_name}
            </Text>

            <Text style={styles.label}>Email</Text>
            <Text
              style={styles.value}
              accessibilityLabel={`Email: ${trainer.email}`}>
              {trainer.email}
            </Text>

            <Text style={styles.label}>Years of Experience</Text>
            <Text
              style={styles.value}
              accessibilityLabel={`Years of experience: ${trainer.years_experience}`}>
              {trainer.years_experience}
            </Text>

            <Text style={styles.label}>Bio</Text>
            <Text
              style={styles.value}
              accessibilityLabel={`Bio: ${trainer.bio || "No bio provided."}`}>
              {trainer.bio || "No bio provided."}
            </Text>
          </View>
        </ScrollView>
      ) : (
        <View
          style={styles.loadingContainer}
          accessible={true}
          accessibilityRole="alert"
          accessibilityLiveRegion="assertive"
          accessibilityLabel="Loading trainer profile">
          <ActivityIndicator
            size={APP_ACTIVITY_INDICATOR_SIZE}
            color={APP_ACTIVITY_INDICATOR_COLOR}
            accessibilityLabel="Loading indicator"
          />
          <Text style={styles.loading}>Loading Profile...</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default TrainerProfile;
