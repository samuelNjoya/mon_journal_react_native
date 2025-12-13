import React, { useState, useRef, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Image,
    Dimensions,
    FlatList,
    Animated
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useTranslation } from '../hooks/useTranslation';
import PlatinumCard from './CardTest';

const { width } = Dimensions.get('window');

export default function FinanceHomeScreen() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const scrollX = useRef(new Animated.Value(0)).current;
    const slidesRef = useRef(null);
    const { t } = useTranslation();

    // Données de démonstration
    const userData = {
        name: "Thomas Dubois",
        balance: 4876.80,
        cards: [
            { id: 1, number: "**** **** **** 1234", type: "Visa", balance: 2450.50 },
            { id: 2, number: "**** **** **** 5678", type: "MasterCard", balance: 1326.30 }
        ],
        transactions: [
            { id: 1, title: "Netflix", date: "10 Oct", amount: -12.99, icon: "tv-outline", type: "divertissement" },
            { id: 2, title: "Supermarché", date: "8 Oct", amount: -86.40, icon: "cart-outline", type: "courses" },
            { id: 3, title: "Salaire", date: "5 Oct", amount: 2500.00, icon: "cash-outline", type: "revenu" },
            { id: 4, title: "Restaurant", date: "3 Oct", amount: -42.50, icon: "restaurant-outline", type: "nourriture" },
            { id: 5, title: "Amazon", date: "1 Oct", amount: -65.99, icon: "bag-outline", type: "shopping" }
        ],
        quickActions: [
            { id: 1, title: "Transférer", icon: "arrow-forward-outline" },
            { id: 2, title: "Payer", icon: "card-outline" },
            { id: 3, title: "Recharger", icon: "phone-portrait-outline" },
            { id: 4, title: "Investir", icon: "trending-up-outline" }
        ]
    };

    // Données pour le slider
    const promoSlides = [
        { id: 1, title: "Offre exclusive", description: "Bénéficiez de 0% de frais sur tous vos virements", image: require('../../assets/carousel/budget-bg.jpg') },
        { id: 2, title: "Nouveau!", description: "Épargnez facilement avec notre compte à terme", image: require('../../assets/carousel/budget-bg.jpg') },
        { id: 3, title: "Cashback", description: "Jusqu'à 5% de cashback sur vos achats", image: require('../../assets/carousel/budget-bg.jpg') },
    ];

    // Services disponibles
    const operations = [
        { id: 1, title: "Transfert vers un abonne sesampayx", image: "transfert", color: "#2A4D8E" },
        { id: 2, title: "Transfert vers un client non abonne sesampayx", image: "transfert_non_abonne", color: "#2A4D8E" },
        { id: 3, title: "Recharger mon compte", image: "recharge_compte", color: "#4CD964" },
        { id: 4, title: "Mon solde", image: 'solde', color: "#FF9500" },
        { id: 5, title: "Mes transactions", image: 'transactions', color: "#FF9500" },
        { id: 6, title: "Recharger une carte visa", image: 'carte_visa', color: "#FF9500" },
    ];

    // Opérations possibles
    const services = [
        { id: 1, title: "Paiement des factures Canal+", description: "Envoyez de l'argent en temps réel", image: "virement" },
    ];

    // Transactions récentes
    const transactions = [
        { id: 1, title: "Netflix", date: "10 Oct", amount: -12.99, icon: "tv", type: "divertissement" },
        { id: 2, title: "Supermarché", date: "8 Oct", amount: -86.40, icon: "shopping-cart", type: "courses" },
        { id: 3, title: "Salaire", date: "5 Oct", amount: 2500.00, icon: "account-balance", type: "revenu" },
        { id: 4, title: "Restaurant", date: "3 Oct", amount: -42.50, icon: "restaurant", type: "nourriture" },
        { id: 5, title: "Amazon", date: "1 Oct", amount: -65.99, icon: "shopping-bag", type: "shopping" },
        { id: 6, title: "Remise énergie", date: "28 Sep", amount: 100.00, icon: "flash-on", type: "remise" },
        { id: 7, title: "Free Mobile", date: "25 Sep", amount: -19.99, icon: "stay-current-portrait", type: "téléphonie" },
        { id: 8, title: "Impôts", date: "20 Sep", amount: -350.00, icon: "description", type: "taxes" },
        { id: 9, title: "Remboursement", date: "15 Sep", amount: 45.30, icon: "healing", type: "santé" },
        { id: 10, title: "Spotify", date: "10 Sep", amount: -9.99, icon: "music-note", type: "divertissement" },
    ];

    const serviceImages = {
        virement: require('../../assets/canalplus.png'),
    };

    const operationImages = {
        transfert: require('../../assets/operations/transfert.png'),
        transfert_non_abonne: require('../../assets/operations/transfert_non_abonne.png'),
        recharge_compte: require('../../assets/operations/recharger_compte.png'),
        solde: require('../../assets/operations/solde.png'),
        transactions: require('../../assets/operations/transactions.png'),
        carte_visa: require('../../assets/operations/recharge_carte_visa.png'),
    };

    const formatBalance = (amount) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'XAF'
        }).format(amount);
    };

    // Configuration pour le slider automatique
    useEffect(() => {
        const interval = setInterval(() => {
            if (slidesRef.current) {
                const nextSlide = (currentSlide + 1) % promoSlides.length;
                slidesRef.current.scrollToOffset({
                    offset: nextSlide * width,
                    animated: true,
                });
                setCurrentSlide(nextSlide);
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [currentSlide]);

    const renderOperation = ({ item }) => (
        <TouchableOpacity style={styles.serviceItem}>
            {/* <View style={[styles.serviceIcon, { backgroundColor: item.color }]}>
                <MaterialIcons name={item.icon} size={24} color="white" />
            </View> */}
            <View style={styles.operationImageContainer}>
                <Image
                    source={operationImages[item.image]}
                    style={styles.operationImage}
                    resizeMode="contain"
                />
            </View>
            <Text style={styles.serviceText}>{item.title}</Text>
        </TouchableOpacity>
    );

    // const renderOperation = ({ item }) => (
    //     <TouchableOpacity style={styles.operationItem}>
    //         <View style={styles.operationIcon}>
    //             <MaterialIcons name={item.icon} size={24} color="#2A4D8E" />
    //         </View>
    //         <View style={styles.operationContent}>
    //             <Text style={styles.operationTitle}>{item.title}</Text>
    //             <Text style={styles.operationDesc}>{item.description}</Text>
    //         </View>
    //         <MaterialIcons name="chevron-right" size={24} color="#ccc" />
    //     </TouchableOpacity>
    // );

    const renderService = ({ item }) => (
        <TouchableOpacity style={styles.serviceItem}>
            <View style={styles.operationImageContainer}>
                <Image
                    source={serviceImages[item.image]}
                    style={styles.operationImage}
                    resizeMode="contain"
                />
            </View>
            <View style={styles.operationContent}>
                <Text style={styles.serviceText}>{item.title}</Text>
                {/* <Text style={styles.operationDesc}>{item.description}</Text> */}
            </View>
        </TouchableOpacity>
    );

    const renderTransaction = ({ item }) => (
        <View style={styles.transactionItem}>
            <View style={styles.transactionLeft}>
                <View style={[styles.transactionIcon,
                { backgroundColor: item.amount > 0 ? '#E3F5EF' : '#FFECEB' }]}>
                    <MaterialIcons
                        name={item.icon}
                        size={20}
                        color={item.amount > 0 ? '#2CC197' : '#FF6B6B'}
                    />
                </View>
                <View style={styles.transactionDetails}>
                    <Text style={styles.transactionTitle}>{item.title}</Text>
                    <Text style={styles.transactionDate}>{item.date}</Text>
                </View>
            </View>
            <Text style={[
                styles.transactionAmount,
                { color: item.amount > 0 ? '#2CC197' : '#333' }
            ]}>
                {formatBalance(item.amount)}
            </Text>
        </View>
    );

    const renderSlide = ({ item }) => (
        <View style={styles.slide}>
            <Image source={item.image} style={styles.slideImage} />
            <View style={styles.slideOverlay}>
                <Text style={styles.slideTitle}>{item.title}</Text>
                <Text style={styles.slideDesc}>{item.description}</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#2A4D8E" />

            {/* En-tête */}
            <View style={styles.header}>
                <View style={styles.headerTop1}>
                    <View>
                        <Ionicons name="person-circle-outline" size={34} color="#fff" />
                    </View>
                    <Text style={styles.cardType1}>{"Sesame Platine"}</Text>
                </View>

                <View style={styles.headerTop}>
                    <View>
                        <Text style={styles.greeting}>Bonjour,</Text>
                        <Text style={styles.userName}>{userData.name}</Text>
                    </View>
                </View>
                <View style={styles.divider} />
                {/* Section inférieure */}
                <View style={styles.cardFooter}>
                    <View>
                        <Text style={styles.label}>DATE D'EXPIRATION</Text>
                        <Text style={styles.expiry}>{"20/12"}</Text>
                    </View>
                    <View>
                        {/* Bouton Migrer */}
                        <TouchableOpacity
                            style={[styles.primaryButton]}
                        >
                            <Text style={styles.primaryButtonText}>{"MIGRER"}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Premier bloc classique - Actions rapides */}
                {/* <View style={styles.quickActions}>
                    <TouchableOpacity style={styles.actionButton}>
                        <View style={styles.actionIcon}>
                            <Ionicons name="arrow-up" size={24} color="#2A4D8E" />
                        </View>
                        <Text style={styles.actionText}>Envoyer</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton}>
                        <View style={styles.actionIcon}>
                            <Ionicons name="arrow-down" size={24} color="#2A4D8E" />
                        </View>
                        <Text style={styles.actionText}>Recevoir</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton}>
                        <View style={styles.actionIcon}>
                            <Ionicons name="card" size={24} color="#2A4D8E" />
                        </View>
                        <Text style={styles.actionText}>Carte</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton}>
                        <View style={styles.actionIcon}>
                            <Ionicons name="stats-chart" size={24} color="#2A4D8E" />
                        </View>
                        <Text style={styles.actionText}>Stats</Text>
                    </TouchableOpacity>
                </View> */}

                {/* Deuxième bloc - Slider d'images */}
                <View style={styles.sliderContainer}>
                    <FlatList
                        ref={slidesRef}
                        data={promoSlides}
                        renderItem={renderSlide}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={item => item.id.toString()}
                        onScroll={Animated.event(
                            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                            { useNativeDriver: false }
                        )}
                        onMomentumScrollEnd={(event) => {
                            const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
                            setCurrentSlide(slideIndex);
                        }}
                    />
                    <View style={styles.pagination}>
                        {promoSlides.map((_, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.paginationDot,
                                    currentSlide === index ? styles.paginationDotActive : null
                                ]}
                            />
                        ))}
                    </View>
                </View>

                {/* Troisième bloc - Services */}
                {/* <View style={styles.section}>

                </View> */}

                {/* Quatrième bloc - Opérations */}
                <View style={styles.section}>
                    <View style={styles.grid}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Services</Text>
                            <TouchableOpacity>
                                <Text style={styles.seeAll}>Tout voir</Text>
                            </TouchableOpacity>
                        </View>

                        <FlatList
                            data={services}
                            renderItem={renderService}
                            keyExtractor={item => item.id.toString()}
                            numColumns={3}
                            scrollEnabled={false}
                            contentContainerStyle={styles.servicesGrid}
                        />
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Opérations</Text>
                            <TouchableOpacity>
                                <Text style={styles.seeAll}>Tout voir</Text>
                            </TouchableOpacity>
                        </View>

                        <FlatList
                            data={operations}
                            renderItem={renderOperation}
                            keyExtractor={item => item.id.toString()}
                            numColumns={3}
                            scrollEnabled={false}
                            contentContainerStyle={styles.servicesGrid}
                        />
                    </View>
                </View>

                {/* Cartes */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Mes cartes</Text>
                        <TouchableOpacity>
                            <Text style={styles.seeAll}>Tout voir</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cardsContainer}>
                        {userData.cards.map(card => (
                            <View key={card.id} style={styles.card}>
                                <View style={styles.cardHeader}>
                                    <View style={styles.cardIcon}></View>
                                    <Ionicons name="ellipsis-vertical" size={16} color="#666" />
                                </View>
                                <Text style={styles.cardNumber}>{card.number}</Text>
                                <View style={styles.cardFooter}>
                                    <Text style={styles.cardBalance}>{formatBalance(card.balance)}</Text>
                                    <Text style={styles.cardType}>{card.type}</Text>
                                </View>
                            </View>
                        ))}

                        <TouchableOpacity style={styles.addCard}>
                            <View style={styles.addCardIcon}>
                                <Ionicons name="add" size={30} color="#2A4D8E" />
                            </View>
                            <Text style={styles.addCardText}>Ajouter une carte</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>

                {/** tester la carte */}
                <PlatinumCard />

                {/* Cinquième bloc - Dernières transactions */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Dernières transactions</Text>
                        <TouchableOpacity>
                            <Text style={styles.seeAll}>Tout voir</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.transactionsList}>
                        {transactions.map(transaction => (
                            <View key={transaction.id} style={styles.transactionItem}>
                                <View style={styles.transactionLeft}>
                                    <View style={[styles.transactionIcon,
                                    { backgroundColor: transaction.amount > 0 ? '#E3F5EF' : '#FFECEB' }]}>
                                        <MaterialIcons
                                            name={transaction.icon}
                                            size={20}
                                            color={transaction.amount > 0 ? '#2CC197' : '#FF6B6B'}
                                        />
                                    </View>
                                    <View style={styles.transactionDetails}>
                                        <Text style={styles.transactionTitle}>{transaction.title}</Text>
                                        <Text style={styles.transactionDate}>{transaction.date}</Text>
                                    </View>
                                </View>
                                <Text style={[
                                    styles.transactionAmount,
                                    { color: transaction.amount > 0 ? '#2CC197' : '#333' }
                                ]}>
                                    {formatBalance(transaction.amount)}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FB',
    },
    header: {
        backgroundColor: '#2A4D8E',
        padding: 20,
        paddingTop: 40,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    headerTop1: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

    },
    greeting: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 12,
        fontFamily: 'Poppins-Regular',
    },
    userName: {
        color: '#fff',
        fontSize: 14,
        fontFamily: 'Poppins-Bold',
    },
    balanceContainer: {
        marginBottom: 10,
    },
    balanceLabel: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 14,
        marginBottom: 5,
    },
    balanceValue: {
        color: '#fff',
        fontSize: 28,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
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
    sliderContainer: {
        height: 200,
        marginTop: 10,
    },
    slide: {
        width: width - 30,
        height: 180,
        marginHorizontal: 15,
        borderRadius: 15,
        overflow: 'hidden',
        position: 'relative',
    },
    slideImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    slideOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: 15,
    },
    slideTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    slideDesc: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
    },
    pagination: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 10,
        alignSelf: 'center',
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255,255,255,0.4)',
        marginHorizontal: 4,
    },
    paginationDotActive: {
        backgroundColor: '#fff',
        width: 20,
    },
    section: {
        marginTop: 10,
        paddingHorizontal: 10,
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
    seeAll: {
        fontSize: 10,
        color: '#2A4D8E',
    },
    servicesGrid: {
        padding: 5,
    },
    serviceItem: {
        flex: 1,
        alignItems: 'center',
        margin: 8,
        maxWidth: '33%',
    },
    // serviceIcon: {
    //     width: 50,
    //     height: 50,
    //     borderRadius: 25,
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     marginBottom: 8,
    // },
    serviceText: {
        fontSize: 8,
        textAlign: 'center',
        //color: '#666',
        color: '#1a171a',
        fontFamily: 'Poppins-Regular',
        marginBottom: 10
    },
    // operationsList: {
    //     backgroundColor: '#fff',
    //     borderRadius: 15,
    //     padding: 15,
    //     shadowColor: '#000',
    //     shadowOffset: { width: 0, height: 1 },
    //     shadowOpacity: 0.1,
    //     shadowRadius: 3,
    //     elevation: 2,
    // },
    // operationItem: {
    //     flexDirection: 'row',
    //     alignItems: 'center',
    //     paddingVertical: 12,
    //     borderBottomWidth: 1,
    //     borderBottomColor: '#F0F0F0',
    // },
    // operationIcon: {
    //     width: 40,
    //     height: 40,
    //     borderRadius: 20,
    //     backgroundColor: '#EBF0FF',
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     marginRight: 15,
    // },
    // operationContent: {
    //     flex: 1,
    // },
    // operationTitle: {
    //     fontSize: 16,
    //     fontWeight: '500',
    //     color: '#333',
    //     marginBottom: 4,
    // },
    // operationDesc: {
    //     fontSize: 12,
    //     color: '#999',
    // },
    transactionsList: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    transactionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    transactionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    transactionIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    transactionDetails: {
        justifyContent: 'center',
    },
    transactionTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        marginBottom: 4,
    },
    transactionDate: {
        fontSize: 12,
        color: '#999',
    },
    transactionAmount: {
        fontSize: 16,
        fontWeight: '600',
    },
    // operationsGrid: {
    //     padding: 0,
    // },
    operationImageContainer: {
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    operationImage: {
        width: 65,
        height: 45,
    },
    operationContent: {
        alignItems: 'center',
    },
    operationTitle: {
        fontSize: 9,
        fontFamily: 'Poppins-Regular',
        color: '#1a171a',
        marginBottom: 4,
        textAlign: 'center',
    },
    operationDesc: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
    },
    grid: {
        backgroundColor: '#fff',
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
        paddingHorizontal: 10
    },
    card: {
        width: width * 0.7,
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 20,
        marginRight: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 25,
    },
    cardIcon: {
        width: 40,
        height: 25,
        backgroundColor: '#FFD700',
        borderRadius: 4,
    },
    cardNumber: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 15,
        letterSpacing: 1,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardBalance: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    cardType: {
        fontSize: 14,
        color: '#666',
    },
    addCard: {
        width: width * 0.7,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 20,
        marginRight: 15,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderStyle: 'dashed',
    },
    addCardIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#F0F4FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    addCardText: {
        fontSize: 14,
        color: '#2A4D8E',
        fontWeight: '500',
    },
    cardsContainer: {
        flexDirection: 'row',
    },
    label: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 10,
        marginBottom: 4,
    },
    expiry: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    },
    migrateButton: {
        marginTop: 20,
        backgroundColor: 'transparent',
        borderRadius: 8,
        borderWidth: 2, // Bordure plus épaisse
        borderColor: '#3498db', // Couleur bleue élégante
        paddingHorizontal: 10,
        paddingVertical: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
    },
    migrateButtonText: {
        color: '#1a171a',
        fontSize: 12,
        fontFamily: 'Poppins-Bold',
    },
    cardType1: {
        color: '#fff',
        fontSize: 14,
        backgroundColor: '#1a171a',
        borderRadius: 8,
        borderWidth: 2, // Bordure plus épaisse
        borderColor: '#3498db', // Couleur bleue élégante
        padding: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
    },
    primaryButton: {
        backgroundColor: '#4CD964', // Vert vif qui contraste bien avec le bleu
        paddingVertical: 7,
        paddingHorizontal: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 5,
    },
    primaryButtonText: {
        color: 'white',
        fontSize: 12,
        fontFamily: 'Poppins-Bold',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    disabledButton: {
        backgroundColor: '#A0A0A0',
        shadowOpacity: 0.1,
    },
    divider: {
        height: 1,
        backgroundColor: '#999999',
        marginTop: 2,
        marginBottom: 30,
    },
});