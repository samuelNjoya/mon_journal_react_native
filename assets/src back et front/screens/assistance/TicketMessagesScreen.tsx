import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { homeService } from '../../api/services/home';
import ErrorModal from '../../components/Notification';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { formatDate } from '../../utils/helpers';
import { useTranslation } from '../../hooks/useTranslation';

interface TicketMessage {
    id: string;
    ticket_id: string;
    message: string;
    sender: 'user' | 'support';
    sender_name: string;
    date: string;
    attachments?: string[];
    is_read?: boolean;
}

interface Ticket {
    id: string;
    title: string;
    status: 'OPENED' | 'CLOSED' | 'PENDING';
    date: string;
    description: string;
    priority?: 'low' | 'medium' | 'high';
    category?: string;
}

const TicketDetailScreen: React.FC = ({ route, navigation }: any) => {
    const { ticket } = route.params;
    const [messages, setMessages] = useState<TicketMessage[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [sending, setSending] = useState<boolean>(false);
    const [newMessage, setNewMessage] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const flatListRef = useRef<FlatList>(null);
    const insets = useSafeAreaInsets();
    const { t, language } = useTranslation();

    // Fonction pour récupérer les messages du ticket
    const fetchMessages = async () => {
        try {
            setLoading(true);
            const result = await homeService.getTicketMessages({ id_ticket: ticket.id });

            if (result.success) {
                const formattedMessages: TicketMessage[] = result.data.datas.map((msg: any) => ({
                    id: msg.id_message.toString(),
                    ticket_id: msg.id_ticket,
                    message: msg.message,
                    sender: msg.from === 'OTHER' ? 'support' : 'user',
                    sender_name: msg.from,
                    date: msg.created_at,

                }));
                setMessages(formattedMessages);
            } else {
                setErrorMessage(result.error?.err_msg || t.message.loading_error);
            }
        } catch (error: any) {
            console.error('Erreur:', error);
            setErrorMessage(error.message || t.alerts.error);

            // // Données mockées pour la démonstration
            // const mockMessages: TicketMessage[] = [
            //     {
            //         id: '1',
            //         ticket_id: ticket.id,
            //         message: ticket.description,
            //         sender: 'user',
            //         sender_name: 'Vous',
            //         date: ticket.date,
            //         is_read: true
            //     },
            //     {
            //         id: '2',
            //         ticket_id: ticket.id,
            //         message: 'Nous avons bien reçu votre demande. Notre équipe technique examine le problème et vous répondra dans les plus brefs délais.',
            //         sender: 'support',
            //         sender_name: 'Support Technique',
            //         date: new Date().toLocaleString('fr-FR'),
            //         is_read: true
            //     },
            //     {
            //         id: '3',
            //         ticket_id: ticket.id,
            //         message: 'Merci pour votre rapidité. J\'ai besoin de cette résolution rapidement car cela bloque mon travail.',
            //         sender: 'user',
            //         sender_name: 'Vous',
            //         date: new Date().toLocaleString('fr-FR'),
            //         is_read: true
            //     }
            // ];
            // setMessages(mockMessages);
        } finally {
            setLoading(false);
        }
    };

    // Fonction pour envoyer un nouveau message
    const sendMessage = async () => {
        if (!newMessage.trim()) return;
        setSending(true);
        const tempMessage: TicketMessage = {
            id: Date.now().toString(),
            ticket_id: ticket.id,
            message: newMessage.trim(),
            sender: 'user',
            sender_name: 'Vous',
            date: new Date().toISOString(),
            is_read: false
        };
        try {

            //console.log(new Date(new Date().toISOString().replace(" ", "T")))
            // Ajout temporaire du message
            setMessages(prev => [...prev, tempMessage]);
            setNewMessage('');

            // Simulation d'envoi API
            const result = await homeService.sendTicketMessage({
                id_ticket: ticket.id,
                message: newMessage.trim()
            });
            if (result.success) {
                // Recharger les messages pour avoir les vrais données
                const formattedMessages: TicketMessage[] = result.data.datas.map((msg: any) => ({
                    id: msg.id_message.toString(),
                    ticket_id: msg.id_ticket,
                    message: msg.message,
                    sender: msg.sender_type === 'support' ? 'support' : 'user',
                    sender_name: msg.from,
                    date: msg.created_at,

                }));
                setMessages(formattedMessages);
            } else {
                setErrorMessage(t.message.sending_error);
                // Retirer le message temporaire en cas d'erreur
                setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
            }
        } catch (error: any) {
            setErrorMessage(error.message || t.message.sending_error);
            // Retirer le message temporaire en cas d'erreur
            setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
        } finally {
            setSending(false);
        }
    };

    // Fonction pour formater la date
    const formatMessageDate = (dateString: string) => {
        const date = new Date(dateString.replace(" ", "T"));
        const now = new Date();
        const diff = now.getTime() - date.getTime();

        if (diff < 60000) return t.message.now;
        if (diff < 3600000) return `Il y a ${Math.floor(diff / 60000)} min`;
        if (diff < 86400000) return `Il y a ${Math.floor(diff / 3600000)} h`;

        return date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Rendu d'un message
    const renderMessage = ({ item, index }: { item: TicketMessage; index: number }) => {
        const isUser = item.sender === 'user';
        const showSender = index === 0 || messages[index - 1].sender !== item.sender;

        return (
            <View style={[
                styles.messageContainer,
                isUser ? styles.userMessageContainer : styles.supportMessageContainer
            ]}>
                {!isUser && showSender && (
                    <Text style={styles.senderName}>{item.sender_name}</Text>
                )}

                <View style={[
                    styles.messageBubble,
                    isUser ? styles.userBubble : styles.supportBubble
                ]}>
                    <Text style={[
                        styles.messageText,
                        isUser ? styles.userMessageText : styles.supportMessageText
                    ]}>
                        {item.message}
                    </Text>
                </View>

                <Text style={[
                    styles.messageTime,
                    isUser ? styles.userMessageTime : styles.supportMessageTime
                ]}>
                    {formatMessageDate(item.date)}
                    {item.is_read && isUser && (
                        <Ionicons name="checkmark-done" size={12} color="#4ECDC4" style={styles.readIcon} />
                    )}
                </Text>
            </View>
        );
    };

    // Header personnalisé
    const renderHeader = () => (
        <View style={styles.ticketInfo}>
            <View style={styles.ticketHeader}>
                <Text style={styles.ticketTitle}>{ticket.title}</Text>
                <View style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(ticket.status) }
                ]}>
                    <Text style={styles.statusText}>{getStatusText(ticket.status)}</Text>
                </View>
            </View>

            <Text style={styles.ticketDescription}>{ticket.description}</Text>

            <View style={styles.ticketMeta}>
                <View style={styles.metaItem}>
                    <Ionicons name="pricetag" size={14} color="#718096" />
                    <Text style={styles.metaText}>{ticket.category || t.ticket.general}</Text>
                </View>
                <View style={styles.metaItem}>
                    <Ionicons name="calendar" size={14} color="#718096" />
                    <Text style={styles.metaText}>{t.message.created_at} {formatDate(ticket.date)}</Text>
                </View>
                {ticket.priority && (
                    <View style={styles.metaItem}>
                        <Ionicons name="warning" size={14} color={getPriorityColor(ticket.priority)} />
                        <Text style={styles.metaText}>
                            {t.message.priority} {ticket.priority === 'high' ? t.ticket.high :
                                ticket.priority === 'medium' ? t.ticket.medium : t.ticket.low}
                        </Text>
                    </View>
                )}
            </View>
        </View>
    );

    // Chargement initial
    useEffect(() => {
        fetchMessages();
    }, [ticket.id]);

    // Auto-scroll vers le bas quand de nouveaux messages arrivent
    useEffect(() => {
        if (messages.length > 0) {
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);
        }
    }, [messages.length]);

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
            case 'OPENED': return 'Ouvert';
            case 'CLOSED': return 'Fermé';
            case 'PENDING': return 'En attente';
            default: return status;
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#fcbf00" />
                <Text style={styles.loadingText}>{t.message.loading}...</Text>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
            <ErrorModal
                visible={errorMessage !== ''}
                type='error'
                onClose={() => setErrorMessage('')}
                message={errorMessage}
            />

            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 5 }]}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="#2D3748" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Conversation</Text>
                <TouchableOpacity style={styles.menuButton}>
                    <Ionicons name="ellipsis-vertical" size={20} color="#2D3748" />
                </TouchableOpacity>
            </View>

            {/* Liste des messages */}
            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={renderHeader}
                contentContainerStyle={styles.messagesList}
                showsVerticalScrollIndicator={false}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            />

            {/* Zone de saisie */}
            {ticket.status !== 'closed' && (
                <View style={styles.inputContainer}>
                    <TouchableOpacity style={styles.attachmentButton}>
                        <Ionicons name="attach" size={24} color="#718096" />
                    </TouchableOpacity>

                    <TextInput
                        style={styles.textInput}
                        value={newMessage}
                        onChangeText={setNewMessage}
                        placeholder="Tapez votre message..."
                        placeholderTextColor="#A0AEC0"
                        multiline
                        maxLength={1000}
                    />

                    <TouchableOpacity
                        style={[
                            styles.sendButton,
                            (!newMessage.trim() || sending) && styles.sendButtonDisabled
                        ]}
                        onPress={sendMessage}
                        disabled={!newMessage.trim() || sending}
                    >
                        {sending ? (
                            <ActivityIndicator size="small" color="#FFFFFF" />
                        ) : (
                            <Ionicons name="send" size={20} color="#FFFFFF" />
                        )}
                    </TouchableOpacity>
                </View>
            )}

            {ticket.status === 'closed' && (
                <View style={styles.closedTicketBanner}>
                    <Ionicons name="lock-closed" size={16} color="#718096" />
                    <Text style={styles.closedTicketText}>Ce ticket est fermé</Text>
                </View>
            )}
        </KeyboardAvoidingView>
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
        fontFamily: 'Poppins-Regular',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fcbf00',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2D3748',
        fontFamily: 'Poppins-SemiBold',
    },
    menuButton: {
        padding: 4,
    },
    messagesList: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    ticketInfo: {
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
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
    ticketTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2D3748',
        flex: 1,
        marginRight: 12,
        fontFamily: 'Poppins-SemiBold',
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    statusText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '600',
        fontFamily: 'Poppins-SemiBold',
    },
    ticketDescription: {
        fontSize: 14,
        color: '#718096',
        lineHeight: 20,
        marginBottom: 12,
        fontFamily: 'Poppins-Regular',
    },
    ticketMeta: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    metaText: {
        fontSize: 12,
        color: '#718096',
        marginLeft: 4,
        fontFamily: 'Poppins-Regular',
    },
    messageContainer: {
        marginVertical: 4,
        maxWidth: '80%',
    },
    userMessageContainer: {
        alignSelf: 'flex-end',
        alignItems: 'flex-end',
    },
    supportMessageContainer: {
        alignSelf: 'flex-start',
        alignItems: 'flex-start',
    },
    senderName: {
        fontSize: 12,
        color: '#718096',
        marginBottom: 4,
        marginLeft: 12,
        fontFamily: 'Poppins-Medium',
    },
    messageBubble: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 20,
        marginBottom: 4,
    },
    userBubble: {
        backgroundColor: '#fcbf00',
        borderBottomRightRadius: 4,
    },
    supportBubble: {
        backgroundColor: '#FFFFFF',
        borderBottomLeftRadius: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    messageText: {
        fontSize: 14,
        lineHeight: 20,
        fontFamily: 'Poppins-Regular',
    },
    userMessageText: {
        color: '#FFFFFF',
    },
    supportMessageText: {
        color: '#2D3748',
    },
    attachmentsContainer: {
        marginTop: 8,
    },
    attachmentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        borderRadius: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        marginTop: 4,
    },
    attachmentText: {
        fontSize: 12,
        marginLeft: 4,
        fontFamily: 'Poppins-Medium',
    },
    messageTime: {
        fontSize: 11,
        marginHorizontal: 12,
        fontFamily: 'Poppins-Light',
    },
    userMessageTime: {
        color: '#718096',
        textAlign: 'right',
    },
    supportMessageTime: {
        color: '#A0AEC0',
        textAlign: 'left',
    },
    readIcon: {
        marginLeft: 4,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    attachmentButton: {
        padding: 8,
        marginRight: 8,
    },
    textInput: {
        flex: 1,
        backgroundColor: '#F7FAFC',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 12,
        maxHeight: 100,
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
    },
    sendButton: {
        backgroundColor: '#fcbf00',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
    sendButtonDisabled: {
        backgroundColor: '#CBD5E0',
    },
    closedTicketBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F7FAFC',
        padding: 12,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    closedTicketText: {
        fontSize: 14,
        color: '#718096',
        marginLeft: 8,
        fontFamily: 'Poppins-Regular',
    },
});

export default TicketDetailScreen;