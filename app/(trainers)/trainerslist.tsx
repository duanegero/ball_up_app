import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";

import api from "../../utils/api";

const TrainersList = () => {
  const [trainers, setTrainer] = useState([]);

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const response = await api.get("/trainers");
        setTrainer(response.data);
      } catch (error) {
        console.error("Error fetching trainers:", error);
      }
    };
    fetchTrainers();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trainer List:</Text>
      {trainers.map((trainer: any) => (
        <Text key={trainer.trainer_user_id} style={styles.trainer}>
          {trainer.first_name}
        </Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 50,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  trainer: {
    fontSize: 18,
    marginVertical: 5,
  },
});

export default TrainersList;
