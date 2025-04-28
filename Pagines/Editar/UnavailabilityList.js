import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db, auth } from "../../FireBase/FirebaseConfig";
import Loader from "../../Components/UI/Loader";
import EmptyState from "../../Components/UI/EmptyState";
import FSection from "../../Navigation/FSection";

const UnavailabilityList = ({ navigation }) => {
  const [unavailabilities, setUnavailabilities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUnavailabilities();

    // Refrescar la lista cuando la pantalla obtiene el foco
    const unsubscribe = navigation.addListener("focus", () => {
      fetchUnavailabilities();
    });

    return unsubscribe;
  }, [navigation]);

  const fetchUnavailabilities = async () => {
    try {
      setLoading(true);
      const currentUser = auth.currentUser;

      if (!currentUser) {
        throw new Error("No user session found");
      }

      const unavailabilityQuery = query(
        collection(db, "dailyOverride"),
        where("driverId", "==", currentUser.uid)
      );

      const unavailabilitySnapshot = await getDocs(unavailabilityQuery);
      const unavailabilityList = unavailabilitySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        startDate: doc.data().startDate?.toDate
          ? doc.data().startDate.toDate()
          : new Date(doc.data().startDate),
        endDate: doc.data().endDate?.toDate
          ? doc.data().endDate.toDate()
          : new Date(doc.data().endDate),
      }));

      // Sort by start date (most recent first)
      unavailabilityList.sort((a, b) => b.startDate - a.startDate);

      setUnavailabilities(unavailabilityList);
    } catch (error) {
      console.error("Error fetching unavailabilities:", error);
      Alert.alert(
        "Error",
        "No s'han pogut carregar les indisponibilitats. Si us plau, torna-ho a provar més tard."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUnavailability = (id) => {
    Alert.alert(
      "Confirmar eliminació",
      "Estàs segur que vols eliminar aquesta indisponibilitat?",
      [
        {
          text: "Cancel·lar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              await deleteDoc(doc(db, "dailyOverride", id));

              // Update the list
              setUnavailabilities((prev) =>
                prev.filter((item) => item.id !== id)
              );

              Alert.alert("Èxit", "Indisponibilitat eliminada correctament.");
            } catch (error) {
              console.error("Error deleting unavailability:", error);
              Alert.alert(
                "Error",
                "No s'ha pogut eliminar la indisponibilitat. Si us plau, torna-ho a provar més tard."
              );
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("ca-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const isActive = (item) => {
    const now = new Date();
    return item.endDate >= now;
  };

  const renderItem = ({ item }) => {
    const active = isActive(item);

    return (
      <View
        style={[styles.card, active ? styles.activeCard : styles.inactiveCard]}
      >
        <View style={styles.cardHeader}>
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusDot,
                active ? styles.activeDot : styles.inactiveDot,
              ]}
            />
            <Text style={styles.statusText}>
              {active ? "Activa" : "Finalitzada"}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => handleDeleteUnavailability(item.id)}
            style={styles.deleteButton}
          >
            <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
          </TouchableOpacity>
        </View>

        <View style={styles.dateRow}>
          <Ionicons name="calendar-outline" size={18} color="#666" />
          <Text style={styles.dateText}>
            {formatDate(item.startDate)} - {formatDate(item.endDate)}
          </Text>
        </View>

        <View style={styles.reasonContainer}>
          <Text style={styles.reasonLabel}>Motiu:</Text>
          <Text style={styles.reasonText}>
            {item.cancelledTrips && item.cancelledTrips.length > 0
              ? item.cancelledTrips[0].reason
              : "No s'ha especificat"}
          </Text>
        </View>

        <View style={styles.tripsContainer}>
          <Text style={styles.tripsLabel}>
            Viatges afectats:{" "}
            {item.cancelledTrips ? item.cancelledTrips.length : 0}
          </Text>
        </View>
      </View>
    );
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
            <Text style={styles.title}>Les meves indisponibilitats</Text>
          </View>
          <Loader message="Carregant indisponibilitats..." />
        </View>
      </SafeAreaView>
    );
  }

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
          <Text style={styles.title}>Les meves indisponibilitats</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate("DriverUnavailability")}
          >
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {unavailabilities.length === 0 ? (
          <EmptyState
            iconName="calendar"
            title="No tens indisponibilitats registrades"
            subtitle="Prem el botó + per registrar una nova indisponibilitat"
          />
        ) : (
          <FlatList
            data={unavailabilities}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {/* Bottom navigation bar */}
      <View style={styles.bottomBar}>
        <FSection
          currentSection={3} // Assuming this is in the Edit section
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
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e1e1e1",
  },
  backButton: {
    marginRight: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  addButton: {
    backgroundColor: "#4CAF50",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    padding: 15,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  activeCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
  },
  inactiveCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#9E9E9E",
    opacity: 0.8,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  activeDot: {
    backgroundColor: "#4CAF50",
  },
  inactiveDot: {
    backgroundColor: "#9E9E9E",
  },
  statusText: {
    fontSize: 14,
    fontWeight: "500",
  },
  deleteButton: {
    padding: 5,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  dateText: {
    fontSize: 16,
    marginLeft: 5,
  },
  reasonContainer: {
    marginBottom: 10,
  },
  reasonLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 3,
  },
  reasonText: {
    fontSize: 16,
  },
  tripsContainer: {
    backgroundColor: "#f0f0f0",
    padding: 8,
    borderRadius: 5,
  },
  tripsLabel: {
    fontSize: 14,
    color: "#666",
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

export default UnavailabilityList;