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
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useTranslation } from '../hooks/useTranslation';
import { PlatinumCard } from '../components/AssistanceButton';
import BenefitComponent from '../components/home/Benefits'
import OperationServiceComponent from '../components/home/Operations';
import SlideComponent from '../components/home/Slides';
import TransactionComponent from '../components/home/TransactionComponent';
import { homeService } from '../api/services/home';
import QuickActionsComponent from '../components/home/QuickActionsComponent';
import { useAuthAuthContext } from '../context/auth/AuthContext';
//import { Preloader } from '../components/Preloader';
import { StackNavigationProp } from '@react-navigation/stack';
import { HomeStackParamList } from '../navigation/HomeNavigator';
import { useNavigation } from '@react-navigation/native';
import ErrorModal from '../components/Notification';
import ErrorHandler from '../components/ErrorHandler';
import SoldeComponent from '../components/bottom_sheets/Solde';
import ExpenseChartLine from '../components/depenses/graphChart/ExpenseChartLine';


const { width } = Dimensions.get('window');
type HomeScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'HomeMain'>;

export default function FinanceHomeScreen() {
    const { t, language } = useTranslation();
    const { setProfil } = useAuthAuthContext();
    const [isVisible, setIsVisible] = useState(false)
    const [loading, setLoading] = useState(true);
    const [slides, setSlides] = useState([])
    const [name, setName] = useState('')
    const [error, setError] = useState<any>(null);
    const [refreshing, setRefreshing] = useState(false);
    const [showSolde, setShowSolde] = useState(false);
    const navigation = useNavigation<HomeScreenNavigationProp>();
    const [homeDatas, setHomeDatas] = useState({
        name: '',
        slides: [],
        expireAt: '',
        linked_benacc: {
            reference: '',
            denomination: '',
            picture: '',
            price: '',
            min_subscription: '',
            id: -1,
            delay: '',
        },
        lastSubscription: {
            date: '',
            is_active: false
        },
        benaccs: [],
        badges: []
    })

    const getDate = (dateString: string) => {
        // Validation de l'entrée
        if (!dateString || typeof dateString !== 'string') {
            return '';
        }
        try {
            const date = new Date(dateString.replace(' ', 'T'));
            return date.toLocaleDateString(language, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
        } catch (err) {
            return ''
        }
    }

    const fetchData = async () => {
        try {
            setLoading(true)
            setError(null);
            setIsVisible(false)
            const res = await homeService.getDatas();
            if (res.success) {
                let datas = res.data.datas
                await setProfil({
                    account_number: datas.account_number,
                    profile_picture: datas.profile_picture,
                    account_state: datas.account_state,
                    name: datas.username,
                    benacc: res.data.datas.linked_benacc
                })
                let ben = datas.benacc.find((x: any) => x.reference === datas.linked_benacc.reference)
                setHomeDatas({
                    ...homeDatas,
                    slides: datas.slides,
                    name: datas.username,
                    linked_benacc: {
                        ...homeDatas.linked_benacc,
                        reference: datas.linked_benacc.reference,
                        denomination: datas.linked_benacc.denomination,
                        min_subscription: datas.linked_benacc.min_subscription,
                        id: datas.linked_benacc.id_type_ben_account
                    },
                    lastSubscription: {
                        ...homeDatas.lastSubscription,
                        date: getDate(datas.linked_benacc.last_subscription.end_date),
                        is_active: datas.linked_benacc.last_subscription.is_subscription_active
                    },
                    benaccs: datas.benacc,
                    badges: ben ? ben.badges : []
                })
                setSlides(datas.slides)
                setName(datas.username)
                // console.log(datas)
            } else {
                setError(res.error);
                setIsVisible(true)
            }
        } catch (err: any) {
            console.log(err)
            setError(err?.message);
            setIsVisible(true)
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchData();
    };

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

    // Données de démonstration
    const userData = {
        name: "Thomas Dubois",
        balance: 4876.80,
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



    return (

        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#fcbf00" />
            {/* <Preloader visible={loading} /> */}
            {/* En-tête */}
            <View style={styles.header}>
                <View style={styles.headerTop1}>
                    <View>
                        <Ionicons name="person-circle-outline" size={34} color="#fff" />
                    </View>
                    <View style={styles.statusBadge}>
                        <Ionicons name="checkmark-circle" size={16} color="#3FA9F5" />
                        <Text style={styles.statusText}>{homeDatas.linked_benacc.denomination}</Text>
                    </View>
                    {/* <Text style={styles.cardType1}>{homeDatas.linked_benacc.denomination}</Text> */}
                </View>

                <View style={styles.headerTop}>
                    <View>
                        <Text style={styles.greeting}>{t.home.title},</Text>
                        <Text style={styles.userName}>{name}</Text>
                    </View>
                </View>
                <View style={styles.divider} />
                {/* Section inférieure */}
                <View style={styles.cardFooter}>
                    <View>
                        <Text style={styles.label}>{t.home.expirationDate}</Text>
                        <Text style={styles.expiry}>{homeDatas.lastSubscription.date}</Text>
                    </View>
                    <View>
                        {/* Bouton Migrer */}
                        <TouchableOpacity
                            style={[styles.primaryButton]}
                            onPress={() => {
                                navigation.navigate('Migration', {
                                    benaccs: homeDatas.benaccs,
                                    linked_benacc: homeDatas.linked_benacc
                                })
                            }}
                        >
                            <Text style={styles.primaryButtonText}>{t.home.migrate.toUpperCase()}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

                <QuickActionsComponent
                    onVisible={() => { setShowSolde(true) }}
                    navigation={navigation}
                />
                {/* Deuxième bloc - Slider d'images */}
                <SlideComponent slides={homeDatas.slides} />

                {/* Troisième bloc - Services - Opérations */}
                <OperationServiceComponent navigation={navigation} />

                {/* section stat graph suivie des depenses */}
                {/* <View style={{ marginTop:10 }}>
                    <ExpenseChartLine />
                </View> */}
                <BenefitComponent badges={homeDatas.badges} />



                {/* Cartes */}
                {/* <CardComponent /> */}

                {/* Cinquième bloc - Dernières transactions */}
                {/* <TransactionComponent /> */}
            </ScrollView>
            <PlatinumCard />
            {/* Composant BottomSheet du solde */}
            <SoldeComponent visible={showSolde} onClose={() => setShowSolde(false)} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FB',
    },
    header: {
        backgroundColor: '#3FA9F5',
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
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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

    label: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 10,
        marginBottom: 4,
        textTransform: 'uppercase'
    },
    expiry: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
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
        backgroundColor: '#2CC197', // Vert vif qui contraste bien avec le bleu
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
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E3F5EF',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    statusText: {
        color: '#3FA9F5',
        fontWeight: '600',
        fontSize: 14,
        marginLeft: 4,
    },
});