import React from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  Platform,
  Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { collection, addDoc, serverTimestamp, getDoc, doc, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "../../FireBase/FirebaseConfig";

const ChatInput = ({ 
  newMessage, 
  setNewMessage, 
  sendMessage, 
  inputRef,
  matchId,
  otherUserId  // Add this prop
}) => {
  const handleSend = () => {
    Keyboard.dismiss();
    sendMessage();
  };

  const handleRequestTrip = async () => {
    try {
      // Get match information first
      const matchDoc = await getDoc(doc(db, "matches", matchId));
      if (!matchDoc.exists()) {
        Alert.alert("Error", "No s'ha trobat la informació del match");
        return;
      }

      const matchData = matchDoc.data();
      const otherUserId = matchData.users.find(id => id !== auth.currentUser?.uid);

      // Query users collection with userId field
      const usersRef = collection(db, "users");
      const [currentUserQuery, otherUserQuery] = await Promise.all([
        getDocs(query(usersRef, where("userId", "==", auth.currentUser.uid))),
        getDocs(query(usersRef, where("userId", "==", otherUserId)))
      ]);

      if (currentUserQuery.empty) {
        console.error("Current user doc not found");
        Alert.alert("Error", "No s'ha trobat la informació del usuari actual");
        return;
      }

      if (otherUserQuery.empty) {
        console.error("Other user doc not found");
        Alert.alert("Error", "No s'ha trobat la informació del altre usuari");
        return;
      }

      const currentUserData = currentUserQuery.docs[0].data();
      const otherUserData = otherUserQuery.docs[0].data();

      // Check if we have all required data
      if (!currentUserData.role || !currentUserData.location || !currentUserData.desti ||
          !otherUserData.role || !otherUserData.location || !otherUserData.desti) {
        Alert.alert("Error", "Falta informació necessària dels usuaris");
        return;
      }

      // Determine driver and passenger based on roles
      let driverId, from, to;
      const passengersId = [];

      if (currentUserData.role.toLowerCase() === "conductor") {
        driverId = auth.currentUser.uid;
        from = currentUserData.location;
        to = currentUserData.desti;
        passengersId.push(otherUserId);
      } else {
        driverId = otherUserId;
        from = otherUserData.location;
        to = otherUserData.desti;
        passengersId.push(auth.currentUser.uid);
      }

      // Create trip document
      const tripRef = await addDoc(collection(db, "trips"), {
        createdAt: serverTimestamp(),
        date: new Date().toISOString(),
        driverId,
        from,
        to,
        passengersId,
        status: "pending"  // Add status field
      });

      // Create trip request message
      const messagesRef = collection(db, "matches", matchId, "messages");
      await addDoc(messagesRef, {
        type: "trip_request",
        sender: auth.currentUser.uid,
        receiver: otherUserId,
        timestamp: serverTimestamp(),
        status: "pending",
        tripId: tripRef.id,
        text: "🚗 Viatge creat correctament.",
        systemMessage: true,
        tripInfo: {
          from,
          to,
          driverId,
          passengersId,
          date: new Date().toISOString(),
          driver: {
            id: driverId,
            displayName: driverId === auth.currentUser.uid ? 
              (currentUserData.displayName || currentUserData.email || 'Conductor') : 
              (otherUserData.displayName || otherUserData.email || 'Conductor'),
            role: "conductor"
          },
          passenger: {
            id: driverId === auth.currentUser.uid ? otherUserId : auth.currentUser.uid,
            displayName: driverId === auth.currentUser.uid ? 
              (otherUserData.displayName || otherUserData.email || 'Passatger') : 
              (currentUserData.displayName || currentUserData.email || 'Passatger'),
            role: "passatger"
          }
        },
        actions: {
          accept: {
            label: "Acceptar",
            action: "accept_trip"
          },
          reject: {
            label: "Rebutjar",
            action: "reject_trip"
          }
        },
        metadata: {
          needsResponse: true,
          responseFrom: otherUserId,
          requestedAt: serverTimestamp(),
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours from now
        }
      });

      // After successfully creating the trip and message
      const isDriver = currentUserData.role.toLowerCase() === "conductor";
      if (isDriver) {
        Alert.alert("Èxit", "Viatge creat correctament.");
      } else {
        Alert.alert("Èxit", "Sol·licitud de viatge enviada al conductor.");
      }
    } catch (error) {
      console.error("Error al enviar la sol·licitud:", error);
      Alert.alert("Error", "No s'ha pogut crear el viatge");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.tripButton}
        onPress={handleRequestTrip}
      >
        <Ionicons name="car-outline" size={24} color="#007AFF" />
      </TouchableOpacity>

      <View style={styles.inputContainer}>
        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder="Escriu un missatge..."
          value={newMessage}
          onChangeText={setNewMessage}
          returnKeyType="send"
          onSubmitEditing={newMessage.trim() ? handleSend : null}
          blurOnSubmit={false}
        />
      </View>

      <TouchableOpacity
        style={[styles.sendButton, { opacity: newMessage.trim() ? 1 : 0.5 }]}
        onPress={handleSend}
        disabled={!newMessage.trim()}
      >
        <Ionicons name="send" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  inputContainer: {
    flex: 1,
    backgroundColor: "#F0F2F5",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    minHeight: 40,
    maxHeight: 100,
    textAlignVertical: "center",
  },
  input: {
    flex: 1,
  },
  sendButton: {
    backgroundColor: "#007AFF",
    borderRadius: 25,
    width: 45,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  tripButton: {
    backgroundColor: "white",
    borderRadius: 25,
    width: 45,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
});

export default ChatInput;
