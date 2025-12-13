import React, { useState, useEffect, useRef } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SelectInput from '../../components/SelectInput';
import { useTranslation } from '../../hooks/useTranslation';

type PhoneProps = {
    onChange: (data: any) => void;
    questions1: { value: number; label: string }[];
    questions2: { value: number; label: string }[];
};

interface AuthDataType {
    password: string;
    confirm_password: string;
    answers: { id_question: number; answer_value: string }[];
}
const Step3 = ({ onChange, questions1, questions2 }: PhoneProps) => {
    const [authData, setAuthData] = useState<AuthDataType>({
        password: '',
        confirm_password: '',
        answers: [
            { id_question: -1, answer_value: '' },
            { id_question: -1, answer_value: '' }
        ],
    });
    const [showPassword, setShowPassword] = useState(false);
    const [question1, setQuestion1] = useState('');
    const [question2, setQuestion2] = useState('');
    const { t } = useTranslation();

    const handleInputChange = (field: string, value: any) => {
        setAuthData(prev => ({
            ...prev,
            [field]: value
        }));
        onChange({
            ...authData,
            [field]: value
        });

    };

    const handleSecurityQuestionChange = (index: number, field: string, value: string) => {
        const updatedQuestions: any[] = [...authData.answers];

        updatedQuestions[index][field] = value;
        setAuthData({
            ...authData,
            answers: updatedQuestions
        });
        if (field === 'id_question') {
            index === 0 ? setQuestion1(value) : setQuestion2(value);
        }
        onChange({
            ...authData,
            answers: updatedQuestions
        });

    };


    return (
        <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>{t.signup.step3Title}</Text>
            <Text style={styles.stepDescription}>
                {t.signup.step3Description}
            </Text>

            <View>
                <Text style={styles.inputLabel}>{t.auth.password}</Text>
                <View style={styles.inputContainerPassword}>
                    <Ionicons name="lock-closed-outline" size={20} color="#7f8c8d" style={styles.inputIcon} />
                    <TextInput
                        style={styles.inputPassword}
                        placeholder="Mot de passe"
                        placeholderTextColor="#7f8c8d"
                        value={authData.password}
                        onChangeText={(text) => handleInputChange('password', text)}
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
            </View>
            <View>
                <Text style={styles.inputLabel}>{t.auth.confirmPassword}</Text>
                <View style={styles.inputContainerPassword}>
                    <Ionicons name="lock-closed-outline" size={20} color="#7f8c8d" style={styles.inputIcon} />
                    <TextInput
                        style={styles.inputPassword}
                        placeholder="Retapez votre mot de passe"
                        placeholderTextColor="#7f8c8d"
                        value={authData.confirm_password}
                        onChangeText={(text) => handleInputChange('confirm_password', text)}
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
            </View>

            <Text style={styles.sectionTitle}>{t.signup.securityQuestions}</Text>

            <View key={1} style={styles.securityQuestionContainer}>
                <Text style={styles.inputLabel}>{t.signup.question} 1</Text>
                <SelectInput
                    value={question1}
                    onValueChange={(value: string) => handleSecurityQuestionChange(0, 'id_question', value)}
                    options={questions1}
                />

                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>{t.signup.answer}</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Votre réponse"
                        value={authData.answers[0].answer_value}
                        onChangeText={(text) => handleSecurityQuestionChange(0, 'answer_value', text)}
                    />
                </View>

                <View style={styles.divider} />
            </View>
            <View style={styles.securityQuestionContainer}>
                <Text style={styles.inputLabel}>{t.signup.question} 2</Text>
                <SelectInput
                    value={question2}
                    onValueChange={(value: string) => handleSecurityQuestionChange(1, 'id_question', value)}
                    options={questions2}
                />
                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>{t.signup.answer}</Text>
                    <TextInput
                        style={styles.input}
                        placeholder={t.signup.answerPlaceholder}
                        value={authData.answers[1].answer_value}
                        onChangeText={(text) => handleSecurityQuestionChange(1, 'answer_value', text)}
                    />
                </View>

                <View style={styles.divider} />
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
        padding: 12,
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
    divider: {
        height: 1,
        backgroundColor: '#E0E0E0',
        marginVertical: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontFamily: 'Poppins-Bold',
        color: '#1a171a',
        marginTop: 16,
        marginBottom: 12,
    },
    securityQuestionContainer: {
        marginBottom: 16,
    },
    eyeIcon: {
        padding: 5,
    },
    inputIcon: {
        marginRight: 12,
        paddingBottom: 5
    },
    inputContainerPassword: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 8,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#e9ecef',
        paddingHorizontal: 15,

    },
    inputPassword: {
        flex: 1,
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        color: '#2c3e50',
        height: '100%',
    },

});

export default Step3;