import React from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function FButton({
  selectedIcon,
  unselectedIcon,
  id,
  isSelected,
  onPress,
  isCircular = false,
}) {
  return (
    <TouchableOpacity
      onPress={() => onPress(id)}
      style={styles.buttonContainer}
    >
      <View style={[styles.iconContainer, isCircular && styles.circular]}>
        <Icon
          name={isSelected ? selectedIcon : unselectedIcon}
          size={isCircular ? 40 : 30}
          color={isSelected ? "#000" : "#666"} // Canviat per fer les icones més visibles
          style={styles.icon}
        />
        {isSelected && <View style={styles.selectedLine} />}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 10,
  },
  circular: {
    backgroundColor: "transparent", // Canviat a transparent
    borderRadius: 50,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    margin: 5,
  },
  selectedLine: {
    height: 2,
    backgroundColor: "black",
    width: 50,
    marginTop: 5,
  },
});
