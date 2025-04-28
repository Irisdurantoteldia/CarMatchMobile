import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const EmptyState = ({ iconName, title, subtitle }) => (
  <View style={styles.emptyContainer}>
    <Ionicons name={iconName} size={60} color="#ccc" />
    <Text style={styles.emptyText}>{title}</Text>
    <Text style={styles.emptySubtext}>{subtitle}</Text>
  </View>
);

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 15,
    marginBottom: 5,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
});

export default EmptyState;