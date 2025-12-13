import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Switch,
    Alert,
    SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const CurrencyScreen = () => {
    const [selectedCurrency, setSelectedCurrency] = useState('EUR');

    const currencies = [
        { id: 'EUR', name: 'Euro (€)', symbol: '€' },
        { id: 'USD', name: 'Dollar US ($)', symbol: '$' },
        { id: 'GBP', name: 'Livre Sterling (£)', symbol: '£' },
        { id: 'XOF', name: 'Franc CFA (FCFA)', symbol: 'FCFA' },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Devise</Text>
            </View>

            <ScrollView>
                {currencies.map((currency) => (
                    <TouchableOpacity
                        key={currency.id}
                        style={styles.currencyItem}
                        onPress={() => setSelectedCurrency(currency.id)}
                    >
                        <View>
                            <Text style={styles.currencyName}>{currency.name}</Text>
                            <Text style={styles.currencySymbol}>{currency.symbol}</Text>
                        </View>
                        {selectedCurrency === currency.id && (
                            <Ionicons name="checkmark" size={20} color="#fcbf00" />
                        )}
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fcbf00',
        paddingBottom: 10
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1a171a',
    },
    headerRight: {
        width: 32,
    },
    scrollView: {
        flex: 1,
    },
    section: {
        marginTop: 16,
        marginHorizontal: 16,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    sectionContent: {
        backgroundColor: 'white',
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    currencyItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f8f8f8',
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#fff3c2',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    itemTextContainer: {
        flex: 1,
    },
    currencyName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#1a171a',
        marginBottom: 2,
    },
    currencySymbol: {
        fontSize: 14,
        color: '#666',
    },
    itemRight: {
        marginLeft: 8,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        margin: 16,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#FFECEB',
    },
    logoutText: {
        color: '#FF3B30',
        fontWeight: '600',
        fontSize: 16,
        marginLeft: 8,
    },
    footer: {
        alignItems: 'center',
        padding: 24,
        paddingBottom: 32,
    },
    footerText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    footerSubtext: {
        fontSize: 12,
        color: '#999',
        marginTop: 4,
    },
});

export default CurrencyScreen