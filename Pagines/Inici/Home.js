import { View, Text, Image, TouchableOpacity, StyleSheet, Platform } from 'react-native';

const Home = ({ navigation }) => {
    return (
        <View style={styles.centeredView}>
            <Image source={require('../../assets/CarMatch.png')} style={styles.logo} />
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
                <Text style={styles.buttonText}>Iniciar Sessió</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SignUp')}>
                <Text style={styles.buttonText}>Registra't</Text>
            </TouchableOpacity>
        </View>
    );
};

// 🔴 COMPROVA QUE AQUEST OBJECTE STYLES EXISTEIX!
const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#EEF5FF',
    },
    logo: {
        width: 150,
        height: 150,
        marginBottom: 280,
        marginTop: 130,
    },
    button: {
        backgroundColor: '#333c87',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 10,
        marginTop: 15,
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

export default Home;
