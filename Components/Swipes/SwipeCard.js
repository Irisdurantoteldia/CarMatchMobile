import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const SwipeCard = ({ user, detailedView, onToggleDetailedView }) => {
  if (!user) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: user.photo || "https://via.placeholder.com/150" }}
          style={styles.userImage}
        />
        <View style={styles.headerInfo}>
          <Text style={styles.name}>{user.nom}</Text>
          <Text style={styles.role}>{user.role}</Text>
          <Text style={styles.location}>
            {user.location} → {user.desti}
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        nestedScrollEnabled={true}
      >
        <View style={styles.userInfo}>
          {user.carInfo && user.carInfo.length > 0 && (
            <View style={styles.carInfo}>
              <Ionicons name="car" size={18} color="#333" />
              <Text style={styles.carInfoText}>
                {user.carInfo[0]} • {user.carInfo[1]} • {user.carInfo[2]} places
              </Text>
            </View>
          )}

          <TouchableOpacity
            onPress={onToggleDetailedView}
            style={styles.scheduleToggle}
          >
            <Text style={styles.scheduleToggleText}>
              {detailedView ? "Veure horari bàsic" : "Veure horari detallat"}
            </Text>
          </TouchableOpacity>

          {!detailedView ? (
            <View style={styles.daySchedule}>
              <View style={styles.dayHeader}>
                <Ionicons name="calendar" size={16} color="#007AFF" />
                <Text style={styles.dayText}>Horari bàsic</Text>
              </View>
              <View style={styles.dayDetails}>
                <View style={styles.timeSlot}>
                  <Ionicons name="time-outline" size={14} color="#666" />
                  <Text style={styles.timeLabel}>Entrada:</Text>
                  <Text style={styles.timeValue}>
                    {user.detailedSchedule?.days[0]?.horaEntrada ||
                      "No disponible"}
                  </Text>
                </View>
                <View style={styles.timeSlot}>
                  <Ionicons name="time-outline" size={14} color="#666" />
                  <Text style={styles.timeLabel}>Sortida:</Text>
                  <Text style={styles.timeValue}>
                    {user.detailedSchedule?.days[0]?.horaSortida ||
                      "No disponible"}
                  </Text>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.detailedSchedule}>
              <Text style={styles.scheduleTitle}>Horari detallat:</Text>
              {user.detailedSchedule?.days?.map((day, index) => (
                <View key={index} style={styles.daySchedule}>
                  <View style={styles.dayHeader}>
                    <Ionicons name="calendar" size={16} color="#007AFF" />
                    <Text style={styles.dayText}>{getDayName(index)}</Text>
                  </View>
                  <View style={styles.dayDetails}>
                    <View style={styles.timeSlot}>
                      <Ionicons name="time-outline" size={14} color="#666" />
                      <Text style={styles.timeLabel}>Entrada:</Text>
                      <Text style={styles.timeValue}>{day.horaEntrada}</Text>
                    </View>
                    <View style={styles.timeSlot}>
                      <Ionicons name="time-outline" size={14} color="#666" />
                      <Text style={styles.timeLabel}>Sortida:</Text>
                      <Text style={styles.timeValue}>{day.horaSortida}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

// Helper function to get day names in Catalan
const getDayName = (index) => {
  const days = ["Dilluns", "Dimarts", "Dimecres", "Dijous", "Divendres"];
  return days[index] || `Dia ${index + 1}`;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 20,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#2962FF",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  header: {
    flexDirection: "row",
    padding: 20,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#e1e1e1",
  },
  userImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  role: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  location: {
    fontSize: 14,
    color: "#666",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  userInfo: {
    padding: 20,
  },
  carInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  carInfoText: {
    marginLeft: 5,
    fontSize: 16,
    color: "#333",
  },
  scheduleToggle: {
    marginBottom: 15,
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  scheduleToggleText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "500",
  },
  scheduleTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  detailedSchedule: {
    marginBottom: 15,
  },
  daySchedule: {
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    overflow: "hidden",
  },
  dayHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e9f5ff",
    padding: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  dayText: {
    fontWeight: "bold",
    marginLeft: 8,
    fontSize: 16,
    color: "#333",
  },
  dayDetails: {
    padding: 12,
  },
  timeSlot: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  timeLabel: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
    width: 60,
  },
  timeValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
});

export default SwipeCard;
