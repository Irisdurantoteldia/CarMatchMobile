import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { auth, db } from '../../FireBase/FirebaseConfig';
import { collection, query, where, getDocs, deleteDoc, doc, getDoc, writeBatch } from 'firebase/firestore';
import Loader from '../../Components/UI/Loader';

const ManageRoutes = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);

  useEffect(() => {
    fetchUserTrips();
  }, []);

  const fetchUserTrips = async () => {
    try {
      setLoading(true);
      console.log("Fetching trips for user:", auth.currentUser.uid);
      
      const tripsQuery = query(
        collection(db, "trips"),
        where("driverId", "==", auth.currentUser.uid) // Changed from userId to driverId
      );
      const tripsSnapshot = await getDocs(tripsQuery);
      
      const userTrips = [];
      tripsSnapshot.forEach((doc) => {
        const tripData = doc.data();
        console.log("Trip found:", tripData);
        userTrips.push({ id: doc.id, ...tripData });
      });
      
      console.log("Total trips found:", userTrips.length);
      setTrips(userTrips);
    } catch (error) {
      console.error("Error fetching trips:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCoordinatesForLocation = (location) => {
    const coordinates = {
      'Igualada': { latitude: 41.5786, longitude: 1.6172 },
      'Manresa': { latitude: 41.7289, longitude: 1.8267 },
      'Santpedor': { latitude: 41.7833, longitude: 1.8333 },
      'Poligon 1': { latitude: 41.7312, longitude: 1.8397 },
      'Poligon 2': { latitude: 41.7345, longitude: 1.8412 },
      'Poligon 3': { latitude: 41.7367, longitude: 1.8434 },
      'Poligon 4': { latitude: 41.7389, longitude: 1.8456 },
      'Poligon 5': { latitude: 41.7401, longitude: 1.8478 },
      'Poligon 6': { latitude: 41.7423, longitude: 1.8501 }
    };

    // Afegim log per debugar
    const result = coordinates[location];
    if (!result) {
      console.warn(`Ubicació no trobada: ${location}, utilitzant Manresa com a predeterminat`);
      return coordinates['Manresa'];
    }
    return result;
  };

  const calculateRouteDetails = (from, to) => {
    // Distàncies predefinides més precises (en km)
    const routeDistances = {
      'Igualada-Manresa': 33,
      'Manresa-Igualada': 33,
      'Manresa-Poligon 1': 2.5,
      'Poligon 1-Manresa': 2.5,
      'Manresa-Poligon 2': 3.2,
      'Poligon 2-Manresa': 3.2,
      'Manresa-Poligon 3': 3.8,
      'Poligon 3-Manresa': 3.8,
      'Manresa-Poligon 4': 4.2,
      'Poligon 4-Manresa': 4.2,
      'Manresa-Poligon 5': 4.8,
      'Poligon 5-Manresa': 4.8,
      'Manresa-Poligon 6': 5.5,
      'Poligon 6-Manresa': 5.5,
      'Igualada-Poligon 1': 34.5,
      'Poligon 1-Igualada': 34.5,
      'Igualada-Poligon 2': 35.2,
      'Poligon 2-Igualada': 35.2,
      'Igualada-Poligon 3': 35.8,
      'Poligon 3-Igualada': 35.8,
      'Igualada-Poligon 4': 36.2,
      'Poligon 4-Igualada': 36.2,
      'Igualada-Poligon 5': 36.8,
      'Poligon 5-Igualada': 36.8,
      'Igualada-Poligon 6': 37.5,
      'Poligon 6-Igualada': 37.5
    };

    // Buscar la ruta en ambdues direccions
    const routeKey = `${from}-${to}`;
    const reverseRouteKey = `${to}-${from}`;
    
    // Obtenir la distància (intentar ambdues direccions)
    let distance = routeDistances[routeKey] || routeDistances[reverseRouteKey];

    // Si no trobem la distància predefinida, calcular aproximada
    if (!distance) {
      console.warn(`No s'ha trobat distància predefinida per la ruta: ${routeKey}`);
      
      // Obtenir coordenades
      const originCoords = getCoordinatesForLocation(from);
      const destCoords = getCoordinatesForLocation(to);
      
      // Calcular distància utilitzant la fórmula de Haversine
      const R = 6371; // Radi de la Terra en km
      const lat1 = originCoords.latitude * Math.PI / 180;
      const lat2 = destCoords.latitude * Math.PI / 180;
      const dLat = (destCoords.latitude - originCoords.latitude) * Math.PI / 180;
      const dLon = (destCoords.longitude - originCoords.longitude) * Math.PI / 180;

      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1) * Math.cos(lat2) *
                Math.sin(dLon/2) * Math.sin(dLon/2);
      
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      distance = R * c;
      
      // Ajustar per rutes reals (factor de correcció de 1.3 per rutes no directes)
      distance = Math.round(distance * 1.3);
    }

    // Calcular temps basat en velocitat mitjana de 60 km/h
    const time = Math.round((distance / 60) * 60);

    return {
      distance: distance,
      time: time
    };
  };

  if (loading) {
    return <Loader message="Carregant..." />;
  }

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
          <Text style={styles.title}>Els meus viatges</Text>
        </View>

        <ScrollView style={styles.content}>
          {trips.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No tens cap viatge actiu</Text>
            </View>
          ) : (
            trips.map((trip, index) => {
              const routeDetails = calculateRouteDetails(trip.from, trip.to);
              const originCoords = getCoordinatesForLocation(trip.from);
              const destCoords = getCoordinatesForLocation(trip.to);
              
              return (
                <TouchableOpacity
                  key={index}
                  style={styles.tripCard}
                  onPress={() => setSelectedTrip(trip)}
                >
                  <View style={styles.tripHeader}>
                    <Ionicons name="location" size={24} color="#333c87" />
                    <View style={styles.tripInfo}>
                      <Text style={styles.tripTitle}>
                        {trip.from} → {trip.to}
                      </Text>
                      <Text style={styles.tripDetails}>
                        {routeDetails.distance} km · {routeDetails.time} min
                      </Text>
                      <Text style={styles.tripDate}>
                        {new Date(trip.date).toLocaleDateString('ca-ES')}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={() => handleCancelTrip(trip.id)}
                    >
                      <Ionicons name="close-circle-outline" size={24} color="#ff3b30" />
                    </TouchableOpacity>
                  </View>

                  {selectedTrip?.id === trip.id && (
                    <View style={styles.mapContainer}>
                      <MapView
                        style={styles.map}
                        initialRegion={{
                          ...originCoords,
                          latitudeDelta: 0.0922,
                          longitudeDelta: 0.0421,
                        }}
                      >
                        <Marker
                          coordinate={originCoords}
                          title={trip.from}
                        />
                        <Marker
                          coordinate={destCoords}
                          title={trip.to}
                        />
                        <Polyline
                          coordinates={[originCoords, destCoords]}
                          strokeColor="#333c87"
                          strokeWidth={3}
                        />
                      </MapView>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

  const handleCancelTrip = async (tripId) => {
    Alert.alert(
      "Cancel·lar viatge",
      "Estàs segur que vols cancel·lar aquest viatge? Això eliminarà el viatge per a tots els passatgers.",
      [
        {
          text: "No",
          style: "cancel"
        },
        {
          text: "Sí",
          style: "destructive",
          onPress: async () => {
            try {
              // Obtenim la informació del viatge abans d'eliminar-lo
              const tripRef = doc(db, "trips", tripId);
              const tripSnapshot = await getDoc(tripRef);
              
              if (!tripSnapshot.exists()) {
                Alert.alert("Error", "No s'ha trobat el viatge");
                return;
              }

              const tripData = tripSnapshot.data();
              
              // Creem les notificacions per a cada passatger
              const batch = writeBatch(db);
              
              for (const passengerId of tripData.passengersId || []) {
                const notificationRef = doc(collection(db, "notifications"));
                batch.set(notificationRef, {
                  userId: passengerId,
                  type: "trip_cancelled",
                  title: "Viatge Cancel·lat",
                  message: `El viatge de ${tripData.from} a ${tripData.to} del ${new Date(tripData.date).toLocaleDateString('ca-ES')} ha estat cancel·lat pel conductor.`,
                  date: new Date(),
                  read: false,
                  tripId: tripId
                });
              }

              // Eliminem el viatge i creem les notificacions en una sola operació
              batch.delete(tripRef);
              await batch.commit();

              setTrips(prevTrips => prevTrips.filter(trip => trip.id !== tripId));
              Alert.alert("Èxit", "Viatge cancel·lat correctament i s'han notificat els passatgers");
            } catch (error) {
              console.error("Error cancel·lant el viatge:", error);
              Alert.alert("Error", "No s'ha pogut cancel·lar el viatge");
            }
          }
        }
      ]
    );
  };

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#EEF5FF',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
    paddingTop: 60,
    marginTop: -50,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
  },
  content: {
    flex: 1,
    padding: 15,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
  },
  tripCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  tripHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tripInfo: {
    marginLeft: 15,
    flex: 1,
  },
  tripTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  tripDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  tripDate: {
      fontSize: 12,
      color: '#666',
      marginTop: 4,
    },
  mapContainer: {
    height: 200,
    marginTop: 15,
    borderRadius: 10,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  cancelButton: {
    padding: 8,
    marginLeft: 'auto',
  },
});

export default ManageRoutes;