import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { db } from "../../FireBase/FirebaseConfig";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import SelectorPreferences from "../../Selectors/SelectorPreferences";

export default function EditSchedule({ route, navigation }) {
  const [horaEntrada, setHoraEntrada] = useState("");
  const [horaSortida, setHoraSortida] = useState("");
  const [detailedSchedule, setDetailedSchedule] = useState(
    Array(5).fill({ entrada: "", sortida: "" })
  );
  const [preferencies, setPreferencies] = useState("");
  const [weeklyScheduleId, setWeeklyScheduleId] = useState("");
  const [userId, setUserId] = useState("");
  const [isDetailedView, setIsDetailedView] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Get user data
        const userQuery = query(
          collection(db, "users"),
          where("userId", "==", route.params.userId)
        );
        const userSnapshot = await getDocs(userQuery);
        const userData = userSnapshot.docs[0].data();

        setUserId(route.params.userId);
        setPreferencies(userData.preferences);
        setWeeklyScheduleId(userData.weeklyScheduleId);

        // Get schedule data
        const scheduleDoc = await getDoc(
          doc(db, "weeklySchedule", userData.weeklyScheduleId)
        );
        const scheduleData = scheduleDoc.data();

        if (scheduleData && scheduleData.days) {
          setDetailedSchedule(scheduleData.days);
          setHoraEntrada(scheduleData.days[0].horaEntrada);
          setHoraSortida(scheduleData.days[0].horaSortida);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadUserData();
  }, [route.params.userId]);

  const updateGeneralSchedule = () => {
    const updatedSchedule = Array(5).fill({
      horaEntrada,
      horaSortida,
    });
    setDetailedSchedule(updatedSchedule);
  };

  const handleSave = async () => {
    try {
      // Update schedule
      await updateDoc(doc(db, "weeklySchedule", weeklyScheduleId), {
        days: detailedSchedule,
      });

      // Update preferences
      const userQuery = query(
        collection(db, "users"),
        where("userId", "==", userId)
      );
      const userSnapshot = await getDocs(userQuery);
      const userDoc = userSnapshot.docs[0];

      await updateDoc(doc(db, "users", userDoc.id), {
        preferences: preferencies,
      });

      navigation.goBack();
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={24} color="#333c87" />
          </TouchableOpacity>
          <Text style={styles.title}>Editar Horari</Text>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            {!isDetailedView ? (
              <>
                <Text style={styles.sectionTitle}>Horari General</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Hora Entrada"
                  placeholderTextColor="#999"
                  value={horaEntrada}
                  onChangeText={setHoraEntrada}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Hora Sortida"
                  placeholderTextColor="#999"
                  value={horaSortida}
                  onChangeText={setHoraSortida}
                />
                <View style={styles.buttonGroup}>
                  <TouchableOpacity
                    style={styles.applyAllButton}
                    onPress={updateGeneralSchedule}
                  >
                    <Text style={styles.applyAllButtonText}>
                      Aplicar a tots els dies
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => setIsDetailedView(true)}
                  >
                    <Ionicons name="calendar" size={24} color="#007AFF" />
                    <Text style={styles.menuItemText}>Especificar per dia</Text>
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color="#ccc"
                      style={styles.arrowIcon}
                    />
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <View style={styles.sectionHeader}>
                  <TouchableOpacity
                    style={styles.backLink}
                    onPress={() => setIsDetailedView(false)}
                  >
                    <Ionicons name="arrow-back" size={24} color="#007AFF" />
                    <Text style={styles.backLinkText}>Horari General</Text>
                  </TouchableOpacity>
                </View>
                {detailedSchedule.map((day, index) => (
                  <View key={index} style={styles.dayContainer}>
                    <Text style={styles.dayTitle}>Dia {index + 1}</Text>
                    <View style={styles.inputGroup}>
                      <TextInput
                        style={styles.input}
                        placeholder="Hora Entrada"
                        placeholderTextColor="#999"
                        value={day.horaEntrada}
                        onChangeText={(text) => {
                          const updatedSchedule = [...detailedSchedule];
                          updatedSchedule[index] = {
                            ...updatedSchedule[index],
                            horaEntrada: text,
                          };
                          setDetailedSchedule(updatedSchedule);
                        }}
                      />
                      <TextInput
                        style={styles.input}
                        placeholder="Hora Sortida"
                        placeholderTextColor="#999"
                        value={day.horaSortida}
                        onChangeText={(text) => {
                          const updatedSchedule = [...detailedSchedule];
                          updatedSchedule[index] = {
                            ...updatedSchedule[index],
                            horaSortida: text,
                          };
                          setDetailedSchedule(updatedSchedule);
                        }}
                      />
                    </View>
                  </View>
                ))}
              </>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferències</Text>
            <SelectorPreferences
              preferencies={preferencies}
              setPreferencies={setPreferencies}
            />
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Guardar Canvis</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#EEF5FF",
  },
  container: {
    flex: 1,
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e1e1e1",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        paddingTop: 50,
        marginTop: -50,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  backButton: {
    padding: 8,
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
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#e1e1e1",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
    backgroundColor: "white",
  },
  menuItem: {
    flexDirection: "row",
    padding: 15,
    borderWidth: 1,
    borderColor: "#e1e1e1",
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "white",
  },
  menuItemText: {
    marginLeft: 15,
    fontSize: 16,
    flex: 1,
    color: "#333",
  },
  menuItemTextAllDay: {
    marginLeft: 60,
    fontSize: 16,
    flex: 1,
    color: "white",
    backgroundColor: "#333c87",
  },
  arrowIcon: {
    marginLeft: "auto",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  backLink: {
    flexDirection: "row",
    alignItems: "center",
  },
  backLinkText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#007AFF",
  },
  dayContainer: {
    marginBottom: 20,
  },
  dayTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  inputGroup: {
    gap: 10,
  },
  buttonGroup: {
    gap: 10,
    marginTop: 10,
  },
  applyAllButton: {
    backgroundColor: "#333c87",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  applyAllButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  saveButton: {
    backgroundColor: "#333c87",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 30,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
