import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    StatusBar
} from 'react-native';
import { useAuth } from '../context/auth/AuthContext';
import { useTranslation } from '../hooks/useTranslation';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const LanguageScreen: React.FC = () => {
    const { changeLanguage, completeFirstLaunch, appSettings } = useAuth();
    const { t } = useTranslation();

    const languages = [
        {
            code: 'fr',
            name: t.language.french,
            nativeName: 'Français',
            flag: '🇫🇷'
        },
        {
            code: 'en',
            name: t.language.english,
            nativeName: 'English',
            flag: '🇺🇸'
        },
        {
            code: 'es',
            name: t.language.spanish,
            nativeName: 'Español',
            flag: '🇪🇸'
        },
        {
            code: 'ar',
            name: t.language.arabic,
            nativeName: 'العربية',
            flag: '🇸🇦'
        }
    ];

    const handleLanguageSelect = async (languageCode: string) => {
        await changeLanguage(languageCode);
    };

    const handleContinue = async () => {
        await completeFirstLaunch();
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />

            <LinearGradient
                colors={['#1a2b47', '#2c3e50']}
                style={styles.gradientBackground}
            >
                {/* Header */}
                <View style={styles.header}>
                    <Ionicons name="globe" size={32} color="#fff" />
                    <Text style={styles.title}>{t.language.title}</Text>
                    <Text style={styles.subtitle}>
                        {t.welcome.subtitle}
                    </Text>
                </View>

                {/* Language Selection */}
                <View style={styles.content}>
                    <ScrollView
                        contentContainerStyle={styles.languagesContainer}
                        showsVerticalScrollIndicator={false}
                    >
                        {languages.map((language) => (
                            <TouchableOpacity
                                key={language.code}
                                style={[
                                    styles.languageCard,
                                    appSettings.language === language.code && styles.selectedCard
                                ]}
                                onPress={() => handleLanguageSelect(language.code)}
                                activeOpacity={0.7}
                            >
                                <View style={styles.languageHeader}>
                                    <Text style={styles.flag}>{language.flag}</Text>
                                    <View style={styles.languageTextContainer}>
                                        <Text style={styles.languageName}>{language.name}</Text>
                                        <Text style={styles.languageNativeName}>
                                            {language.nativeName}
                                        </Text>
                                    </View>
                                </View>

                                {appSettings.language === language.code && (
                                    <View style={styles.selectedIndicator}>
                                        <Ionicons name="checkmark-circle" size={24} color="#4cd964" />
                                        <Text style={styles.selectedText}>Sélectionné</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {/* Continue Button */}
                    <TouchableOpacity
                        style={styles.continueButton}
                        onPress={handleContinue}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={['#4cd964', '#34e89e']}
                            style={styles.continueButtonGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            <Text style={styles.continueButtonText}>
                                {t.common.continue}
                            </Text>
                            <Ionicons name="arrow-forward" size={20} color="#fff" />
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradientBackground: {
        flex: 1,
    },
    header: {
        alignItems: 'center',
        paddingTop: 60,
        paddingBottom: 30,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: '#fff',
        marginTop: 15,
        marginBottom: 8,
        textAlign: 'center',
        fontFamily: 'Poppins-Bold',
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
        textAlign: 'center',
        lineHeight: 22,
        fontFamily: 'Poppins-Bold',
    },
    content: {
        flex: 1,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 20,
    },
    languagesContainer: {
        padding: 5,
    },
    languageCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: 20,
        padding: 20,
        marginVertical: 8,
        borderWidth: 2,
        borderColor: 'transparent',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    selectedCard: {
        backgroundColor: '#e8f5e8',
        borderColor: '#4cd964',
        shadowColor: '#4cd964',
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 6,
        transform: [{ scale: 1.02 }],
    },
    languageHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    flag: {
        fontSize: 36,
        marginRight: 15,
    },
    languageTextContainer: {
        flex: 1,
    },
    languageName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#2c3e50',
        marginBottom: 2,
    },
    languageNativeName: {
        fontSize: 14,
        color: '#7f8c8d',
        fontWeight: '500',
    },
    selectedIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(76, 217, 100, 0.1)',
        padding: 10,
        borderRadius: 15,
        marginTop: 5,
    },
    selectedText: {
        color: '#27ae60',
        fontWeight: '600',
        marginLeft: 5,
        fontSize: 14,
    },
    continueButton: {
        marginTop: 20,
        marginBottom: 10,
        borderRadius: 25,
        overflow: 'hidden',
        shadowColor: '#4cd964',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    continueButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 18,
    },
    continueButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
        marginRight: 8,
    },
});

export default LanguageScreen;