import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    View,
    Alert,
    Linking
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from '../hooks/useTranslation';

type AssistanceNavigationProp = StackNavigationProp<RootStackParamList, 'Language'>;

import type { NavigationProp } from '@react-navigation/native';

const AssistanceButton = () => {
    const { t } = useTranslation();
    const navigation = useNavigation<AssistanceNavigationProp>();
    const handleAssistancePress = () => {
        // Vérifie si la navigation est disponible
        if (navigation) {
            navigation.navigate('Assistance');
        } else {
            // Fallback si la navigation n'est pas disponible
            Alert.alert(
                t.homenavigator.assistance,
                t.assistance.howContactUs,
                [
                    {
                        text: t.assistance.call,
                        onPress: () => Linking.openURL('tel:+33123456789')
                    },
                    {
                        text: t.assistance.sendMail,
                        onPress: () => Linking.openURL('mailto:support@banque.fr')
                    },
                    {
                        text: t.common.cancel,
                        style: "cancel"
                    }
                ]
            );
        }
    };

    return (
        <TouchableOpacity
            style={styles.assistanceButton}
            onPress={handleAssistancePress}
            activeOpacity={0.8}
        >
            <View style={styles.buttonContent}>
                <Ionicons name="help-circle" size={24} color="#2A4D8E" />
                <Text style={styles.buttonText}>{t.homenavigator.assistance}</Text>
            </View>
        </TouchableOpacity>
    );
};

// Version flottante (FAB) pour un accès facile
const FloatingAssistanceButton = () => {
    const { t } = useTranslation();
    const navigation = useNavigation<AssistanceNavigationProp>();
    const handleAssistancePress = () => {
        if (navigation) {
            navigation.navigate('Assistance');
        } else {
            Alert.alert(
                t.homenavigator.assistance,
                t.assistance.howContactUs,
                [
                    {
                        text: t.assistance.call,
                        onPress: () => Linking.openURL('tel:+33123456789')
                    },
                    {
                        text: t.assistance.sendMail,
                        onPress: () => Linking.openURL('mailto:support@banque.fr')
                    },
                    {
                        text: t.common.cancel,
                        style: "cancel"
                    }
                ]
            );
        }
    };

    return (
        <TouchableOpacity
            style={styles.floatingButton}
            onPress={handleAssistancePress}
            activeOpacity={0.8}
        >
            <Ionicons name="headset" size={24} color="white" />
        </TouchableOpacity>
    );
};

// Version avec options de contact direct
const PlatinumCard = () => {
    const navigation = useNavigation<AssistanceNavigationProp>();
    const [expanded, setExpanded] = React.useState(false);
    const { t } = useTranslation();

    const handleMainButtonPress = () => {
        if (expanded) {
            setExpanded(false);
        } else {
            setExpanded(true);
        }
    };

    const handleOptionPress = (option: string) => {
        setExpanded(false);
        switch (option) {
            case 'screen':
                navigation.navigate('Assistance');
                break;
            case 'call':
                Linking.openURL('tel:+237123456789');
                break;
            case 'email':
                Linking.openURL('mailto:support@banque.fr');
                break;
            case 'chat':
                // Implémenter l'ouverture du chat
                navigation.navigate('Assistance')
                break;
            default:
                break;
        }
    };

    return (
        <View style={styles.expandedContainer}>
            {expanded && (
                <View style={styles.optionsContainer}>
                    <TouchableOpacity
                        style={[styles.optionButton, styles.optionCall]}
                        onPress={() => handleOptionPress('call')}
                    >
                        <Ionicons name="call" size={20} color="white" />
                        <Text style={styles.optionText}>{t.assistance.call}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.optionButton, styles.optionEmail]}
                        onPress={() => handleOptionPress('email')}
                    >
                        <Ionicons name="mail" size={20} color="white" />
                        <Text style={styles.optionText}>{t.auth.email}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.optionButton, styles.optionChat]}
                        onPress={() => handleOptionPress('chat')}
                    >
                        <Ionicons name="chatbubbles" size={20} color="white" />
                        <Text style={styles.optionText}>{t.assistance.chat}</Text>
                    </TouchableOpacity>
                </View>
            )}

            <TouchableOpacity
                style={[styles.mainFloatingButton, expanded && styles.mainButtonActive]}
                onPress={handleMainButtonPress}
                activeOpacity={0.8}
            >
                <Ionicons
                    name={expanded ? "close" : "headset"}
                    size={24}
                    color="white"
                />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    assistanceButton: {
        backgroundColor: 'white',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginVertical: 10,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#2A4D8E',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    floatingButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#2A4D8E',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 6,
        zIndex: 100,
    },
    expandedContainer: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        alignItems: 'center',
        zIndex: 100,
    },
    mainFloatingButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#2A4D8E',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 6,
    },
    mainButtonActive: {
        backgroundColor: '#1E3A8A', // Version plus foncée quand actif
    },
    optionsContainer: {
        marginBottom: 16,
        alignItems: 'center',
    },
    optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
    },
    optionCall: {
        backgroundColor: '#4CD964', // Vert pour appeler
    },
    optionEmail: {
        backgroundColor: '#FF9500', // Orange pour email
    },
    optionChat: {
        backgroundColor: '#5856D6', // Violet pour chat
    },
    optionText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '500',
        marginLeft: 6,
    },
});

export { AssistanceButton, FloatingAssistanceButton, PlatinumCard };