import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  doc,
  getDoc,
  query,
  where,
  getDocs,
  collection,
} from "firebase/firestore";
import { db, auth } from "../../FireBase/FirebaseConfig";
import FSection from "../../Navigation/FSection";

// Components especifics per cada rol.
import DriverOptions from "../../Components/Edit/DriverOptions";
import PassengerOptions from "../../Components/Edit/PassengerOptions";

const Edit = ({ navigation }) => {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          // Buscar el usuario por userId en lugar de uid
          const usersQuery = query(
            collection(db, "users"),
            where("userId", "==", user.uid)
          );
          const userSnapshot = await getDocs(usersQuery);

          if (!userSnapshot.empty) {
            const userDoc = userSnapshot.docs[0];
            const data = userDoc.data();
            setUserData(data);
            setUserRole(data.role || "Passatger");
          } else {
            Alert.alert(
              "Error",
              "No s'ha trobat el perfil de l'usuari. Si us plau, torna a iniciar sessió."
            );
            navigation.navigate("Login");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          Alert.alert(
            "Error",
            "No s'han pogut carregar les dades de l'usuari. Si us plau, torna-ho a provar més tard."
          );
          navigation.navigate("Login");
        }
      } else {
        navigation.navigate("Login");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigation]);

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Carregant...</Text>
        </View>
      );
    }

    if (!userData) {
      return (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>
            No s'han pogut carregar les dades
          </Text>
        </View>
      );
    }

    return (
      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Perfil</Text>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate("Account", { userData })}
          >
            <Ionicons name="person" size={24} color="#007AFF" />
            <Text style={styles.menuItemText}>Editar perfil</Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color="#ccc"
              style={styles.arrowIcon}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() =>
              navigation.navigate("EditSchedule", {
                userId: auth.currentUser.uid,
              })
            }
          >
            <Ionicons name="time" size={24} color="#007AFF" />
            <Text style={styles.menuItemText}>Editar horari</Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color="#ccc"
              style={styles.arrowIcon}
            />
          </TouchableOpacity>
        </View>

        {/* Opciones específicas según el rol */}
        {userRole === "Conductor" ? (
          <DriverOptions navigation={navigation} userData={userData} />
        ) : (
          <PassengerOptions navigation={navigation} userData={userData} />
        )}
      </ScrollView>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Editar</Text>
          </View>

          <ScrollView
            style={styles.content}
            keyboardShouldPersistTaps="handled"
          >
            {renderContent()}
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
    justifyContent: "center",
    paddingVertical: 15,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e1e1e1",
    zIndex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: "white",
    marginVertical: 10,
    borderRadius: 10,
    overflow: "hidden",
    marginHorizontal: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  menuItem: {
    flexDirection: "row",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    alignItems: "center",
  },
  menuItemText: {
    marginLeft: 15,
    fontSize: 16,
    flex: 1,
  },
  arrowIcon: {
    marginLeft: "auto",
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
  content: {
    flex: 1,
  },
});

export default Edit;
