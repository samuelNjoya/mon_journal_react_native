import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Animated,
    PanResponder,
    SafeAreaView,
    TextInput,
    Alert,
    Image
} from 'react-native';
import { showBenaccPrice } from '../../utils/helpers';
import { Ionicons } from '@expo/vector-icons';
import { homeService } from '../../api/services/home';
import ErrorModal from '../Notification';
import { useTranslation } from '../../hooks/useTranslation';

const { width, height } = Dimensions.get('window');

interface BottomSheetType {
    visible: boolean;
    onClose: any;
}

const SoldeComponent = ({
    visible,
    onClose,
}: BottomSheetType) => {
    const translateY = useRef(new Animated.Value(height)).current;
    const [showPassword, setShowPassword] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [solde, setSolde] = useState<any>(null)
    const { t } = useTranslation();


    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: (_, gestureState) => {
                return Math.abs(gestureState.dy) > 5;
            },
            onPanResponderMove: (_, gestureState) => {
                if (gestureState.dy > 0) {
                    translateY.setValue(gestureState.dy);
                }
            },
            onPanResponderRelease: (_, gestureState) => {
                if (gestureState.dy > 100) {
                    closeBottomSheet();
                } else {
                    Animated.spring(translateY, {
                        toValue: 0,
                        useNativeDriver: true,
                        damping: 15,
                        stiffness: 150
                    }).start();
                }
            },
        })
    ).current;

    useEffect(() => {
        setSolde(null)
        if (visible) {
            openBottomSheet();
        } else {
            closeBottomSheet();
        }
    }, [visible]);

    const openBottomSheet = () => {
        Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            damping: 15,
            stiffness: 150
        }).start();
    };



    const closeBottomSheet = () => {
        Animated.spring(translateY, {
            toValue: height,
            useNativeDriver: true,
            damping: 15,
            stiffness: 150
        }).start(() => {
            if (onClose) onClose();
        });
    };

    const handleBalance = useCallback(async () => {
        if (!password) {
            Alert.alert(t.alerts.error, t.alerts.invalidPassword);
            return;
        }
        try {
            setIsProcessing(true)
            const result = await homeService.balance({
                password,
            });
            setIsProcessing(false)
            if (result.success && result.data.status) {
                setSolde(showBenaccPrice(result.data.balance, 1))
            } else {
                setErrorMessage(result.data?.err_msg || result.error);
            }
        } catch (err) {

        }
    }, [password])

    if (!visible) return null;

    return (
        <>
            <Animated.View
                style={[
                    styles.overlay,
                    {
                        opacity: translateY.interpolate({
                            inputRange: [0, height],
                            outputRange: [0.5, 0]
                        })
                    }
                ]}
            />
            <Animated.View
                style={[
                    styles.bottomSheet,
                    {
                        transform: [{ translateY }]
                    }
                ]}
                {...panResponder.panHandlers}
            >
                <View style={styles.dragHandleContainer}>
                    <View style={styles.dragHandle} />
                    {/* Image de l'abonnement */}
                    <Image
                        source={require('../../../assets/logo_sesamepayx3.png')}
                        style={styles.headerImage}
                    />
                    <View style={styles.header}>
                        <Text style={styles.title}>{t.balance.title}</Text>
                    </View>
                </View>

                <View style={styles.content}>
                    {
                        solde ?
                            <>

                                <Text>
                                    <Text style={styles.balanceText}>{t.balance.intro}: </Text>
                                    <Text style={styles.balanceValue}>{solde}</Text>
                                </Text>
                                {/* Bouton fermer */}
                                <TouchableOpacity
                                    style={styles.cancelButton}
                                    onPress={closeBottomSheet}
                                    disabled={isProcessing}
                                >
                                    <Text style={styles.cancelButtonText}>{t.common.close}</Text>
                                </TouchableOpacity>
                            </>
                            :
                            <>
                                <Text style={styles.subTitle}>{t.balance.subtitle}</Text>
                                <View style={styles.field}>
                                    <Text style={styles.passwordHelp}>{t.fields.sesampayxPassword}</Text>
                                    <View style={styles.inputContainer1}>
                                        {/* <Text style={styles.emoji}>💰</Text> */}
                                        <Ionicons name="lock-closed-outline" size={20} color="#7f8c8d" style={styles.inputIcon} />
                                        <TextInput
                                            style={styles.input1}
                                            placeholder={t.fields.enterPassword}
                                            keyboardType="numeric"
                                            onChangeText={setPassword}
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
                                    {/* <TextInput
                                            style={styles.inputAmount}
                                            placeholderTextColor="#7f8c8d"
                                            placeholder="💰 Entrez un montant"
                                            keyboardType="numeric"
                                            value={amount + ""}
                                            onChangeText={setAmount}
                                        /> */}
                                </View>

                                <View style={{ flexDirection: 'row' }}>
                                    {/* Bouton annuler */}
                                    <TouchableOpacity
                                        style={styles.cancelButton}
                                        onPress={closeBottomSheet}
                                        disabled={isProcessing}
                                    >
                                        <Text style={styles.cancelButtonText}>{t.common.close}</Text>
                                    </TouchableOpacity>

                                    {/* Bouton de paiement */}
                                    <TouchableOpacity
                                        style={styles.payButton}
                                        onPress={() => { handleBalance() }}
                                        disabled={isProcessing}
                                    >
                                        {isProcessing ? (
                                            <Text style={styles.payButtonText}>{t.fields.proressingTraitment}...</Text>
                                        ) : (
                                            <Text style={styles.payButtonText}>
                                                {t.balance.view}
                                            </Text>
                                        )}

                                    </TouchableOpacity>
                                </View>
                            </>
                    }


                </View>


                <ErrorModal visible={errorMessage !== ''} type='error' onClose={() => { setErrorMessage('') }} message={errorMessage} />
                <SafeAreaView style={styles.safeArea} />
            </Animated.View>
        </>
    );
};

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#000',
        zIndex: 999,
    },
    bottomSheet: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'white',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,

        zIndex: 1000,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 10,
        maxHeight: height * 0.6,
    },
    dragHandleContainer: {
        alignItems: 'center',
        marginBottom: 6,
        backgroundColor: '#fcbf00',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
    },
    dragHandle: {
        width: 40,
        height: 5,
        // backgroundColor: '#1a171a',
        backgroundColor: '#E5E5E5',
        borderRadius: 3,
    },
    header: {
        marginTop: 10
    },
    content: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 14,
        fontFamily: "Poppins-Bold",
        textAlign: 'center',
        marginBottom: 10,
        color: '#1F2937',

    },

    separator: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginVertical: 10,
    },
    payButton: {
        backgroundColor: '#fcbf00',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginTop: 12,
        shadowColor: '#fcbf00',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 3,
        flex: 1
    },
    payButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    cancelButton: {
        padding: 16,
        alignItems: 'center',
        marginTop: 12,
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        marginRight: 10,
        borderRadius: 12,

    },
    cancelButtonText: {
        color: '#6B7280',
        fontSize: 16,
        fontWeight: '500',
    },
    safeArea: {
        backgroundColor: 'white',
    },
    field: { marginBottom: 10 },
    passwordHelp: {
        fontSize: 12,
        color: '#636E72',
        fontFamily: "Poppins-Regular",
        marginBottom: 5,
    },

    inputContainer1: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 2,
        backgroundColor: '#fff',
    },
    emoji: {
        fontSize: 20,
        marginRight: 8,
    },
    input1: {
        fontSize: 16,
        flex: 1,
    },
    inputIcon: {
        marginRight: 12,
    },
    eyeIcon: {
        padding: 5,
    },
    subTitle: {
        fontSize: 12,
        fontFamily: 'Poppins-SemiBold',
        color: '#636E72',
        marginBottom: 40,
    },
    balanceText: {
        fontSize: 12,
        fontFamily: "Poppins-Regular"
    },
    balanceValue: {
        fontSize: 14,
        fontFamily: "Poppins-Bold",
        color: '#fcbf00'
    },
    headerImage: {
        width: 125,
        height: 30,
        borderRadius: 8,
        marginTop: 10,
    },
});

export default SoldeComponent;