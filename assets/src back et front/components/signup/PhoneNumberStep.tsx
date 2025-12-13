import React, { useState, useEffect, useRef } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
} from 'react-native';

import { useTranslation } from '../../hooks/useTranslation';
import CountryPicker, { CountryCode, Country } from 'react-native-country-picker-modal';

type PhoneProps = {
    onChange: (data: any) => void;
};
const Step1 = ({ onChange }: PhoneProps) => {
    const [countryCode, setCountryCode] = useState<CountryCode>('CM');
    const [country, setCountry] = useState<Country | null>(null);
    const [phone, setPhone] = useState('');
    const { t } = useTranslation();

    const handleInputChange = (field: string, value: any) => {
        const fullNumber = `${country?.callingCode?.[0] ? country.callingCode[0] : '237'}${phone}`;
        onChange(fullNumber)
        setPhone(value)
    };

    return (
        <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>{t.signup.phoneTitle}</Text>
            <Text style={styles.stepDescription}>
                {t.signup.phoneDescription}
            </Text>

            <View style={styles.inputPhoneContainer}>
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
                    style={styles.inputPhone}
                    placeholder={t.auth.phoneNumber}
                    placeholderTextColor="#7f8c8d"
                    value={phone}
                    onChangeText={(text) => handleInputChange('phone', text)}
                    keyboardType="phone-pad"
                    autoCapitalize="none"
                />
            </View>
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
    inputContainer: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
        marginBottom: 8,
    },
    input: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        padding: 16,
        fontSize: 16,
    },
    countryPicker: {
        marginRight: 8,
        marginBottom: 6.5
    },
    inputPhoneContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#e9ecef',
        paddingHorizontal: 15,
        height: 50,
    },
    inputPhone: {
        flex: 1,
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        color: '#2c3e50',
        height: '100%',
    },

});

export default Step1;