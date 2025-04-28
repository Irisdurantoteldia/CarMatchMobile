import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  SafeAreaView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db, auth } from "../../FireBase/FirebaseConfig";
import Loader from "../../Components/UI/Loader";
import FSection from "../../Navigation/FSection";

const DriverUnavailability = ({ navigation }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(Date.now() + 86400000)); // Tomorrow
  const [reason, setReason] = useState("");
  const [trips, setTrips] = useState([]);
  const [selectedTrips, setSelectedTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  useEffect(() => {
    fetchUserTrips();
  }, []);

  const fetchUserTrips = async () => {
    try {
      setLoading(true);
      const currentUser = auth.currentUser;

      if (!currentUser) {
        throw new Error("No user session found");
      }

      // Fetch trips where the current user is the driver
      const tripsQuery = query(
        collection(db, "trips"),
        where("driverId", "==", currentUser.uid)
      );    

      const tripsSnapshot = await getDocs(tripsQuery);
      const tripsList = tripsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setTrips(tripsList);
    } catch (error) {
      console.error("Error fetching trips:", error);
      Alert.alert(
        "Error",
        "No s'han pogut carregar els viatges. Si us plau, torna-ho a provar més tard."
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleTripSelection = (tripId) => {
    setSelectedTrips((prevSelected) => {
      if (prevSelected.includes(tripId)) {
        return prevSelected.filter((id) => id !== tripId);
      } else {
        return [...prevSelected, tripId];
      }
    });
  };

  const handleSaveUnavailability = async () => {
    if (selectedTrips.length === 0) {
      Alert.alert("Error", "Si us plau, selecciona almenys un viatge.");
      return;
    }

    if (!reason.trim()) {
      Alert.alert(
        "Error",
        "Si us plau, indica el motiu de la indisponibilitat."
      );
      return;
    }

    try {
      setLoading(true);
      const currentUser = auth.currentUser;

      if (!currentUser) {
        throw new Error("No user session found");
      }

      // Get affected users (passengers) from selected trips
      const affectedUsers = new Set();
      const selectedTripObjects = trips.filter((trip) =>
        selectedTrips.includes(trip.id)
      );

      selectedTripObjects.forEach((trip) => {
        if (trip.passengers && Array.isArray(trip.passengers)) {
          trip.passengers.forEach((passenger) => {
            affectedUsers.add(passenger.userId);
          });
        }
      });

      // Create the dailyOverride document
      const overrideData = {
        notificationUsers: Array.from(affectedUsers),
        cancelledTrips: selectedTrips.map((tripId) => ({
          tripId,
          endDate: endDate,
          reason: reason,
          userId: currentUser.uid,
        })),
        createdAt: new Date(),
        startDate: startDate,
        endDate: endDate,
        driverId: currentUser.uid,
      };

      // After creating the dailyOverride document
      await addDoc(collection(db, "dailyOverride"), overrideData);

      // Create notifications for affected users
      const notifications = Array.from(affectedUsers).map(userId => ({
        userId,
        type: "driver_unavailability",
        title: "Conductor no disponible",
        message: `El conductor no estarà disponible del ${formatDate(startDate)} al ${formatDate(endDate)}. Motiu: ${reason}`,
        createdAt: new Date(),
        read: false,
        tripIds: selectedTrips
      }));

      // Add all notifications
      await Promise.all(
        notifications.map(notification => 
          addDoc(collection(db, "notifications"), notification)
        )
      );

      Alert.alert("Èxit", "S'ha registrat la indisponibilitat correctament.", [
        {
          text: "D'acord",
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      console.error("Error saving unavailability:", error);
      Alert.alert(
        "Error",
        "No s'ha pogut guardar la indisponibilitat. Si us plau, torna-ho a provar més tard."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("ca-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const onStartDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setShowStartDatePicker(Platform.OS === "ios");
    setStartDate(currentDate);

    // If start date is after end date, update end date
    if (currentDate > endDate) {
      setEndDate(new Date(currentDate.getTime() + 86400000)); // Next day
    }
  };

  const onEndDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || endDate;
    setShowEndDatePicker(Platform.OS === "ios");

    // Ensure end date is not before start date
    if (currentDate >= startDate) {
      setEndDate(currentDate);
    } else {
      Alert.alert(
        "Error",
        "La data final no pot ser anterior a la data d'inici."
      );
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color="#007AFF" />
            </TouchableOpacity>
            <Text style={styles.title}>Registrar Indisponibilitat</Text>
          </View>
          <Loader message="Carregant..." />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color="#007AFF" />
            </TouchableOpacity>
            <Text style={styles.title}>Registrar Indisponibilitat</Text>
          </View>

          <ScrollView 
            style={styles.content}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Període d'indisponibilitat</Text>

              <View style={styles.dateContainer}>
                <Text style={styles.dateLabel}>Data d'inici:</Text>
                <TouchableOpacity
                  style={styles.dateButton}
                  onPress={() => setShowStartDatePicker(true)}
                >
                  <Text style={styles.dateButtonText}>
                    {formatDate(startDate)}
                  </Text>
                  <Ionicons name="calendar" size={20} color="#007AFF" />
                </TouchableOpacity>
              </View>

              {showStartDatePicker && (
                <DateTimePicker
                  value={startDate}
                  mode="date"
                  display="default"
                  onChange={onStartDateChange}
                  minimumDate={new Date()}
                />
              )}

              <View style={styles.dateContainer}>
                <Text style={styles.dateLabel}>Data final:</Text>
                <TouchableOpacity
                  style={styles.dateButton}
                  onPress={() => setShowEndDatePicker(true)}
                >
                  <Text style={styles.dateButtonText}>{formatDate(endDate)}</Text>
                  <Ionicons name="calendar" size={20} color="#007AFF" />
                </TouchableOpacity>
              </View>

              {showEndDatePicker && (
                <DateTimePicker
                  value={endDate}
                  mode="date"
                  display="default"
                  onChange={onEndDateChange}
                  minimumDate={startDate}
                />
              )}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Motiu</Text>
              <TextInput
                style={styles.reasonInput}
                placeholder="Indica el motiu de la indisponibilitat"
                value={reason}
                onChangeText={setReason}
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Viatges afectats</Text>
              {trips.length === 0 ? (
                <Text style={styles.noTripsText}>
                  No tens viatges programats com a conductor.
                </Text>
              ) : (
                trips.map((trip) => (
                  <TouchableOpacity
                    key={trip.id}
                    style={[
                      styles.tripItem,
                      selectedTrips.includes(trip.id) && styles.selectedTripItem,
                    ]}
                    onPress={() => toggleTripSelection(trip.id)}
                  >
                    <View style={styles.tripInfo}>
                      <Text style={styles.tripRoute}>
                        {trip.from} → {trip.to}
                      </Text>
                      <Text style={styles.tripTime}>
                        {new Date(trip.date).toLocaleDateString('ca-ES', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </Text>
                      <Text style={styles.tripPassengers}>
                        {trip.passengersId ? `${trip.passengersId.length} passatgers` : "Sense passatgers"}
                      </Text>
                    </View>
                    <Ionicons
                      name={selectedTrips.includes(trip.id) ? "checkbox" : "square-outline"}
                      size={24}
                      color={selectedTrips.includes(trip.id) ? "#007AFF" : "#666"}
                    />
                  </TouchableOpacity>
                ))
              )}
            </View>

            <TouchableOpacity
              style={[
                styles.saveButton,
                (selectedTrips.length === 0 || !reason.trim()) &&
                  styles.disabledButton,
              ]}
              onPress={handleSaveUnavailability}
              disabled={selectedTrips.length === 0 || !reason.trim()}
            >
              <Text style={styles.saveButtonText}>Guardar Indisponibilitat</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Bottom navigation bar */}
        <View style={styles.bottomBar}>
          <FSection
            currentSection={3}
            onPress={(id) => {
              if (id === 1) navigation.navigate("Swipes");
              else if (id === 2) navigation.navigate("Search");
              else if (id === 3) navigation.navigate("Edit");
              else if (id === 4) navigation.navigate("Matches");
              else if (id === 5) navigation.navigate("Account");
            }}
          />
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  container: {
    flex: 1,
    paddingBottom: 80, // Add padding to account for fixed bottom bar
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e1e1e1",
    backgroundColor: "white",
  },
  backButton: {
    marginRight: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  content: {
    flex: 1,
    padding: 15,
  },
  section: {
    marginBottom: 20,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  dateLabel: {
    fontSize: 16,
    color: "#666",
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 8,
  },
  dateButtonText: {
    fontSize: 16,
    marginRight: 10,
  },
  reasonInput: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    textAlignVertical: "top",
    minHeight: 80,
  },
  tripItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    marginBottom: 10,
  },
  selectedTripItem: {
    backgroundColor: "#e3f2fd",
    borderColor: "#2196f3",
    borderWidth: 1,
  },
  tripInfo: {
    flex: 1,
  },
  tripRoute: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 5,
  },
  tripTime: {
    fontSize: 14,
    color: "#666",
    marginBottom: 3,
  },
  tripPassengers: {
    fontSize: 14,
    color: "#666",
  },
  noTripsText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 30,
  },
  disabledButton: {
    backgroundColor: "#A5D6A7",
    opacity: 0.7,
  },
  saveButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    paddingVertical: 5,
    borderTopWidth: 1,
    borderTopColor: "#e1e1e1",
    zIndex: 1,
  },
});

export default DriverUnavailability;
