import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';

const PrettySquare = ({ label, value, onChangeText, placeholder }) => (
    <View style={styles.inputContainer}>
        <Text style={styles.label}>{label}:</Text>
        <TextInput
            style={styles.input}
            onChangeText={onChangeText}
            value={value}
            placeholder={placeholder}
        />
    </View>
);

const MainApp = ({ onLogout }) => {
    const [site, setSite] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [submittedData, setSubmittedData] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        loadSubmittedData();
    }, []);

    const saveSubmittedData = async (data) => {
        const fileUri = FileSystem.documentDirectory + 'submittedData.json';
        try {
            await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(data));
        } catch (error) {
            console.error('Error saving data:', error);
        }
    };

    const loadSubmittedData = async () => {
        const fileUri = FileSystem.documentDirectory + 'submittedData.json';
        try {
            const fileExists = await FileSystem.getInfoAsync(fileUri);
            if (fileExists.exists) {
                const fileContents = await FileSystem.readAsStringAsync(fileUri);
                setSubmittedData(JSON.parse(fileContents));
            }
        } catch (error) {
            console.error('Error loading data:', error);
        }
    };

    const handleButtonPress = () => {
        if (!site || !username || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }
        const newData = [...submittedData, { site, username, password }];
        setSubmittedData(newData);
        saveSubmittedData(newData);
        setSite('');
        setUsername('');
        setPassword('');
    };

    const handleEdit = (item) => {
        setSite(item.site);
        setUsername(item.username);
        setPassword(item.password);
        setSelectedItem(item);
    };

    const handleDelete = (item) => {
        Alert.alert(
            'Confirmation',
            'Are you sure you want to delete this entry?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    onPress: () => {
                        const newData = submittedData.filter(i => i !== item);
                        setSubmittedData(newData);
                        saveSubmittedData(newData);
                        setSelectedItem(null);
                    },
                },
            ],
            { cancelable: false }
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.titleBox}>
                <Text style={styles.title}>Password Repository by Milli</Text>
            </View>
            <View style={styles.formContainer}>
                <PrettySquare
                    label="Site"
                    value={site}
                    onChangeText={setSite}
                    placeholder="Enter the site..."
                />
                <PrettySquare
                    label="Username"
                    value={username}
                    onChangeText={setUsername}
                    placeholder="Enter your username..."
                />
                <PrettySquare
                    label="Password"
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter your password..."
                />
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleButtonPress}
                >
                    <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.tableContainer}>
                <Text style={styles.tableTitle}>Submitted Data:</Text>
                <FlatList
                    data={submittedData}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.row}
                            onPress={() => setSelectedItem(item)}
                        >
                            <Text style={styles.rowText}>Site: {item.site}</Text>
                            <Text style={styles.rowText}>Username: {item.username}</Text>
                            <Text style={styles.rowText}>Password: {item.password}</Text>
                        </TouchableOpacity>
                    )}
                />
            </View>
            {selectedItem && (
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: '#28a745' }]}
                        onPress={() => handleEdit(selectedItem)}
                    >
                        <Text style={styles.buttonText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: '#dc3545' }]}
                        onPress={() => handleDelete(selectedItem)}
                    >
                        <Text style={styles.buttonText}>Delete</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    titleBox: {
        backgroundColor: '#e9e9e9',
        padding: 10,
        borderRadius: 10,
        marginBottom: 20,
        width: '100%',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        fontFamily: 'Arial',
        color: '#333',
    },
    formContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        marginBottom: 20,
        width: '100%',
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        marginBottom: 5,
        fontWeight: 'bold',
        color: '#333',
        fontSize: 16,
    },
    input: {
        width: '100%',
        height: 50,
        paddingHorizontal: 10,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    tableContainer: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        width: '100%',
        borderColor: 'black',
        borderWidth: 1,
    },
    tableTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 5,
        paddingVertical: 10,
        paddingHorizontal: 5,
    },
    rowText: {
        marginRight: 10,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
        marginHorizontal: 5,
        backgroundColor: '#007bff',
    },
    buttonText: {
        fontWeight: 'bold',
        color: '#fff',
    },
});

export default MainApp;
