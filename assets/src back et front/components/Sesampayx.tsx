import React, { useRef, useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Image,
    ScrollView,
    TextInput,
    ActivityIndicator,
} from 'react-native';
import { useTranslation } from '../hooks/useTranslation';

const { width, height } = Dimensions.get('window');

interface BottomSheetType {
    onClose: any
    commissions: number;
    totalAmount: number;
    transactionAmount: number,
}

const SesampayxPayment = ({
    commissions,
    transactionAmount,
    totalAmount,
    onClose
}: BottomSheetType) => {
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { t, language } = useTranslation();

    const getPaymentMethodImage = () => {
        return require('../../assets/logo_sesampayx.png');
    };


    const handleConfirm = () => {

    }

    return (
        <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={true}
            keyboardShouldPersistTaps="handled"
        >
            {/* <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#fcbf00" />
            </View> */}
            {/* En-tête avec image */}
            <View style={styles.header}>
                <Image
                    source={getPaymentMethodImage()}
                    style={styles.paymentImage}
                    resizeMode="contain"
                />
                <Text style={styles.title}>{t.payment.confirmTitle}</Text>
                <View style={{ width: 40 }} />
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
                    {t.payment.smsCode}
                </Text>
            </View>


            {/* Champ de code */}
            <View style={styles.codeContainer}>
                <Text style={styles.codeLabel}>{t.payment.codeLabel}</Text>
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
            {/* Bouton de confirmation */}
            <TouchableOpacity
                style={[
                    styles.confirmButton,
                    (code.length < 4 || isLoading) && styles.confirmButtonDisabled
                ]}
                onPress={handleConfirm}
                disabled={code.length < 4 || isLoading}
            >
                {isLoading ? (
                    <ActivityIndicator color="#FFFFFF" />
                ) : (
                    <Text style={styles.confirmButtonText}>
                        {t.payment.confirmLabel}
                    </Text>
                )}
            </TouchableOpacity>

            {/* Bouton annuler */}
            <TouchableOpacity
                style={styles.cancelButton}
                onPress={onClose}
                disabled={false}
            >
                <Text style={styles.cancelButtonText}>{t.common.cancel}</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    content: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontFamily: 'Poppins-Bold',
        textAlign: 'right',
        marginBottom: 4,
        color: '#1F2937',
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
        width: 40,
        height: 40,
        marginBottom: 6,
    },

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
        fontSize: 11,
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
    confirmButton: {
        backgroundColor: '#fcbf00',
        borderRadius: 12,
        padding: 18,
        alignItems: 'center',
        marginBottom: 12,
    },
    confirmButtonDisabled: {
        backgroundColor: '#f8e6b1ff',
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

export default SesampayxPayment;