import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import React from "react";

export default function DashboardScreen() {
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert("Confirm Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => router.push("/login"),
      },
    ]);
  };

  const services = [
    {
      title: "Get Data",
      icon: "camera",
      route: "/hardcopy-scan",
      color: "#1ABC9C",
    },

    {
      title: "Review",
      icon: "document-text",
      route: "/review-data",
      color: "#F39C12",
    },
    {
      title: "Explore",
      icon: "chatbox-ellipses",
      route: "/explore",
      color: "#9B59B6",
    },
    {
      title: "Profile",
      icon: "person-circle",
      route: "/profile",
      color: "#2980B9",
    },
    {
      title: "Settings",
      icon: "settings",
      route: "/settings",
      color: "#27AE60",
    },
    {
      title: "About",
      icon: "information-circle",
      route: "/about",
      color: "#E67E22",
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>OPERATOR DASHBOARD</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={26} color="#E74C3C" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.grid}>
        {services.map((service, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() => router.push(service.route as any)}
          >
            <Ionicons
              name={service.icon as any}
              size={40}
              color={service.color}
            />
            <Text style={styles.cardTitle}>{service.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: "#F4F6F8",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2C3E50",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "47%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 28,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#ccc",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  cardTitle: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
    textAlign: "center",
  },
});
