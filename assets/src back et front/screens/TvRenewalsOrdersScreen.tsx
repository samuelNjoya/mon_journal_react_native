import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
    Alert,
    Image
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { homeService } from '../api/services/home';
import { useTranslation } from '../hooks/useTranslation';

interface RenewalOrder {
    denomination: string;
    phone_number: string;
    subscriber_number: string;
    state: string;
    date: string;
    times_subscription: number; // en jours
}

const TVRenewalOrdersScreen: React.FC = () => {
    const [orders, setOrders] = useState<RenewalOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { t, language } = useTranslation();

    // Données mockées (à remplacer par votre API)


    const fetchOrders = useCallback(async () => {
        try {
            setError(null);
            // Simuler un appel API
            const response = await homeService.getTVRenewalOrders();
            if (response.success) {
                const mockOrders = response.data.commands.map((x: any) => {
                    return {
                        denomination: x.denomination,
                        phone_number: x.phone_number,
                        subscriber_number: x.subscriber_number,
                        state: x.state,
                        date: x.created_at,
                        times_subscription: x.times_subscription
                    }
                })
                setOrders(mockOrders);
                setLoading(false);
                setRefreshing(false);
            } else {
                setError(response.error);
            }

        } catch (err: any) {
            setError(err.message);
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchOrders();
        }, [fetchOrders])
    );

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchOrders();
    }, [fetchOrders]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'VALIDATED': return '#4CAF50';
            case 'IN_PROGRESS': return '#FF9800';
            case 'CANCELED': return '#F44336';
            default: return '#9E9E9E';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'VALIDATED': return t.status.validated;
            case 'IN_PROGRESS': return t.status.pending;
            case 'CANCELED': return t.status.canceled;
            default: return t.status.unknow;
        }
    };

    // const handleRenewOrder = (orderId: string) => {
    //     Alert.alert(
    //         'Renouveler la commande',
    //         'Voulez-vous renouveler cette commande ?',
    //         [
    //             { text: 'Annuler', style: 'cancel' },
    //             { text: 'Renouveler', onPress: () => renewOrder(orderId) }
    //         ]
    //     );
    // };

    // const renewOrder = async (orderId: string) => {
    //     try {
    //         // Simuler le renouvellement
    //         // await homeService.renewTVOrder(orderId);
    //         Alert.alert('Succès', 'Commande renouvelée avec succès');
    //         fetchOrders(); // Rafraîchir la liste
    //     } catch (error) {
    //         Alert.alert('Erreur', 'Échec du renouvellement');
    //     }
    // };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR');
    };

    const renderOrderItem = ({ item }: { item: RenewalOrder }) => (
        <View style={styles.orderCard}>
            <View style={styles.orderHeader}>
                <Image source={require('../../assets/canalplus3.png')} style={styles.packageImage} />
                <View style={styles.orderInfo}>
                    <Text style={styles.packageName}>{item.denomination}</Text>
                    <Text style={styles.detailLabel}>{item.subscriber_number}</Text>
                    {/* <Text style={styles.price}>{formatPrice(item.price)}</Text> */}
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.state) }]}>
                    <Text style={styles.statusText}>{getStatusText(item.state)}</Text>
                </View>
            </View>

            <View style={styles.orderDetails}>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>{t.tvOrders.tel}:</Text>
                    <Text style={styles.detailValue}>{item.phone_number}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>{t.tvOrders.makeAt}:</Text>
                    <Text style={styles.detailValue}>{formatDate(item.date)}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>{t.payment.monthsNumber}:</Text>
                    <Text style={styles.detailValue}>{item.times_subscription}</Text>
                </View>
            </View>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>{t.tvOrders.ordersLoad}...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>{t.alerts.error}: {error}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={fetchOrders}>
                    <Text style={styles.retryButtonText}>{t.common.retry}</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* <Text style={styles.title}>Commandes de Renouvellement TV</Text> */}

            <FlatList
                data={orders}
                renderItem={renderOrderItem}
                keyExtractor={(item, index) => index + ''}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#007AFF']}
                    />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>{t.tvOrders.emty}</Text>
                    </View>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 16,
        color: '#333',
    },
    listContent: {
        padding: 16,
        paddingBottom: 32,
    },
    orderCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    orderHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    packageImage: {
        width: 50,
        height: 50,
        borderRadius: 8,
        marginRight: 12,
    },
    orderInfo: {
        flex: 1,
    },
    packageName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
        fontFamily: 'Poppins-SemiBold'
    },
    price: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#007AFF',
        fontFamily: 'Poppins-Bold'
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    statusText: {
        color: 'white',
        fontSize: 10,
        fontWeight: '600',
        fontFamily: 'Poppins-SemiBold'
    },
    orderDetails: {
        borderTopWidth: 1,
        borderTopColor: '#EEE',
        paddingTop: 12,
        marginBottom: 12,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    detailLabel: {
        fontSize: 11,
        color: '#666',
        fontFamily: 'Poppins-Regular'
    },
    detailValue: {
        fontSize: 12,
        fontWeight: '500',
        color: '#333',
        fontFamily: 'Poppins-SemiBold'
    },
    renewButton: {
        backgroundColor: '#007AFF',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    renewButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 14,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loadingText: {
        marginTop: 12,
        color: '#666',
    },
    errorText: {
        color: '#F44336',
        textAlign: 'center',
        marginBottom: 16,
    },
    retryButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    retryButtonText: {
        color: 'white',
        fontWeight: '600',
    },
    emptyContainer: {
        alignItems: 'center',
        padding: 40,
    },
    emptyText: {
        color: '#666',
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
    },
});

export default TVRenewalOrdersScreen;