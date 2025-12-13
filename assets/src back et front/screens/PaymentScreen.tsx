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

const { width } = Dimensions.get('window');
// Constantes pour les méthodes de paiement
const PAYMENT_METHODS = [
    { id: 'SESAMPAYX', name: 'Sesampayx', icon: require('../../assets/logo_sesampayx.png') },
    { id: 'OM', name: 'Orange Money', icon: require('../../assets/payment_methodes/om.png') },
    { id: 'MTNMOMO', name: 'MTN Mobile Money', icon: require('../../assets/payment_methodes/momo.png') },
    { id: 'VISA/MASTERCARD', name: 'VISA/MASTERCARD', icon: require('../../assets/payment_methodes/visa.png') },
];

// États de paiement constants
const PAYMENT_STATUS = {
    COMPLETED: ['COMPLETED', 'VALIDATED', 'SUCCESSFUL', 'SUCCESSFFUL'],
    FAILED: ['FAILED', 'CANCELED', 'failed', 'canceled'],
    PENDING: ['PENDING', 'pending', 'processing', 'PROCESSING']
};

const PaymentScreen = ({ route, navigation }: any) => {
    const { selectedCard } = route.params || {};
    const [subscriptions, setSubscriptions] = useState(selectedCard.min_subscription);
    const [password, setPassword] = useState('');
    const [selectedMethod, setSelectedMethod] = useState('SESAMPAYX');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [countryCode, setCountryCode] = useState<CountryCode>('CM');
    const [country, setCountry] = useState<Country | null>(null);
    const { t, language } = useTranslation();
    const [amount, setAmount] = useState(0);
    const [commission, setCommission] = useState(0);
    const [fees, setFees] = useState(-1);
    const [totalAmount, setTotalAmount] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');
    const [confirmPaymentVisible, setConfirmPaymentVisible] = useState(false);
    const [cardPaymentUrl, setCardPaymentUrl] = useState('');
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
    // Mémoïsation des calculs coûteux
    const calculatedTotal = useMemo(() => {
        const subs = parseInt(subscriptions) || 1;
        return showBenaccPrice(selectedCard.price, subs);
    }, [subscriptions, selectedCard.price]);

    const requiresPhoneNumber = useMemo(() =>
        ['OM', 'MTNMOMO'].includes(selectedMethod),
        [selectedMethod]
    );

    const fullPhoneNumber = useMemo(() =>
        `${country?.callingCode?.[0] || '237'}${phoneNumber}`,
        [country, phoneNumber]
    );
    // Validation des abonnements avec useEffect
    useEffect(() => {
        const subs = parseInt(subscriptions) || 1;

        if (subs < selectedCard.min_subscription) {
            setError(t.payment.minMonth + ` ${selectedCard.min_subscription}`);
        } else if (subs % selectedCard.min_subscription !== 0) {
            setError(t.payment.periodError + ` ${selectedCard.min_subscription}`);
        } else {
            setError('');
        }
    }, [subscriptions, selectedCard.min_subscription]);

    // Calcul du total sans effets de bord
    const calculateTotal = useCallback(() => {
        const subs = parseInt(subscriptions) || 1;
        return showBenaccPrice(selectedCard.price, subs);
    }, [subscriptions, selectedCard.price]);

    const [isVisible, setIsVisible] = useState(false);

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
            setErrorMessage('Timeout:' + t.payment.timeout);
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

            // if (currentAttempt >= maxAttempts) {
            //     setErrorMessage(`Erreur après ${maxAttempts} tentatives`);
            //     setConfirmPaymentVisible(false);
            //     setIsVisible(false);
            //     return null;
            // }

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
            card: PAYMENT_METHODS.find(x => x.id === selectedMethod)?.name,
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
    }, [totalAmount]);

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
            const result = await homeService.subscribeBenefit({
                times: subscriptions,
                id: selectedCard.id_type_ben_account,
                payment_mode: selectedMethod,
                password: password,
                om_phone_number: fullPhoneNumber,
                momo_phone_number: fullPhoneNumber
            });

            if (result.success && result.data.status) {
                const datas = result.data.datas;

                switch (selectedMethod) {
                    case 'SESAMPAYX':
                        navigation.navigate('PaymentSuccess', {
                            amount: datas.amount,
                            balance_after: datas.balance_after,
                            balance_before: datas.balance_before,
                            transactionId: 'TRX-123456',
                            card: selectedMethod,
                            message: datas.message,
                            timestamp: Date.now()
                        });
                        break;
                    case 'OM':
                    case 'MTNMOMO':
                        setMomoDatas(prev => ({
                            ...prev,
                            message: result.data.msg,
                            transaction_code: result.data.transaction_code,
                            totalAmount: result.data.total,
                            fees: result.data.fees
                        }));
                        setConfirmPaymentVisible(true);
                        await checkPaymentStatus(result.data.transaction_code);
                        break;
                    // case "VISA/MASTERCARD":
                    //     console.log(result.data)
                    //     setMomoDatas(prev => ({
                    //         ...prev,
                    //         message: "",
                    //         transaction_code: result.data.transaction_code,
                    //         totalAmount: result.data.total,
                    //         fees: result.data.fees
                    //     }));

                    //    break;
                }
            } else {
                setErrorMessage(result.data?.err_msg || result.error);
            }
        } catch (error) {
            setErrorMessage(t.alerts.paymentError);
        } finally {
            setIsProcessing(false);
        }
    }, [subscriptions, selectedCard, selectedMethod, password, fullPhoneNumber, checkPaymentStatus]);

    // Initialisation du paiement
    const handleInitPayment = useCallback(async () => {
        if (!password) {
            Alert.alert(t.alerts.error, t.alerts.invalidPassword);
            return;
        }

        if (selectedMethod === "SESAMPAYX") {
            await handlePay()
            return false
        }

        if (requiresPhoneNumber && !phoneNumber) {
            Alert.alert(t.alerts.error, t.alerts.invalidPhoneNumber);
            return;
        }

        setIsProcessing(true);
        setErrorMessage('');

        try {
            const res = await homeService.getCommissions({
                password: password,
                amount: Math.ceil(selectedCard.price * subscriptions),
                reference: 'SO_PAYBEN',
                phone_number: fullPhoneNumber,
                payment_method: selectedMethod
            });

            if (res.success && res.data.status) {
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
    }, [password, requiresPhoneNumber, phoneNumber, selectedCard.price, subscriptions]);

    // Rendu des méthodes de paiement mémoïsé
    const renderPaymentMethods = useMemo(() =>
        PAYMENT_METHODS.map((method) => (
            <TouchableOpacity
                key={method.id}
                style={[
                    styles.methodButton,
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
                amount={amount}
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
                        <Text style={styles.title}>{t.payment.finalizeSubscription}</Text>
                        <Text style={styles.subtitle}>{t.payment.security2}</Text>
                    </View>

                    {/* Carte sélectionnée et montant */}
                    <View style={styles.cardInfo}>
                        <View style={styles.cardHeader}>
                            <Image
                                source={selectedCard?.image || require('../../assets/logo_sesampayx.png')}
                                style={styles.cardImage}
                                resizeMode="contain"
                            />
                            <View style={styles.cardDetails}>
                                <Text style={styles.cardName}>{selectedCard?.denomination || 'Compte de privilège'}</Text>
                                <Text style={styles.cardDescription}>
                                    {selectedCard?.description}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.amountContainer}>
                            <View style={styles.amountRow}>
                                <Text style={styles.amountLabel}>{t.payment.unitPrice}:</Text>
                                <Text style={styles.amountValue}>
                                    {showBenaccPricePeriod(selectedCard.price, selectedCard.min_subscription, selectedCard.delay, t.benacc.month, t.benacc.day)}
                                </Text>
                            </View>

                            <View style={styles.subscriptionContainer}>
                                <Text style={styles.subscriptionLabel}>{t.payment.monthsNumber}:</Text>
                                <TextInput
                                    style={styles.subscriptionInput}
                                    value={subscriptions}
                                    onChangeText={setSubscriptions}
                                    keyboardType="numeric"
                                    placeholder="1"
                                    maxLength={2}
                                />
                            </View>

                            <View style={styles.separator} />

                            <View style={styles.amountRow}>
                                <Text style={styles.totalLabel}>{t.payment.totalToPay}:</Text>
                                <Text style={styles.totalValue}>{calculateTotal()}</Text>
                            </View>

                        </View>
                        {
                            error !== '' && <Text style={styles.errorText}>{error}</Text>
                        }

                    </View>

                    {/* Méthodes de paiement */}
                    <View style={styles.paymentMethods}>
                        <Text style={styles.sectionTitle}>{t.title.paymentMethod}</Text>

                        <View style={styles.methodsGrid}>
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

                    {/* Champ mot de passe */}
                    <View style={styles.passwordSection}>
                        <Text style={styles.sectionTitle}>{t.title.security}</Text>

                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={styles.passwordInput}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                placeholder={t.fields.enterPassword}
                                placeholderTextColor="#999"
                            />
                            <Text style={styles.passwordHelp}>
                                {t.payment.confirmIdentity}
                            </Text>
                        </View>
                    </View>

                    {/* Bouton de paiement */}
                    <TouchableOpacity
                        style={[styles.payButton, isProcessing && styles.payButtonDisabled]}
                        onPress={handleInitPayment}
                        disabled={isProcessing || error != ''}
                    >
                        <Text style={styles.payButtonText}>
                            {isProcessing ? t.fields.proressingTraitment : t.fields.valid}
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
        marginBottom: 30,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2D3436',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#636E72',
        textAlign: 'center',
    },
    cardInfo: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        marginBottom: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    cardImage: {
        width: 50,
        height: 35,
        marginRight: 15,
    },
    cardDetails: {
        flex: 1,
    },
    cardName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2D3436',
        marginBottom: 4,
    },
    cardDescription: {
        fontSize: 14,
        color: '#636E72',
    },
    amountContainer: {
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
        padding: 16,
    },
    amountRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    amountLabel: {
        fontSize: 15,
        color: '#636E72',
    },
    amountValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2D3436',
    },
    subscriptionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    subscriptionLabel: {
        fontSize: 15,
        color: '#636E72',
    },
    subscriptionInput: {
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 8,
        padding: 10,
        width: 60,
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '600',
        color: '#2D3436',
    },
    separator: {
        height: 1,
        backgroundColor: '#E0E0E0',
        marginVertical: 12,
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2D3436',
    },
    totalValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    paymentMethods: {
        marginBottom: 25,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2D3436',
        marginBottom: 16,
    },
    methodsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    methodButton: {
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
    passwordSection: {
        marginBottom: 30,
    },
    passwordContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    passwordInput: {
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 8,
        padding: 15,
        fontSize: 16,
        marginBottom: 10,
        color: '#2D3436',
    },
    passwordHelp: {
        fontSize: 13,
        color: '#636E72',
        textAlign: 'center',
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
});

export default PaymentScreen;