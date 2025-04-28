import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const SwipeButtons = ({ onLike, onDislike }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, styles.dislikeButton]}
        onPress={onDislike}
      >
        <Ionicons name="close" size={30} color="white" />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.likeButton]}
        onPress={onLike}
      >
        <Ionicons name="heart" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingVertical: 15,
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginHorizontal: 15,
  },
  likeButton: {
    backgroundColor: "#4ECB71",
  },
  dislikeButton: {
    backgroundColor: "#FF6B6B",
  },
});

export default SwipeButtons;