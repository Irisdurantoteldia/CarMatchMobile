import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import EmptyState from "../Components/UI/EmptyState";

const EmptyMatches = ({ onSwipeNow }) => {
  return (
    <View style={styles.container}>
      <EmptyState
        iconName="heart-outline"
        title="Cap 'match' encara"
        subtitle="Comença a fer 'swipe' per connectar amb algú"
      />

      <TouchableOpacity style={styles.button} onPress={onSwipeNow}>
        <Ionicons
          name="flame-outline"
          size={24}
          color="white"
          style={styles.buttonIcon}
        />
        <Text style={styles.buttonText}>Fer 'swipe' ara</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  button: {
    flexDirection: "row",
    backgroundColor: "#FF3B30",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default EmptyMatches;
