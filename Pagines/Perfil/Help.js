import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Help = ({ navigation }) => {
  const faqs = [
    {
      question: "Com puc canviar el meu rol de passatger a conductor?",
      answer: "Pots canviar el teu rol anant a 'Editar perfil' i seleccionant el nou rol. Hauràs de proporcionar informació addicional com el tipus de vehicle."
    },
    {
      question: "Com funciona el sistema de coincidències?",
      answer: "El sistema busca altres usuaris amb horaris i rutes similars a les teves. Quan hi ha una coincidència, tots dos usuaris rebreu una notificació."
    },
    {
      question: "Com puc modificar el meu horari?",
      answer: "Ves a 'Editar horari' al menú d'edició. Allà podràs afegir, modificar o eliminar els teus horaris setmanals."
    },
    {
      question: "Què passa si cancel·lo un viatge?",
      answer: "Si necessites cancel·lar un viatge, fes-ho amb la màxima antelació possible. Els altres usuaris rebran una notificació de la cancel·lació."
    },
    {
      question: "Com puc veure les meves rutes guardades?",
      answer: "Pots veure i gestionar les teves rutes guardades a la secció 'Les meves rutes' dins del menú d'edició."
    },
    {
      question: "Com funciona el sistema de valoracions?",
      answer: "Després de cada viatge, tant conductors com passatgers poden valorar l'experiència. Aquestes valoracions ajuden a mantenir la qualitat del servei."
    },
    {
      question: "Com puc contactar amb suport?",
      answer: "Si tens problemes o dubtes que no es resolen aquí, pots contactar amb nosaltres a través del correu ['support@gmail.com']"
    }
  ];

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
          <Text style={styles.title}>Ajuda</Text>
        </View>

        <ScrollView style={styles.content}>
          {faqs.map((faq, index) => (
            <View key={index} style={styles.faqItem}>
              <Text style={styles.question}>{faq.question}</Text>
              <Text style={styles.answer}>{faq.answer}</Text>
            </View>
          ))}
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
  faqItem: {
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
  question: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  answer: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default Help;