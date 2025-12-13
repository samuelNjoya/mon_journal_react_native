import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Modal,
    TouchableWithoutFeedback,
    Animated,
    Alert,
} from 'react-native';
import { useAuthAuthContext } from '../../context/auth/AuthContext';
import { formatDate } from '../../utils/helpers';
import { homeService } from '../../api/services/home';
import { useTranslation } from '../../hooks/useTranslation';
import LoadingScreen from '../../components/LoadingScreen';
import { Ionicons } from '@expo/vector-icons';
import ErrorModal from '../../components/Notification';

interface Subscription {
    id: string;
    type: string;
    status: boolean;
    subscriptionDate: string;
    expirationDate: string;
    benacc_color?: string;
}


const BenefitScreen = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const slideAnim = useState(new Animated.Value(0))[0];
    const { t, language } = useTranslation();
    const { authState } = useAuthAuthContext();

    const aboutText = t.benacc.about_text;

    const openModal = async () => {
        try {
            setLoading(true)
            const result = await homeService.listSubscriptions();
            if (result.success && result.data.status) {
                const subs: Subscription[] = result.data.datas.map((item: any) => {
                    return {
                        id: item.id + '',
                        type: item.benaccount.denomination,
                        status: item.is_subscription_active,
                        subscriptionDate: item.start_date,
                        expirationDate: formatDate(item.end_date),
                        benacc_color: item.benaccount.main_color
                    }
                })
                setModalVisible(true);
                Animated.timing(slideAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }).start();
                setSubscriptions(subs)

            } else {
                setErrorMessage(result.data?.err_msg || result.error);
            }
        } catch (err: any) {
            console.error('Erreur API:', err);
            setErrorMessage(err.message || t.alerts.errorOccurred);
        } finally {
            setLoading(false);
        }
    };

    const closeModal = () => {

        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setModalVisible(false);
        });
        setSubscriptions([])
    };

    return (
        <View style={styles.container}>
            {/* Section informations du compte */}
            <View style={styles.accountSection}>
                {/* <Text style={styles.title}>Informations du compte</Text> */}
                <InfoRow label={t.common.status} value={authState.profil?.account_state || ""} color={authState.profil?.account_state ? "#6BCB77" : "#FF6B6B"} />
                <InfoRow label={t.benacc.benaccTitle} value={authState.profil?.benacc.denomination} color={authState.profil?.benacc?.main_color} />
                <InfoRow label={t.benacc.expire_at} value={formatDate(authState.profil?.benacc?.last_subscription.end_date)} color="#1a171a" />
                {/* Bouton pour ouvrir le modal */}
                <TouchableOpacity style={styles.button} onPress={openModal}>
                    <Text style={styles.buttonText}>{t.benacc.see}</Text>
                </TouchableOpacity>
            </View>



            {/* Zone À propos */}
            <ScrollView style={styles.aboutSection}>
                <Text style={styles.aboutTitle}>{t.benacc.about}</Text>
                <Text style={styles.aboutText}>{aboutText}</Text>
            </ScrollView>

            {/* Modal pour les souscriptions */}
            <Modal
                visible={modalVisible}
                transparent
                animationType="none"
                onRequestClose={closeModal}
            >
                <View style={styles.modalContainer}>
                    <View style={[styles.modalContent, styles.devicesModalContent]}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{t.profil.device_title}</Text>
                            <TouchableOpacity
                                onPress={closeModal}
                                style={styles.closeButton}
                            >
                                <Ionicons name="close" size={24} color="#2D3748" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.subscriptionsList}>
                            {subscriptions.map((sub) => (
                                <SubscriptionCard key={sub.id} subscription={sub} />
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
            <ErrorModal
                visible={errorMessage !== ''}
                message={errorMessage}
                onClose={() => { setErrorMessage('') }}
                type="error"
            />
            {
                loading && <LoadingScreen message={t.benacc.loading_msg} />
            }
        </View>
    );
};

// Composant pour afficher une ligne d'information
const InfoRow = ({ label, value, color }: { label: string; value: string; color: string; }) => (
    <View style={styles.infoRow}>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.value, { color: color }]}>{value}</Text>
    </View>
);

// Composant pour une carte de souscription ,
const SubscriptionCard = ({ subscription }: any) => {
    const { t } = useTranslation()
    return (
        <View style={[styles.subCard, { borderLeftColor: subscription.benacc_color }]}>
            <View style={styles.subHeader}>
                <Text style={[styles.subType, { color: subscription.benacc_color }]}>{subscription.type}</Text>
                <Text style={[
                    styles.subStatus,
                    subscription.status ? styles.statusActive : styles.statusExpired
                ]}>
                    {subscription.status ? "Active" : "Inactive"}
                </Text>
            </View>
            <View style={styles.subDates}>
                <Text style={styles.dateText}>
                    {t.benacc.subscription}: {subscription.subscriptionDate}
                </Text>
                <Text style={styles.dateText}>
                    {t.benacc.expiration} {subscription.expirationDate}
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,

        backgroundColor: '#f5f5f5',
    },
    accountSection: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    title: {
        fontSize: 16,
        fontFamily: 'Poppins-Bold',
        marginBottom: 20,
        color: '#333',
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 6,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    label: {
        fontFamily: 'Poppins-Medium',
        fontSize: 11,
        color: '#666',
    },
    value: {
        fontSize: 13,
        color: '#333',
        fontFamily: "Poppins-SemiBold"
    },
    button: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        // shadowColor: '#007AFF',
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.3,
        // shadowRadius: 4,
        // elevation: 3,
    },
    buttonText: {
        color: '#fcbf00',
        fontFamily: "Poppins-SemiBold",
        fontSize: 14,
        textDecorationLine: 'underline',
    },
    aboutSection: {
        flex: 1,
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
    },
    aboutTitle: {
        fontSize: 16,
        fontFamily: 'Poppins-Bold',
        marginBottom: 10,
        color: '#333',
    },
    aboutText: {
        lineHeight: 18,
        fontFamily: 'Poppins-Regular',
        color: '#666',
        fontSize: 12,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    closeButton: {
        padding: 5,
    },
    closeButtonText: {
        fontSize: 24,
        color: '#666',
        fontWeight: 'bold',
    },
    subscriptionsList: {
        maxHeight: 400,
        padding: 20,
    },
    subCard: {
        backgroundColor: '#f8f9fa',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        borderLeftWidth: 4,

    },
    subHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    subType: {
        fontSize: 14,
        fontFamily: 'Poppins-Bold',
    },
    subStatus: {
        fontSize: 12,
        fontFamily: "Poppins-SemiBold",
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
    },
    statusActive: {
        backgroundColor: '#d4edda',
        color: '#155724',
    },
    statusExpired: {
        backgroundColor: '#f8d7da',
        color: '#721c24',
    },
    subDates: {
        gap: 5,
    },
    dateText: {
        fontSize: 14,
        color: '#666',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    devicesModalContent: {
        maxHeight: '90%',
    },
});

export default BenefitScreen;