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
import { formatDate, getStatusColor, getStatusIcon, showBenaccPrice } from '../../utils/helpers';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '../../hooks/useTranslation';

const { width, height } = Dimensions.get('window');

interface TransactionDetailsType {
    visible: boolean;
    onClose: any;
    operation: any
}

const TransactionDetails = ({
    visible,
    onClose,
    operation
}: TransactionDetailsType) => {
    const translateY = useRef(new Animated.Value(height)).current;
    const { t } = useTranslation();

    const isSmallScreen = height < 700;


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

    // Calcul des dimensions responsives
    const getResponsiveStyles = () => {
        return {
            iconSize: isSmallScreen ? 80 : 100,
            iconContainerSize: isSmallScreen ? 60 : 80,
            titleFontSize: isSmallScreen ? 22 : 28,
            amountFontSize: isSmallScreen ? 20 : 24,
            buttonPadding: isSmallScreen ? 14 : 18,
            detailFontSize: isSmallScreen ? 10 : 11,
            spacing: isSmallScreen ? 15 : 20
        };
    };

    const responsive = getResponsiveStyles();

    useEffect(() => {
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
                        <Text style={styles.title}>{operation.code}</Text>
                    </View>
                </View>

                <View style={styles.content}>
                    <View style={[styles.cardContainer]}>

                        <View
                            style={styles.card}
                        >
                            {/* Header de la carte */}
                            <View
                                style={styles.cardHeader}
                            >
                                <View style={styles.iconContainer}>
                                    <Image style={{ height: 24, width: 24 }} source={operation.icon} />
                                    {/* <Ionicons name={item.icon as any} size={24} color={item.color} /> */}
                                </View>

                                <View style={styles.titleContainer}>
                                    <Text style={styles.operationTitle}>{operation.title}</Text>
                                    <Text style={styles.recipientText}>{operation.subtitle}</Text>
                                </View>

                                <View style={styles.amountContainer}>
                                    <Text style={[
                                        styles.amountText,
                                        { color: operation.type === 'withdrawal' || operation.type === 'payment' ? '#F44336' : '#4CAF50' }
                                    ]}>
                                        {operation.type === 'withdrawal' || operation.type === 'payment' ? '-' : '+'}{operation.amount}
                                    </Text>
                                </View>
                            </View>
                            {/* Footer de la carte */}
                            <View style={styles.cardFooter}>
                                <View style={styles.statusContainer}>
                                    <Ionicons
                                        name={getStatusIcon(operation.status) as any}
                                        size={16}
                                        color={getStatusColor(operation.status)}
                                    />
                                    <Text style={[styles.statusText, { color: getStatusColor(operation.status) }]}>
                                        {operation.status}
                                    </Text>
                                </View>

                                <Text style={styles.dateText}>{formatDate(operation.date)}</Text>
                            </View>
                        </View>
                    </View>
                    {/* Section centrale - Détails de la transaction */}
                    <View style={[
                        styles.middleSection,
                        {
                            flex: height < 600 ? 1 : undefined,
                            marginBottom: responsive.spacing
                        }
                    ]}>
                        <View style={[
                            styles.detailsCard,
                            {
                                padding: responsive.spacing,
                                marginBottom: responsive.spacing
                            }
                        ]}>
                            <Text style={[
                                styles.detailsTitle,
                                { fontSize: responsive.detailFontSize + 2 }
                            ]}>
                                {t.title.transactionDetails}
                            </Text>

                            <View style={[styles.detailRow, { marginVertical: responsive.spacing * 0.5 }]}>
                                <Text style={[styles.detailLabel, { fontSize: responsive.detailFontSize }]}>
                                    {t.fields.amount}
                                </Text>
                                <Text style={[styles.detailValue, { fontSize: responsive.detailFontSize }]}>
                                    {operation.amount}
                                </Text>
                            </View>

                            <View style={[styles.detailRow, { marginVertical: responsive.spacing * 0.5 }]}>
                                <Text style={[styles.detailLabel, { fontSize: responsive.detailFontSize }]}>
                                    {t.payment.commission}
                                </Text>
                                <Text style={[styles.detailValue, { fontSize: responsive.detailFontSize }]}>
                                    {operation.commission}
                                </Text>
                            </View>

                            <View style={[styles.detailRow, { marginVertical: responsive.spacing * 0.5 }]}>
                                <Text style={[styles.detailLabel, { fontSize: responsive.detailFontSize }]}>
                                    {t.fields.reference}
                                </Text>
                                <Text style={[styles.detailValue, { fontSize: responsive.detailFontSize }]}>
                                    {operation.code}
                                </Text>
                            </View>

                            <View style={[styles.detailRow, { marginVertical: responsive.spacing * 0.5 }]}>
                                <Text style={[styles.detailLabel, { fontSize: responsive.detailFontSize }]}>
                                    {t.home.date}
                                </Text>
                                <Text style={[styles.detailValue, { fontSize: responsive.detailFontSize }]}>
                                    {new Date(Date.now()).toLocaleString('fr-FR')}
                                </Text>
                            </View>
                        </View>
                    </View>


                    <View style={{ flexDirection: 'row' }}>
                        {/* Bouton annuler */}
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={closeBottomSheet}
                        >
                            <Text style={styles.cancelButtonText}>{t.common.close}</Text>
                        </TouchableOpacity>
                    </View>

                </View>
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
        maxHeight: height * 0.8,
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
    headerImage: {
        width: 125,
        height: 30,
        borderRadius: 8,
        marginTop: 10,
    },
    cardContainer: {
        marginBottom: 6,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 3
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10
    },
    titleContainer: {
        flex: 1
    },
    recipientText: {
        fontSize: 8,
        fontFamily: 'Poppins-Regular',
        color: '#718096'
    },
    amountContainer: {
        alignItems: 'flex-end'
    },
    amountText: {
        fontSize: 12,
        fontFamily: 'Poppins-Bold',
    },
    operationTitle: {
        fontSize: 11,
        fontFamily: 'Poppins-Bold',
        color: '#2D3748',
        marginBottom: 2
    },
    card: {
        borderRadius: 20,
        padding: 7,
        borderWidth: 1,
        borderColor: '#F0F0F0'
    },
    middleSection: {
        flexShrink: 1,
        flexGrow: 0,
    },
    detailsCard: {
        backgroundColor: 'white',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
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
        color: '#636E72',
        fontFamily: "Poppins-Regular",
    },
    detailValue: {
        fontFamily: "Poppins-SemiBold",
        color: '#2D3436',
    },
    actionsContainer: {
        width: '100%',
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap'
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 12
    },
    statusText: {
        fontSize: 10,
        fontFamily: 'Poppins-SemiBold',
        marginLeft: 6
    },
    dateText: {
        fontSize: 10,
        color: '#A0AEC0',
        flex: 1,
        marginRight: 12,
        fontFamily: 'Poppins-Regular',
    },
});

export default TransactionDetails;