// screens/LanguageScreen.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthAuthContext } from '../../context/auth/AuthContext';
import { useTranslation } from '../../hooks/useTranslation';

const LanguageScreen = () => {
    const { t, language } = useTranslation();
    const { appSettings, changeLanguage } = useAuthAuthContext();
    const [selectedLanguage, setSelectedLanguage] = useState(appSettings.language);


    const languages = [
        {
            code: 'fr',
            label: t.language.french
        },
        {
            code: 'en',
            label: t.language.english
        }
    ];

    return (
        <View style={styles.container}>
            <ScrollView>
                {languages.map((language) => (
                    <TouchableOpacity
                        key={language.code}
                        style={styles.item}
                        onPress={async () => {
                            await changeLanguage(language.code)
                            setSelectedLanguage(language.code)
                        }}
                    >
                        <Text style={styles.text}>{language.label}</Text>
                        {selectedLanguage === language.code && (
                            <Ionicons name="checkmark" size={20} color="#fcbf00" />
                        )}
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: 'white',
        marginBottom: 8,
        borderRadius: 8,
    },
    text: {
        fontSize: 16,
        color: '#1a171a',
    },
});

export default LanguageScreen;