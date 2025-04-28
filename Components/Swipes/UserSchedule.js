import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const DAYS = ["Dilluns", "Dimarts", "Dimecres", "Dijous", "Divendres"];
const HOURS = [
  "8:00",
  "9:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

const UserSchedule = ({ schedule }) => {
  const [selectedDay, setSelectedDay] = useState(DAYS[0]);

  const renderDayTabs = () => (
    <View style={styles.daysContainer}>
      {DAYS.map((day) => (
        <TouchableOpacity
          key={day}
          style={[styles.dayTab, selectedDay === day && styles.selectedDayTab]}
          onPress={() => setSelectedDay(day)}
        >
          <Text
            style={[
              styles.dayText,
              selectedDay === day && styles.selectedDayText,
            ]}
          >
            {day.substring(0, 3)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderTimeSlots = () => {
    const daySchedule = schedule[selectedDay.toLowerCase()] || {};

    return (
      <View style={styles.timeSlotsContainer}>
        {HOURS.map((hour) => {
          const isAvailable = daySchedule[hour] === true;
          return (
            <View
              key={hour}
              style={[
                styles.timeSlot,
                isAvailable ? styles.availableSlot : styles.unavailableSlot,
              ]}
            >
              <Text style={styles.timeText}>{hour}</Text>
              <Text style={styles.availabilityText}>
                {isAvailable ? "Disponible" : "No disponible"}
              </Text>
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderDayTabs()}
      {renderTimeSlots()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 10,
  },
  daysContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e1e1e1",
  },
  dayTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
  },
  selectedDayTab: {
    backgroundColor: "#E1F5FE",
  },
  dayText: {
    fontSize: 14,
    color: "#666",
  },
  selectedDayText: {
    fontWeight: "bold",
    color: "#0288D1",
  },
  timeSlotsContainer: {
    paddingVertical: 10,
  },
  timeSlot: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  availableSlot: {
    backgroundColor: "#E8F5E9",
  },
  unavailableSlot: {
    backgroundColor: "#FFEBEE",
  },
  timeText: {
    fontSize: 14,
    fontWeight: "500",
  },
  availabilityText: {
    fontSize: 14,
    color: "#666",
  },
});

export default UserSchedule;
