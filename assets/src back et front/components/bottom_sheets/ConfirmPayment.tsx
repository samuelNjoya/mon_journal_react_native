import React, { useRef, useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Animated,
    PanResponder,
    SafeAreaView,
    Image,
    ScrollView,
    TextInput,
    ActivityIndicator,
} from 'react-native';
import { showBenaccPrice } from '../../utils/helpers';
import { useTranslation } from '../../hooks/useTranslation';

const { width, height } = Dimensions.get('window');

interface BottomSheetType {
    visible: boolean;
    onClose: any;
    paymentMethod: string
    onConfirm: any,
    transactionAmount: number,
}

const PaymentConfirmation = ({
    visible,
    onClose,
    paymentMethod,
    onConfirm,
    transactionAmount,
}: BottomSheetType) => {
    const translateY = useRef(new Animated.Value(height)).current;
    const totalAmount = 0
    const { t, language } = useTranslation();

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: (_, gestureState) => {
                return Math.abs(gestureState.dy) > 5;
            },
            onPanResponderMove: (_, gestureState) => {
                if (gestureState.dy > 0) {
                    translateY.setValue(gestureState.dy);
                }
            },
            onPanResponderRelease: (_, gestureState) => {
                if (gestureState.dy > 100) {
                    closeBottomSheet();
                } else {
                    Animated.spring(translateY, {
                        toValue: 0,
                        useNativeDriver: true,
                        damping: 15,
                        stiffness: 150
                    }).start();
                }
            },
        })
    ).current;
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [countdown, setCountdown] = useState(60);
    const [canResend, setCanResend] = useState(false);

    // Images des méthodes de paiement
    const paymentMethodImages: any = {
        om: require('../../../assets/payment_methodes/om.png'),
        mtn: require('../../../assets/payment_methodes/momo.png'),
        sesampayx: require('../../../assets/payment_methodes/momo.png'),
        visa: require('../../../assets/payment_methodes/om.png'),
        mastercard: require('../../../assets/payment_methodes/momo.png'),
        default: require('../../../assets/payment_methodes/om.png')
    };

    // Messages selon la méthode de paiement
    // const getPaymentMethodMessage = () => {
    //     switch (paymentMethod) {
    //         case 'om':
    //             return "Orange Money vous envoie un code de confirmation";
    //         case 'mtn':
    //             return "MTN Mobile Money vous envoie un code de confirmation";
    //         case 'orange':
    //             return "Orange Money vous envoie un code de confirmation";
    //         case 'visa':
    //             return "Visa vous envoie un code de confirmation";
    //         case 'mastercard':
    //             return "Mastercard vous envoie un code de confirmation";
    //         default:
    //             return "Un code de confirmation vous a été envoyé";
    //     }
    // };
    const getPaymentMethodImage = () => {
        return paymentMethodImages[paymentMethod] || paymentMethodImages.default;
    };

    useEffect(() => {
        if (visible) {
            openBottomSheet();
        } else {
            closeBottomSheet();
        }
    }, [visible]);

    const openBottomSheet = () => {
        Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            damping: 15,
            stiffness: 150
        }).start();
    };

    const startCountdown = () => {
        setCountdown(60);
        setCanResend(false);
    };

    const handleResendCode = () => {
        if (canResend) {
            startCountdown();
            // Ici vous ajouteriez la logique pour renvoyer le code
            console.log("Code renvoyé");
        }
    };

    const closeBottomSheet = () => {
        Animated.spring(translateY, {
            toValue: height,
            useNativeDriver: true,
            damping: 15,
            stiffness: 150
        }).start(() => {
            if (onClose) onClose();
        });
    };

    if (!visible) return null;

    return (
        <>
            <Animated.View
                style={[
                    styles.overlay,
                    {
                        opacity: translateY.interpolate({
                            inputRange: [0, height],
                            outputRange: [0.5, 0]
                        })
                    }
                ]}
            />
            <Animated.View
                style={[
                    styles.bottomSheet,
                    {
                        transform: [{ translateY }]
                    }
                ]}
                {...panResponder.panHandlers}
            >
                <View style={styles.dragHandleContainer}>
                    <View style={styles.dragHandle} />
                </View>

                <ScrollView
                    style={styles.content}
                    showsVerticalScrollIndicator={true}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.loaderContainer}>
                        <ActivityIndicator size="large" color="#fcbf00" />
                    </View>
                    {/* En-tête avec image */}
                    <View style={styles.header}>
                        <Image
                            source={getPaymentMethodImage()}
                            style={styles.paymentImage}
                            resizeMode="contain"
                        />
                        <Text style={styles.title}>{t.title.paymentConfirmation}</Text>
                        <View style={{ width: 40 }} /> {/* Espace vide à gauche */}
                        {/* <Text style={styles.amount}>
                            {transactionAmount.toFixed(2)}
                        </Text> */}
                    </View>
                    {/* Message d'instructions */}
                    <View style={styles.messageContainer}>
                        {/* <Text style={styles.messageText}>
                            {getPaymentMethodMessage()}
                        </Text> */}
                        <Text style={styles.instructionText}>
                            {"message"}
                        </Text>
                    </View>
                    <View style={styles.content}>
                        {/* Montant */}
                        <View style={styles.row}>
                            <Text style={styles.label}>{t.fields.amount}</Text>
                            <Text style={styles.value}>{showBenaccPrice(40000, 1)}</Text>
                        </View>

                        {/* Commission */}
                        <View style={styles.row}>
                            <Text style={styles.label}>{ }</Text>
                            <Text style={[styles.value, styles.commission]}>
                                +{showBenaccPrice(0, 1)}
                            </Text>
                        </View>

                        {/* Séparateur */}
                        <View style={styles.separator} />

                        {/* Total */}
                        <View style={[styles.row, styles.totalRow]}>
                            <Text style={styles.totalLabel}>{t.payment.totalToPay}</Text>
                            <Text style={styles.totalValue}>
                                {showBenaccPrice(totalAmount, 1)}
                            </Text>
                        </View>

                        {/* Bouton annuler */}
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={closeBottomSheet}
                        >
                            <Text style={styles.cancelButtonText}>{t.common.cancel}</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Champ de code
                    <View style={styles.codeContainer}>
                        <Text style={styles.codeLabel}>Code de confirmation</Text>
                        <TextInput
                            style={styles.codeInput}
                            value={code}
                            onChangeText={setCode}
                            keyboardType="number-pad"
                            placeholder="000000"
                            placeholderTextColor="#9CA3AF"
                            maxLength={6}

                            editable={!isLoading}
                        />
                    </View>
                    {/* Bouton de confirmation }
                    <TouchableOpacity
                        style={[
                            styles.confirmButton,
                            (code.length < 4 || isLoading) && styles.confirmButtonDisabled
                        ]}
                        onPress={onConfirm}
                        disabled={code.length < 4 || isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <Text style={styles.confirmButtonText}>
                                Confirmer le paiement
                            </Text>
                        )}
                    </TouchableOpacity>

                    {/* Bouton annuler }
                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={closeBottomSheet}
                        disabled={true}
                    >
                        <Text style={styles.cancelButtonText}>Annuler</Text>
                    </TouchableOpacity> */}
                </ScrollView>

                <SafeAreaView style={styles.safeArea} />
            </Animated.View>
        </>
    );
};

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#000',
        zIndex: 999,
    },
    bottomSheet: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'white',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 20,
        paddingVertical: 10,
        zIndex: 1000,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 10,
        maxHeight: height * 0.6,
    },
    dragHandleContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    dragHandle: {
        width: 40,
        height: 5,
        backgroundColor: '#E5E5E5',
        borderRadius: 3,
    },
    content: {
        flex: 1,
    },
    title: {
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'right',
        marginBottom: 4,
        color: '#1F2937',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    label: {
        fontSize: 12,
        color: '#6B7280',
        fontFamily: 'Poppins-Regular',
        fontWeight: '500',
    },
    value: {
        fontSize: 12,
        color: '#374151',
        fontWeight: '600',
        fontFamily: 'Poppins-Regular',
    },
    commission: {
        color: '#EF4444',
    },
    separator: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginVertical: 16,
    },
    totalRow: {
        marginBottom: 14,
    },
    totalLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    totalValue: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#fcbf00',
    },
    payButton: {
        backgroundColor: '#fcbf00',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginBottom: 12,
        shadowColor: '#fcbf00',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 3,
    },
    payButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    cancelButton: {
        padding: 16,
        alignItems: 'center',
        borderRadius: 8,
        borderColor: 'black',
        borderWidth: 1,
    },
    cancelButtonText: {
        color: '#6B7280',
        fontSize: 16,
        fontWeight: '500',

    },
    safeArea: {
        backgroundColor: 'white',
    },
    header: {
        alignItems: 'center',
        marginBottom: 14,
        flexDirection: 'row',
        justifyContent: 'space-between',
        //justifyContent: 'center',   // centre horizontalement
    },
    paymentImage: {
        width: 60,
        height: 60,
        marginBottom: 6,
    },
    // title: {
    //     fontSize: 20,
    //     fontWeight: 'bold',
    //     color: '#1F2937',
    //     marginBottom: 8,
    //     textAlign: 'center',
    // },
    amount: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    messageContainer: {
        backgroundColor: '#F3F4F6',
        padding: 16,
        borderRadius: 12,
        marginBottom: 24,
    },
    messageText: {
        fontSize: 10,
        color: '#374151',
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 8,
    },
    instructionText: {
        fontSize: 10,
        color: '#6B7280',
        textAlign: 'center',
        fontFamily: 'Poppins-Regular'
    },
    codeContainer: {
        marginBottom: 20,
    },
    codeLabel: {
        fontSize: 16,
        color: '#374151',
        fontWeight: '600',
        marginBottom: 8,
    },
    codeInput: {
        borderWidth: 2,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        padding: 16,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#1F2937',
        backgroundColor: '#F9FAFB',
    },
    countdownContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    countdownText: {
        fontSize: 14,
        color: '#6B7280',
    },
    resendText: {
        fontSize: 14,
        color: '#007AFF',
        fontWeight: '600',
    },
    confirmButton: {
        backgroundColor: '#007AFF',
        borderRadius: 12,
        padding: 18,
        alignItems: 'center',
        marginBottom: 12,
    },
    confirmButtonDisabled: {
        backgroundColor: '#93C5FD',
    },
    confirmButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    loaderContainer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
    },
});

export default PaymentConfirmation;