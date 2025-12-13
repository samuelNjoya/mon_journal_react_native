import React, { useState, useEffect, useRef } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '../../hooks/useTranslation';

type PhoneProps = {
    onChange: (data: { id_type_ben_account: number }) => void;
    benaccs: any[]
};

interface BenDataType {
    id_type_ben_account: number;
}

interface BenAccType {
    reference: "SPX-BA-PLATINUM" | "SPX-BA-IVORY" | "SPX-BA-LIGHT" | "SPX-BA-SOLO";
    id: number;
    card_picture: string;
    denomination: string;
    price: number;
    min_subscription: number;
    delay: string;
}
const Step4 = ({ onChange, benaccs }: PhoneProps) => {
    const [benData, setBenData] = useState<BenDataType>({
        id_type_ben_account: -1,
    });
    const [ben, setBen] = useState(0);
    const { t } = useTranslation();

    const features =
    {
        "SPX-BA-PLATINUM": [
            t.benacc.features.platinum.feature1,
            t.benacc.features.platinum.feature2,
            t.benacc.features.platinum.feature3,
            t.benacc.features.platinum.feature4,
        ],
        "SPX-BA-IVORY": [
            t.benacc.features.ivory.feature1,
            t.benacc.features.ivory.feature2,
            t.benacc.features.ivory.feature3,
        ],
        "SPX-BA-LIGHT": [
            t.benacc.features.light.feature1,
            t.benacc.features.light.feature2,
            t.benacc.features.light.feature3,
            t.benacc.features.light.feature4,
            t.benacc.features.light.feature5,
            t.benacc.features.light.feature6,
        ],
        "SPX-BA-SOLO": [
            t.benacc.features.solo.feature1,
            t.benacc.features.solo.feature2,
            t.benacc.features.solo.feature3,
            t.benacc.features.solo.feature4,
        ]
    };

    const handleInputChange = (field: string, value: number) => {
        setBenData(prev => ({
            ...prev,
            [field]: value
        }));
        onChange({
            ...benData,
            [field]: value
        });

    };

    const showBenaccPrice = (price: number, min_subscription: number, delay: string) => {
        let period = delay === "30" ? t.benacc.month : t.benacc.day
        let plural = delay == "1" && min_subscription > 1 ? 's' : ''
        let amount = new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'XAF'
        }).format(Math.ceil(price * min_subscription));
        return `${amount}/${min_subscription} ${period}${plural}`
    }

    return (
        <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>{t.benacc.benaccTitle}</Text>
            <Text style={styles.stepDescription}>
                {t.signup.benaccDescription}
            </Text>

            <ScrollView style={styles.accountScrollView}>
                {benaccs.map((account: BenAccType) => (
                    <TouchableOpacity
                        key={account.id}
                        style={[
                            styles.accountCard,
                            benData.id_type_ben_account === account.id && styles.accountCardSelected
                        ]}
                        onPress={() => handleInputChange('id_type_ben_account', account.id)}
                    >
                        <View style={styles.header}>
                            <View style={styles.accountHeader}>

                                <View style={styles.accountIcon}>
                                    <Ionicons
                                        name={'card'}
                                        size={24}
                                        color={benData.id_type_ben_account === account.id ? '#fcbf00' : '#666'}
                                    />
                                </View>
                                <Text style={[
                                    styles.accountTitle,
                                    benData.id_type_ben_account === account.id && styles.accountTitleSelected
                                ]}>
                                    {account.denomination}
                                </Text>

                            </View>
                            <Text style={styles.price}>{showBenaccPrice(account.price, account.min_subscription, account.delay)}</Text>
                        </View>


                        <View style={styles.accountFeatures}>
                            {features[account.reference].map((feature: string, index: number) => (
                                <View key={index} style={styles.featureItem}>
                                    <Ionicons name="checkmark-circle" size={16} color="#fcbf00" />
                                    <Text style={styles.featureText}>{feature}</Text>
                                </View>
                            ))}
                        </View>

                        {benData.id_type_ben_account === account.id && (
                            <View style={styles.selectedIndicator}>
                                <Ionicons name="checkmark" size={20} color="white" />
                            </View>
                        )}
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    stepContent: {
        marginBottom: 20,
    },
    stepTitle: {
        fontSize: 20,
        fontFamily: 'Poppins-Bold',
        color: '#1a171a',
        marginBottom: 8,
    },
    stepDescription: {
        fontSize: 12,
        color: '#666',
        marginBottom: 24,
        fontFamily: 'Poppins-Regular',
    },
    selectedIndicator: {
        position: 'absolute',
        top: -10,
        right: -10,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#fcbf00',
        justifyContent: 'center',
        alignItems: 'center',
    },
    accountScrollView: {
        maxHeight: 400,
    },
    accountCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    accountCardSelected: {
        borderColor: '#fcbf00',
        borderWidth: 2,
    },
    accountHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    accountIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#fff3c2',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    accountTitle: {
        fontSize: 16,
        fontFamily: 'Poppins-Bold',
        color: '#333',
    },
    accountTitleSelected: {
        color: '#fcbf00',
    },
    accountFeatures: {
        marginLeft: 8,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    featureText: {
        marginLeft: 8,
        fontSize: 12,
        color: '#666',
        fontFamily: 'Poppins-Regular',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    price: {
        fontFamily: 'Poppins-Regular',
        fontSize: 8
    }

});

export default Step4;