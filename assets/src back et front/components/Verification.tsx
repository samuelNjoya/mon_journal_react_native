import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Easing
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '../hooks/useTranslation';

type CheckProps = {
    onAction: (password: string) => void;
    isProcessing: boolean;
};

const PasswordForm = ({ onAction, isProcessing }: CheckProps) => {
    const [password, setPassword] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [shakeAnim] = useState(new Animated.Value(0));
    const { t, language } = useTranslation();

    const handleValidate = () => {
        if (!password.trim()) {
            shakeAnimation();
            return;
        }
        onAction(password)
        // console.log('Mot de passe validé:', password);
        // setPassword('');
    };

    const shakeAnimation = () => {
        Animated.sequence([
            Animated.timing(shakeAnim, {
                toValue: 10,
                duration: 50,
                easing: Easing.linear,
                useNativeDriver: true
            }),
            Animated.timing(shakeAnim, {
                toValue: -10,
                duration: 50,
                easing: Easing.linear,
                useNativeDriver: true
            }),
            Animated.timing(shakeAnim, {
                toValue: 10,
                duration: 50,
                easing: Easing.linear,
                useNativeDriver: true
            }),
            Animated.timing(shakeAnim, {
                toValue: 0,
                duration: 50,
                easing: Easing.linear,
                useNativeDriver: true
            })
        ]).start();
    };

    return (
        <View style={styles.container}>
            {/* Icone et Titre */}
            <View style={styles.header}>
                <LinearGradient
                    colors={['#fcbf00', '#f7931e']}
                    style={styles.iconGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <Ionicons name="lock-closed" size={32} color="white" />
                </LinearGradient>
                <Text style={styles.title}>{t.payment.transactionSecurityTitle}</Text>
                <Text style={styles.subtitle}>
                    {t.payment.transactionSecuritySubtitle}
                </Text>
            </View>

            {/* Champ mot de passe */}
            <Animated.View style={[
                styles.inputContainer,
                isFocused && styles.inputContainerFocused,
                { transform: [{ translateX: shakeAnim }] }
            ]}>
                <TextInput
                    style={styles.input}
                    placeholder={t.auth.password}
                    placeholderTextColor="#A0AEC0"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    autoCapitalize="none"
                    autoCorrect={false}
                />
                <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setShowPassword(!showPassword)}
                >
                    <Ionicons
                        name={showPassword ? 'eye-off' : 'eye'}
                        size={22}
                        color="#fcbf00"
                    />
                </TouchableOpacity>
            </Animated.View>

            {/* Boutons */}
            <View style={styles.buttonsContainer}>
                {/* <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => console.log('Annulé')}
                >
                    <Text style={styles.cancelButtonText}>Annuler</Text>
                </TouchableOpacity> */}

                <TouchableOpacity
                    style={[
                        styles.validateButton,
                        !password && styles.validateButtonDisabled
                    ]}
                    onPress={handleValidate}
                    disabled={!password || isProcessing}
                >
                    <LinearGradient
                        colors={password ? ['#fcbf00', '#f7931e'] : ['#CCC', '#AAA']}
                        style={styles.validateButtonGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                    >
                        <Text style={styles.validateButtonText}>
                            {isProcessing ? t.fields.proressingTraitment + '...' : t.fields.valid}
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        backgroundColor: '#F8F9FA',
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    iconGradient: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: '#667eea',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 5,
    },
    title: {
        fontSize: 20,
        fontFamily: 'Poppins-Bold',
        color: '#2D3748',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#718096',
        textAlign: 'center',
        lineHeight: 22,
        fontFamily: 'Poppins-Regular'
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#E2E8F0',
        marginBottom: 32,
        paddingHorizontal: 20,
        height: 60,
    },
    inputContainerFocused: {
        borderColor: '#fcbf00',
        shadowColor: '#fcbf00',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 3,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#2D3748',
        height: '100%',
    },
    eyeButton: {
        padding: 8,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        gap: 16,
    },
    cancelButton: {
        flex: 1,
        backgroundColor: '#F1F2F6',
        borderRadius: 16,
        padding: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButtonText: {
        color: '#718096',
        fontSize: 16,
        fontFamily: 'Poppins-Bold'
    },
    validateButton: {
        flex: 1,
        borderRadius: 16,
        overflow: 'hidden',
    },
    validateButtonDisabled: {
        opacity: 0.7,
    },
    validateButtonGradient: {
        padding: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    validateButtonText: {
        color: 'white',
        fontSize: 16,
        fontFamily: 'Poppins-Bold'
    },
});

export default PasswordForm;