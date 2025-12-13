import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from '../../hooks/useTranslation';
import ErrorModal from '../../components/Notification';
import { homeService } from '../../api/services/home';

// Types
interface Announcement {
    id: string;
    title: string;
    content: string;
    date: string;
    type: 'info' | 'warning' | 'success';
    author?: string;
    isImportant?: boolean;
}

// Type pour la navigation
type AnnouncementsNavigationProp = {
    navigate: (screen: string, params: any) => void;
};

const AnnouncementsScreen: React.FC = () => {
    const navigation = useNavigation<AnnouncementsNavigationProp>();
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const { t, language } = useTranslation();

    // Simulation de chargement des données depuis l'API
    useEffect(() => {
        loadAnnouncements();
    }, []);

    const loadAnnouncements = async (isRefreshing = false) => {
        try {
            if (isRefreshing) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            const result = await homeService.getAnnouncements();
            // console.log(result.data.datas[3])
            if (result.success && result.data.status) {
                const datas: Announcement[] = result.data.datas.map((item: any, index: number) => {
                    return {
                        id: item.id_announcement,
                        title: item.title,
                        content: item.description,
                        date: item.created_at,
                        type: index % 2 === 0 ? 'info' : 'warning',
                        author: 'Équipe Technique',
                        isImportant: index % 2 === 0 ? false : true,
                    }
                })
                console.log(result.data.datas[0].user_actions)
                setAnnouncements(datas);

            } else {
                setErrorMessage(result.data?.err_msg || result.error);
            }

            // Données mockées
            // const mockData: Announcement[] = [
            //     {
            //         id: '1',
            //         title: 'Maintenance programmée',
            //         content: 'Une maintenance est prévue ce weekend. Le service pourrait être interrompu pendant quelques heures. Nous vous recommandons de planifier vos transactions en conséquence.',
            //         date: '2024-01-20',
            //         type: 'info',
            //         author: 'Équipe Technique',
            //         isImportant: true,
            //         attachments: 2
            //     },
            //     {
            //         id: '2',
            //         title: 'Nouvelle fonctionnalité disponible',
            //         content: 'Découvrez notre nouveau système de transfert instantané. Les virements sont maintenant traités en temps réel 24h/24 et 7j/7.',
            //         date: '2024-01-18',
            //         type: 'success',
            //         author: 'Équipe Développement',
            //         attachments: 1
            //     },
            //     {
            //         id: '3',
            //         title: 'Mise à jour des conditions générales',
            //         content: 'Veuillez noter que nos conditions générales d\'utilisation ont été mises à jour. Nous vous recommandons de prendre connaissance des nouveaux termes.',
            //         date: '2024-01-15',
            //         type: 'warning',
            //         author: 'Service Juridique',
            //         isImportant: true
            //     },
            //     {
            //         id: '4',
            //         title: 'Promotion spéciale de fin d\'année',
            //         content: 'Profitez de frais réduits sur tous vos transferts jusqu\'à la fin du mois. Une réduction de 50% vous est offerte pour célébrer la nouvelle année.',
            //         date: '2024-01-10',
            //         type: 'success',
            //         author: 'Équipe Marketing'
            //     }
            // ];


        } catch (error) {
            console.error('Erreur lors du chargement des annonces:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleAnnouncementPress = (announcement: Announcement) => {
        navigation.navigate('AnnouncementDetail', { announcement });
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'info': return '#45B7D1';
            case 'warning': return '#F9A826';
            case 'success': return '#4ECDC4';
            default: return '#CBD5E0';
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'info': return 'information-circle';
            case 'warning': return 'warning';
            case 'success': return 'checkmark-circle';
            default: return 'megaphone';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const renderAnnouncement = ({ item }: { item: Announcement }) => (
        <TouchableOpacity
            style={styles.announcementCard}
            onPress={() => handleAnnouncementPress(item)}
            activeOpacity={0.7}
        >
            <View style={[styles.typeIndicator, { backgroundColor: getTypeColor(item.type) }]} />
            <View style={styles.announcementContent}>
                <View style={styles.announcementHeader}>
                    <View style={styles.titleContainer}>
                        <Ionicons
                            name={getTypeIcon(item.type) as any}
                            size={20}
                            color={getTypeColor(item.type)}
                            style={styles.typeIcon}
                        />
                        <Text style={styles.announcementTitle} numberOfLines={2}>
                            {item.title}
                        </Text>
                    </View>
                    {item.isImportant && (
                        <Ionicons name="star" size={16} color="#F9A826" />
                    )}
                </View>

                <Text style={styles.announcementText} numberOfLines={3}>
                    {item.content}
                </Text>
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#fcbf00" />
                <Text style={styles.loadingText}>{t.announcement.loading}...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                {/* <Text style={styles.headerTitle}>Annonces</Text> */}
                <Text style={styles.headerSubtitle}>
                    {t.announcement.headerSubtitle}
                </Text>
            </View>

            <FlatList
                data={announcements}
                renderItem={renderAnnouncement}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => loadAnnouncements(true)}
                        colors={['#fcbf00']}
                        tintColor="#fcbf00"
                    />
                }
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Ionicons name="megaphone" size={64} color="#CBD5E0" />
                        <Text style={styles.emptyTitle}>{t.announcement.emptyTitle}</Text>
                        <Text style={styles.emptyText}>
                            {t.announcement.emptyText}
                        </Text>
                    </View>
                }
            />
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
        fontSize: 15,
        color: '#718096',
        fontFamily: 'Poppins-Regular'
    },
    header: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    headerTitle: {
        fontSize: 22,
        fontFamily: 'Poppins-Bold',
        color: '#2D3748',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 12,
        color: '#718096',
        lineHeight: 20,
        fontFamily: 'Poppins-Regular'
    },
    listContent: {
        flexGrow: 1,
        padding: 16,
    },
    announcementCard: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
        minHeight: 120,
    },
    typeIndicator: {
        width: 6,
        borderTopLeftRadius: 16,
        borderBottomLeftRadius: 16,
    },
    announcementContent: {
        flex: 1,
        padding: 16,
    },
    announcementHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    titleContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginRight: 8,
    },
    typeIcon: {
        marginRight: 8,
        marginTop: 2,
    },
    announcementTitle: {
        flex: 1,
        fontSize: 14,
        fontFamily: 'Poppins-SemiBold',
        color: '#2D3748',
        lineHeight: 20,
    },
    announcementText: {
        fontSize: 13,
        color: '#718096',
        lineHeight: 20,
        marginBottom: 12,
        fontFamily: 'Poppins-Regular'
    },
    announcementFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    footerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    announcementDate: {
        fontSize: 12,
        color: '#A0AEC0',
        fontFamily: 'Poppins-SemiBold'
    },
    attachmentBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F7FAFC',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        gap: 4,
    },
    attachmentText: {
        fontSize: 9,
        color: '#718096',
        fontFamily: 'Poppins-SemiBold'
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
        flex: 1,
    },
    emptyTitle: {
        fontSize: 16,
        fontFamily: 'Poppins-SemiBold',
        color: '#A0AEC0',
        marginTop: 16,
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 13,
        color: '#CBD5E0',
        textAlign: 'center',
        fontFamily: 'Poppins-Regular'
    },
});

export default AnnouncementsScreen;