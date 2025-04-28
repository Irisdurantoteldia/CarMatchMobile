import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const UserInfoHeader = ({ user, onProfilePress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onProfilePress}>
      <Image
        source={
          user.photoURL
            ? { uri: user.photoURL }
            : require("../../assets/CarMatch.png")
        }
        style={styles.avatar}
      />
      <View style={styles.textContainer}>
        <Text style={styles.name} numberOfLines={1}>
          {user.displayName || "Usuario"}
        </Text>
        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, { backgroundColor: "#4CAF50" }]} />
          <Text style={styles.statusText}>Online</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#666" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: "white",
    width: "100%",
    maxWidth: 280,
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 23,
    marginRight: 12,
    backgroundColor: "#f0f0f0",
  },
  textContainer: {
    flex: 1,
    marginRight: 10,
  },
  name: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 2,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 13,
    color: "#4CAF50",
    fontWeight: "500",
  },
});

export default UserInfoHeader;
