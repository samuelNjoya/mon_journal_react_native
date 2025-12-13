import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Image,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    Dimensions,
    Alert
} from 'react-native';
import { showBenaccPrice, showBenaccPricePeriod } from '../utils/helpers';
import { useTranslation } from '../hooks/useTranslation';
import CountryPicker, { CountryCode, Country } from 'react-native-country-picker-modal';
import { homeService } from '../api/services/home';
import ErrorModal from '../components/Notification';
import BottomSheet from '../components/bottom_sheets/Payment1';
import WebViewModal from '../components/WebViewModal';
import ErrorHandler from '../components/ErrorHandler';

const { width, height } = Dimensions.get('window');
// États de paiement constants
const PAYMENT_STATUS = {
    COMPLETED: ['COMPLETED', 'VALIDATED', 'SUCCESSFUL', 'SUCCESSFFUL '],
    FAILED: ['FAILED', 'CANCELED', 'failed', 'canceled'],
    PENDING: ['PENDING', 'pending', 'processing', 'PROCESSING']
};

// Types pour les props de navigation
interface DepositRouteParams {
    prefillData?: {
        phone_number: string;
        amount?: string;
        method?: string;
    };
}


const DepositScreen = ({ route, navigation }: any) => {
    //ceci est utilisée lorsqu on clique sur refaire dans la page des transactions
    const params = route.params as DepositRouteParams

    const [selectedMethod, setSelectedMethod] = useState(params?.prefillData?.method || 'MTNMOMO');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<any>(null);
    const [errorText, setErrorText] = useState('');
    const [phoneNumber, setPhoneNumber] = useState(params?.prefillData?.phone_number || '');
    const [countryCode, setCountryCode] = useState<CountryCode>('CM');
    const [country, setCountry] = useState<Country | null>(null);
    const { t, language } = useTranslation();
    const [amount, setAmount] = useState(params?.prefillData?.amount || '');
    const [commission, setCommission] = useState(0);
    const [fees, setFees] = useState(-1);
    const [totalAmount, setTotalAmount] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [confirmPaymentVisible, setConfirmPaymentVisible] = useState(false);
    const [cardPaymentUrl, setCardPaymentUrl] = useState('');
    const [paymentMethodes, setPaymentMethodes] = useState<any>([])
    const [momoDatas, setMomoDatas] = useState({
        amount: 0,
        totalAmount: 0,
        commissions: 0,
        fees: 0,
        transaction_code: '',
        message: ''
    })
    const [webViewVisible, setWebViewVisible] = useState(false);
    const [googlePayUrl, setGooglePayUrl] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    // Mémoïsation des calculs coûteux
    // const calculatedTotal = useMemo(() => {
    //     const total = subscriptions.reduce((acc: any, item: any) => acc + item.total_with_reduction, 0)
    //     return showBenaccPrice(total, 1);
    // }, [subscriptions]);

    const requiresPhoneNumber = useMemo(() =>
        ['OM', 'MTNMOMO'].includes(selectedMethod),
        [selectedMethod]
    );

    const fullPhoneNumber = useMemo(() =>
        `${country?.callingCode?.[0] || '237'}${phoneNumber}`,
        [country, phoneNumber]
    );
    const [isVisible, setIsVisible] = useState(false);

    const fetchData = async () => {
        try {
            setLoading(true)
            setError(null)
            const res = await homeService.getPaymentMethodes({ type_deposit: "DEPOSIT" });
            if (res.success) {
                const methodes = res.data.methodes.map((item: any) => {
                    return {
                        id: item.value,
                        name: item.label,
                        icon: item.value === "OM" ? require('../../assets/payment_methodes/om.png') : item.value === "MTNMOMO" ? require('../../assets/payment_methodes/momo.png') : require('../../assets/payment_methodes/visa.png')
                    }
                })
                setPaymentMethodes(methodes)
            } else {
                setIsVisible(true)
                setError(res.error)
            }
        } catch (err: any) {
            console.log(err)
            setError(err?.message)
            setIsVisible(true)
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    };



    // Vérification du statut du paiement avec gestion d'annulation
    const checkPaymentStatus = useCallback(async (
        transaction_code: string,
        maxAttempts = 15,
        delay = 2000,
        currentAttempt = 1
    ) => {
        if (currentAttempt > maxAttempts) {
            setConfirmPaymentVisible(false);
            setIsVisible(false);
            setErrorMessage('Timeout: ' + t.payment.timeout);
            return null;
        }

        try {
            const response = selectedMethod === "OM"
                ? await homeService.checkOmPayStatus({ transaction_code })
                : await homeService.checkMomoPayStatus({ transaction_code });

            if (!response.success) {
                handlePaymentError(response.error);
                return null;
            }

            const { status } = response.data;

            if (PAYMENT_STATUS.COMPLETED.includes(status)) {
                handlePaymentSuccess(transaction_code);
                return null;
            }

            if (PAYMENT_STATUS.FAILED.includes(status)) {
                handlePaymentFailure();
                return false;
            }

            if (PAYMENT_STATUS.PENDING.includes(status)) {
                await new Promise(resolve => setTimeout(resolve, delay));
                return checkPaymentStatus(transaction_code, maxAttempts, delay, currentAttempt + 1);
            }

            setErrorMessage(t.payment.unknownStatus);
            setConfirmPaymentVisible(false);
            setIsVisible(false);
            return null;

        } catch (error) {
            console.error('Erreur lors de la vérification:', error);

            if (currentAttempt >= maxAttempts) {
                setErrorMessage(`Erreur après ${maxAttempts} tentatives`);
                setConfirmPaymentVisible(false);
                setIsVisible(false);
                return null;
            }

            await new Promise(resolve => setTimeout(resolve, delay));
            return checkPaymentStatus(transaction_code, maxAttempts, delay, currentAttempt + 1);
        }
    }, [selectedMethod, amount]);

    const handlePaymentSuccess = useCallback((transaction_code: string) => {
        setConfirmPaymentVisible(false);
        setIsVisible(false);
        navigation.navigate('PaymentSuccess', {
            amount: amount,
            transactionId: transaction_code,
            card: paymentMethodes.find((x: any) => x.id === selectedMethod)?.name,
            message: t.alerts.successPayment,
            timestamp: Date.now()
        });
    }, [navigation, amount, selectedMethod]);

    const handlePaymentFailure = useCallback(() => {
        setErrorMessage(t.alerts.paymentError);
        setConfirmPaymentVisible(false);
        setIsVisible(false);
    }, []);

    const handlePaymentError = useCallback((error: any) => {
        setConfirmPaymentVisible(false);
        setIsVisible(false);
        setErrorMessage(error || t.alerts.paymentError);
    }, []);

    // Fonction pour gérer le paiement Google Pay
    const handleVisaMastercardPay = useCallback(async (paymentUrl: string) => {
        try {
            setIsProcessing(true);
            setGooglePayUrl(paymentUrl);
            setWebViewVisible(true);
        } catch (error) {
            setErrorMessage(t.alerts.paymentError);
        } finally {
            setIsProcessing(false);
        }
    }, [amount]);

    // Gestionnaire de navigation WebView
    const handleWebViewNavigation = useCallback((navState: any) => {
        const { url } = navState;

        // Détection des URLs de callback
        console.log(url)
        if (url.includes('votreapp://payment/success')) {
            setWebViewVisible(false);
            handlePaymentSuccess('GOOGLE_PAY_TRX_' + Date.now());
        } else if (url.includes('votreapp://payment/cancel')) {
            setWebViewVisible(false);
            setErrorMessage(t.alerts.cancelPayment);
        } else if (url.includes('votreapp://payment/error')) {
            setWebViewVisible(false);
            setErrorMessage(t.alerts.paymentError);
        }
    }, []);


    // Gestion du paiement
    const handlePay = useCallback(async () => {
        setIsProcessing(true);
        setErrorMessage('');

        try {
            if (selectedMethod === "VISA/MASTERCARD") {
                await handleVisaMastercardPay(cardPaymentUrl)
                return null
            }
            const result = await homeService.deposit({
                times: 0,
                amount: parseInt(amount),
                phone_number: fullPhoneNumber,
                payment_method: selectedMethod,
            });
            if (result.success && result.data.status) {
                setMomoDatas(prev => ({
                    ...prev,
                    message: result.data.msg,
                    transaction_code: result.data.transaction_code,
                    totalAmount: result.data.total,
                    fees: result.data.fees
                }));
                setConfirmPaymentVisible(true);
                await checkPaymentStatus(result.data.transaction_code);
            } else {
                setErrorMessage(result.data?.err_msg || result.error);
            }
        } catch (error) {
            setErrorMessage(t.alerts.paymentError);
        } finally {
            setIsProcessing(false);
        }
    }, [selectedMethod, fullPhoneNumber, checkPaymentStatus, amount]);

    // Initialisation du paiement
    const handleInitPayment = useCallback(async () => {
        if (!amount || amount === "") {
            Alert.alert(t.alerts.error, t.alerts.invalidAmount);
            return;
        }
        if (requiresPhoneNumber && !phoneNumber) {
            Alert.alert(t.alerts.error, t.alerts.invalidPhoneNumber);
            return;
        }

        setIsProcessing(true);
        setErrorMessage('');
        try {
            const res = await homeService.getCommissions({
                amount: parseInt(amount),
                reference: 'SO_DEPOSIT',
                payment_method: selectedMethod,
                phone_number: fullPhoneNumber,
            });
            if (res.success && res.data.status) {
                setMomoDatas({
                    ...momoDatas,
                    amount: res.data.amount,
                    commissions: res.data.commission,
                    fees: res.data.fees || -1,
                    message: res.data.msg,
                    transaction_code: res.data.transaction_code,
                    totalAmount: res.data.total
                })
                setAmount(res.data.amount);
                setCommission(res.data.commission);
                setTotalAmount(res.data.total);
                if (res.data.fees) {
                    setFees(res.data.fees)
                }
                if (selectedMethod === "VISA/MASTERCARD") {
                    setCardPaymentUrl(res.data.api)
                }
                setIsVisible(true);
            } else {
                setErrorMessage(res.data?.err_msg || res.error);
            }
        } catch (error) {
            setErrorMessage(t.alerts.comError);
        } finally {
            setIsProcessing(false);
        }
    }, [requiresPhoneNumber, phoneNumber, amount]);

    // Rendu des méthodes de paiement mémoïsé
    const renderPaymentMethods = useMemo(() =>
        paymentMethodes.map((method: any) => (
            <TouchableOpacity
                key={method.id}
                style={[
                    paymentMethodes.length % 2 === 0 ? styles.methodButtonGrid : styles.methodButtonLine,
                    selectedMethod === method.id && styles.methodButtonSelected
                ]}
                onPress={() => setSelectedMethod(method.id)}
            >
                <Image
                    source={method.icon}
                    style={styles.methodIcon}
                    resizeMode="contain"
                />
                <Text style={[
                    styles.methodText,
                    selectedMethod === method.id && styles.methodTextSelected
                ]}>
                    {method.name}
                </Text>
            </TouchableOpacity>
        ))
        , [selectedMethod]);

    useEffect(() => {
        fetchData();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchData();
    };

    // Si erreur ou chargement, afficher le composant ErrorHandler
    if (loading || error) {
        return (
            <ErrorHandler
                error={error}
                onRetry={fetchData}
                loading={loading}
            />
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* WebView Modal pour Google Pay */}
            <WebViewModal
                visible={webViewVisible}
                onClose={() => setWebViewVisible(false)}
                url={googlePayUrl}
                title={t.title.visaPayment}
                onNavigationStateChange={handleWebViewNavigation}
            />
            {/** modals de paiements */}
            <BottomSheet
                visible={isVisible}
                onClose={() => setIsVisible(false)}
                amount={parseInt(amount)}
                commission={commission}
                fees={fees}
                total={totalAmount}
                onPay={handlePay}
                paymentMethod={selectedMethod}
                isConfirmPayment={confirmPaymentVisible}
                isPayProcessing={isProcessing}
                momoDatas={momoDatas}
            />
            <ErrorModal visible={errorMessage !== ''} type='error' onClose={() => { setErrorMessage('') }} message={errorMessage} />
            {/** Fin des modals de paiement */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* En-tête */}
                    <View style={styles.header}>
                        <Text style={styles.title}>{t.title.deposit}</Text>
                        <View style={styles.separator} />
                        <Text style={styles.subtitle}>{t.title.paymentMethod}</Text>
                    </View>

                    {/* Méthodes de paiement */}
                    <View style={styles.paymentMethods}>
                        <Text style={styles.sectionTitle}>{t.title.deposit2}</Text>

                        <View style={paymentMethodes.length % 2 === 0 ? styles.methodsGrid : styles.methodsLine}>
                            {renderPaymentMethods}
                        </View>
                        {requiresPhoneNumber && (
                            <View style={styles.inputContainer}>
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
                                    style={styles.input}
                                    placeholder={t.auth.phoneNumber}
                                    placeholderTextColor="#7f8c8d"
                                    value={phoneNumber}
                                    onChangeText={setPhoneNumber}
                                    keyboardType="phone-pad"
                                    autoCapitalize="none"
                                />
                            </View>
                        )}
                    </View>

                    <View style={styles.field}>
                        <Text style={styles.label}>{t.fields.amount}</Text>
                        <TextInput
                            style={styles.inputAmount}
                            placeholderTextColor="#7f8c8d"
                            placeholder={t.fields.enterAmount}
                            keyboardType="numeric"
                            value={amount + ""}
                            onChangeText={setAmount}
                        />
                    </View>

                    {/* Bouton de paiement */}
                    <TouchableOpacity
                        style={[styles.payButton, isProcessing && styles.payButtonDisabled]}
                        onPress={handleInitPayment}
                        disabled={isProcessing || errorText !== ''}
                    >
                        <Text style={styles.payButtonText}>
                            {isProcessing ? t.fields.proressingTraitment + '...' : t.fields.valid}
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    header: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
    },
    separator: {
        height: 1,
        backgroundColor: '#E0E0E0',
        marginVertical: 10,
        width: '100%',
    },
    title: {
        fontSize: 11,
        fontFamily: 'Poppins-Regular',
        color: '#636E72',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 12,
        fontFamily: 'Poppins-SemiBold',
        color: '#fcbf00',
        textAlign: 'center',
    },
    paymentMethods: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 11,
        fontFamily: 'Poppins-Regular',

        marginBottom: 10,
    },
    methodsLine: {
        width: '100%',
    },
    methodsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    methodButtonLine: {
        height: 50,
        flexDirection: 'row',
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
        alignItems: 'center',
        //justifyContent: 'center',
        marginBottom: 10,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    methodButtonGrid: {
        width: width / 2 - 30,
        height: 80,
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    methodButtonSelected: {
        borderColor: '#007AFF',
        backgroundColor: '#E7F3FF',
    },
    methodIcon: {
        width: 40,
        height: 40,
        marginBottom: 2,
    },
    methodText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#636E72',
    },
    methodTextSelected: {
        color: '#007AFF',
        fontWeight: 'bold',
    },
    payButton: {
        backgroundColor: '#fcbf00',
        borderRadius: 12,
        padding: 18,
        alignItems: 'center',
        marginBottom: 25,
    },
    payButtonDisabled: {
        backgroundColor: '#99C8FF',
    },
    payButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    securitySection: {
        alignItems: 'center',
    },
    securityRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    securityIcon: {
        width: 20,
        height: 20,
        marginRight: 10,
        tintColor: '#636E72',
    },
    securityText: {
        fontSize: 14,
        color: '#636E72',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#e9ecef',
        paddingHorizontal: 15,
        height: 54,
    },
    inputIcon: {
        marginRight: 12,
        paddingBottom: 5
    },
    input: {
        flex: 1,
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        color: '#2c3e50',
        height: '100%',
    },
    eyeIcon: {
        padding: 5,
    },
    countryPicker: {
        marginRight: 8,
        marginBottom: 6.5
    },
    errorText: {
        fontSize: 12,
        color: 'red',
        marginTop: 8,
        textAlign: 'center',
    },
    field: { marginBottom: 20 },
    label: { fontSize: 16, marginBottom: 8, color: '#333' },
    inputAmount: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        padding: 10,
        fontSize: 16,
        backgroundColor: '#fff',
    },
});

export default DepositScreen;