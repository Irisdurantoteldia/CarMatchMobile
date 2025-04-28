import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Alert,
  Image,
  Modal,
  ScrollView,
  Platform,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import FSection from "../../Navigation/FSection";
import { db } from "../../FireBase/FirebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import Loader from "../../Components/UI/Loader";

const SCREEN_WIDTH = Dimensions.get("window").width;

const Search = ({ navigation }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("name");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    role: null,
    origin: "",
    destination: "",
    minSeats: null,
    preference: "",
  });

  // Define search fields
  const searchFields = [
    { id: "name", label: "Nom", icon: "person-outline" },
    { id: "role", label: "Rol", icon: "car-outline" },
    { id: "origin", label: "Origen", icon: "location-outline" },
    { id: "destination", label: "Destí", icon: "navigate-outline" },
    { id: "preference", label: "Preferència", icon: "heart-outline" },
  ];

  // Define filter options
  const roles = ["Conductor", "Passatger"];
  const seatOptions = [
    { value: 1, label: "1 plaça" },
    { value: 2, label: "2 places" },
    { value: 3, label: "3 places" },
    { value: 4, label: "4 places" },
    { value: 5, label: "5 places" },
    { value: 6, label: "6 places" },
  ];
  const preferenceOptions = [
    "Horari entrada",
    "Horari sortida",
    "Ambdos",
    "Flexible",
  ];

  // Fetch all users when component mounts
  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      const usersRef = collection(db, "users");
      const querySnapshot = await getDocs(usersRef);
      const usersList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersList);
    } catch (error) {
      console.error("Error fetching users:", error);
      Alert.alert("Error", "No s'han pogut carregar els usuaris");
    } finally {
      setLoading(false);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchAllUsers();
  }, []);

  // Search and filter functionality
  useEffect(() => {
    const searchUsers = async () => {
      if (
        !searchTerm.trim() &&
        !filters.role &&
        !filters.origin &&
        !filters.destination &&
        !filters.minSeats &&
        !filters.preference
      ) {
        fetchAllUsers();
        return;
      }

      try {
        setLoading(true);
        const usersRef = collection(db, "users");
        const querySnapshot = await getDocs(usersRef);
        let filteredUsers = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Apply search term filter
        if (searchTerm.trim()) {
          const searchTermLower = searchTerm.toLowerCase();
          filteredUsers = filteredUsers.filter((user) => {
            switch (searchField) {
              case "name":
                return user.nom?.toLowerCase().includes(searchTermLower);
              case "role":
                return user.role?.toLowerCase().includes(searchTermLower);
              case "origin":
                return user.location?.toLowerCase().includes(searchTermLower);
              case "destination":
                return user.desti?.toLowerCase().includes(searchTermLower);
              case "preference":
                return user.preferences?.some((pref) =>
                  pref.toLowerCase().includes(searchTermLower)
                );
              default:
                return true;
            }
          });
        }

        // Apply additional filters
        if (filters.role) {
          filteredUsers = filteredUsers.filter(
            (user) => user.role === filters.role
          );
        }
        if (filters.origin) {
          filteredUsers = filteredUsers.filter((user) =>
            user.location?.toLowerCase().includes(filters.origin.toLowerCase())
          );
        }
        if (filters.destination) {
          filteredUsers = filteredUsers.filter((user) =>
            user.desti
              ?.toLowerCase()
              .includes(filters.destination.toLowerCase())
          );
        }
        if (filters.minSeats) {
          filteredUsers = filteredUsers.filter(
            (user) =>
              user.role === "Conductor" &&
              user.carInfo?.[2] &&
              parseInt(user.carInfo[2]) >= filters.minSeats
          );
        }
        if (filters.preference) {
          filteredUsers = filteredUsers.filter((user) =>
            user.preferences?.includes(filters.preference)
          );
        }

        setUsers(filteredUsers);
      } catch (error) {
        console.error("Error searching users:", error);
        Alert.alert("Error", "No s'han pogut cercar els usuaris");
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(searchUsers, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, searchField, filters]);

  const handleUserPress = (userId) => {
    // Troba l'usuari complet
    const selectedUser = users.find((user) => user.id === userId);

    if (!selectedUser) {
      Alert.alert("Error", "No s'ha trobat l'usuari");
      return;
    }

    navigation.navigate("Swipes", {
      selectedUserId: userId, // Passa només l'ID
      showSpecificUser: true,
      userData: selectedUser, // Passa l'objecte d'usuari complet
    });
  };

  const renderUserItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.userCard}
        onPress={() => handleUserPress(item.id)}
      >
        {item.photo ? (
          <Image
            source={{ uri: item.photo }}
            style={styles.userPhoto}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.userPhotoPlaceholder}>
            <Text style={styles.userPhotoPlaceholderText}>
              {item.nom?.charAt(0).toUpperCase() || "?"}
            </Text>
          </View>
        )}
        <View style={styles.userInfo}>
          <View style={styles.userHeader}>
            <Text style={styles.userName}>{item.nom || "Sense nom"}</Text>
            <View style={styles.roleContainer}>
              <Ionicons
                name={
                  item.role === "Conductor" ? "car-outline" : "person-outline"
                }
                size={16}
                color="#333c87"
              />
              <Text style={styles.roleText}>{item.role || "Sense rol"}</Text>
            </View>
          </View>

          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={14} color="#666" />
              <Text style={styles.infoText}>
                {item.location} → {item.desti}
              </Text>
            </View>
            {item.role === "Conductor" && item.carInfo && (
              <View style={styles.infoRow}>
                <Ionicons name="people-outline" size={14} color="#666" />
                <Text style={styles.infoText}>
                  {item.carInfo[2]} places · {item.carInfo[0]}
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderFiltersModal = () => (
    <Modal
      visible={showFilters}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowFilters(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filtres</Text>
            <TouchableOpacity onPress={() => setShowFilters(false)}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.filterContent}>
            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Rol</Text>
              <View style={styles.filterOptions}>
                {roles.map((role) => (
                  <TouchableOpacity
                    key={role}
                    style={[
                      styles.filterOption,
                      filters.role === role && styles.filterOptionActive,
                    ]}
                    onPress={() =>
                      setFilters({
                        ...filters,
                        role: filters.role === role ? null : role,
                      })
                    }
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        filters.role === role && styles.filterOptionTextActive,
                      ]}
                    >
                      {role}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Origen</Text>
              <TextInput
                style={styles.filterInput}
                placeholder="Introdueix l'origen"
                value={filters.origin}
                onChangeText={(text) =>
                  setFilters({ ...filters, origin: text })
                }
              />
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Destí</Text>
              <TextInput
                style={styles.filterInput}
                placeholder="Introdueix el destí"
                value={filters.destination}
                onChangeText={(text) =>
                  setFilters({ ...filters, destination: text })
                }
              />
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Places mínimes</Text>
              <View style={styles.filterOptions}>
                {seatOptions.map((seat) => (
                  <TouchableOpacity
                    key={seat.value}
                    style={[
                      styles.filterOption,
                      filters.minSeats === seat.value &&
                        styles.filterOptionActive,
                      styles.seatOption,
                    ]}
                    onPress={() =>
                      setFilters({
                        ...filters,
                        minSeats:
                          filters.minSeats === seat.value ? null : seat.value,
                      })
                    }
                  >
                    <Ionicons
                      name="people-outline"
                      size={16}
                      color={filters.minSeats === seat.value ? "white" : "#666"}
                    />
                    <Text
                      style={[
                        styles.filterOptionText,
                        filters.minSeats === seat.value &&
                          styles.filterOptionTextActive,
                      ]}
                    >
                      {seat.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Preferència</Text>
              <View style={styles.filterOptions}>
                {preferenceOptions.map((pref) => (
                  <TouchableOpacity
                    key={pref}
                    style={[
                      styles.filterOption,
                      filters.preference === pref && styles.filterOptionActive,
                    ]}
                    onPress={() =>
                      setFilters({
                        ...filters,
                        preference: filters.preference === pref ? "" : pref,
                      })
                    }
                  >
                    <Ionicons
                      name="time-outline"
                      size={16}
                      color={filters.preference === pref ? "white" : "#666"}
                    />
                    <Text
                      style={[
                        styles.filterOptionText,
                        filters.preference === pref &&
                          styles.filterOptionTextActive,
                      ]}
                    >
                      {pref}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={() =>
                setFilters({
                  role: null,
                  origin: "",
                  destination: "",
                  minSeats: null,
                  preference: "",
                })
              }
            >
              <Text style={styles.resetButtonText}>Reiniciar Filtres</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => {
                setShowFilters(false);
              }}
            >
              <Text style={styles.applyButtonText}>Aplicar Filtres</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  // Calcular altura de la barra inferior para iOS
  const bottomBarHeight = Platform.OS === 'ios' ? 70 : 50;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Cercar Usuaris</Text>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowFilters(true)}
          >
            <Ionicons name="options-outline" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.searchFieldsScroll}
          >
            {searchFields.map((field) => (
              <TouchableOpacity
                key={field.id}
                style={[
                  styles.searchFieldButton,
                  searchField === field.id && styles.searchFieldButtonActive,
                ]}
                onPress={() => {
                  setSearchField(field.id);
                  setSearchTerm("");
                }}
              >
                <Ionicons
                  name={field.icon}
                  size={14}
                  color={searchField === field.id ? "white" : "#666"}
                />
                <Text
                  style={[
                    styles.searchFieldText,
                    searchField === field.id && styles.searchFieldTextActive,
                  ]}
                >
                  {field.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.searchInputContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder={`Cercar per ${searchFields
                .find((f) => f.id === searchField)
                ?.label.toLowerCase()}...`}
              value={searchTerm}
              onChangeText={setSearchTerm}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {searchTerm ? (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => setSearchTerm("")}
              >
                <Ionicons name="close-circle" size={24} color="#666" />
              </TouchableOpacity>
            ) : (
              <Ionicons
                name="search"
                size={24}
                color="#666"
                style={styles.searchIcon}
              />
            )}
          </View>
        </View>

        {loading ? (
          <Loader message="Cercant usuaris..." />
        ) : (
          <FlatList
            data={users}
            renderItem={renderUserItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={[
              styles.listContainer, 
              { paddingBottom: bottomBarHeight } // Usar la altura calculada de la barra inferior
            ]}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="search-outline" size={50} color="#ccc" />
                <Text style={styles.emptyText}>
                  {searchTerm ||
                  filters.role ||
                  filters.origin ||
                  filters.destination ||
                  filters.preference
                    ? "No s'han trobat usuaris"
                    : "Utilitza els filtres per cercar usuaris"}
                </Text>
              </View>
            }
          />
        )}
      </View>

      {renderFiltersModal()}

      {/* Barra de navegació inferior */}
      <View style={[styles.bottomBar, { height: bottomBarHeight }]}>
        <FSection
          currentSection={2}
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
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e1e1e1",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  filterButton: {
    padding: 8,
  },
  searchContainer: {
    padding: 15,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchFieldsScroll: {
    paddingVertical: 5,
    paddingHorizontal: 5,
    gap: 8,
  },
  searchFieldButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: "#F5F7FA",
    borderWidth: 1,
    borderColor: "#e1e1e1",
    minWidth: 90,
  },
  searchFieldButtonActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  searchFieldText: {
    color: "#666",
    fontSize: 12,
    fontWeight: "500",
  },
  searchFieldTextActive: {
    color: "white",
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F7FA",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e1e1e1",
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  clearButton: {
    padding: 8,
  },
  searchIcon: {
    padding: 8,
  },
  listContainer: {
    padding: 15,
  },
  userCard: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 10,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userPhoto: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  userPhotoPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  userPhotoPlaceholderText: {
    fontSize: 20,
    color: "#666",
    fontWeight: "500",
  },
  userInfo: {
    flex: 1,
  },
  userHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  roleContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEF5FF",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  roleText: {
    marginLeft: 4,
    color: "#333c87",
    fontWeight: "500",
    fontSize: 12,
  },
  infoContainer: {
    gap: 4,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  infoText: {
    fontSize: 13,
    color: "#666",
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 30,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#e1e1e1",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  filterContent: {
    padding: 15,
    maxHeight: "70%",
  },
  filterSection: {
    marginBottom: 20,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  filterOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  filterOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F7FA",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#e1e1e1",
    minWidth: 100,
    justifyContent: "center",
    gap: 6,
  },
  filterOptionActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  filterOptionText: {
    color: "#666",
    fontSize: 14,
    fontWeight: "500",
  },
  filterOptionTextActive: {
    color: "white",
  },
  filterInput: {
    backgroundColor: "#F5F7FA",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e1e1e1",
    padding: 12,
    fontSize: 16,
  },
  seatOption: {
    minWidth: 90,
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "#e1e1e1",
  },
  resetButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#007AFF",
    backgroundColor: "white",
  },
  resetButtonText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "600",
  },
  applyButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: "#007AFF",
  },
  applyButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginTop: 15,
  },
  // Estilo de barra inferior actualizado para que coincida con Swipes
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#e1e1e1",
    zIndex: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default Search;