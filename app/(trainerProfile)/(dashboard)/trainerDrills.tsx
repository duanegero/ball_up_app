import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useFocusEffect, useRouter } from "expo-router";
import { Drill } from "../../../components/types";
import { deleteDrillById, getTrainerDrills } from "../../../utils/apiServices";
import { styles } from "../../../styles/trainerDrills.styles";
import {
  APP_ACTIVITY_INDICATOR_COLOR,
  APP_ACTIVITY_INDICATOR_SIZE,
} from "../../../components/constants";

const TrainerDrills = () => {
  //instance of router
  const router = useRouter();

  //useState variables
  const [drills, setDrills] = useState<Drill[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deletingDrillId, setDeletingDrillId] = useState<number | null>(null);

  //async function to fetch and load trainer drills
  const fetchTrainerDrills = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getTrainerDrills();
      if (data) {
        setDrills(data);
      } else {
        console.error("Fetch Trainer Drills returned null or undefined");
        Alert.alert("Data error");
      }
    } catch (error) {
      console.error("Failed to load trainer drills:", error);
      Alert.alert("Error", "Could not load drills.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  //useFocusEffect runs everytime screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchTrainerDrills();
    }, [])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchTrainerDrills();
  }, []);

  //async function to handle delete press
  const handleDelete = (drill_id: number) => {
    if (deletingDrillId !== null) {
      return;
    }
    Alert.alert("Delete Drill", "Are you sure you want to delete this drill?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          setDeletingDrillId(drill_id);
          try {
            await deleteDrillById(drill_id);
            setDrills((prevDrills) =>
              prevDrills.filter((d) => d.drill_id !== drill_id)
            );
            Alert.alert(
              "Drill Deleted",
              "Drill has been deleted from the list."
            );
          } catch (error) {
            console.error("Failed to delete drill:", error);
            Alert.alert("Error", "Failed to delete drill.");
          } finally {
            setDeletingDrillId(null);
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView
      style={styles.container}
      accessibilityLabel="My Drills screen"
      accessibilityHint="View and manage your drills">
      <Text
        style={styles.heading}
        accessibilityRole="header"
        accessibilityLabel="My Drills">
        My Drills
      </Text>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#9ca3af"
            accessibilityLabel="Pull to refresh drills list"
          />
        }
        accessible={true}>
        {loading ? (
          <View
            style={styles.loadingContainer}
            accessible={true}
            accessibilityRole="alert"
            accessibilityLiveRegion="assertive"
            accessibilityLabel="Loading drills, please wait">
            <ActivityIndicator
              size={APP_ACTIVITY_INDICATOR_SIZE}
              color={APP_ACTIVITY_INDICATOR_COLOR}
              accessibilityLabel="Loading indicator"
            />
          </View>
        ) : drills.length === 0 ? (
          <Text
            style={styles.noDrillsText}
            accessibilityLiveRegion="polite"
            accessibilityLabel="No drills found">
            No drills found.
          </Text>
        ) : (
          drills.map((drill) => {
            const isDeleting = deletingDrillId === drill.drill_id;

            return (
              <View
                key={drill.drill_id}
                style={styles.card}
                accessible={true}
                accessibilityLabel={`Drill: ${drill.drill_name}, Type: ${drill.drill_type}, Level: ${drill.level}, Description: ${drill.description}`}>
                <Text style={styles.drillName}>{drill.drill_name}</Text>

                <Text style={styles.label}>Type:</Text>
                <Text style={styles.value}>{drill.drill_type}</Text>

                <Text style={styles.label}>Level:</Text>
                <Text style={styles.value}>{drill.level}</Text>

                <Text style={styles.label}>Description:</Text>
                <Text style={styles.value}>{drill.description}</Text>

                <TouchableOpacity
                  style={[
                    styles.deleteButton,
                    isDeleting && styles.deleteButtonDisabled,
                  ]}
                  onPress={() => handleDelete(drill.drill_id)}
                  disabled={isDeleting}
                  accessibilityRole="button"
                  accessibilityLabel={
                    isDeleting
                      ? `Deleting drill ${drill.drill_name}`
                      : `Delete drill ${drill.drill_name}`
                  }
                  accessibilityHint="Deletes this drill"
                  accessibilityState={{
                    busy: isDeleting,
                    disabled: isDeleting,
                  }}>
                  {isDeleting ? (
                    <ActivityIndicator
                      size="small"
                      color="#fff"
                      accessibilityLabel="Deleting drill"
                    />
                  ) : (
                    <Ionicons name="trash" size={20} color="#fff" />
                  )}
                  <Text style={styles.deleteText}>
                    {isDeleting ? "Deleting..." : "Delete"}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("/createDrill")}
        accessibilityRole="button"
        accessibilityLabel="Add new drill"
        accessibilityHint="Navigates to create new drill screen">
        <Text style={styles.addText}>Add New Drill</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default TrainerDrills;
