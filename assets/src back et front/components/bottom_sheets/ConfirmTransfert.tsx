import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Modal,
    KeyboardAvoidingView,
    Platform,
    Animated,
    Easing,
    TouchableWithoutFeedback,
    Keyboard,
    Dimensions,
    Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '../../hooks/useTranslation';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface TransferConfirmationSheetProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: (password: string) => void;
    amount: number;
    recipient: string;
    isLoading?: boolean;
}

const TransferConfirmationSheet: React.FC<TransferConfirmationSheetProps> = ({
    visible,
    onClose,
    onConfirm,
    amount,
    recipient,
    isLoading = false
}) => {
    const [password, setPassword] = useState('');
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const slideAnim = useRef(new Animated.Value(0)).current;
    const { t } = useTranslation();

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setKeyboardVisible(true);
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setKeyboardVisible(false);
            }
        );

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    useEffect(() => {
        if (visible) {
            Animated.timing(slideAnim, {
                toValue: 1,
                duration: 300,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true
            }).start();
        } else {
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 250,
                easing: Easing.in(Easing.ease),
                useNativeDriver: true
            }).start();
        }
    }, [visible, slideAnim]);

    const handleConfirm = () => {
        if (!password) return;
        onConfirm(password);
        setPassword('');
    };

    const handleClose = () => {
        Keyboard.dismiss();
        onClose();
        setPassword('');
    };

    const translateY = slideAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [SCREEN_HEIGHT, 0]
    });

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            onRequestClose={handleClose}
        >
            <TouchableWithoutFeedback onPress={handleClose}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                        <Animated.View
                            style={[
                                styles.container,
                                { transform: [{ translateY }] },
                                keyboardVisible && styles.containerWithKeyboard
                            ]}
                        >
                            <View style={{ backgroundColor: '#fcbf00', borderTopLeftRadius: 24, borderTopRightRadius: 24, alignItems: 'center' }}>
                                <View style={styles.handleBar} />
                                {/* Image de l'abonnement */}
                                <Image
                                    source={require('../../../assets/logo_sesamepayx3.png')}
                                    style={styles.headerImage}
                                />
                                {/* En-tête */}
                                <View style={styles.header}>
                                    <Ionicons name="checkmark-circle" size={32} color="#4CAF50" />
                                    <Text style={styles.title}>{t.title.transfertConfirm}</Text>
                                </View>
                            </View>
                            <View style={{ padding: 24, paddingBottom: 34, backgroundColor: 'white', }}>


                                {/* Détails du transfert */}
                                {/* <View style={styles.detailsContainer}>
                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>Montant:</Text>
                                        <Text style={styles.detailValue}>{amount.toLocaleString()} FCFA</Text>
                                    </View>
                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>Destinataire:</Text>
                                        <Text style={styles.detailValue}>{recipient}</Text>
                                    </View>
                                </View> */}

                                {/* Message de confirmation */}
                                <Text style={styles.message}>
                                    {recipient}
                                </Text>

                                {/* Champ mot de passe */}
                                <View style={styles.passwordContainer}>
                                    <TextInput
                                        style={styles.passwordInput}
                                        placeholder={t.auth.password}
                                        placeholderTextColor="#A0AEC0"
                                        value={password}
                                        onChangeText={setPassword}
                                        secureTextEntry
                                        autoFocus
                                    />
                                    <Ionicons name="lock-closed" size={20} color="#667eea" style={styles.lockIcon} />
                                </View>

                                {/* Boutons Annuler et Confirmer */}
                                <View style={styles.buttonsContainer}>
                                    <TouchableOpacity
                                        style={[styles.button, styles.cancelButton]}
                                        onPress={handleClose}
                                        disabled={isLoading}
                                    >
                                        <Text style={styles.cancelButtonText}>{t.common.cancel}</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[
                                            styles.button,
                                            styles.confirmButton,
                                            !password && styles.confirmButtonDisabled
                                        ]}
                                        onPress={handleConfirm}
                                        disabled={!password || isLoading}
                                    >
                                        {isLoading ? (
                                            <Text style={styles.confirmButtonText}>{t.fields.proressingTraitment}...</Text>
                                        ) : (
                                            <Text style={styles.confirmButtonText}>{t.common.confirm}</Text>
                                        )}
                                    </TouchableOpacity>
                                </View>
                            </View>

                        </Animated.View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    container: {

        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,

        maxHeight: SCREEN_HEIGHT * 0.7,
    },
    containerWithKeyboard: {
        paddingBottom: 24,
    },
    handleBar: {
        width: 40,
        height: 5,
        backgroundColor: 'red',
        borderRadius: 3,
        alignSelf: 'center',
        marginBottom: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        gap: 12,
    },
    title: {
        fontSize: 16,
        fontFamily: 'Poppins-Bold',
        color: '#2D3748',
    },
    detailsContainer: {
        backgroundColor: '#F7FAFC',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    detailLabel: {
        fontSize: 14,
        color: '#718096',
        fontWeight: '500',
    },
    detailValue: {
        fontSize: 16,
        color: '#2D3748',
        fontWeight: '600',
    },
    message: {
        color: '#718096',
        marginBottom: 20,
        fontSize: 11,
        fontFamily: 'Poppins-Regular',
        lineHeight: 20,
    },
    passwordContainer: {
        position: 'relative',
        marginBottom: 24,
    },
    passwordInput: {
        backgroundColor: '#F7FAFC',
        borderRadius: 12,
        padding: 16,
        paddingLeft: 48,
        fontSize: 16,
        color: '#2D3748',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    lockIcon: {
        position: 'absolute',
        left: 16,
        top: 16,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 16,
    },
    button: {
        flex: 1,
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButton: {
        backgroundColor: '#F1F2F6',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    cancelButtonText: {
        color: '#718096',
        fontSize: 16,
        fontWeight: '600',
    },
    confirmButton: {
        backgroundColor: '#fcbf00',
    },
    confirmButtonDisabled: {
        backgroundColor: '#CBD5E0',
    },
    confirmButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    headerImage: {
        width: 125,
        height: 30,
        borderRadius: 8,
        marginTop: 10,
        marginBottom: 10,
    },
});

export default TransferConfirmationSheet;