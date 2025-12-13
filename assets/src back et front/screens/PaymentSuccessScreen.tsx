import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    Dimensions,
    useWindowDimensions,
    Animated,
    Easing
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { showBenaccPrice } from '../utils/helpers';
import { useTranslation } from '../hooks/useTranslation';


const PaymentSuccessScreen = ({ route, navigation }: any) => {
    //const navigation = useNavigation();
    const { width, height } = useWindowDimensions();
    const { amount, transactionId, card, timestamp, onRedo } = route.params || {};
    const [scaleAnim] = useState(new Animated.Value(0));
    const [fadeAnim] = useState(new Animated.Value(0));
    const isSmallScreen = height < 700;
    const { t, language } = useTranslation();

    useEffect(() => {
        Animated.parallel([
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 3,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            })
        ]).start();
    }, []);

    const handleContinue = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'HomeMain' }],
        });
    };

    const handleViewReceipt = () => {
        navigation.navigate('Receipt', {
            transactionId,
            amount,
            card,
            timestamp
        });
    };

    const handleRedoOperation = () => {
        if (onRedo) {
            onRedo();
        } else {
            navigation.goBack();
        }
    };

    // Calcul des dimensions responsives
    const getResponsiveStyles = () => {
        return {
            iconSize: isSmallScreen ? 80 : 100,
            iconContainerSize: isSmallScreen ? 60 : 80,
            titleFontSize: isSmallScreen ? 18 : 24,
            amountFontSize: isSmallScreen ? 20 : 24,
            buttonPadding: isSmallScreen ? 14 : 18,
            detailFontSize: isSmallScreen ? 10 : 12,
            spacing: isSmallScreen ? 15 : 20
        };
    };

    const responsive = getResponsiveStyles();

    return (
        <SafeAreaView style={styles.container}>
            <View style={[
                styles.content,
                {
                    padding: responsive.spacing,
                    justifyContent: height < 600 ? 'flex-start' : 'space-around'
                }
            ]}>


                {/* Section supérieure - Icône et titre */}
                <View style={[styles.topSection]}>
                    <Animated.View
                        style={[
                            styles.successContainer,
                            {
                                transform: [{ scale: scaleAnim }],
                                opacity: fadeAnim
                            }
                        ]}
                    >
                        <View style={[
                            styles.iconContainer,
                            {
                                width: responsive.iconContainerSize,
                                height: responsive.iconContainerSize,
                                borderRadius: responsive.iconContainerSize / 2
                            }
                        ]}>
                            <MaterialIcons name="check" size={responsive.iconSize * 0.5} color="white" />
                        </View>

                        <Text style={[
                            styles.successTitle,
                            { fontSize: responsive.titleFontSize }
                        ]}>
                            {t.operation.successPayment} !
                        </Text>

                        <Text style={[
                            styles.successMessage,
                            { fontSize: responsive.detailFontSize }
                        ]}>
                            {t.payment.succesOperation}
                        </Text>
                    </Animated.View>
                </View>

                {/** Header */}
                <View style={styles.headerContainer}>
                    {/* Bouton Home à gauche */}
                    <TouchableOpacity
                        style={styles.button}
                        activeOpacity={0.7}
                        onPress={handleContinue}
                    >
                        <Ionicons name="home-outline" size={20} color="#007AFF" />
                        <Text style={styles.buttonText}>{t.common.home}</Text>
                    </TouchableOpacity>

                    {/* Espace vide au centre */}
                    <View style={styles.spacer} />

                    {/* Bouton Télécharger à droite */}
                    <TouchableOpacity
                        style={[styles.button, styles.buttonDisabled]}
                        activeOpacity={0.7}
                    >
                        <Ionicons
                            name="download-outline"
                            size={20}
                            color={"#007AFF"}
                        />
                        <Text style={[
                            styles.buttonText,
                        ]}>
                            {t.payment.receipt}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Section centrale - Détails de la transaction */}
                <View style={[
                    styles.middleSection,
                    {
                        flex: height < 600 ? 1 : undefined,
                        marginBottom: responsive.spacing - 10
                    }
                ]}>
                    <View style={[
                        styles.detailsCard,
                        {
                            padding: responsive.spacing,
                        }
                    ]}>
                        <Text style={[
                            styles.detailsTitle,
                            { fontSize: responsive.detailFontSize + 2, fontFamily: 'Poppins-Bold' }
                        ]}>
                            {t.title.transactionDetails}
                        </Text>

                        <View style={[styles.detailRow, { marginVertical: responsive.spacing * 0.5 }]}>
                            <Text style={[styles.detailLabel, { fontSize: responsive.detailFontSize }]}>
                                Montant
                            </Text>
                            <Text style={[styles.detailValue, { fontSize: responsive.detailFontSize }]}>
                                {showBenaccPrice(amount, 1)}
                            </Text>
                        </View>

                        <View style={[styles.detailRow, { marginVertical: responsive.spacing * 0.5 }]}>
                            <Text style={[styles.detailLabel, { fontSize: responsive.detailFontSize }]}>
                                {t.title.paymentMethod}
                            </Text>
                            <Text style={[styles.detailValue, { fontSize: responsive.detailFontSize }]}>
                                {card}
                            </Text>
                        </View>

                        <View style={[styles.detailRow, { marginVertical: responsive.spacing * 0.5 }]}>
                            <Text style={[styles.detailLabel, { fontSize: responsive.detailFontSize }]}>
                                {t.fields.reference}
                            </Text>
                            <Text style={[styles.detailValue, { fontSize: responsive.detailFontSize }]}>
                                {transactionId}
                            </Text>
                        </View>

                        <View style={[styles.detailRow, { marginVertical: responsive.spacing * 0.5 }]}>
                            <Text style={[styles.detailLabel, { fontSize: responsive.detailFontSize }]}>
                                {t.home.date}
                            </Text>
                            <Text style={[styles.detailValue, { fontSize: responsive.detailFontSize }]}>
                                {new Date(timestamp || Date.now()).toLocaleString('fr-FR')}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Section inférieure - Boutons d'action */}
                <View style={styles.bottomSection}>
                    <View style={[styles.actionsContainer, { gap: responsive.spacing * 0.4 }]}>


                        {/* <TouchableOpacity
                            style={[
                                styles.secondaryButton,
                                { padding: responsive.buttonPadding }
                            ]}
                            onPress={handleViewReceipt}
                        >
                            <Text style={styles.secondaryButtonText}>Voir le reçu</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.primaryButton,
                                { padding: responsive.buttonPadding }
                            ]}
                            onPress={handleContinue}
                        >
                            <Text style={styles.primaryButtonText}>Retour à l'accueil</Text>
                        </TouchableOpacity> */}

                        <TouchableOpacity
                            style={[
                                styles.redoButton,
                                { padding: responsive.buttonPadding }
                            ]}
                            onPress={handleRedoOperation}
                        >
                            <MaterialIcons name="replay" size={20} color="white" style={styles.redoIcon} />
                            <Text style={styles.redoButtonText}>{t.operation.new}</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Message de confirmation */}
                    <View style={[styles.footer, { marginTop: responsive.spacing }]}>
                        <Text style={[styles.footerText, { fontSize: responsive.detailFontSize - 4 }]}>
                            {t.operation.confirmation_email}
                        </Text>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    content: {
        flex: 1,
    },
    topSection: {
        alignItems: 'center',
        flexShrink: 1,
    },
    middleSection: {
        flexShrink: 1,
        flexGrow: 0,
    },
    bottomSection: {
        flexShrink: 1,
    },
    successContainer: {
        alignItems: 'center',
    },
    iconContainer: {
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    successTitle: {
        fontFamily: 'Poppins-Bold',
        color: '#2D3436',
        marginBottom: 8,
        textAlign: 'center',
    },
    successMessage: {
        color: '#636E72',
        textAlign: 'center',
        fontFamily: 'Poppins-Regular',
    },
    detailsCard: {
        backgroundColor: 'white',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 1,
    },
    detailsTitle: {
        fontFamily: "Poppins-Bold",
        color: '#2D3436',
        textAlign: 'center',
        marginBottom: 10,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    detailLabel: {
        fontFamily: 'Poppins-Regular',
        color: '#636E72',
    },
    detailValue: {
        fontFamily: 'Poppins-SemiBold',
        color: '#2D3436',
    },
    actionsContainer: {
        width: '100%',
    },
    primaryButton: {
        backgroundColor: '#007AFF',
        borderRadius: 12,
        alignItems: 'center',
    },
    primaryButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    secondaryButton: {
        borderWidth: 1,
        borderColor: '#007AFF',
        borderRadius: 12,
        alignItems: 'center',
    },
    secondaryButtonText: {
        color: '#fcbf00',
        fontSize: 16,
        fontWeight: 'bold',
    },
    redoButton: {
        backgroundColor: '#fcbf00',
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    redoIcon: {
        marginRight: 5,
    },
    redoButtonText: {
        color: '#1a171a',
        fontSize: 14,
        fontFamily: "Poppins-Bold",
    },
    footer: {
        alignItems: 'center',
    },
    footerText: {
        color: '#636E72',
        textAlign: 'center',
        fontFamily: 'Poppins-Regular'
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 6,
        backgroundColor: 'transparent',
        gap: 6,
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    buttonText: {
        color: '#007AFF',
        fontSize: 14,
        fontWeight: '500',
        textDecorationLine: 'underline',
    },
    buttonTextDisabled: {
        color: '#999',
    },
    spacer: {
        flex: 1,
    },
});

export default PaymentSuccessScreen;