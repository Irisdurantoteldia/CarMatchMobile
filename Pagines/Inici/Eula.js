import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Animated, Platform, ScrollView } from 'react-native';

const Eula = ({ navigation }) => {
  const [showEULA, setShowEULA] = useState(false);
  const fadeAnim = useState(new Animated.Value(1))[0];

  useEffect(() => {
    setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setShowEULA(true);
      });
    }, 1000);
  }, []);

  return (
    <View style={styles.centeredView}>
      {!showEULA ? (
        <Animated.View style={{ ...styles.logoContainer, opacity: fadeAnim }}>
          <Image source={require('../../assets/CarMatch.png')} style={styles.logo} />
        </Animated.View>
      ) : (
        <>
          <Text style={styles.eulaTitle}>Benvingut a <Text style={styles.eulaTitleRed}>CarJob</Text>!</Text>
          <View style={styles.eulaContainer}>
            <Text style={styles.eulaSubtitle}>Termes i condicions:</Text>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
              <Text style={styles.eulaContent}>
                En utilitzar aquesta aplicació, acceptes els següents termes i condicions:
              </Text>
              <Text style={styles.eulaContent}>
                {'\n'}<Text style={styles.boldText}>1.</Text> Acceptació dels termes:{'\n'}
                L'ús de CarJob constitueix la teva acceptació de tots els termes, condicions i avisos.
              </Text>
              <Text style={styles.eulaContent}>
                {'\n'}<Text style={styles.boldText}>2.</Text> Responsabilitats de l'usuari:{'\n'}
                Ets responsable de les teves accions i de qualsevol contingut que comparteixis.
              </Text>
              <Text style={styles.eulaContent}>
                {'\n'}<Text style={styles.boldText}>3.</Text> Política de privacitat:{'\n'}
                No es guarden dades personals sensibles ni informació de localització.
              </Text>
              <Text style={styles.eulaContent}>
                {'\n'}<Text style={styles.boldText}>4.</Text> Limitació de responsabilitat:{'\n'}
                L'empresa no es fa responsable de cap transacció, incident o dany que es produeixi mentre s'utilitza l'aplicació.
              </Text>
              <Text style={styles.eulaContent}>
                {'\n'}<Text style={styles.boldText}>5.</Text> Terminació:{'\n'}
                La violació d'aquests termes pot resultar en la suspensió o terminació del teu compte.
              </Text>
              <Text style={styles.eulaContent}>
                {'\n'}Si no estàs d'acord amb cap d'aquests termes, si us plau, deixa d'utilitzar l'aplicació.
              </Text>
            </ScrollView>
          </View>
          <TouchableOpacity style={styles.acceptButton} onPress={() => navigation.navigate('Home')}>
            <Text style={styles.buttonText}>Acceptar</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EEF5FF',
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
  },
  eulaTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 20,
    textAlign: 'center',
  },
  eulaTitleRed: {
    color: '#b81414',
  },
  eulaContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 25,
    width: '85%',
    height: '60%',
    ...Platform.select({
      ios: {
        shadowColor: '#2962FF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  eulaSubtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#1E3A8A',
  },
  eulaContent: {
    fontSize: 14,
    color: '#333',
    textAlign: 'justify',
    lineHeight: 20,
    marginBottom: 10,
  },
  boldText: {
    fontWeight: 'bold',
  },
  acceptButton: {
    backgroundColor: '#333c87',
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 25,
    width: '85%',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#2962FF',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Eula;
