import { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native';

const options = [
    { label: "Horari d'entrada - Només anada", value: "Horari d'entrada" },
    { label: "Horari de sortida - Només tornada", value: "Horari de sortida" },
    { label: "Ambdós - Entrada i sortida", value: "Ambdós" },
    { label: "Sense preferències - Flexible", value: "Sense preferències" }
];

const SelectorPreferences = ({ preferencies, setPreferencies }) => {
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <View>
            <Text style={styles.informativeText}>
                Aquí hauries d'especificar quin horari per compartir voldries fer:
            </Text>

            <TouchableOpacity 
                style={styles.selector} 
                onPress={() => setModalVisible(true)}
            >
                <Text style={styles.selectorText}>
                    {preferencies || "Selecciona una opció..."}
                </Text>
            </TouchableOpacity>

            <Modal visible={modalVisible} transparent animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <FlatList 
                            data={options}
                            keyExtractor={(item) => item.value}
                            renderItem={({ item }) => (
                                <TouchableOpacity 
                                    style={styles.option} 
                                    onPress={() => {
                                        setPreferencies(item.value);
                                        setModalVisible(false);
                                    }}
                                >
                                    <Text style={styles.optionText}>{item.label}</Text>
                                </TouchableOpacity>
                            )}
                        />
                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                            <Text style={styles.closeButton}>Tancar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    informativeText: {
        fontSize: 16,
        color: '#333',
        marginBottom: 5,
    },
    selector: {
        backgroundColor: '#f0f0f0',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    selectorText: {
        fontSize: 16,
        color: '#007AFF',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%',
    },
    option: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    optionText: {
        fontSize: 16,
    },
    closeButton: {
        marginTop: 10,
        fontSize: 16,
        color: 'red',
        textAlign: 'center',
    },
});

export default SelectorPreferences;
