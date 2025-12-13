import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    StatusBar,
    Image,
} from 'react-native';
import { useAuth } from '../context/auth/AuthContext';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from '../hooks/useTranslation';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type LanguageScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Language'>;

const BaseScreen: React.FC = () => {
    const { changeLanguage, appSettings } = useAuth();
    const { t } = useTranslation();
    const navigation = useNavigation<LanguageScreenNavigationProp>();
    const insets = useSafeAreaInsets();

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
        // {
        //     code: 'es',
        //     name: t.language.spanish,
        //     nativeName: 'Español',
        //     flag: '🇪🇸'
        // },
        // {
        //     code: 'ar',
        //     name: t.language.arabic,
        //     nativeName: 'العربية',
        //     flag: '🇸🇦'
        // }
    ];

    const handleLanguageSelect = async (languageCode: string) => {
        await changeLanguage(languageCode);
        navigation.replace('Welcome');
    };

    // const handleContinue = async () => {
    //     await completeFirstLaunch();

    // };

    return (
        <SafeAreaView style={styles.safeArea} edges={['bottom']}>
            <View style={[styles.container, { paddingTop: insets.top }]}>
                <View style={[styles.content]}>
                    <Text style={styles.title}>Connexion</Text>
                    {/* Ajoute ici ton formulaire */}
                </View>
            </View>
        </SafeAreaView>

    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#fcbf00',
    },
    content: {
        flex: 1,
        width: '100%',
        paddingHorizontal: 20,
        backgroundColor: '#ffff' // retire cette ligne si tu veux tout en #fff3c2
    },
    logo: {
        width: 180,
        height: 100,
        marginBottom: 50,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#003366', // Bleu foncé pour contraste
        marginBottom: 20,
        textAlign: 'center',
        fontFamily: 'Poppins-Bold',
    },
    optionsContainer: {
        width: '100%',
        maxWidth: 350,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingLeft: 15,
        borderRadius: 12,
        marginVertical: 10,
        width: 200,
        height: 50
    },
    flag: {
        width: 32,
        height: 20,
        marginRight: 15,
    },
    label: {
        fontSize: 18,
        color: '#003366',
        fontWeight: '600',
    },
});


export default BaseScreen;