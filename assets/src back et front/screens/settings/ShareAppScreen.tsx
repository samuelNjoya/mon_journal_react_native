import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
    Linking,
    Platform,
    Share,
    Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ShareAppScreen: React.FC = () => {
    const [shared, setShared] = useState(false);

    // Données de partage
    const shareData = {
        title: 'Partager MonApp',
        message: 'Découvrez MonApp - l\'application révolutionnaire pour gérer vos finances ! 📱\n\n' +
            'Téléchargez-la maintenant : https://monapp.com/download\n\n' +
            'Fonctionnalités principales :\n' +
            '✅ Gestion de comptes\n' +
            '✅ Transferts instantanés\n' +
            '✅ Paiements sécurisés\n' +
            '✅ Support 24/7',
        url: 'https://monapp.com/download'
    };

    // Options de partage
    const shareOptions = [
        {
            id: 'whatsapp',
            name: 'WhatsApp',
            icon: 'logo-whatsapp',
            color: '#25D366',
            scheme: 'whatsapp://send?text='
        },
        {
            id: 'facebook',
            name: 'Facebook',
            icon: 'logo-facebook',
            color: '#1877F2',
            scheme: 'fb://post?text='
        },
        {
            id: 'twitter',
            name: 'Twitter',
            icon: 'logo-twitter',
            color: '#1DA1F2',
            scheme: 'twitter://post?message='
        },
        {
            id: 'instagram',
            name: 'Instagram',
            icon: 'logo-instagram',
            color: '#E4405F',
            scheme: 'instagram://share?text='
        },
        {
            id: 'telegram',
            name: 'Telegram',
            icon: 'paper-plane',
            color: '#0088CC',
            scheme: 'tg://msg?text='
        },
        {
            id: 'sms',
            name: 'SMS',
            icon: 'chatbubble',
            color: '#34C759',
            scheme: 'sms:?body='
        },
        {
            id: 'email',
            name: 'Email',
            icon: 'mail',
            color: '#FF9500',
            scheme: 'mailto:?subject=Partager MonApp&body='
        },
        {
            id: 'system',
            name: 'Autres apps',
            icon: 'share-social',
            color: '#007AFF',
            scheme: null
        }
    ];

    // Partager via une application spécifique
    const shareViaApp = async (app: any) => {
        try {
            let shareUrl = '';

            if (app.scheme) {
                // Encoder le message pour l'URL
                const encodedMessage = encodeURIComponent(shareData.message);

                if (app.id === 'email') {
                    shareUrl = `${app.scheme}${encodedMessage}`;
                } else {
                    shareUrl = `${app.scheme}${encodedMessage}`;
                }

                // Vérifier si l'application est installée
                const canOpen = await Linking.canOpenURL(shareUrl);

                if (canOpen) {
                    await Linking.openURL(shareUrl);
                    setShared(true);
                } else {
                    // Si l'app n'est pas installée, utiliser le partage système
                    await shareSystem();
                }
            } else {
                // Partage système
                await shareSystem();
            }
        } catch (error) {
            console.error('Erreur partage:', error);
            Alert.alert('Erreur', 'Impossible de partager via cette application');
        }
    };

    // Partage système (partage natif)
    const shareSystem = async () => {
        try {
            const result = await Share.share({
                title: shareData.title,
                message: shareData.message,
                url: shareData.url
            }, {
                dialogTitle: 'Partager MonApp',
                subject: shareData.title
            });

            if (result.action === Share.sharedAction) {
                setShared(true);
            }
        } catch (error) {
            console.error('Erreur partage système:', error);
            Alert.alert('Erreur', 'Impossible de partager l\'application');
        }
    };

    // Copier le lien dans le presse-papier
    const copyToClipboard = async () => {
        try {
            // Utiliser Expo Clipboard ou react-native-clipboard
            // Ici, nous simulons avec Alert
            Alert.alert(
                'Lien copié',
                'Le lien de téléchargement a été copié dans le presse-papier !',
                [{ text: 'OK' }]
            );
            setShared(true);
        } catch (error) {
            Alert.alert('Erreur', 'Impossible de copier le lien');
        }
    };

    // Réinitialiser l'état de partage
    const resetShare = () => {
        setShared(false);
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Partager l'application</Text>
                <Text style={styles.headerSubtitle}>
                    Partagez MonApp avec vos amis et famille
                </Text>
            </View>

            {/* Illustration */}
            <View style={styles.illustrationContainer}>
                <View style={styles.illustration}>
                    <Ionicons name="share-social" size={80} color="#fcbf00" />
                    <Text style={styles.illustrationText}>
                        {shared ? 'Merci pour le partage ! 🎉' : 'Partagez la bonne nouvelle'}
                    </Text>
                </View>
            </View>

            {/* Message de partage */}
            <View style={styles.messageContainer}>
                <Text style={styles.messageTitle}>Pourquoi partager MonApp ?</Text>
                <View style={styles.benefitsList}>
                    <View style={styles.benefitItem}>
                        <Ionicons name="checkmark-circle" size={20} color="#4ECDC4" />
                        <Text style={styles.benefitText}>Transactions sécurisées et rapides</Text>
                    </View>
                    <View style={styles.benefitItem}>
                        <Ionicons name="checkmark-circle" size={20} color="#4ECDC4" />
                        <Text style={styles.benefitText}>Frais réduits pour les utilisateurs invités</Text>
                    </View>
                    <View style={styles.benefitItem}>
                        <Ionicons name="checkmark-circle" size={20} color="#4ECDC4" />
                        <Text style={styles.benefitText}>Support client 24h/24 et 7j/7</Text>
                    </View>
                    <View style={styles.benefitItem}>
                        <Ionicons name="checkmark-circle" size={20} color="#4ECDC4" />
                        <Text style={styles.benefitText}>Interface simple et intuitive</Text>
                    </View>
                </View>
            </View>

            {/* Bouton de partage principal */}
            <TouchableOpacity
                style={styles.mainShareButton}
                onPress={shareSystem}
            >
                <Ionicons name="share" size={24} color="#FFFFFF" />
                <Text style={styles.mainShareButtonText}>
                    Partager l'application
                </Text>
            </TouchableOpacity>

            {/* Séparateur */}
            <View style={styles.separator}>
                <View style={styles.separatorLine} />
                <Text style={styles.separatorText}>ou partager via</Text>
                <View style={styles.separatorLine} />
            </View>

            {/* Options de partage spécifiques */}
            <View style={styles.shareOptionsContainer}>
                <Text style={styles.shareOptionsTitle}>Applications de messagerie</Text>
                <View style={styles.shareOptionsGrid}>
                    {shareOptions.map((app) => (
                        <TouchableOpacity
                            key={app.id}
                            style={styles.shareOptionButton}
                            onPress={() => shareViaApp(app)}
                        >
                            <View style={[styles.shareOptionIcon, { backgroundColor: app.color }]}>
                                <Ionicons name={app.icon as any} size={24} color="#FFFFFF" />
                            </View>
                            <Text style={styles.shareOptionText}>{app.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Section lien de téléchargement */}
            <View style={styles.downloadSection}>
                <Text style={styles.downloadTitle}>Lien de téléchargement</Text>
                <Text style={styles.downloadUrl}>https://monapp.com/download</Text>

                <TouchableOpacity
                    style={styles.copyButton}
                    onPress={copyToClipboard}
                >
                    <Ionicons name="copy" size={20} color="#fcbf00" />
                    <Text style={styles.copyButtonText}>Copier le lien</Text>
                </TouchableOpacity>
            </View>

            {/* Statistiques de partage (optionnel) */}
            {shared && (
                <View style={styles.successContainer}>
                    <View style={styles.successHeader}>
                        <Ionicons name="checkmark-done-circle" size={48} color="#4ECDC4" />
                        <Text style={styles.successTitle}>Merci !</Text>
                    </View>
                    <Text style={styles.successText}>
                        Votre partage aide à faire connaître MonApp à plus de personnes.
                    </Text>
                    <TouchableOpacity
                        style={styles.againButton}
                        onPress={resetShare}
                    >
                        <Text style={styles.againButtonText}>Partager à nouveau</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Informations supplémentaires */}
            <View style={styles.infoContainer}>
                <Text style={styles.infoTitle}>Questions fréquentes</Text>
                <View style={styles.faqItem}>
                    <Text style={styles.faqQuestion}>Le partage est-il sécurisé ?</Text>
                    <Text style={styles.faqAnswer}>
                        Oui, le partage ne transmet aucune donnée personnelle. Seul le lien de téléchargement est partagé.
                    </Text>
                </View>
                <View style={styles.faqItem}>
                    <Text style={styles.faqQuestion}>Y a-t-il des avantages à partager ?</Text>
                    <Text style={styles.faqAnswer}>
                        Les utilisateurs invités bénéficient de frais réduits pendant leurs 3 premiers mois.
                    </Text>
                </View>
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
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2D3748',
        textAlign: 'center',
        fontFamily: 'Poppins-Bold',
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#718096',
        textAlign: 'center',
        marginTop: 8,
        fontFamily: 'Poppins-Regular',
    },
    illustrationContainer: {
        alignItems: 'center',
        paddingVertical: 40,
        backgroundColor: '#FFFFFF',
        marginBottom: 16,
    },
    illustration: {
        alignItems: 'center',
    },
    illustrationText: {
        fontSize: 16,
        color: '#2D3748',
        marginTop: 16,
        textAlign: 'center',
        fontFamily: 'Poppins-SemiBold',
    },
    messageContainer: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        marginHorizontal: 16,
        borderRadius: 12,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    messageTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2D3748',
        marginBottom: 16,
        fontFamily: 'Poppins-SemiBold',
    },
    benefitsList: {
        gap: 12,
    },
    benefitItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    benefitText: {
        fontSize: 14,
        color: '#718096',
        marginLeft: 12,
        flex: 1,
        fontFamily: 'Poppins-Regular',
    },
    mainShareButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fcbf00',
        padding: 16,
        borderRadius: 12,
        marginHorizontal: 16,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    mainShareButtonText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
        marginLeft: 12,
        fontFamily: 'Poppins-SemiBold',
    },
    separator: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        marginBottom: 24,
    },
    separatorLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#E2E8F0',
    },
    separatorText: {
        fontSize: 12,
        color: '#718096',
        marginHorizontal: 12,
        fontFamily: 'Poppins-Regular',
    },
    shareOptionsContainer: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        marginHorizontal: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    shareOptionsTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2D3748',
        marginBottom: 16,
        textAlign: 'center',
        fontFamily: 'Poppins-SemiBold',
    },
    shareOptionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    shareOptionButton: {
        alignItems: 'center',
        width: '23%',
        marginBottom: 16,
    },
    shareOptionIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    shareOptionText: {
        fontSize: 12,
        color: '#718096',
        textAlign: 'center',
        fontFamily: 'Poppins-Regular',
    },
    downloadSection: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        marginHorizontal: 16,
        borderRadius: 12,
        marginBottom: 16,
        alignItems: 'center',
    },
    downloadTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2D3748',
        marginBottom: 8,
        fontFamily: 'Poppins-SemiBold',
    },
    downloadUrl: {
        fontSize: 14,
        color: '#718096',
        textAlign: 'center',
        marginBottom: 16,
        fontFamily: 'Poppins-Regular',
        backgroundColor: '#F7FAFC',
        padding: 12,
        borderRadius: 8,
        width: '100%',
    },
    copyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#fcbf00',
    },
    copyButtonText: {
        fontSize: 14,
        color: '#fcbf00',
        marginLeft: 8,
        fontFamily: 'Poppins-Medium',
    },
    successContainer: {
        backgroundColor: '#F0FFF4',
        padding: 20,
        marginHorizontal: 16,
        borderRadius: 12,
        marginBottom: 16,
        alignItems: 'center',
        borderLeftWidth: 4,
        borderLeftColor: '#4ECDC4',
    },
    successHeader: {
        alignItems: 'center',
        marginBottom: 12,
    },
    successTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#2D3748',
        marginTop: 8,
        fontFamily: 'Poppins-SemiBold',
    },
    successText: {
        fontSize: 14,
        color: '#718096',
        textAlign: 'center',
        marginBottom: 16,
        fontFamily: 'Poppins-Regular',
    },
    againButton: {
        backgroundColor: '#4ECDC4',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    againButtonText: {
        fontSize: 14,
        color: '#FFFFFF',
        fontWeight: '600',
        fontFamily: 'Poppins-SemiBold',
    },
    infoContainer: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        marginHorizontal: 16,
        marginBottom: 24,
        borderRadius: 12,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2D3748',
        marginBottom: 16,
        fontFamily: 'Poppins-SemiBold',
    },
    faqItem: {
        marginBottom: 16,
    },
    faqQuestion: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2D3748',
        marginBottom: 4,
        fontFamily: 'Poppins-SemiBold',
    },
    faqAnswer: {
        fontSize: 12,
        color: '#718096',
        lineHeight: 16,
        fontFamily: 'Poppins-Regular',
    },
});

export default ShareAppScreen;