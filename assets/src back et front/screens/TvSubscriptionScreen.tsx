import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    FlatList,
    Image,
    Alert,
    Dimensions,
    SafeAreaView,
    Modal,
    TextInput,
    Platform,
    InteractionManager
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import ErrorHandler from '../components/ErrorHandler';
import { homeService } from '../api/services/home';
import AddUpdateTvSubscription, { SubscriptionFormBottomSheetRef } from '../components/tv/AddUpdateTvSubscription';
import ErrorModal from '../components/Notification';
import { StackNavigationProp } from '@react-navigation/stack';
import { HomeStackParamList } from '../navigation/HomeNavigator';
import { showBenaccPrice } from '../utils/helpers';
import { useTranslation } from '../hooks/useTranslation';


const { width, height } = Dimensions.get('window');

// Type pour les abonnements
interface Subscription {
    id_tv_package: string;
    denomination: string;
    price: number;
    title: string;
    status: 'active' | 'expired' | 'pending';
    subscriber_number: string;
    phone_number: string;
    id_tv_subscription: number;
    commission: number;
}

// Type pour les abonnements sélectionnés
interface SelectedSubscription extends Subscription {
    months: number;
    total: number;
    total_with_reduction: number;
}
type SubscriptionScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'HomeMain'>;

const SubscriptionManagementScreen: React.FC = () => {
    const { t, language } = useTranslation();
    const navigation = useNavigation<SubscriptionScreenNavigationProp>();
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedSubscriptions, setSelectedSubscriptions] = useState<SelectedSubscription[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);
    const [refreshing, setRefreshing] = useState(false);
    // Données d'exemple pour les abonnements
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const formRef = useRef<SubscriptionFormBottomSheetRef>(null);
    const [bouquets, setBouquets] = useState([])
    const [messageError, setMessageError] = useState('')
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [selectedSubscription, setSelectedSubscription] = useState<any>(null)
    const [methodes, setMethodes] = useState([])




    const fetchData = useCallback(async () => {
        try {
            setLoading(true)
            setError(null);
            const res = await homeService.getTvSubscriptions();
            if (res.success) {
                setSubscriptions(res.data.packages)
                const data = res.data.methodes.map((x: any) => {
                    return {
                        id: x.value,
                        name: x.value === "OM" ? "Orange Money" : x.value === "MTNMOMO" ? "MTN Mobile Money" : x.value === "SESAME" ? "SesamPayx" : "VISA/MASTERCARD",
                        color: x.color,
                        icon: x.value === "OM" ?
                            require('../../assets/payment_methodes/om.png') :
                            x.value === "MTNMOMO" ?
                                require('../../assets/payment_methodes/momo.png') :
                                x.value === "SESAME" ?
                                    require('../../assets/payment_methodes/logo_sesampayx.png') :
                                    require('../../assets/payment_methodes/visa.png')
                    }
                })
                setMethodes(data)
            } else {
                console.log("Error", res)
                setError(res.error);
            }
        } catch (err: any) {
            console.log(err)
            setError(err?.message);
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData, refreshTrigger]);


    // Si erreur ou chargement, afficher le composant ErrorHandler
    if (loading || error) {
        return (
            <ErrorHandler
                error={error}
                onRetry={fetchData}
                loading={loading}
            />
        );
    }


    // Fonction pour créer un nouvel abonnement
    const handleCreateSubscription = async () => {
        try {
            //navigation.navigate('CreateSubscription');
            setSelectedSubscription(null)
            const res = await homeService.getTvBouquets()
            setLoading(true)
            if (res.success) {
                formRef.current?.open()
                setBouquets(res.data.packages)
            } else {
                setMessageError(res.error)
            }
        } catch (err) {
            setMessageError(t.alerts.errorOccurred)
        } finally {
            setLoading(false)
        }

    };

    const handleEditSubscription = async (id_tv_subscription: number) => {
        const subscription = subscriptions.find(
            sub => sub.id_tv_subscription === id_tv_subscription
        );

        if (!subscription) {
            return setMessageError(t.tvOrders.emptySubscriptionError);
        }

        try {
            const { success, data, error } = await homeService.getTvBouquets();

            if (!success) {
                return setMessageError(error || t.tvOrders.loadPackagesError);
            }



            setSelectedSubscription({
                id_tv_subscription: subscription.id_tv_subscription,
                id_tv_package: subscription.id_tv_package,
                phone_number: subscription.phone_number,
                subscriber_number: subscription.subscriber_number,
                title: subscription.title,
            });

            setBouquets(data.packages || []);
            formRef.current?.open();
        } catch (err) {
            console.error("Erreur système:", err);
            setMessageError(t.alerts.errorOccurred);
        }
    };

    // Fonction pour voir les commandes de renouvellement
    const handleViewRenewalOrders = () => {
        navigation.navigate('RenewalOrders');
    };

    // Fonction pour sélectionner/désélectionner un abonnement
    const toggleSubscriptionSelection = (subscription: Subscription) => {
        setSelectedSubscriptions(prev => {
            const isSelected: any = prev.find(sub => sub.id_tv_subscription === subscription.id_tv_subscription);

            if (isSelected) {
                return prev.filter(sub => sub.id_tv_subscription !== subscription.id_tv_subscription);
            } else {
                return [...prev, {
                    ...subscription,
                    months: 1,
                    total: subscription.price,
                    total_with_reduction: subscription.price + subscription?.commission || 0
                }];
            }
        });
    };

    // Fonction pour modifier le nombre de mois d'un abonnement sélectionné
    const updateSubscriptionMonths = (id: number, months: number) => {
        if (months < 1) return;

        setSelectedSubscriptions(prev =>
            prev.map(sub =>
                sub.id_tv_subscription === id
                    ? { ...sub, months, total: sub.price * months, total_with_reduction: (sub.price + sub.commission) * months }
                    : sub
            )
        );
    };

    // Fonction pour ouvrir le modal de confirmation
    const openConfirmationModal = () => {
        if (selectedSubscriptions.length === 0) {
            Alert.alert('Information', t.tvOrders.invalidSubscription);
            return;
        }
        setModalVisible(true);
    };

    // Fonction pour procéder au paiement
    const handleProceedToPayment = () => {
        setModalVisible(false);
        navigation.navigate('Payment1', {
            subscriptions: selectedSubscriptions,
            methodes: methodes,
        });
    };

    const handleSave = async (data: any) => {
        const res = !selectedSubscription ? await homeService.createSubscription({ subscription: data }) : await homeService.updateSubscription({ subscription: data })
        if (res.success) {
            //formRef.current?.close()
            // ✅ Solution la plus sûre
            setTimeout(() => {
                setRefreshTrigger(prev => prev + 1);
            }, 100);
        } else {
            setMessageError(res.error)
        }
        // Traiter l'enregistrement
    };

    const handleDelete = (id_tv_subscription: number) => {
        Alert.alert(
            t.common.confirmation,
            t.tvOrders.confirmDelete,
            [
                {
                    text: t.common.cancel,
                    style: 'cancel',
                },
                {
                    text: t.actions.delete,
                    style: 'destructive',
                    onPress: async () => {
                        // ✅ Action réelle de suppression ici
                        const res = await homeService.deleteSubscription({ subscription: { id_tv_subscription } })
                        if (res.success) {
                            //formRef.current?.close()
                            // ✅ Solution la plus sûre
                            setTimeout(() => {
                                setRefreshTrigger(prev => prev + 1);
                            }, 100);
                        } else {
                            setMessageError(res.error)
                        }
                    },
                },
            ],
            { cancelable: true }
        );
    }

    // Rendu d'un élément d'abonnement
    const renderSubscriptionItem = ({ item }: { item: Subscription }) => {
        const isSelected = selectedSubscriptions.find(sub => sub.id_tv_subscription === item.id_tv_subscription);

        return (
            <TouchableOpacity
                style={[
                    styles.subscriptionCard,
                    isSelected && styles.selectedCard
                ]}
                onPress={() => toggleSubscriptionSelection(item)}
            >
                {/* Checkbox de sélection */}
                <View style={styles.checkboxContainer}>
                    <View style={[
                        styles.checkbox,
                        isSelected && styles.checkboxSelected
                    ]}>
                        {isSelected && (
                            <Ionicons name="checkmark" size={10} color="#FFFFFF" />
                        )}
                    </View>
                </View>

                {/* Image de l'abonnement */}
                <Image
                    source={require('../../assets/canalplus2.png')}
                    style={styles.subscriptionImage}
                />

                {/* Informations de l'abonnement */}
                <View style={styles.subscriptionInfo}>
                    <Text style={styles.subscriptionName}>{item.denomination}({item.title})</Text>
                    <Text style={styles.subscriptionDescription}>
                        {"NA"} {item.subscriber_number}
                    </Text>
                    <Text style={styles.subscriptionPrice}>
                        {"Tel"} {item.phone_number}
                    </Text>
                    {/* <View style={[
                        styles.statusBadge,
                        styles[`status${item.status.charAt(0).toUpperCase() + item.status.slice(1)}`]
                    ]}>
                        <Text style={styles.statusText}>
                            {item.status === 'active' ? 'Actif' :
                                item.status === 'expired' ? 'Expiré' : 'En attente'}
                        </Text>
                    </View> */}
                </View>

                <View style={{ flexDirection: 'row' }}>
                    {/* Indicateur de sélection */}
                    <TouchableOpacity
                        onPress={() => handleEditSubscription(item.id_tv_subscription)}
                        style={[
                            styles.circle,
                            {
                                width: 34,
                                height: 34,
                                borderRadius: 17,
                                borderWidth: 0.5,
                                marginRight: 8,
                            }
                        ]}>
                        <Ionicons
                            name={"create-outline"}
                            size={16}
                            color="#666"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => handleDelete(item.id_tv_subscription)}
                        style={[
                            styles.circle,
                            {
                                width: 34,
                                height: 34,
                                borderRadius: 17,
                                borderWidth: 0.5,

                            }
                        ]}>
                        <Ionicons
                            name={"trash-outline"}
                            size={16}
                            color="#666"
                        />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {/** Error Modal */}
            <ErrorModal
                type={"error"}
                visible={messageError !== ''}
                onClose={() => setMessageError('')}
                message={messageError}
            />
            <AddUpdateTvSubscription
                ref={formRef}
                onSave={handleSave}
                bouquets={bouquets}
                initialData={selectedSubscription} // Pour la modification
            />
            {/* En-tête avec les boutons */}
            <View style={styles.header}>
                {/* <Text style={styles.title}>Gestion des Abonnements</Text> */}

                <View style={styles.buttonsContainer}>
                    <TouchableOpacity
                        style={[styles.mainButton, styles.createButton]}
                        onPress={handleCreateSubscription}
                    >
                        <Ionicons name="add" size={24} color="#FFFFFF" />
                        <Text style={styles.buttonText}>{t.tvOrders.newSubscription}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.mainButton, styles.ordersButton]}
                        onPress={handleViewRenewalOrders}
                    >
                        <Ionicons name="list" size={24} color="#FFFFFF" />
                        <Text style={styles.buttonText}>{t.tvOrders.orders}</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Bouton de confirmation (apparaît seulement si des abonnements sont sélectionnés) */}
            {selectedSubscriptions.length > 0 && (
                <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={openConfirmationModal}
                >
                    <Text style={styles.confirmButtonText}>
                        {t.tvOrders.validSelection} ({selectedSubscriptions.length})
                    </Text>
                </TouchableOpacity>
            )}

            {/* Liste des abonnements */}
            <View style={styles.listContainer}>
                <Text style={styles.listTitle}>{t.tvOrders.mySubscriptions}</Text>

                <FlatList
                    data={subscriptions}
                    renderItem={renderSubscriptionItem}
                    keyExtractor={item => item.subscriber_number}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Ionicons name="document-text-outline" size={64} color="#CCCCCC" />
                            <Text style={styles.emptyStateText}>{t.tvOrders.noSubscription}</Text>
                            <Text style={styles.emptyStateSubtext}>
                                {t.tvOrders.title1}
                            </Text>
                        </View>
                    }
                />
            </View>

            {/* Modal de confirmation */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        {/* En-tête du modal */}
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{t.tvOrders.monthNumber}</Text>
                            <TouchableOpacity
                                onPress={() => setModalVisible(false)}
                                style={styles.closeButton}
                            >
                                <Ionicons name="close" size={24} color="#666" />
                            </TouchableOpacity>
                        </View>

                        {/* Liste des abonnements sélectionnés */}
                        <ScrollView style={styles.modalContent}>
                            {selectedSubscriptions.map((subscription) => (
                                <View key={subscription.id_tv_subscription} style={styles.modalSubscriptionItem}>
                                    <View style={styles.modalSubscriptionInfo}>
                                        <Text style={styles.modalSubscriptionName}>
                                            {subscription.title}
                                        </Text>
                                        <Text style={styles.modalSubscriptionName}>
                                            {"NA: "}{subscription.subscriber_number}
                                        </Text>
                                        <Text style={styles.modalSubscriptionPrice}>
                                            {showBenaccPrice(subscription.price, 1)}
                                        </Text>
                                    </View>

                                    <View style={styles.quantitySelector}>
                                        <TouchableOpacity
                                            style={styles.quantityButton}
                                            onPress={() => updateSubscriptionMonths(subscription.id_tv_subscription, subscription.months - 1)}
                                        >
                                            <Ionicons name="remove" size={16} color="#007AFF" />
                                        </TouchableOpacity>

                                        <TextInput
                                            style={styles.quantityInput}
                                            value={subscription.months.toString()}
                                            keyboardType="numeric"
                                            onChangeText={(text) => {
                                                const months = parseInt(text) || 1;
                                                updateSubscriptionMonths(subscription.id_tv_subscription, months);
                                            }}
                                        />

                                        <TouchableOpacity
                                            style={styles.quantityButton}
                                            onPress={() => updateSubscriptionMonths(subscription.id_tv_subscription, subscription.months + 1)}
                                        >
                                            <Ionicons name="add" size={16} color="#007AFF" />
                                        </TouchableOpacity>
                                    </View>
                                    {/* 
                                    <Text style={styles.modalSubscriptionTotal}>
                                        Total: {subscription.total.toFixed(2)}€
                                    </Text> */}
                                </View>
                            ))}
                        </ScrollView>

                        {/* Pied du modal avec boutons */}
                        <View style={styles.modalFooter}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.cancelButtonText}>{t.common.cancel}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.modalButton, styles.nextButton]}
                                onPress={handleProceedToPayment}
                            >
                                <Text style={styles.nextButtonText}>{t.common.next}</Text>
                                <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
        position: 'relative'
    },
    header: {
        padding: 10,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2D3436',
        marginBottom: 10,
        textAlign: 'center',
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    mainButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 7,
        borderRadius: 12,
        gap: 8,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    createButton: {
        backgroundColor: '#007AFF',
    },
    ordersButton: {
        backgroundColor: '#34C759',
    },
    buttonText: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 12,
    },
    confirmButton: {
        backgroundColor: '#fcbf00',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        margin: 16,
        padding: 10,
        borderRadius: 12,
        alignItems: 'center',
        zIndex: 1000,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    confirmButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 16,
    },
    listContainer: {
        flex: 1,
        padding: 10,
    },
    listTitle: {
        fontSize: 12,
        fontFamily: 'Poppins-Bold',
        color: '#2D3436',
        marginBottom: 16,
    },
    listContent: {
        paddingBottom: 20,
    },
    subscriptionCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 10,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 3,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    selectedCard: {
        borderColor: '#fcbf00',
        borderWidth: 2,
    },
    checkboxContainer: {
        marginRight: 12,
    },
    checkbox: {
        width: 15,
        height: 15,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#CCCCCC',
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxSelected: {
        backgroundColor: '#007AFF',
        borderColor: '#007AFF',
    },
    subscriptionImage: {
        width: 55,
        height: 60,
        borderRadius: 8,
        marginRight: 6,
    },
    subscriptionInfo: {
        flex: 1,
    },
    subscriptionName: {
        fontSize: 10,
        fontFamily: 'Poppins-Bold',
        color: '#2D3436',
    },
    subscriptionDescription: {
        fontSize: 8,
        color: '#666666',
        fontFamily: 'Poppins-Regular',
    },
    subscriptionPrice: {
        fontSize: 8,
        color: '#007AFF',
        fontWeight: '600',
        marginBottom: 6,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        alignSelf: 'flex-start',
    },
    statusActive: {
        backgroundColor: '#E7F6EA',
    },
    statusExpired: {
        backgroundColor: '#FEEBEB',
    },
    statusPending: {
        backgroundColor: '#FEF6E6',
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        marginTop: 20,
    },
    emptyStateText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#666666',
        marginTop: 16,
        marginBottom: 8,
    },
    emptyStateSubtext: {
        fontSize: 14,
        color: '#999999',
        textAlign: 'center',
    },
    // Styles pour le modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: height * 0.8,
        padding: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 12,
        fontFamily: 'Poppins-Bold',
        color: '#2D3436',
        flex: 1,
    },
    closeButton: {
        padding: 4,
    },
    modalContent: {
        maxHeight: height * 0.5,
    },
    modalSubscriptionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    modalSubscriptionInfo: {
        flex: 1,
        borderLeftWidth: 2,
        paddingLeft: 5
    },
    modalSubscriptionName: {
        fontSize: 10,
        fontWeight: '600',
        color: '#2D3436',
        marginBottom: 4,
    },
    modalSubscriptionPrice: {
        fontSize: 14,
        color: '#666666',
    },
    modalSubscriptionTotal: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#007AFF',
        marginLeft: 12,
    },
    quantitySelector: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 0,
    },
    quantityButton: {
        width: 30,
        height: 30,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#007AFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    quantityInput: {
        width: 36,
        height: 36,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        textAlign: 'center',
        marginHorizontal: 8,
        fontSize: 12,
    },
    modalFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        gap: 12,
    },
    modalButton: {
        flex: 1,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButton: {
        backgroundColor: '#F0F0F0',
    },
    nextButton: {
        backgroundColor: '#007AFF',
        flexDirection: 'row',
        gap: 8,
    },
    cancelButtonText: {
        color: '#666666',
        fontWeight: '600',
    },
    nextButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
    circle: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default SubscriptionManagementScreen;