import React, { useRef, useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Animated,
    Easing,
    SafeAreaView
} from 'react-native';
import { useTranslation } from '../../hooks/useTranslation';

const { width, height } = Dimensions.get('window');

const AdvancedBottomSheet = ({
    visible,
    onClose,
    amount,
    commissionRate = 0.029, // 2.9% par défaut
    fixedCommission = 0.30, // 0.30€ fixe par défaut
    onPay,
    currency = '€',
    minHeight = height * 0.4,
    maxHeight = height * 0.7
}: any) => {
    const translateY = useRef(new Animated.Value(height)).current;
    const [sheetHeight, setSheetHeight] = useState(minHeight);

    // Calcul de la commission (pourcentage + fixe)
    const commission = (amount * commissionRate) + fixedCommission;
    const totalAmount = amount + commission;
    const { t, language } = useTranslation();

    useEffect(() => {
        if (visible) {
            openBottomSheet();
        } else {
            closeBottomSheet();
        }
    }, [visible]);

    const openBottomSheet = () => {
        Animated.timing(translateY, {
            toValue: height - sheetHeight,
            duration: 300,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
        }).start();
    };

    const closeBottomSheet = () => {
        Animated.timing(translateY, {
            toValue: height,
            duration: 250,
            easing: Easing.in(Easing.cubic),
            useNativeDriver: true,
        }).start(() => {
            if (onClose) onClose();
        });
    };

    const handleLayout = (event: any) => {
        const { height: contentHeight } = event.nativeEvent.layout;
        const newHeight = Math.min(Math.max(contentHeight + 100, minHeight), maxHeight);
        setSheetHeight(newHeight);
    };

    if (!visible) return null;

    return (
        <>
            <Animated.View
                style={[
                    styles.overlay,
                    {
                        opacity: translateY.interpolate({
                            inputRange: [height - sheetHeight, height],
                            outputRange: [0.5, 0]
                        })
                    }
                ]}
            >
                <TouchableOpacity
                    style={styles.overlayTouchable}
                    onPress={closeBottomSheet}
                    activeOpacity={1}
                />
            </Animated.View>

            <Animated.View
                style={[
                    styles.bottomSheet,
                    {
                        height: sheetHeight,
                        transform: [{ translateY }]
                    }
                ]}
            >
                <View style={styles.dragHandleContainer}>
                    <View style={styles.dragHandle} />
                </View>

                <View style={styles.content} onLayout={handleLayout}>
                    <Text style={styles.title}>{t.payment.paymentDetails}</Text>

                    {/* Montant */}
                    <View style={styles.row}>
                        <View>
                            <Text style={styles.label}>{t.fields.amount}</Text>
                            <Text style={styles.subLabel}>{t.payment.noFees}</Text>
                        </View>
                        <Text style={styles.value}>{amount.toFixed(2)} {currency}</Text>
                    </View>

                    {/* Commission */}
                    <View style={styles.row}>
                        <View>
                            <Text style={styles.label}>{t.payment.fees}</Text>
                            <Text style={styles.subLabel}>
                                {(commissionRate * 100).toFixed(1)}% + {fixedCommission.toFixed(2)} {currency}
                            </Text>
                        </View>
                        <Text style={[styles.value, styles.commission]}>
                            +{commission.toFixed(2)} {currency}
                        </Text>
                    </View>

                    {/* Séparateur */}
                    <View style={styles.separator} />

                    {/* Total */}
                    <View style={[styles.row, styles.totalRow]}>
                        <Text style={styles.totalLabel}>{t.payment.totalToPay}</Text>
                        <Text style={styles.totalValue}>
                            {totalAmount.toFixed(2)} {currency}
                        </Text>
                    </View>

                    {/* Informations */}
                    <View style={styles.infoBox}>
                        <Text style={styles.infoText}>
                            💳 {t.title.securePayment}
                        </Text>
                        <Text style={styles.infoText}>
                            ⚡ {t.title.immediateConfirmation}
                        </Text>
                    </View>

                    {/* Boutons */}
                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity
                            style={styles.payButton}
                            onPress={onPay}
                        >
                            <Text style={styles.payButtonText}>
                                Payer {totalAmount.toFixed(2)} {currency}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={closeBottomSheet}
                        >
                            <Text style={styles.cancelButtonText}>{t.common.cancel}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <SafeAreaView style={styles.safeArea} />
            </Animated.View>
        </>
    );
};

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 999,
    },
    overlayTouchable: {
        flex: 1,
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
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 10,
    },
    dragHandleContainer: {
        alignItems: 'center',
        paddingVertical: 8,
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
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 24,
        color: '#1F2937',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        color: '#1F2937',
        fontWeight: '600',
    },
    subLabel: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 2,
    },
    value: {
        fontSize: 16,
        color: '#374151',
        fontWeight: '600',
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
        marginBottom: 24,
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    totalValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    infoBox: {
        backgroundColor: '#F9FAFB',
        padding: 16,
        borderRadius: 12,
        marginBottom: 24,
    },
    infoText: {
        fontSize: 14,
        color: '#6B7280',
        marginVertical: 4,
    },
    buttonsContainer: {
        gap: 12,
    },
    payButton: {
        backgroundColor: '#007AFF',
        borderRadius: 12,
        padding: 18,
        alignItems: 'center',
        shadowColor: '#007AFF',
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
    },
    cancelButtonText: {
        color: '#6B7280',
        fontSize: 16,
        fontWeight: '500',
    },
    safeArea: {
        backgroundColor: 'white',
    },
});

export default AdvancedBottomSheet