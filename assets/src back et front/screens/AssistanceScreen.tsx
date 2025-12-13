// Dans ProfileScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuthAuthContext } from '../context/auth/AuthContext';
import { useTranslation } from '../hooks/useTranslation';

const AssistanceScreen: React.FC = () => {
    const { authState, signOut, appSettings } = useAuthAuthContext();
    const { t } = useTranslation();

    const handleLanguageChange = () => {
        // Navigation vers l'écran de sélection de langue
        // Vous devrez implémenter la navigation selon votre configuration
    };

    return (
        <View >
            <Text >Profil</Text>

            <TouchableOpacity onPress={handleLanguageChange}>
                <Text>Changer la langue ({appSettings.language})</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={signOut}>
                <Text>{t.home.logout}</Text>
            </TouchableOpacity>
        </View>
    );
};
export default AssistanceScreen