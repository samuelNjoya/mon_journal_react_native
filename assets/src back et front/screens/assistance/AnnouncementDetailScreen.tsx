import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Linking
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { useTranslation } from '../../hooks/useTranslation';

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

type RootStackParamList = {
    AnnouncementDetail: {
        announcement: Announcement;
    };
};

type AnnouncementDetailRouteProp = RouteProp<RootStackParamList, 'AnnouncementDetail'>;

const AnnouncementDetailScreen: React.FC = () => {
    const route = useRoute<AnnouncementDetailRouteProp>();
    const navigation = useNavigation();
    const { announcement } = route.params;
    const { t, language } = useTranslation();

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
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleContactSupport = () => {
        Linking.openURL('mailto:support@example.com');
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* En-tête */}
            {/* <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="#2D3748" />
                </TouchableOpacity>

                <View style={styles.headerContent}>
                    <View style={styles.typeBadge}>
                        <Ionicons
                            name={getTypeIcon(announcement.type) as any}
                            size={16}
                            color={getTypeColor(announcement.type)}
                        />
                        <Text style={[styles.typeText, { color: getTypeColor(announcement.type) }]}>
                            {announcement.type === 'info' ? 'Information' :
                                announcement.type === 'warning' ? 'Avertissement' : 'Bonne nouvelle'}
                        </Text>
                    </View>

                    {announcement.isImportant && (
                        <View style={styles.importantBadge}>
                            <Ionicons name="star" size={14} color="#FFFFFF" />
                            <Text style={styles.importantText}>Important</Text>
                        </View>
                    )}
                </View>
            </View> */}

            {/* Contenu principal */}
            <View style={styles.content}>
                <Text style={styles.title}>{announcement.title}</Text>

                <View style={styles.metaInfo}>
                    <View style={styles.metaItem}>
                        <Ionicons name="calendar" size={16} color="#718096" />
                        <Text style={styles.metaText}>
                            {t.announcement.published} {formatDate(announcement.date)}
                        </Text>
                    </View>

                    {announcement.author && (
                        <View style={styles.metaItem}>
                            <Ionicons name="person" size={16} color="#718096" />
                            <Text style={styles.metaText}>{t.announcement.by} {announcement.author}</Text>
                        </View>
                    )}
                </View>

                <View style={styles.contentCard}>
                    <Text style={styles.contentText}>
                        {announcement.content}
                    </Text>
                </View>

                {/* Pièces jointes */}
                {/* {announcement.attachments && announcement.attachments > 0 && (
                    <View style={styles.attachmentsSection}>
                        <Text style={styles.sectionTitle}>Pièces jointes ({announcement.attachments})</Text>
                        <TouchableOpacity style={styles.attachmentButton}>
                            <Ionicons name="document" size={20} color="#45B7D1" />
                            <Text style={styles.attachmentButtonText}>Télécharger les documents</Text>
                        </TouchableOpacity>
                    </View>
                )} */}

                {/* Actions */}
                {/* <View style={styles.actionsSection}>
                    <Text style={styles.sectionTitle}>Actions</Text>

                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={handleContactSupport}
                    >
                        <Ionicons name="chatbubble-ellipses" size={20} color="#FFFFFF" />
                        <Text style={styles.actionButtonText}>Contacter le support</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.secondaryButton}>
                        <Ionicons name="share-social" size={20} color="#fcbf00" />
                        <Text style={styles.secondaryButtonText}>Partager cette annonce</Text>
                    </TouchableOpacity>
                </View> */}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    backButton: {
        padding: 8,
        alignSelf: 'flex-start',
        marginBottom: 12,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    typeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F7FAFC',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        gap: 6,
    },
    typeText: {
        fontSize: 11,
        fontWeight: '600',
        fontFamily: 'Poppins-SemiBold'
    },
    importantBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9A826',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },
    importantText: {
        color: '#FFFFFF',
        fontSize: 9,
        fontWeight: '600',
        fontFamily: 'Poppins-SemiBold'
    },
    content: {
        padding: 20,
    },
    title: {
        fontSize: 22,
        fontFamily: 'Poppins-Bold',
        color: '#2D3748',
        marginBottom: 16,
        lineHeight: 32,
    },
    metaInfo: {
        marginBottom: 24,
        gap: 8,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    metaText: {
        fontSize: 12,
        color: '#718096',
        fontFamily: 'Poppins-Regular'
    },
    contentCard: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 12,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    contentText: {
        fontSize: 14,
        color: '#4A5568',
        lineHeight: 24,
        textAlign: 'justify',
        fontFamily: 'Poppins-Regular'
    },
    attachmentsSection: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: 'Poppins-SemiBold',
        color: '#2D3748',
        marginBottom: 12,
    },
    attachmentButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        gap: 12,
    },
    attachmentButtonText: {
        fontSize: 16,
        color: '#2D3748',
        fontFamily: 'Poppins-SemiBold',
    },
    actionsSection: {
        marginBottom: 24,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fcbf00',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        justifyContent: 'center',
        gap: 8,
    },
    actionButtonText: {
        fontSize: 16,
        color: '#FFFFFF',
        fontFamily: 'Poppins-SemiBold',
    },
    secondaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'transparent',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#fcbf00',
        justifyContent: 'center',
        gap: 8,
    },
    secondaryButtonText: {
        fontSize: 16,
        color: '#fcbf00',
        fontFamily: 'Poppins-SemiBold',
    },
});

export default AnnouncementDetailScreen;