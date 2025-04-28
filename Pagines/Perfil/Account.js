import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Image,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import FSection from "../../Navigation/FSection";
import { getUserById } from "../../Services/userService";
import { auth } from "../../FireBase/FirebaseConfig";
import Loader from "../../Components/UI/Loader";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../FireBase/FirebaseConfig";

const Account = ({ route, navigation }) => {
  const userId = route.params?.userId || auth.currentUser?.uid;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      Alert.alert("Error", "No s'ha pogut obtenir l'ID de l'usuari");
      navigation.goBack();
      return;
    }
    fetchUserProfile();
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const userData = await getUserById(userId);
      if (!userData) {
        Alert.alert("Error", "No s'ha trobat l'usuari");
        navigation.goBack();
        return;
      }
      setUser(userData);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      Alert.alert("Error", "No s'ha pogut carregar el perfil");
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = () => {
    // Implementar cambio de contraseña
    Alert.alert("Info", "Funcionalitat en desenvolupament");
  };

  const renderVehicleInfo = () => {
    if (!user.vehicle || !Array.isArray(user.vehicle) || user.vehicle.length !== 3) return null;

    const [model, color, seats] = user.vehicle;
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Vehicle</Text>
        <View style={styles.vehicleInfo}>
          <View style={styles.infoRow}>
            <Ionicons name="car-outline" size={20} color="#666" />
            <Text style={styles.infoText}>{model}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="color-palette-outline" size={20} color="#666" />
            <Text style={styles.infoText}>{color}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="people-outline" size={20} color="#666" />
            <Text style={styles.infoText}>{seats} places</Text>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return <Loader message="Carregant perfil..." />;
  }

  const handleRoleSwitch = async (newRole) => {
    try {
      // Get the correct document ID from the user object
      const docId = user.id || user.userId;
      if (!docId) {
        Alert.alert("Error", "No s'ha pogut trobar l'ID de l'usuari");
        return;
      }

      const userRef = doc(db, "users", docId);
      await updateDoc(userRef, {
        role: newRole
      });
      
      // Update local state
      setUser(prev => ({ ...prev, role: newRole }));
      
      // Show success message
      Alert.alert("Èxit", "S'ha actualitzat el rol correctament");
    } catch (error) {
      console.error("Error updating role:", error);
      Alert.alert("Error", "No s'ha pogut actualitzar el rol");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView style={styles.content}>
          <View style={styles.profileHeader}>
            <Image
              source={{ uri: user.photo || "https://via.placeholder.com/150" }}
              style={styles.profileImage}
            />
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userRole}>{user.role}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informació Personal</Text>
            <View style={styles.infoContainer}>
              <View style={styles.infoRow}>
                <Ionicons name="mail-outline" size={20} color="#666" />
                <Text style={styles.infoText}>{user.email}</Text>
              </View>
              {user.phone && (
                <View style={styles.infoRow}>
                  <Ionicons name="call-outline" size={20} color="#666" />
                  <Text style={styles.infoText}>{user.phone}</Text>
                </View>
              )}
              {user.bio && (
                <View style={styles.bioContainer}>
                  <Text style={styles.bioText}>{user.bio}</Text>
                </View>
              )}
            </View>
          </View>

          {userId === auth.currentUser?.uid && (
            <>
              <View style={styles.roleSwitcher}>
                <TouchableOpacity
                  style={[
                    styles.roleButton,
                    user?.role === "Conductor" && styles.activeRole
                  ]}
                  onPress={() => handleRoleSwitch("Conductor")}
                >
                  <Ionicons 
                    name="car-outline" 
                    size={24} 
                    color={user?.role === "Conductor" ? "#fff" : "#007AFF"} 
                  />
                  <Text style={[
                    styles.roleText,
                    user?.role === "Conductor" && styles.activeRoleText
                  ]}>
                    Conductor
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.roleButton,
                    user?.role === "Passatger" && styles.activeRole
                  ]}
                  onPress={() => handleRoleSwitch("Passatger")}
                >
                  <Ionicons 
                    name="person-outline" 
                    size={24} 
                    color={user?.role === "Passatger" ? "#fff" : "#007AFF"} 
                  />
                  <Text style={[
                    styles.roleText,
                    user?.role === "Passatger" && styles.activeRoleText
                  ]}>
                    Passatger
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.changePasswordButton}
                onPress={handleChangePassword}
              >
                <Ionicons name="key-outline" size={20} color="#007AFF" />
                <Text style={styles.changePasswordText}>Canviar Contrasenya</Text>
              </TouchableOpacity>
            </>
          )}

          {user.role === "Conductor" && (
            <TouchableOpacity
              style={styles.manageVehicleButton}
              onPress={() => navigation.navigate("ManageVehicle")}
            >
              <Ionicons name="car-outline" size={20} color="#007AFF" />
              <Text style={styles.manageVehicleText}>Gestionar Vehicle</Text>
            </TouchableOpacity>
          )}

          {user.role === "Conductor" && renderVehicleInfo()}

          {/* Nova secció de Configuració */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Configuració i Ajuda</Text>
            
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate("Settings")}
            >
              <Ionicons name="settings-outline" size={24} color="#007AFF" />
              <Text style={styles.menuItemText}>Configuració</Text>
              <Ionicons
                name="chevron-forward"
                size={20}
                color="#ccc"
                style={styles.arrowIcon}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate("Help")}
            >
              <Ionicons name="help-circle-outline" size={24} color="#007AFF" />
              <Text style={styles.menuItemText}>Ajuda</Text>
              <Ionicons
                name="chevron-forward"
                size={20}
                color="#ccc"
                style={styles.arrowIcon}
              />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      <View style={styles.bottomBar}>
        <FSection
          currentSection={5}
          onPress={(id) => {
            if (id === 1) navigation.navigate("Swipes");
            else if (id === 2) navigation.navigate("Search");
            else if (id === 3) navigation.navigate("Edit");
            else if (id === 4) navigation.navigate("Matches");
            else if (id === 5) return;
          }}
        />
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
  content: {
    flex: 1,
    paddingBottom: 80, // Add padding for bottom bar
  },
  profileHeader: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e1e1e1",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#007AFF",
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  userRole: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "500",
  },
  section: {
    backgroundColor: "white",
    marginTop: 12,
    marginHorizontal: 12,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  infoContainer: {
    gap: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  infoText: {
    fontSize: 15,
    color: "#444",
  },
  roleSwitcher: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    marginHorizontal: 12,
    marginTop: 12,
    gap: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
  },
  roleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#007AFF',
    backgroundColor: 'white',
    gap: 8,
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
  activeRole: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
    ...Platform.select({
      ios: {
        shadowColor: "#2962FF",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  // Eliminar la duplicació de roleText i mantenir només una versió
  roleText: {
    fontSize: 15,
    color: '#007AFF',
    fontWeight: '600',
  },
  activeRoleText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },

  // Afegir els nous estils per als botons de configuració
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
    color: "#333",
  },
  arrowIcon: {
    marginLeft: "auto",
  },
  changePasswordButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "white",
    padding: 14,
    marginTop: 12,
    marginHorizontal: 12,
    borderRadius: 12,
  },
  manageVehicleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "white",
    padding: 14,
    marginTop: 12,
    marginHorizontal: 12,
    borderRadius: 12,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#e1e1e1",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
    zIndex: 1,
  },
});

export default Account;