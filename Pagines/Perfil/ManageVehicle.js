import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  TextInput,
} from "react-native";
import { auth, db } from "../../FireBase/FirebaseConfig";
import { 
  doc, 
  updateDoc, 
  getDoc, 
  collection, 
  query, 
  where, 
  getDocs 
} from "firebase/firestore";
import Loader from "../../Components/UI/Loader";

const ManageVehicle = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [carInfo, setCarInfo] = useState({
    name: "",
    color: "",
    seats: "",
  });

  useEffect(() => {
    fetchCarInfo();
  }, []);

  const fetchCarInfo = async () => {
    try {
      setLoading(true);
      const userQuery = query(
        collection(db, "users"),
        where("userId", "==", auth.currentUser.uid)
      );
      const userSnapshot = await getDocs(userQuery);
      
      if (!userSnapshot.empty) {
        const userData = userSnapshot.docs[0].data();
        if (userData.carInfo && Array.isArray(userData.carInfo)) {
          const [model, color, seats] = userData.carInfo;
          setCarInfo({
            name: model || "",
            color: color || "",
            seats: seats?.toString() || "",
          });
        }
      }
    } catch (error) {
      console.error("Error fetching car info:", error);
      Alert.alert("Error", "No s'ha pogut carregar la informació del vehicle");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const userQuery = query(
        collection(db, "users"),
        where("userId", "==", auth.currentUser.uid)
      );
      const userSnapshot = await getDocs(userQuery);
      
      if (!userSnapshot.empty) {
        const userDoc = userSnapshot.docs[0];
        const carInfo = [
          carInfo.name,
          carInfo.color,
          parseInt(carInfo.seats) || 0
        ];
        
        await updateDoc(doc(db, "users", userDoc.id), {
          carInfo: carInfo // Changed from vehicle to carInfo
        });
        Alert.alert("Èxit", "Informació del vehicle actualitzada correctament");
        navigation.goBack();
      }
    } catch (error) {
      console.error("Error updating car info:", error);
      Alert.alert("Error", "No s'ha pogut actualitzar la informació del vehicle");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader message="Carregant..." />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Informació del Vehicle</Text>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.section}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nom del Vehicle</Text>
              <TextInput
                style={styles.input}
                value={carInfo.name}
                onChangeText={(text) => setCarInfo({ ...carInfo, name: text })}
                placeholder="Ex: Seat Ibiza"
              />

              <Text style={styles.label}>Color</Text>
              <TextInput
                style={styles.input}
                value={carInfo.color}
                onChangeText={(text) => setCarInfo({ ...carInfo, color: text })}
                placeholder="Ex: Negre"
              />

              <Text style={styles.label}>Places</Text>
              <TextInput
                style={styles.input}
                value={carInfo.seats}
                onChangeText={(text) => setCarInfo({ ...carInfo, seats: text })}
                placeholder="Ex: 5"
                keyboardType="numeric"
              />
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Guardar Canvis</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#EEF5FF",
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e1e1e1",
    paddingTop: 60,
    marginTop: -50,
  },
  backButton: {
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 10,
  },
  content: {
    flex: 1,
    padding: 15,
  },
  section: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  inputContainer: {
    gap: 15,
  },
  label: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ManageVehicle;
