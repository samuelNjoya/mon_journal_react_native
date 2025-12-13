import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
} from 'react-native';
import { useTranslation } from '../../hooks/useTranslation';

interface ActionType {
    visible?: boolean;
    onVisible?: any;
    navigation?: any;
}

export default function QuickActionsComponent({ onVisible, navigation }: ActionType) {
    const { t } = useTranslation();

    // Données de démonstration
    const userData = {
        name: "Thomas Dubois",
        balance: 4876.80,
        quickActions: [
            { id: 1, title: "Transférer", icon: "arrow-forward-outline" },
            { id: 2, title: "Payer", icon: "card-outline" },
            { id: 3, title: "Recharger", icon: "phone-portrait-outline" },
            { id: 4, title: "Investir", icon: "trending-up-outline" }
        ]
    };

    return (
        <View style={styles.quickActions}>
            <TouchableOpacity
                style={styles.actionButton}
                onPress={onVisible}
            >
                <View style={styles.actionIcon}>
                    <Text style={styles.actionEmoji}>💰</Text>
                </View>
                <Text style={styles.actionText}>{t.operations.balance}</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.actionButton}
                onPress={() => {
                    navigation.navigate("transactions")
                }}
            >
                <View style={styles.actionIcon}>
                    <Text style={styles.actionEmoji}>📥</Text>
                </View>
                <Text style={styles.actionText}>{t.operations.myTransactions}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
                <View style={styles.actionIcon}>
                    <Text style={styles.actionEmoji}>💳</Text>
                </View>
                <Text style={styles.actionText}>{t.operations.card}</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.actionButton}
                onPress={() => {
                    navigation.navigate("gains")
                }}
            >
                <View style={styles.actionIcon}>
                    <Text style={styles.actionEmoji}>📊</Text>
                </View>
                <Text style={styles.actionText}>{t.operations.statistics}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    seeAll: {
        fontSize: 10,
        color: '#2A4D8E',
    },
    quickActions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 20,
        backgroundColor: '#fff',
        margin: 15,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    actionButton: {
        alignItems: 'center',
    },
    actionIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#EBF0FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    actionText: {
        fontSize: 12,
        color: '#666',
    },
    section: {
        marginTop: 10,
        paddingHorizontal: 10,
    },
    actionEmoji: {
        fontSize: 20,
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