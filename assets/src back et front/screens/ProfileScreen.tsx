// Dans ProfileScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuthAuthContext } from '../context/auth/AuthContext';
import { useTranslation } from '../hooks/useTranslation';

const ProfileScreen: React.FC = () => {
    const { authState, signOut, appSettings } = useAuthAuthContext();
    const { t } = useTranslation();

    const handleLanguageChange = () => {
        // Navigation vers l'écran de sélection de langue
        // Vous devrez implémenter la navigation selon votre configuration
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Profil</Text>

            <TouchableOpacity style={styles.optionButton} onPress={handleLanguageChange}>
                <Text>Changer la langue ({appSettings.language})</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
                <Text style={styles.logoutText}>{t.home.logout}</Text>
            </TouchableOpacity>
        </View>
    );
};