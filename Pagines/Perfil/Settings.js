import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../../FireBase/FirebaseConfig';

const Settings = ({ navigation }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Error', 'No s\'ha pogut tancar la sessió. Torna-ho a provar.');
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Eliminar compte',
      'Estàs segur que vols eliminar el teu compte? Aquesta acció no es pot desfer.',
      [
        {
          text: 'Cancel·lar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              // Aquí aniria la lògica per eliminar el compte
              await auth.currentUser.delete();
              navigation.navigate('Login');
            } catch (error) {
              Alert.alert('Error', 'No s\'ha pogut eliminar el compte. Torna-ho a provar.');
            }
          },
        },
      ]
    );
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
          <Text style={styles.title}>Configuració</Text>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notificacions</Text>
            <View style={styles.settingItem}>
              <Text style={styles.settingText}>Notificacions push</Text>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#767577', true: '#333c87' }}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Compte</Text>
            <TouchableOpacity 
              style={styles.settingButton}
              onPress={handleLogout}
            >
              <Text style={styles.buttonText}>Tancar sessió</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.settingButton, styles.deleteButton]}
              onPress={handleDeleteAccount}
            >
              <Text style={[styles.buttonText, styles.deleteButtonText]}>
                Eliminar compte
              </Text>
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
  section: {
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  settingText: {
    fontSize: 16,
    color: '#333',
  },
  settingButton: {
    paddingVertical: 12,
    marginVertical: 5,
    borderRadius: 8,
    backgroundColor: '#333c87',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  deleteButton: {
    backgroundColor: '#ff3b30',
    marginTop: 10,
  },
  deleteButtonText: {
    color: 'white',
  },
});

export default Settings;