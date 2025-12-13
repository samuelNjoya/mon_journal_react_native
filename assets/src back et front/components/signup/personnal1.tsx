import React, { useState, useEffect, useRef } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTranslation } from '../../hooks/useTranslation';

type PhoneProps = {
    onChange: (data: any) => void;
};

interface UserDataType {
    lastname: string;
    firstname: string;
    birthdate: string;
    gender: string;
    email: string;
}
const Step2 = ({ onChange }: PhoneProps) => {
    const [userData, setUserData] = useState<UserDataType>({
        lastname: '',
        firstname: '',
        email: '',
        gender: '',
        birthdate: new Date().toISOString().split('T')[0]
    });
    const [showDatePicker, setShowDatePicker] = useState(false);
    const { t, language } = useTranslation();

    const handleInputChange = (field: string, value: any) => {
        setUserData(prev => ({
            ...prev,
            [field]: value
        }));
        onChange({
            ...userData,
            [field]: value
        });

    };

    return (
        <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>{t.signup.personnalTitle}</Text>
            <Text style={styles.stepDescription}>
                {t.signup.personnalDescription}
            </Text>

            <View style={styles.row}>
                <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
                    <Text style={styles.inputLabel}>{t.auth.name}</Text>
                    <TextInput
                        style={styles.input}
                        placeholder={t.signup.yourname}
                        value={userData.lastname}
                        onChangeText={(text) => handleInputChange('lastname', text)}
                    />
                </View>

                <View style={[styles.inputContainer, { flex: 1 }]}>
                    <Text style={styles.inputLabel}>Prénom</Text>
                    <TextInput
                        style={styles.input}
                        placeholder={t.signup.firstname}
                        value={userData.firstname}
                        onChangeText={(text) => handleInputChange('firstname', text)}
                    />
                </View>
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>{t.auth.email}</Text>
                <TextInput
                    style={styles.input}
                    placeholder="exemple@email.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={userData.email}
                    onChangeText={(text) => handleInputChange('email', text)}
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>{t.signup.gender}</Text>
                <View style={styles.radioGroup}>
                    <TouchableOpacity
                        style={[styles.radioButton, userData.gender === 'male' && styles.radioButtonSelected]}
                        onPress={() => handleInputChange('gender', 'male')}
                    >
                        <Text style={[styles.radioText, userData.gender === 'male' && styles.radioTextSelected]}>Homme</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.radioButton, userData.gender === 'female' && styles.radioButtonSelected]}
                        onPress={() => handleInputChange('gender', 'female')}
                    >
                        <Text style={[styles.radioText, userData.gender === 'female' && styles.radioTextSelected]}>Femme</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>{t.signup.birthdate}</Text>
                <TouchableOpacity
                    style={styles.datePickerButton}
                    onPress={() => setShowDatePicker(true)}
                >
                    <Text style={styles.dateText}>
                        {new Date(userData.birthdate).toLocaleDateString(language || 'fr-FR')}
                    </Text>
                    <Ionicons name="calendar" size={20} color="#fcbf00" />
                </TouchableOpacity>

                {showDatePicker && (
                    <DateTimePicker
                        value={new Date(userData.birthdate)}
                        mode="date"
                        display="default"
                        onChange={(event, date) => {
                            setShowDatePicker(false);
                            if (date) {
                                handleInputChange('birthdate', date.toISOString().split('T')[0]);
                            }
                        }}
                    />
                )}
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
        fontSize: 12,
        fontFamily: 'Poppins-Bold',
        color: '#333',
        marginBottom: 8,
    },
    input: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        padding: 8,
        fontSize: 14,
    },
    row: {
        flexDirection: 'row',
    },
    radioGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    radioButton: {
        flex: 1,
        padding: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        alignItems: 'center',
        marginHorizontal: 4,
    },
    radioButtonSelected: {
        backgroundColor: '#fcbf00',
        borderColor: '#fcbf00',
    },
    radioText: {
        color: '#666',
        fontWeight: '500',
    },
    radioTextSelected: {
        color: 'white',
    },
    datePickerButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        padding: 8,
    },
    dateText: {
        fontSize: 16,
        color: '#333',
    },

});

export default Step2;