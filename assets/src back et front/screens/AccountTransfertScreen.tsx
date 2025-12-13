import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert,
    ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '../hooks/useTranslation';
import CountryPicker, { CountryCode, Country } from 'react-native-country-picker-modal';
import { homeService } from '../api/services/home';
import ErrorModal from '../components/Notification';
import { showBenaccPrice } from '../utils/helpers';
import TransferConfirmationSheet from '../components/bottom_sheets/ConfirmTransfert';

// Types pour les props de navigation
interface RemakeRouteParams {
    prefillData?: {
        phone_number: string;
        amount?: string;
    };
}

const AccountTransferScreen = ({ route, navigation }: any) => {
    //ceci est utilisée lorsqu on clique sur refaire dans la page des transactions
    const params = route.params as RemakeRouteParams

    const [phoneNumber, setPhoneNumber] = useState(params?.prefillData?.phone_number || '');
    const [amount, setAmount] = useState(params?.prefillData?.amount || '');
    const [commission, setCommission] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [commissionLoading, setCommissionLoading] = useState(false);
    const [countryCode, setCountryCode] = useState<CountryCode>('CM');
    const [country, setCountry] = useState<Country | null>(null);
    const [phone, setPhone] = useState('');
    const { t } = useTranslation();
    const [errorMessage, setErrorMessage] = useState('');
    const [isConfirmVisible, setIsConfirmVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [recipient, setRecipient] = useState("");

    const handleInputChange = (field: string, value: any) => {
        const fullNumber = `${country?.callingCode?.[0] ? country.callingCode[0] : '237'}${value}`;
        setPhone(value)
        setPhoneNumber(fullNumber)
    };

    const handlePreviewCommission = async () => {

        if (!amount || parseFloat(amount) <= 0) {
            Alert.alert(t.alerts.error, t.alerts.invalidAmount);
            return;
        }

        setCommissionLoading(true);

        // Simulation d'appel API pour récupérer la commission
        try {
            const result = await homeService.getStandardCommissions({
                amount,
                reference: "SO_TRSCUST"
            });

            if (result.success && result.data.status) {
                setCommission(result.data.commission);
            } else {
                setErrorMessage(result.data?.err_msg || result.error);
            }

            // Simulation: commission de 2% du montant

        } catch (error) {
            Alert.alert(t.alerts.error, t.alerts.invalidCommission);
        } finally {
            setCommissionLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!phoneNumber || !amount) {
            Alert.alert(t.alerts.error, t.alerts.fillAllFields);
            return;
        }
        try {
            setLoading(true);
            const result = await homeService.previewAccTransfert({
                amount,
                beneficiary: {
                    phone_number: phoneNumber
                }
            });

            if (result.success && result.data.status) {
                console.log(result)
                setRecipient(result.data.msg)
                setIsConfirmVisible(true)
                setCommission(null);
            } else {
                setErrorMessage(result.data?.err_msg || result.error);
            }
        } catch (error) {
            Alert.alert(t.alerts.error, t.alerts.errorOccurred);
            console.log(error)
        } finally {
            setLoading(false);
        }

        // Simulation de traitement
        // setTimeout(() => {
        //     setLoading(false);
        //     Alert.alert('Succès', 'Transfert effectué avec succès');

        // }, 2000);
    };

    const handleConfirmTransfer = async (password: string) => {
        setIsLoading(true);
        // Simulation de traitement
        try {
            const result = await homeService.accTransfert({
                amount,
                beneficiary: {
                    phone_number: phoneNumber
                },
                password,
            });

            if (result.success && result.data.status) {
                console.log(result)
                setIsConfirmVisible(false)
                setCommission(null);
                const datas = result.data.datas
                navigation.navigate('PaymentSuccess', {
                    amount: amount,
                    balance_after: 0,
                    balance_before: 0,
                    transactionId: datas.code_operation_transaction,
                    card: "",
                    message: datas.message,
                    timestamp: Date.now()
                });
            } else {
                setErrorMessage(result.data?.err_msg || result.error);
            }
        } catch (error) {
            Alert.alert(t.alerts.error, t.alerts.errorOccurred);
            console.log(error)
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ErrorModal visible={errorMessage !== ''} type='error' onClose={() => { setErrorMessage('') }} message={errorMessage} />
            <TransferConfirmationSheet
                visible={isConfirmVisible}
                onClose={() => setIsConfirmVisible(false)}
                onConfirm={handleConfirmTransfer}
                amount={parseInt(amount)}
                recipient={recipient}
                isLoading={isLoading}
            />

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.formContainer}>
                    {/* Titre */}
                    {/* <Text style={styles.title}>Transfert d'Argent</Text> */}
                    <Text style={styles.subtitle}>{t.title.fillAllfields}</Text>

                    {/* Champ Numéro de Téléphone avec Label */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>{t.auth.phoneNumber}</Text>
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

                    {/* Champ Montant avec Label */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>{t.fields.amountToTransfer}</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="cash" size={20} color="#fcbf00" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder={t.fields.cfaAmount}
                                placeholderTextColor="#A0AEC0"
                                value={amount}
                                onChangeText={setAmount}
                                keyboardType="numeric"
                            />
                        </View>
                    </View>

                    {/* Bouton Prévisualiser Commission plus compact */}
                    <TouchableOpacity
                        style={styles.commissionButton}
                        onPress={handlePreviewCommission}
                        disabled={commissionLoading || !amount}
                    >
                        {commissionLoading ? (
                            <ActivityIndicator size="small" color="#FFF" />
                        ) : (
                            <View style={styles.commissionButtonContent}>
                                <Ionicons name="calculator" size={16} color="#FFF" />
                                <Text style={styles.commissionButtonText}>{t.fields.seeCommission}</Text>
                            </View>
                        )}
                    </TouchableOpacity>

                    {/* Affichage de la Commission */}
                    {commission !== null && (
                        <View style={styles.commissionContainer}>
                            <Text style={styles.commissionLabel}>{t.fields.estimateCom}:</Text>
                            <Text style={styles.commissionValue}>{showBenaccPrice(commission, 1)}</Text>
                            {/* <Text style={styles.commissionNote}>(2% du montant transféré)</Text> */}
                        </View>
                    )}


                </View>
                {/* Bouton Valider */}
                <TouchableOpacity
                    style={[styles.submitButton, (!phoneNumber || !amount) && styles.submitButtonDisabled]}
                    onPress={handleSubmit}
                    disabled={!phoneNumber || !amount || loading}
                >
                    {loading ? (
                        <ActivityIndicator size="small" color="#FFF" />
                    ) : (
                        <View style={styles.submitButtonContent}>
                            <Ionicons name="checkmark-circle" size={20} color="#FFF" />
                            <Text style={styles.submitButtonText}>{t.operations.transfer}</Text>
                        </View>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    scrollContent: {
        flexGrow: 1,
        padding: 20,
    },
    formContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 14,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 1,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2D3748',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 10,
        color: '#718096',
        marginBottom: 32,
        textAlign: 'center',
        fontFamily: 'Poppins-Regular'
    },
    inputGroup: {
        width: '100%',
        marginBottom: 10,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4A5568',
        marginBottom: 8,
        marginLeft: 4,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        backgroundColor: '#F7FAFC',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        paddingHorizontal: 16,
        height: 50,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#2D3748',
        height: '100%',
    },
    commissionButton: {
        backgroundColor: '#667eea',
        borderRadius: 10,
        padding: 12,
        width: '100%',
        marginBottom: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    commissionButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    commissionButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    commissionContainer: {
        width: '100%',
        backgroundColor: '#EDF2F7',
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
        alignItems: 'center',
    },
    commissionLabel: {
        fontSize: 14,
        color: '#4A5568',
        fontWeight: '500',
        marginBottom: 4,
    },
    commissionValue: {
        fontSize: 18,
        color: '#2D3748',
        fontWeight: 'bold',
        marginBottom: 4,
    },
    commissionNote: {
        fontSize: 12,
        color: '#718096',
        fontStyle: 'italic',
    },
    submitButton: {
        backgroundColor: '#fcbf00',
        position: 'absolute',
        bottom: 10,
        left: 0,
        right: 0,
        borderRadius: 12,
        padding: 12,
        marginHorizontal: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    submitButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    submitButtonDisabled: {
        backgroundColor: '#CBD5E0',
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    inputPhoneContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 10,
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
    countryPicker: {
        marginRight: 8,
        marginBottom: 6.5
    },
});

export default AccountTransferScreen;