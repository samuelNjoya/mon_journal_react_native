import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
    TextInput,
    KeyboardAvoidingView,
    Image,
    Platform
} from 'react-native';
import { useAuthAuthContext } from '../context/auth/AuthContext';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import CountryPicker, { CountryCode, Country } from 'react-native-country-picker-modal';
import { useTranslation } from '../hooks/useTranslation';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import ErrorModal from '../components/Notification';
import { authService } from '../api';
import getDeviceNetworkInfo from '../utils/deviceInfo';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Language'>;

const LanguageScreen: React.FC = () => {
    const { t, language } = useTranslation();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [countryCode, setCountryCode] = useState<CountryCode>('CM');
    const [country, setCountry] = useState<Country | null>(null);
    const [withCallingCode, setWithCallingCode] = useState(true);
    const [showError, setShowError] = useState(false);
    const [message, setMessage] = useState('');
    const [messageTitle, setMessageTitle] = useState('')

    const navigation = useNavigation<LoginScreenNavigationProp>();
    const insets = useSafeAreaInsets();
    const { signIn } = useAuthAuthContext();

    const handleLogin = async () => {
        try {
            const fullNumber = `${country?.callingCode?.[0] ? country.callingCode[0] : '237'}${phoneNumber}`;
            if (!fullNumber || !password) {
                // Alert.alert(t.common.error, t.alerts.fillAllFields);
                setMessageTitle(t.common.error)
                setMessage(t.alerts.fillAllFields)
                setShowError(true)
                return;
            }

            setIsLoading(true);
            const deviceInfo = await getDeviceNetworkInfo();
            const credentials = {
                phone_number: fullNumber,
                password,
                lan: language,
                host: {
                    hostname: deviceInfo?.deviceName,
                    host_platform: Platform.OS,
                    host_os: Platform.OS,
                    app_version: deviceInfo?.appVersion
                },
            }
            const result = await authService.login(credentials)
            if (result.success && result.data) {
                if (result.data.status === 1) {
                    await signIn({
                        accessToken: result.data.accessToken,
                        sessionToken: result.data.sessionToken,
                        phone_number: fullNumber
                    })
                } else {
                    setMessage(result.data.err_msg)
                    setMessageTitle(result.data.err_title)
                    setShowError(true);
                }
            } else {
                setMessageTitle(t.alerts.error)
                setShowError(true);
                setMessage(result.error)
            }
        } catch (e) {
            console.log("Exception: ", e)
        } finally {
            setIsLoading(false)
        }
    };

    const handleForgotPassword = () => {
        navigation.navigate('ForgotPassword' as never);
    };

    const handleCreateAccount = () => {
        navigation.navigate('Signup' as never);
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={['bottom']}>
            <ErrorModal
                visible={showError}
                title={messageTitle}
                message={message}
                type={"warning"}
                onClose={() => setShowError(false)}
            />
            <View style={[styles.container, { paddingTop: insets.top }]}>
                <View style={[styles.content]}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={styles.keyboardAvoidingView}
                    >
                        <ScrollView
                            contentContainerStyle={styles.scrollContent}
                            keyboardShouldPersistTaps="handled"
                        >
                            {/* Header avec logo */}
                            <View style={styles.header}>
                                <Image source={require('../../assets/logo_sesampayx.png')} style={styles.logo} />
                                <Text style={styles.title}>{t.auth.login}</Text>
                                <Text style={styles.welcomeText}>{t.auth.subtitle}</Text>
                            </View>

                            {/* Formulaire de connexion */}
                            <View style={styles.formContainer}>
                                {/* Champ numéro de téléphone */}
                                <View style={styles.inputContainer}>
                                    <CountryPicker
                                        countryCode={countryCode}
                                        withCallingCodeButton
                                        withFilter
                                        withFlag
                                        withEmoji
                                        onSelect={(c) => {
                                            setCountryCode(c.cca2);
                                            setCountry(c);
                                        }}
                                        containerButtonStyle={styles.countryPicker}
                                    />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Numéro de téléphone"
                                        placeholderTextColor="#7f8c8d"
                                        value={phoneNumber}
                                        onChangeText={setPhoneNumber}
                                        keyboardType="phone-pad"
                                        autoCapitalize="none"
                                    />
                                </View>

                                {/* Champ mot de passe */}
                                <View style={styles.inputContainer}>
                                    <Ionicons name="lock-closed-outline" size={20} color="#7f8c8d" style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Mot de passe"
                                        placeholderTextColor="#7f8c8d"
                                        value={password}
                                        onChangeText={setPassword}
                                        secureTextEntry={!showPassword}
                                        autoCapitalize="none"
                                    />
                                    <TouchableOpacity
                                        onPress={() => setShowPassword(!showPassword)}
                                        style={styles.eyeIcon}
                                    >
                                        <Ionicons
                                            name={showPassword ? "eye-off-outline" : "eye-outline"}
                                            size={20}
                                            color="#7f8c8d"
                                        />
                                    </TouchableOpacity>
                                </View>

                                {/* Lien mot de passe oublié */}
                                <TouchableOpacity
                                    onPress={handleForgotPassword}
                                    style={styles.forgotPasswordLink}
                                >
                                    <Text style={styles.forgotPasswordText}>{t.auth.forgotPassword}</Text>
                                </TouchableOpacity>

                                {/* Bouton de connexion */}
                                <TouchableOpacity
                                    style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                                    onPress={handleLogin}
                                    disabled={isLoading}
                                >
                                    <LinearGradient
                                        colors={['#fcbf00', '#e6ac00']}
                                        style={styles.loginButtonGradient}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                    >
                                        {isLoading ? (
                                            <Ionicons name="refresh" size={24} color="#1a171a" />
                                        ) : (
                                            <Text style={styles.loginButtonText}>{t.auth.Login}</Text>
                                        )}
                                    </LinearGradient>
                                </TouchableOpacity>

                                {/* Séparateur */}
                                <View style={styles.separator}>
                                    <View style={styles.separatorLine} />
                                    <Text style={styles.separatorText}>Ou</Text>
                                    <View style={styles.separatorLine} />
                                </View>

                                {/* Lien création de compte */}
                                <View style={styles.createAccountContainer}>
                                    <Text style={styles.createAccountText}>{t.auth.noAccount}</Text>
                                    <TouchableOpacity onPress={handleCreateAccount}>
                                        <Text style={styles.createAccountLink}>{t.auth.createAccount}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Footer */}
                            <View style={styles.footer}>
                                <Text style={styles.footerText}>© 2025 Sesampayx. {t.common.copyright}</Text>
                            </View>
                        </ScrollView>
                    </KeyboardAvoidingView>
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
        backgroundColor: '#ffff' // retire cette ligne si tu veux tout en #fff3c2
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
    keyboardAvoidingView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'space-between',
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 30,
    },
    logo: {
        width: 80,
        height: 80,
        marginBottom: 16,
        resizeMode: 'contain',
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#1a2b47',
        marginBottom: 22,
        fontFamily: 'Poppins-Bold',
    },
    logoContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    appName: {
        fontSize: 28,
        fontFamily: 'Poppins-Bold',
        color: '#1a2b47',
        marginBottom: 5,
    },
    welcomeText: {
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        color: '#7f8c8d',
    },
    formContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#e9ecef',
        paddingHorizontal: 15,
        height: 54,
    },
    inputIcon: {
        marginRight: 12,
        paddingBottom: 5
    },
    input: {
        flex: 1,
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        color: '#2c3e50',
        height: '100%',
    },
    eyeIcon: {
        padding: 5,
    },
    forgotPasswordLink: {
        alignSelf: 'flex-end',
        marginBottom: 30,
    },
    forgotPasswordText: {
        fontSize: 14,
        fontFamily: 'Poppins-Medium',
        color: '#007aff',
    },
    loginButton: {
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 30,
        shadowColor: '#fcbf00',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    loginButtonGradient: {
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginButtonText: {
        fontSize: 18,
        fontFamily: 'Poppins-Bold',
        color: '#1a171a',
    },
    loginButtonDisabled: {
        opacity: 0.7,
    },
    separator: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
    },
    separatorLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#e9ecef',
    },
    separatorText: {
        marginHorizontal: 15,
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        color: '#7f8c8d',
    },
    createAccountContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    createAccountText: {
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        color: '#7f8c8d',
    },
    createAccountLink: {
        fontSize: 14,
        fontFamily: 'Poppins-Bold',
        color: '#fcbf00',
    },
    footer: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 10,
    },
    footerText: {
        fontSize: 12,
        fontFamily: 'Poppins-Light',
        color: '#adb5bd',
    },
    countryPicker: {
        marginRight: 8,
        marginBottom: 6.5
    },
});


export default LanguageScreen;