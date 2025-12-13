import React, { useState, useRef, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Dimensions,
    TouchableOpacity,
    Image,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '../../hooks/useTranslation';

const { width } = Dimensions.get('window');

interface Transaction {
    id: number
    title: string
    amount: number
    date: string
    type: any
    icon?: any
}


export default function CardComponent() {
    const { t } = useTranslation();
    // Données de démonstration
    const userData = {
        name: "Thomas Dubois",
        balance: 4876.80,
        cards: [
            { id: 1, number: "**** **** **** 1234", type: "Visa", balance: 2450.50 },
            { id: 2, number: "**** **** **** 5678", type: "MasterCard", balance: 1326.30 }
        ],
        transactions: [
            { id: 1, title: "Netflix", date: "10 Oct", amount: -12.99, icon: "tv-outline", type: "divertissement" },
            { id: 2, title: "Supermarché", date: "8 Oct", amount: -86.40, icon: "cart-outline", type: "courses" },
            { id: 3, title: "Salaire", date: "5 Oct", amount: 2500.00, icon: "cash-outline", type: "revenu" },
            { id: 4, title: "Restaurant", date: "3 Oct", amount: -42.50, icon: "restaurant-outline", type: "nourriture" },
            { id: 5, title: "Amazon", date: "1 Oct", amount: -65.99, icon: "bag-outline", type: "shopping" }
        ],
        quickActions: [
            { id: 1, title: t.operations.transfer, icon: "arrow-forward-outline" },
            { id: 2, title: t.operations.pay, icon: "card-outline" },
            { id: 3, title: t.operations.topup, icon: "phone-portrait-outline" },
        ]
    };

    const formatBalance = (amount: number) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'XAF'
        }).format(amount);
    };

    return (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{t.operations.mycards}</Text>
                <TouchableOpacity>
                    <Text style={styles.seeAll}>{t.operations.seeAll}</Text>
                </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cardsContainer}>
                {userData.cards.map(card => (
                    <View key={card.id} style={styles.card}>
                        <View style={styles.cardHeader}>
                            <View style={styles.cardIcon}></View>
                            <Ionicons name="ellipsis-vertical" size={16} color="#666" />
                        </View>
                        <Text style={styles.cardNumber}>{card.number}</Text>
                        <View style={styles.cardFooter}>
                            <Text style={styles.cardBalance}>{formatBalance(card.balance)}</Text>
                            <Text style={styles.cardType}>{card.type}</Text>
                        </View>
                    </View>
                ))}

                <TouchableOpacity style={styles.addCard}>
                    <View style={styles.addCardIcon}>
                        <Ionicons name="add" size={30} color="#2A4D8E" />
                    </View>
                    <Text style={styles.addCardText}>{t.operations.addCard}</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    seeAll: {
        fontSize: 10,
        color: '#2A4D8E',
    },
    card: {
        width: width * 0.7,
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 20,
        marginRight: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 25,
    },
    cardIcon: {
        width: 40,
        height: 25,
        backgroundColor: '#FFD700',
        borderRadius: 4,
    },
    cardNumber: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 15,
        letterSpacing: 1,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardBalance: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    cardType: {
        fontSize: 14,
        color: '#666',
    },
    addCard: {
        width: width * 0.7,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 20,
        marginRight: 15,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderStyle: 'dashed',
    },
    addCardIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#F0F4FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    addCardText: {
        fontSize: 14,
        color: '#2A4D8E',
        fontWeight: '500',
    },
    cardsContainer: {
        flexDirection: 'row',
    },
    label: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 10,
        marginBottom: 4,
    },
    expiry: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    },
    section: {
        marginTop: 10,
        paddingHorizontal: 10,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        paddingTop: 15,
    },
    sectionTitle: {
        fontSize: 12,
        fontFamily: 'Poppins-Bold',
        color: '#333',
    },
});