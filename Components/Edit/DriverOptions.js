import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const DriverOptions = ({ navigation, userData }) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Opcions de conductor</Text>

      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigation.navigate("UnavailabilityList")}
      >
        <Ionicons name="calendar" size={24} color="#007AFF" />
        <Text style={styles.menuItemText}>Gestionar indisponibilitats</Text>
        <Ionicons
          name="chevron-forward"
          size={20}
          color="#ccc"
          style={styles.arrowIcon}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigation.navigate("ManageVehicle")}
      >
        <Ionicons name="car" size={24} color="#007AFF" />
        <Text style={styles.menuItemText}>Gestionar vehicle</Text>
        <Ionicons
          name="chevron-forward"
          size={20}
          color="#ccc"
          style={styles.arrowIcon}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigation.navigate("ManageRoutes")}
      >
        <Ionicons name="map" size={24} color="#007AFF" />
        <Text style={styles.menuItemText}>Gestionar rutes</Text>
        <Ionicons
          name="chevron-forward"
          size={20}
          color="#ccc"
          style={styles.arrowIcon}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    backgroundColor: "white",
    marginVertical: 10,
    borderRadius: 10,
    overflow: "hidden",
    marginHorizontal: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  menuItem: {
    flexDirection: "row",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    alignItems: "center",
  },
  menuItemText: {
    marginLeft: 15,
    fontSize: 16,
    flex: 1,
  },
  arrowIcon: {
    marginLeft: "auto",
  },
});

export default DriverOptions;
