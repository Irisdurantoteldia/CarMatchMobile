import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const MatchCard = ({ item, onPress }) => (
  <TouchableOpacity style={styles.matchCard} onPress={() => onPress(item)}>
    <Image source={{ uri: item.photo }} style={styles.matchPhoto} />
    <View style={styles.matchInfo}>
      <Text style={styles.matchName}>{item.nom}</Text>
      <Text style={styles.matchRole}>{item.role}</Text>
      <View style={styles.locationContainer}>
        <Ionicons name="location" size={16} color="#666" />
        <Text style={styles.matchLocation}>
          {item.location} → {item.desti}
        </Text>
      </View>
      {item.lastMessage && (
        <Text style={styles.lastMessage} numberOfLines={1}>
          {item.lastMessage.sender === item.currentUserId ? "Tu: " : ""}
          {item.lastMessage.text}
        </Text>
      )}
    </View>
    <Ionicons
      name="chatbubble-outline"
      size={24}
      color="#007AFF"
      style={styles.chatIcon}
    />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  matchCard: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    alignItems: "center",
  },
  matchPhoto: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
  },
  matchInfo: {
    flex: 1,
  },
  matchName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  matchRole: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  matchLocation: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: "#888",
    fontStyle: "italic",
  },
  chatIcon: {
    padding: 10,
  },
});

export default MatchCard;