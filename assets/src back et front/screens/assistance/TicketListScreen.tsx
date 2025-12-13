import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
    Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { homeService } from '../../api/services/home';
import { useTranslation } from '../../hooks/useTranslation';
import ErrorModal from '../../components/Notification';
import { formatDate } from '../../utils/helpers';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type TicketNavigationProp = {
    navigate: (screen: string, params: any) => void;
};

interface Ticket {
    id: string;
    title: string;
    status: 'OPENED' | 'CLOSED' | 'PENDING';
    date: string;
    description: string;
    priority?: 'low' | 'medium' | 'high';
    category?: string;
}


const TicketListScreen: React.FC = ({ navigation }: any) => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState('');
    const { t, language } = useTranslation();
    const insets = useSafeAreaInsets();
    //const navigation = useNavigation<TicketNavigationProp>();

    const fetchTickets = async (isRefreshing: boolean = false): Promise<void> => {
        try {
            if (isRefreshing) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }
            setError(null);

            const result = await homeService.getTickets();
            // console.log(result.data.datas[3])
            if (result.success && result.data.status) {
                const processedTickets: Ticket[] = result.data.datas.map((item: any) => {
                    return {
                        id: item.id + '',
                        title: item.title,
                        status: item.state,
                        date: item.created_at,
                        description: item.description,
                        priority: 'high',
                    }
                })
                setTickets(processedTickets);

            } else {
                setErrorMessage(result.data?.err_msg || result.error);
            }

            // // Simulation de réponse API avec parfois une erreur
            // const shouldFail = Math.random() < 0.1; // 10% de chance d'erreur pour la démo

            // if (shouldFail) {
            //     throw new Error('Erreur de connexion au serveur');
            // }

            // Données mockées de l'API
            // const mockApiResponse: ApiResponse = {
            //     success: true,
            //     data: [
            //         {
            //             id: '1',
            //             title: 'Problème de connexion',
            //             status: 'open',
            //             date: '2024-01-15',
            //             description: 'Impossible de se connecter à mon compte',
            //             priority: 'high',
            //             category: 'Technical'
            //         },
            //         {
            //             id: '2',
            //             title: 'Question sur les frais',
            //             status: 'closed',
            //             date: '2024-01-10',
            //             description: 'Comprendre les frais de transaction',
            //             priority: 'medium',
            //             category: 'Billing'
            //         },
            //         {
            //             id: '3',
            //             title: 'Demande de fonctionnalité',
            //             status: 'pending',
            //             date: '2024-01-12',
            //             description: 'Ajouter le support PayPal',
            //             priority: 'low',
            //             category: 'Feature Request'
            //         },
            //         {
            //             id: '4',
            //             title: 'Problème de transfert',
            //             status: 'open',
            //             date: '2024-01-14',
            //             description: 'Transfert en attente depuis 24h',
            //             priority: 'high',
            //             category: 'Transaction'
            //         },
            //         {
            //             id: '5',
            //             title: 'Question sur le compte',
            //             status: 'closed',
            //             date: '2024-01-08',
            //             description: 'Vérification du statut du compte',
            //             priority: 'medium',
            //             category: 'Account'
            //         }
            //     ],
            //     total: 5,
            //     message: 'Tickets récupérés avec succès'
            // };

            // Simuler un traitement des données
            // const processedTickets = result.data.datas.map((ticket: any) => ({
            //     ...ticket,
            //     date: new Date(ticket.date).toLocaleDateString('fr-FR')
            // }));



        } catch (err: any) {
            console.error('Erreur API:', err);
            setError(err.message || t.alerts.errorOccurred);
            Alert.alert(t.alerts.error, t.ticket.loadTicketError);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleTicketPress = (ticket: Ticket) => {
        navigation.navigate('ticketDetail', { ticket });
    };

    // Chargement initial des tickets
    useEffect(() => {
        fetchTickets();
    }, []);

    // Fonction pour rafraîchir manuellement
    const onRefresh = () => {
        fetchTickets(true);
    };

    // Fonction pour créer un nouveau ticket (simulation)
    const handleCreateTicket = () => {
        navigation.navigate('createTicket', {});
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'OPENED': return '#4ECDC4';
            case 'CLOSED': return '#FF6B6B';
            case 'PENDING': return '#F9A826';
            default: return '#CBD5E0';
        }
    };

    const getPriorityColor = (priority?: string) => {
        switch (priority) {
            case 'high': return '#FF6B6B';
            case 'medium': return '#F9A826';
            case 'low': return '#4ECDC4';
            default: return '#CBD5E0';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'OPENED': return t.ticket.open;
            case 'CLOSED': return t.ticket.close;
            case 'PENDING': return t.ticket.pending;
            default: return status;
        }
    };

    const renderTicket = ({ item }: { item: Ticket }) => (
        <TouchableOpacity
            style={styles.ticketCard}
            onPress={() => handleTicketPress(item)}
            activeOpacity={0.7}
        >
            <View style={styles.ticketHeader}>
                <View style={styles.ticketTitleContainer}>
                    <Text style={styles.ticketTitle} numberOfLines={1}>{item.title}</Text>
                    {item.priority && (
                        <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority) }]}>
                            <Text style={styles.priorityText}>
                                {item.priority === 'high' ? t.ticket.high : item.priority === 'medium' ? t.ticket.medium : t.ticket.low}
                            </Text>
                        </View>
                    )}
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                    <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
                </View>
            </View>

            <Text style={styles.ticketDescription} numberOfLines={2}>{item.description}</Text>

            <View style={styles.ticketFooter}>
                <View style={styles.categoryContainer}>
                    <Ionicons name="pricetag" size={12} color="#718096" />
                    <Text style={styles.categoryText}>{item.category || t.ticket.general}</Text>
                </View>
                <Text style={styles.ticketDate}>{formatDate(item.date)}</Text>
            </View>
        </TouchableOpacity>
    );

    // Écran de chargement
    if (loading && !refreshing) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#fcbf00" />
                <Text style={styles.loadingText}>{t.ticket.loading}...</Text>
            </View>
        );
    }

    // Écran d'erreur
    if (error && tickets.length === 0) {
        return (
            <View style={styles.errorContainer}>
                <Ionicons name="warning" size={64} color="#FF6B6B" />
                <Text style={styles.errorTitle}>{t.ticket.loading_error}</Text>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={() => fetchTickets()}>
                    <Text style={styles.retryButtonText}>{t.common.retry}</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ErrorModal visible={errorMessage !== ''} type='error' onClose={() => { setErrorMessage('') }} message={errorMessage} />
            {/* En-tête avec statistiques */}
            <View style={[styles.header, { paddingTop: insets.top + 5 }]}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="#2D3748" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t.ticket.my_tickets}</Text>
                <Text style={styles.headerSubtitle}>
                    {tickets.length} {t.ticket.ticket_total} • {
                        tickets.filter(t => t.status === 'OPENED').length
                    } {t.ticket.opens}
                </Text>
            </View>

            <FlatList
                data={tickets}
                renderItem={renderTicket}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#fcbf00']}
                        tintColor="#fcbf00"
                    />
                }
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Ionicons name="ticket" size={64} color="#CBD5E0" />
                        <Text style={styles.emptyTitle}>{t.ticket.emptyTitle}</Text>
                        <Text style={styles.emptyText}>
                            {error ? t.ticket.loading_error : t.ticket.emptyText}
                        </Text>
                        <TouchableOpacity style={styles.emptyButton} onPress={() => fetchTickets()}>
                            <Text style={styles.emptyButtonText}>{t.ticket.reload}</Text>
                        </TouchableOpacity>
                    </View>
                }
                ListHeaderComponent={
                    tickets.length > 0 ? (
                        <View style={styles.statsContainer}>
                            <View style={styles.statItem}>
                                <View style={[styles.statDot, { backgroundColor: '#4ECDC4' }]} />
                                <Text style={styles.statText}>
                                    {tickets.filter(t => t.status === 'OPENED').length} {t.ticket.opens}
                                </Text>
                            </View>
                            <View style={styles.statItem}>
                                <View style={[styles.statDot, { backgroundColor: '#F9A826' }]} />
                                <Text style={styles.statText}>
                                    {tickets.filter(t => t.status === 'PENDING').length} {t.ticket.pending}
                                </Text>
                            </View>
                            <View style={styles.statItem}>
                                <View style={[styles.statDot, { backgroundColor: '#FF6B6B' }]} />
                                <Text style={styles.statText}>
                                    {tickets.filter(t => t.status === 'CLOSED').length} {t.ticket.closes}
                                </Text>
                            </View>
                        </View>
                    ) : null
                }
            />

            {/* Bouton d'action flottant */}
            <TouchableOpacity style={styles.fab} onPress={handleCreateTicket}>
                <Ionicons name="add" size={24} color="#FFFFFF" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#718096',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
        backgroundColor: '#F8F9FA',
    },
    errorTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2D3748',
        marginTop: 16,
        marginBottom: 8,
    },
    errorText: {
        fontSize: 16,
        color: '#718096',
        textAlign: 'center',
        marginBottom: 24,
    },
    retryButton: {
        backgroundColor: '#fcbf00',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    retryButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 16,
    },
    header: {
        backgroundColor: '#fcbf00',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2D3748',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#718096',
    },
    listContent: {
        flexGrow: 1,
        padding: 16,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#FFFFFF',
        padding: 12,
        borderRadius: 12,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 1,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },
    statText: {
        fontSize: 12,
        color: '#718096',
        fontWeight: '500',
    },
    ticketCard: {
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    ticketHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    ticketTitleContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginRight: 8,
    },
    ticketTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2D3748',
        marginRight: 8,
        flex: 1,
    },
    priorityBadge: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    priorityText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: '600',
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        minWidth: 70,
        alignItems: 'center',
    },
    statusText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '600',
    },
    ticketDescription: {
        fontSize: 14,
        color: '#718096',
        lineHeight: 20,
        marginBottom: 12,
    },
    ticketFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    categoryContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    categoryText: {
        fontSize: 12,
        color: '#718096',
        marginLeft: 4,
    },
    ticketDate: {
        fontSize: 12,
        color: '#A0AEC0',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
        flex: 1,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#A0AEC0',
        marginTop: 16,
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 14,
        color: '#CBD5E0',
        textAlign: 'center',
        marginBottom: 16,
    },
    emptyButton: {
        backgroundColor: '#fcbf00',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    emptyButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
    fab: {
        position: 'absolute',
        right: 16,
        bottom: 16,
        backgroundColor: '#fcbf00',
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    backButton: {
        padding: 4,
    },
});

export default TicketListScreen;