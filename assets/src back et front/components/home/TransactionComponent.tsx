import React, { useState, useRef, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Dimensions,
    TouchableOpacity,
    Image
} from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { ListRenderItem } from 'react-native'
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


export default function TransactionComponent() {
    const { t } = useTranslation();

    // Transactions récentes
    const transactions = [
        { id: 1, title: "Netflix", date: "10 Oct", amount: -12.99, icon: "tv", type: "divertissement" },
        { id: 2, title: "Supermarché", date: "8 Oct", amount: -86.40, icon: "shopping-cart", type: "courses" },
        { id: 3, title: "Salaire", date: "5 Oct", amount: 2500.00, icon: "account-balance", type: "revenu" },
        { id: 4, title: "Restaurant", date: "3 Oct", amount: -42.50, icon: "restaurant", type: "nourriture" },
        { id: 5, title: "Amazon", date: "1 Oct", amount: -65.99, icon: "shopping-bag", type: "shopping" },
        { id: 6, title: "Remise énergie", date: "28 Sep", amount: 100.00, icon: "flash-on", type: "remise" },
        { id: 7, title: "Free Mobile", date: "25 Sep", amount: -19.99, icon: "stay-current-portrait", type: "téléphonie" },
        { id: 8, title: "Impôts", date: "20 Sep", amount: -350.00, icon: "description", type: "taxes" },
        { id: 9, title: "Remboursement", date: "15 Sep", amount: 45.30, icon: "healing", type: "santé" },
        { id: 10, title: "Spotify", date: "10 Sep", amount: -9.99, icon: "music-note", type: "divertissement" },
    ];

    const formatBalance = (amount: number) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'XAF'
        }).format(amount);
    };


    const renderTransaction: ListRenderItem<Transaction> = ({ item }) => (
        <View style={styles.transactionItem}>
            <View style={styles.transactionLeft}>
                <View style={[styles.transactionIcon,
                { backgroundColor: item.amount > 0 ? '#E3F5EF' : '#FFECEB' }]}>
                    <MaterialIcons
                        name={item.icon}
                        size={20}
                        color={item.amount > 0 ? '#2CC197' : '#FF6B6B'}
                    />
                </View>
                <View style={styles.transactionDetails}>
                    <Text style={styles.transactionTitle}>{item.title}</Text>
                    <Text style={styles.transactionDate}>{item.date}</Text>
                </View>
            </View>
            <Text style={[
                styles.transactionAmount,
                { color: item.amount > 0 ? '#2CC197' : '#333' }
            ]}>
                {formatBalance(item.amount)}
            </Text>
        </View>
    );

    return (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{t.operations.recentTransactions}</Text>
                <TouchableOpacity>
                    <Text style={styles.seeAll}>{t.operations.seeAll}</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.transactionsList}>
                {transactions.map((transaction: Transaction) => (
                    <View key={transaction.id} style={styles.transactionItem}>
                        <View style={styles.transactionLeft}>
                            <View style={[styles.transactionIcon,
                            { backgroundColor: transaction.amount > 0 ? '#E3F5EF' : '#FFECEB' }]}>
                                <MaterialIcons
                                    name={transaction.icon}
                                    size={20}
                                    color={transaction.amount > 0 ? '#2CC197' : '#FF6B6B'}
                                />
                            </View>
                            <View style={styles.transactionDetails}>
                                <Text style={styles.transactionTitle}>{transaction.title}</Text>
                                <Text style={styles.transactionDate}>{transaction.date}</Text>
                            </View>
                        </View>
                        <Text style={[
                            styles.transactionAmount,
                            { color: transaction.amount > 0 ? '#2CC197' : '#333' }
                        ]}>
                            {formatBalance(transaction.amount)}
                        </Text>
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    seeAll: {
        fontSize: 10,
        color: '#2A4D8E',
    },
    transactionsList: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    transactionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    transactionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    transactionIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    transactionDetails: {
        justifyContent: 'center',
    },
    transactionTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        marginBottom: 4,
    },
    transactionDate: {
        fontSize: 12,
        color: '#999',
    },
    transactionAmount: {
        fontSize: 16,
        fontWeight: '600',
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