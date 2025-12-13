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
import { useAuthAuthContext } from '../context/auth/AuthContext';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from '../hooks/useTranslation';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type LanguageScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Language'>;

const LanguageScreen: React.FC = () => {
    const { changeLanguage, appSettings } = useAuthAuthContext();
    const { t } = useTranslation();
    const navigation = useNavigation<LanguageScreenNavigationProp>();

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
            <View style={styles.container}>
                <Image
                    source={require('../../assets/logo_sesampayx.png')} // Assure-toi que le logo est bien dans assets
                    style={styles.logo}
                    resizeMode="contain"
                />
                <Text style={styles.title}>🌍 Choisissez votre langue</Text>
                {languages.map((lang) => (
                    <TouchableOpacity
                        key={lang.code}
                        style={styles.option}
                        onPress={() => handleLanguageSelect(lang.code)}
                    >
                        <Text style={styles.flag}>{lang.flag}</Text>
                        <Text style={styles.label}>{lang.name}</Text>
                    </TouchableOpacity>
                ))}
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
        paddingHorizontal: 20,
        paddingTop: 60,
        backgroundColor: '#fcbf00',
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


export default LanguageScreen;