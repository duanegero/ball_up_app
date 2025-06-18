import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const DashboardLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "white",
          paddingTop: 10,
          height: 90,
        },
        tabBarActiveTintColor: "#3B82F6",
        tabBarInactiveTintColor: "black",
      }}>
      <Tabs.Screen
        name="athleteProfile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="athleteSession"
        options={{
          title: "Sessions",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "list" : "list-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="athleteTrainer"
        options={{
          title: "Trainers",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "body" : "body-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
};
export default DashboardLayout;
