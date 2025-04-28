import React from "react";
import { View, Text, Button } from "react-native";
import FButton from "./FButton";

export default function FSection({ currentSection, onPress }) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
      }}
    >
      <FButton
        selectedIcon="car"
        unselectedIcon="car-outline"
        id={1}
        onPress={onPress}
        isSelected={currentSection == 1}
      />

      <FButton
        selectedIcon="magnify"
        unselectedIcon="magnify"
        id={2}
        onPress={onPress}
        isSelected={currentSection == 2}
      />

      <FButton
        selectedIcon="calendar"
        unselectedIcon="calendar-outline"
        id={3}
        onPress={onPress}
        isSelected={currentSection == 3}
      />

      <FButton
        selectedIcon="message"
        unselectedIcon="message-outline"
        id={4}
        onPress={onPress}
        isSelected={currentSection == 4}
      />

      <FButton
        selectedIcon="account"
        unselectedIcon="account-outline"
        id={5}
        onPress={onPress}
        isSelected={currentSection == 5}
      />
    </View>
  );
}
