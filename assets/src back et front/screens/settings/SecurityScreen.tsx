import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Switch,
    TextInput,
    Alert,
    Modal,
    Platform,
    ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { homeService } from '../../api/services/home';
import { useTranslation } from '../../hooks/useTranslation';
import LoadingScreen from '../../components/LoadingScreen';
import getDeviceNetworkInfo from '../../utils/deviceInfo';
import { useAuthAuthContext } from '../../context/auth/AuthContext';
import ErrorModal from '../../components/Notification';

const SecurityPrivacyScreen: React.FC = () => {
    const [onlinePaymentEnabled, setOnlinePaymentEnabled] = useState(true);
    const [biometricEnabled, setBiometricEnabled] = useState(true);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [acting, setActing] = useState(false);

    // États pour le changement de mot de passe
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { t, language } = useTranslation();
    const { changePassword } = useAuthAuthContext();

    // Options de sécurité
    const securityOptions = [
        {
            id: '1',
            title: t.security.online_payment,
            description: t.security.online_payment_description,
            icon: 'card',
            enabled: onlinePaymentEnabled,
            color: '#fcbf00'
        },
    ];

    // Valider le changement de mot de passe
    const validatePasswordChange = () => {
        if (!currentPassword) {
            setErrorMessage(t.security.invalidPassword)
            return false;
        }

        if (newPassword.length < 8) {
            setErrorMessage(t.security.min_password)
            return false;
        }

        if (newPassword !== confirmPassword) {
            setErrorMessage(t.security.miss_match_password)
            return false;
        }

        if (newPassword === currentPassword) {
            setErrorMessage(t.security.old_not_new_password)
            return false;
        }

        return true;
    };

    const handleSwitch = async (id: string) => {
        try {
            if (id === '1') {
                setActing(true)
                const result = await homeService.setOnlinePayment({ payment_state: !onlinePaymentEnabled })
                setActing(false)
                if (result.success && result.data) {
                    if (result.data.status === 1) {
                        setOnlinePaymentEnabled(result.data.payment_state)
                    } else {
                        setErrorMessage(result.data.err_msg)
                    }
                } else {
                    setErrorMessage(result.error)
                }
            }
        } catch (error) {
            console.log(error)
            setErrorMessage(t.profil.loading_error)
        }
    }

    // Changer le mot de passe
    const handleChangePassword = async () => {
        if (!validatePasswordChange()) return;

        setLoading(true);
        try {
            const deviceInfo = await getDeviceNetworkInfo();
            const result = await homeService.changePassword({
                password: currentPassword,
                new_password: newPassword,
                host: {
                    hostname: deviceInfo?.deviceName,
                    host_platform: Platform.OS,
                    host_os: Platform.OS,
                    app_version: deviceInfo?.appVersion
                },
            })
            if (result.success && result.data) {
                if (result.data.status === 1) {
                    const res = await changePassword(result.data)
                    Alert.alert(
                        res ? t.common.success : t.security.warning,
                        res ? t.security.set_password_success_msg : t.security.set_password_warning_msg,
                        [
                            {
                                text: t.alerts.ok,
                                onPress: () => {
                                    setShowChangePassword(false);
                                    resetPasswordForm();
                                }
                            }
                        ]
                    );
                } else {
                    setErrorMessage(result.data.err_msg)
                }
            } else {
                setErrorMessage(result.error)
            }
        } catch (error) {
            setErrorMessage(t.security.set_password_error)
        } finally {
            setLoading(false);
        }
    };

    // Réinitialiser le formulaire
    const resetPasswordForm = () => {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setShowCurrentPassword(false);
        setShowNewPassword(false);
        setShowConfirmPassword(false);
    };

    // Rendu d'une option de sécurité
    const renderSecurityOption = (option: any) => (
        <View key={option.id} style={styles.securityOption}>
            <View style={styles.optionHeader}>
                <View style={styles.optionInfo}>
                    <View style={[styles.optionIcon, { backgroundColor: `${option.color}20` }]}>
                        <Ionicons name={option.icon as any} size={24} color={option.color} />
                    </View>
                    <View style={styles.optionText}>
                        <Text style={styles.optionTitle}>{option.title}</Text>
                        <Text style={styles.optionDescription}>{option.description}</Text>
                    </View>
                </View>
                <Switch
                    value={option.enabled}
                    onValueChange={() => { handleSwitch(option.id) }}
                    trackColor={{ false: '#E2E8F0', true: option.color }}
                    thumbColor="#FFFFFF"
                />
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Header */}
                {/* <View style={styles.header}>
                    <Text style={styles.headerTitle}>Sécurité et Confidentialité</Text>
                    <Text style={styles.headerSubtitle}>
                        Gérez vos paramètres de sécurité et de confidentialité
                    </Text>
                </View> */}

                {/* Section Options de sécurité */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t.security.title}</Text>
                    <Text style={styles.sectionDescription}>
                        {t.security.description}
                    </Text>

                    <View style={styles.securityOptions}>
                        {securityOptions.map(renderSecurityOption)}
                    </View>
                </View>

                {/* Section Changement de mot de passe */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <View>
                            <Text style={styles.sectionTitle}>{t.auth.password}</Text>
                            <Text style={styles.sectionDescription}>
                                {t.security.password_description}
                            </Text>
                        </View>
                        <TouchableOpacity
                            style={styles.changePasswordButton}
                            onPress={() => setShowChangePassword(true)}
                        >
                            <Ionicons name="key" size={16} color="#FFFFFF" />
                            <Text style={styles.changePasswordText}>Changer</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.passwordInfo}>
                        <Ionicons name="information-circle" size={20} color="#fcbf00" />
                        <Text style={styles.passwordInfoText}>
                            {t.security.info}
                        </Text>
                    </View>
                </View>
            </ScrollView>

            {/* Modal de changement de mot de passe */}
            <Modal
                visible={showChangePassword}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowChangePassword(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{t.security.set_password}</Text>
                            <TouchableOpacity
                                onPress={() => {
                                    setShowChangePassword(false);
                                    resetPasswordForm();
                                }}
                                style={styles.closeButton}
                            >
                                <Ionicons name="close" size={24} color="#2D3748" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalBody}>
                            {/* Mot de passe actuel */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>{t.security.current_password}</Text>
                                <View style={styles.passwordInputContainer}>
                                    <TextInput
                                        style={styles.passwordInput}
                                        value={currentPassword}
                                        onChangeText={setCurrentPassword}
                                        secureTextEntry={!showCurrentPassword}
                                        placeholder={t.security.current_placeholder}
                                        autoCapitalize="none"
                                    />
                                    <TouchableOpacity
                                        style={styles.eyeButton}
                                        onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                                    >
                                        <Ionicons
                                            name={showCurrentPassword ? "eye-off" : "eye"}
                                            size={20}
                                            color="#718096"
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Nouveau mot de passe */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>{t.security.new_password}</Text>
                                <View style={styles.passwordInputContainer}>
                                    <TextInput
                                        style={styles.passwordInput}
                                        value={newPassword}
                                        onChangeText={setNewPassword}
                                        secureTextEntry={!showNewPassword}
                                        placeholder={t.security.new_placeholder}
                                        autoCapitalize="none"
                                    />
                                    <TouchableOpacity
                                        style={styles.eyeButton}
                                        onPress={() => setShowNewPassword(!showNewPassword)}
                                    >
                                        <Ionicons
                                            name={showNewPassword ? "eye-off" : "eye"}
                                            size={20}
                                            color="#718096"
                                        />
                                    </TouchableOpacity>
                                </View>
                                <Text style={styles.passwordHint}>
                                    {t.security.password_hint}
                                </Text>
                            </View>

                            {/* Confirmation du mot de passe */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>{t.security.password_confirm}</Text>
                                <View style={styles.passwordInputContainer}>
                                    <TextInput
                                        style={styles.passwordInput}
                                        value={confirmPassword}
                                        onChangeText={setConfirmPassword}
                                        secureTextEntry={!showConfirmPassword}
                                        placeholder={t.security.confirm_placeholder}
                                        autoCapitalize="none"
                                    />
                                    <TouchableOpacity
                                        style={styles.eyeButton}
                                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        <Ionicons
                                            name={showConfirmPassword ? "eye-off" : "eye"}
                                            size={20}
                                            color="#718096"
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Indicateur de force du mot de passe */}
                            <View style={styles.passwordStrength}>
                                <Text style={styles.strengthLabel}>{t.security.password_strength}</Text>
                                <View style={styles.strengthBar}>
                                    <View
                                        style={[
                                            styles.strengthProgress,
                                            {
                                                width: `${Math.min((newPassword.length / 8) * 100, 100)}%`,
                                                backgroundColor: newPassword.length >= 8 ? '#4ECDC4' : '#FF6B6B'
                                            }
                                        ]}
                                    />
                                </View>
                                <Text style={styles.strengthText}>
                                    {newPassword.length >= 8 ? t.security.strong : t.security.weak}
                                </Text>
                            </View>
                        </ScrollView>

                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => {
                                    setShowChangePassword(false);
                                    resetPasswordForm();
                                }}
                                disabled={loading}
                            >
                                <Text style={styles.cancelButtonText}>{t.common.cancel}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.saveButton,
                                    (!currentPassword || !newPassword || !confirmPassword) && styles.saveButtonDisabled
                                ]}
                                onPress={handleChangePassword}
                                disabled={!currentPassword || !newPassword || !confirmPassword || loading}
                            >
                                {loading ? (
                                    <ActivityIndicator size="small" color="#FFFFFF" />
                                ) : (
                                    <>
                                        <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                                        <Text style={styles.saveButtonText}>{t.common.save}</Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            <ErrorModal
                visible={errorMessage !== ''}
                message={errorMessage}
                onClose={() => { setErrorMessage('') }}
                type="error"
            />
            {
                acting && <LoadingScreen />
            }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 20,
    },
    header: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2D3748',
        fontFamily: 'Poppins-Bold',
        textAlign: 'center',
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#718096',
        textAlign: 'center',
        marginTop: 8,
        fontFamily: 'Poppins-Regular',
    },
    section: {
        backgroundColor: '#FFFFFF',
        margin: 16,
        marginBottom: 0,
        padding: 20,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2D3748',
        fontFamily: 'Poppins-SemiBold',
    },
    sectionDescription: {
        fontSize: 12,
        color: '#718096',
        marginTop: 4,
        fontFamily: 'Poppins-Regular',
    },
    securityOptions: {
        gap: 16,
    },
    securityOption: {
        paddingVertical: 8,
    },
    optionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    optionInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    optionIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    optionText: {
        flex: 1,
    },
    optionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2D3748',
        fontFamily: 'Poppins-SemiBold',
    },
    optionDescription: {
        fontSize: 12,
        color: '#718096',
        marginTop: 2,
        fontFamily: 'Poppins-Regular',
    },
    changePasswordButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fcbf00',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    changePasswordText: {
        color: '#FFFFFF',
        fontWeight: '600',
        marginLeft: 4,
        fontFamily: 'Poppins-SemiBold',
    },
    passwordInfo: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#FFFBF0',
        padding: 12,
        borderRadius: 8,
        marginTop: 12,
    },
    passwordInfoText: {
        fontSize: 12,
        color: '#D69E2E',
        marginLeft: 8,
        flex: 1,
        fontFamily: 'Poppins-Regular',
    },
    seeAllButton: {
        padding: 4,
    },
    seeAllText: {
        color: '#fcbf00',
        fontSize: 14,
        fontFamily: 'Poppins-Medium',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '90%',
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2D3748',
        fontFamily: 'Poppins-SemiBold',
    },
    closeButton: {
        padding: 4,
    },
    modalBody: {
        padding: 20,
    },
    inputGroup: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2D3748',
        marginBottom: 8,
        fontFamily: 'Poppins-SemiBold',
    },
    passwordInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 8,
        backgroundColor: '#F7FAFC',
    },
    passwordInput: {
        flex: 1,
        padding: 12,
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
    },
    eyeButton: {
        padding: 12,
    },
    passwordHint: {
        fontSize: 12,
        color: '#718096',
        marginTop: 4,
        fontFamily: 'Poppins-Regular',
    },
    passwordStrength: {
        marginTop: 16,
    },
    strengthLabel: {
        fontSize: 12,
        color: '#718096',
        marginBottom: 8,
        fontFamily: 'Poppins-Regular',
    },
    strengthBar: {
        height: 4,
        backgroundColor: '#E2E8F0',
        borderRadius: 2,
        marginBottom: 4,
    },
    strengthProgress: {
        height: '100%',
        borderRadius: 2,
    },
    strengthText: {
        fontSize: 12,
        fontWeight: '600',
        fontFamily: 'Poppins-SemiBold',
    },
    modalActions: {
        flexDirection: 'row',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    cancelButton: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        backgroundColor: '#F7FAFC',
        alignItems: 'center',
        marginRight: 8,
    },
    cancelButtonText: {
        color: '#718096',
        fontWeight: '600',
        fontFamily: 'Poppins-SemiBold',
    },
    saveButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fcbf00',
        padding: 12,
        borderRadius: 8,
        marginLeft: 8,
    },
    saveButtonDisabled: {
        backgroundColor: '#CBD5E0',
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
        marginLeft: 8,
        fontFamily: 'Poppins-SemiBold',
    },
});

export default SecurityPrivacyScreen;