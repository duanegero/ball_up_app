import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
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

const TrainerDrills = () => {
  //instance of router
  const router = useRouter();

  //useState variables
  const [drills, setDrills] = useState<Drill[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deletingDrillId, setDeletingDrillId] = useState<number | null>(null);

  const fetchTrainerDrills = async () => {
    try {
      const data = await getTrainerDrills();
      setDrills(data);
    } catch (error) {
      console.error("Failed to load trainer drills:", error);
      Alert.alert("Error", "Could not load drills.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTrainerDrills();
    }, [])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchTrainerDrills();
  }, []);

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
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>My Drills</Text>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#9ca3af"
          />
        }>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#28a745" />
          </View>
        ) : drills.length === 0 ? (
          <Text style={styles.noDrillsText}>No drills found.</Text>
        ) : (
          drills.map((drill) => {
            const isDeleting = deletingDrillId === drill.drill_id;

            return (
              <View key={drill.drill_id} style={styles.card}>
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
                  accessibilityLabel={
                    isDeleting
                      ? `Deleting drill ${drill.drill_type}`
                      : `Delete drill ${drill.drill_type}`
                  }
                  accessibilityRole="button">
                  {isDeleting ? (
                    <ActivityIndicator size="small" color="#fff" />
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
        onPress={() => router.push("/createDrill")}>
        <Text style={styles.addText}>Add New Drill</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default TrainerDrills;
