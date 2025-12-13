import React, { useRef, useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import { showBenaccPrice } from '../../utils/helpers';
import { useTranslation } from '../../hooks/useTranslation';


interface BottomSheetType {
    onClose: any;
    paymentMethod: string
    momoDatas: any
}

interface MomoData {
    amount: number;
    totalAmount: number;
    commissions: number;
    fees: number;
    transaction_code: string;
    message: string
}

const MomoPaymentStatus = ({
    onClose,
    paymentMethod,
    momoDatas,
}: BottomSheetType) => {
    const [momoData, setMomoData] = useState<MomoData>(
        momoDatas || {
            amount: 0,
            totalAmount: 0,
            commissions: 0,
            fees: 0,
            transaction_code: '',
            message: ''
        }
    );
    const { t, language } = useTranslation();

    useEffect(() => {
        if (momoDatas) {
            setMomoData(momoDatas);
        }
    }, [momoDatas]);

    const getPaymentMethodImage = () => {
        return paymentMethod == "OM" ? require('../../../assets/payment_methodes/om.png') : require('../../../assets/payment_methodes/momo.png')
    };

    return (
        <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={true}
            keyboardShouldPersistTaps="handled"
        >

            {/* En-tête avec image */}
            <View style={styles.header}>
                <Image
                    source={getPaymentMethodImage()}
                    style={styles.paymentImage}
                    resizeMode="contain"
                />
                <Text style={styles.title}>{t.title.paymentConfirmation}</Text>
                <View style={{ width: 40 }} />
            </View>
            {/* Message d'instructions */}
            <View style={styles.messageContainer}>
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#fcbf00" />
                </View>
                <Text style={styles.instructionText}>
                    {momoDatas.message}
                </Text>
            </View>
            <View style={styles.content}>

                {/* Montant */}
                <View style={styles.row}>
                    <Text style={styles.label}>{t.fields.amount}</Text>
                    <Text style={styles.value}>{showBenaccPrice(momoData.amount, 1)}</Text>
                </View>

                {/* Commission */}
                <View style={styles.row}>
                    <Text style={styles.label}>{t.payment.commission}</Text>
                    <Text style={[styles.value, styles.commission]}>
                        +{showBenaccPrice(momoData.commissions, 1)}
                    </Text>
                </View>
                {/* Frais */}
                <View style={styles.row}>
                    <Text style={styles.label}>{t.payment.operatorFees}</Text>
                    <Text style={[styles.value, styles.commission]}>
                        +{showBenaccPrice(momoData.fees, 1)}
                    </Text>
                </View>

                {/* Séparateur */}
                <View style={styles.separator} />

                {/* Total */}
                <View style={[styles.row, styles.totalRow]}>
                    <Text style={styles.totalLabel}>{t.payment.total}</Text>
                    <Text style={styles.totalValue}>
                        {showBenaccPrice(momoData.totalAmount, 1)}
                    </Text>
                </View>

                {/* Bouton annuler */}
                <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={onClose}
                >
                    <Text style={styles.cancelButtonText}>{t.common.close}</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    content: {
        flex: 1,
    },
    title: {
        fontSize: 14,
        fontFamily: 'Poppins-Bold',
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
        fontSize: 13,
        color: '#6B7280',
        fontFamily: 'Poppins-Regular',
        fontWeight: '500',
    },
    value: {
        fontSize: 13,
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
        marginBottom: 20,
    },
    totalLabel: {
        fontSize: 14,
        fontFamily: 'Poppins-Bold',
        color: '#1F2937',
    },
    totalValue: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#fcbf00',
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
        fontSize: 11,
        color: '#6B7280',
        textAlign: 'center',
        fontFamily: 'Poppins-Regular'
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

export default MomoPaymentStatus;