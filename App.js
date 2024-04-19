import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import * as FileSystem from 'expo-file-system';
import LoginScreen from './LoginScreen'; // Import the login screen component
import MainApp from './MainApp'; // Import the main app component






const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        checkLoginStatus();
    }, []);

    const checkLoginStatus = async () => {
        // Check if the user is already logged in by looking for the presence of a token, user info, etc.
        // For simplicity, let's assume the user is not logged in initially
        setIsLoggedIn(false);
    };

    const handleLogin = () => {
        setIsLoggedIn(true);
    };

    return (
        <View style={styles.container}>
            {isLoggedIn ? (
                <MainApp />
            ) : (
                <LoginScreen onLogin={handleLogin} />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        padding: 20,
    },
});

export default App;
