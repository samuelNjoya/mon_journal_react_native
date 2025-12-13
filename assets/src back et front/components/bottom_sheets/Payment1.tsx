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
    TextInput
} from 'react-native';
import { showBenaccPrice } from '../../utils/helpers';
import SesampayxPayment from '../Sesampayx';
import MomoPaymentStatus from './OmMomoStatus';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '../../hooks/useTranslation';

const { width, height } = Dimensions.get('window');

interface BottomSheetType {
    visible: boolean;
    onClose: any;
    handlePassword?: any;
    amount: number;
    commission: number;
    total: number;
    onPay: any;
    paymentMethod: string;
    isConfirmPayment: boolean,
    isPayProcessing: boolean,
    momoDatas: any;
    fees: number;
}

const BottomSheet = ({
    visible,
    onClose,
    handlePassword,
    amount,
    commission,
    onPay,
    paymentMethod,
    isConfirmPayment,
    isPayProcessing,
    momoDatas,
    total,
    fees,
}: BottomSheetType) => {
    const translateY = useRef(new Animated.Value(height)).current;
    const totalAmount = amount + commission;
    const [showPassword, setShowPassword] = useState(false)
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
                {
                    isConfirmPayment ?
                        paymentMethod === "SESAMPAYX" ? <SesampayxPayment
                            onClose={onClose}
                            transactionAmount={amount}
                            totalAmount={totalAmount}
                            commissions={commission}
                        />
                            :
                            (paymentMethod === "OM" || paymentMethod === "MTNMOMO") && <MomoPaymentStatus
                                onClose={onClose}
                                paymentMethod={paymentMethod}
                                momoDatas={momoDatas}
                            />

                        :
                        <View style={styles.content}>
                            <Text style={styles.title}>{t.payment.paymentSummary}</Text>

                            {/* Montant */}
                            <View style={styles.row}>
                                <Text style={styles.label}>{t.fields.amount}</Text>
                                <Text style={styles.value}>{showBenaccPrice(amount, 1)}</Text>
                            </View>

                            {/* Commission */}
                            <View style={styles.row}>
                                <Text style={styles.label}>{t.payment.commission}</Text>
                                <Text style={[styles.value, styles.commission]}>
                                    +{showBenaccPrice(commission, 1)}
                                </Text>
                            </View>

                            {/* Fees */}
                            {
                                fees !== -1 &&
                                <View style={styles.row}>
                                    <Text style={styles.label}>{t.payment.fees}</Text>
                                    <Text style={[styles.value, styles.commission]}>
                                        +{showBenaccPrice(fees, 1)}
                                    </Text>
                                </View>
                            }
                            {
                                momoDatas.frais_visa !== -1 &&
                                <View style={styles.row}>
                                    <Text style={styles.label}>{t.payment.visaFees}</Text>
                                    <Text style={[styles.value, styles.commission]}>
                                        +{showBenaccPrice(momoDatas.frais_visa, 1)}
                                    </Text>
                                </View>
                            }


                            {/* Séparateur */}
                            <View style={styles.separator} />

                            {/* Total */}
                            <View style={[styles.row, styles.totalRow]}>
                                <Text style={styles.totalLabel}>{t.payment.total}</Text>
                                <Text style={styles.totalValue}>
                                    {showBenaccPrice(total, 1)}
                                </Text>
                            </View>
                            {
                                momoDatas.frais_visa !== -1 &&
                                <View style={styles.field}>
                                    <Text style={styles.passwordHelp}>{t.fields.sesampayxPassword}</Text>
                                    <View style={styles.inputContainer1}>
                                        {/* <Text style={styles.emoji}>💰</Text> */}
                                        <Ionicons name="lock-closed-outline" size={20} color="#7f8c8d" style={styles.inputIcon} />
                                        <TextInput
                                            style={styles.input1}
                                            placeholder={t.fields.enterPassword}
                                            keyboardType="numeric"
                                            onChangeText={handlePassword}
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
                                    {/* <TextInput
                                        style={styles.inputAmount}
                                        placeholderTextColor="#7f8c8d"
                                        placeholder="💰 Entrez un montant"
                                        keyboardType="numeric"
                                        value={amount + ""}
                                        onChangeText={setAmount}
                                    /> */}
                                </View>
                            }

                            <View style={{ flexDirection: 'row' }}>
                                {/* Bouton annuler */}
                                <TouchableOpacity
                                    style={styles.cancelButton}
                                    onPress={closeBottomSheet}
                                    disabled={isPayProcessing}
                                >
                                    <Text style={styles.cancelButtonText}>{t.common.cancel}</Text>
                                </TouchableOpacity>

                                {/* Bouton de paiement */}
                                <TouchableOpacity
                                    style={styles.payButton}
                                    onPress={onPay}
                                    disabled={isPayProcessing}
                                >
                                    {isPayProcessing ? (
                                        <Text style={styles.payButtonText}>{t.fields.proressingTraitment}...</Text>
                                    ) : (
                                        <Text style={styles.payButtonText}>
                                            {t.operations.pay}
                                        </Text>
                                    )}

                                </TouchableOpacity>
                            </View>
                        </View>
                }


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
        padding: 20,
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
        fontFamily: "Poppins-Bold",
        textAlign: 'center',
        marginBottom: 24,
        color: '#1F2937',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    label: {
        fontSize: 13,
        color: '#6B7280',
        fontWeight: '500',
        fontFamily: "Poppins-Regular"
    },
    value: {
        fontSize: 13,
        color: '#374151',
        fontWeight: '600',
        fontFamily: "Poppins-Bold"
    },
    commission: {
        color: '#EF4444',
    },
    separator: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginVertical: 10,
    },
    totalRow: {
        marginBottom: 24,
    },
    totalLabel: {
        fontSize: 13,
        fontFamily: 'Poppins-Regular',
        color: '#1F2937',
    },
    totalValue: {
        fontSize: 13,
        fontFamily: 'Poppins-Bold',
        color: '#fcbf00',
        fontWeight: '600',
    },
    payButton: {
        backgroundColor: '#fcbf00',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginTop: 12,
        shadowColor: '#fcbf00',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 3,
        flex: 1
    },
    payButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    cancelButton: {
        padding: 16,
        alignItems: 'center',
        marginTop: 12,
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        marginRight: 10,
        borderRadius: 12,

    },
    cancelButtonText: {
        color: '#6B7280',
        fontSize: 16,
        fontWeight: '500',
    },
    safeArea: {
        backgroundColor: 'white',
    },
    field: { marginBottom: 10 },
    passwordHelp: {
        fontSize: 12,
        color: '#636E72',
        fontFamily: "Poppins-Regular",
        marginBottom: 5,
    },

    inputContainer1: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 2,
        backgroundColor: '#fff',
    },
    emoji: {
        fontSize: 20,
        marginRight: 8,
    },
    input1: {
        fontSize: 16,
        flex: 1,
    },
    inputIcon: {
        marginRight: 12,
    },
    eyeIcon: {
        padding: 5,
    },
});

export default BottomSheet;