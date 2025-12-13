import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    RefreshControl,
    Animated,
    Easing,
    ScrollView,
    ListRenderItem,
    Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { homeService } from '../api/services/home';
import PasswordForm from '../components/Verification';
import ErrorModal from '../components/Notification';
import { formatDate, getStatusColor, getStatusIcon, showBenaccPrice } from '../utils/helpers';
import TransactionDetails from '../components/bottom_sheets/TransactionDetails';
import { useTranslation } from '../hooks/useTranslation';

interface Operation {
    id: string;
    type?: 'payment' | 'transfer' | 'recharge' | 'withdrawal';
    title: string;
    subtitle: string;
    amount: number;
    date: string;
    status: string;
    recipient?: string;
    icon: any;
    color: string;
    code: string;
    commission: number;
    op_amount: number;
    operation: string;
    real_amount: string;
}



const TransactionsScreen = ({ navigation }: any) => {
    const [operations, setOperations] = useState<Operation[]>([]);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [selectedOperation, setSelectedOperation] = useState<string | null>(null);
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [balance, setBalance] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [operationSelected, setOperationSelected] = useState<Operation>()
    const { t, language } = useTranslation();
    // Données mockées
    const icones: any = {
        SOOM_DEPOSIT: require('../../assets/payment_methodes/om.png'),
        SO_DEPOSIT: require('../../assets/payment_methodes/logo_sesampayx.png'),
        SOMTN_DEPOSIT: require('../../assets/payment_methodes/momo.png'),
        SO_APP_CARD: require('../../assets/payment_methodes/momo.png'),
        SO_PYBCANAL: require('../../assets/canalplus3.png'),
        SO_PAYBEN: require('../../assets/platine_card.png'),
        SO_TRSCUST: require('../../assets/operations/transfert.png'),
        SO_TRSNCUST: require('../../assets/operations/transfert_non_abonne.png'),
        SO_WITHDRAW: require('../../assets/operations/recharger_compte.png'),
    };
    const types: any = {
        SOOM_DEPOSIT: 'recharge',
        SO_DEPOSIT: 'recharge',
        SOMTN_DEPOSIT: 'recharge',
        SO_APP_CARD: 'payment',
        SO_PYBCANAL: 'payment',
        SO_PAYBEN: 'payment',
        SO_TRSCUST: 'transfert',
        SO_TRSNCUST: 'transfert',
        SO_WITHDRAW: 'withdrawal',
    }


    const handlePassword = (password: string) => {
        setPassword(password)
        loadOperations(password)
    }

    const loadOperations = async (password: string) => {
        try {
            setRefreshing(true);
            const result = await homeService.transactions({
                password,
            });
            // console.log(result.data.datas[3])
            if (result.success && result.data.status) {
                const transactions: Operation[] = result.data.datas.map((item: any) => {
                    return {
                        title: item.title,
                        type: types[item.ref_operation] || 'payment',
                        subtitle: item.subtitle && item.subtitle !== '' ? item.subtitle : '----',
                        date: item.date,
                        icon: icones[item.ref_operation] || require('../../assets/splash.png'),
                        status: item.status,
                        color: item.status_color,
                        operation: item.ref_operation,
                        code: item.transaction_code,
                        op_amount: item.op_amount,
                        commission: showBenaccPrice(item.op_commission, 1),
                        amount: showBenaccPrice(Math.abs(parseInt(item.amount + "")), 1),
                        real_amount: Math.abs(parseInt(item.amount + "")) + "",
                    }
                })
                setBalance(result.data.balance)
                setOperations(transactions);
                setIsAuthenticated(true)
            } else {
                setErrorMessage(result.data?.err_msg || result.error);
            }
            // setTimeout(() => {
            //     setOperations(mockOperations);
            //     setRefreshing(false);
            // }, 1000);
        } catch (error) {
            setErrorMessage(t.alerts.comError);
        } finally {
            setRefreshing(false);
        }
    };

    // if (!isAuthenticated) {
    //     return <PasswordForm onAction={handlePassword} />
    // }

    const handleRedoOperation = (operation: Operation) => {
        setSelectedOperation(operation.id);
        setOperationSelected(operation)
        // j'utilise ceci pour ajouter les données aux besoins
        switch (operation.operation) {
            case "SOOM_DEPOSIT":
            case "SOMTN_DEPOSIT":
                navigation.navigate('topUpAccount', {
                    prefillData: {
                        amount: operation.real_amount,
                    }
                })
                break;
            case "SO_APP_CARD":
                navigation.navigate('topUpVisaAVisa', {
                    prefillData: {
                        amount: operation.real_amount,
                    }
                })
                break;
            case "SO_PYBCANAL":
                navigation.navigate('TvSubscription')
                break;
            case "SO_PAYBEN":
                navigation.navigate('HomeMain')
                break;
            case "SO_TRSCUST":
                navigation.navigate('accountTransfert', {
                    prefillData: {
                        amount: operation.real_amount,
                    }
                })
                break;
            case "SO_TRSNCUST":
                navigation.navigate('nonAccountTransfert', {
                    prefillData: {
                        amount: operation.real_amount,
                    }
                })
                break;
        }
        // // Simulation du traitement
        // setTimeout(() => {
        //     Alert.alert('Succès', `Opération "${operation.title}" relancée avec succès !`);
        //     setSelectedOperation(null);
        // }, 1500);
    };



    const OperationCard = React.memo(({ item }: { item: Operation }) => {
        const scaleAnim = useRef(new Animated.Value(1)).current

        const handlePressIn = useCallback(() => {
            Animated.timing(scaleAnim, {
                toValue: 0.97,
                duration: 150,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true
            }).start();
        }, []);

        const handlePressOut = useCallback(() => {
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 150,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true
            }).start();
        }, []);

        const showTransactionsDetails = (transaction_code: string) => {
            const operation = operations.find((item: Operation) => item.code === transaction_code)
            if (!operation) {
                setErrorMessage(t.transactions.empty)
                return false
            }
            setOperationSelected(operation)
            setIsVisible(true)
        }

        const isProcessing = selectedOperation === item.code;

        return (
            <Animated.View style={[styles.cardContainer, { transform: [{ scale: scaleAnim }] }]}>

                <LinearGradient
                    colors={['#FFFFFF', '#F8F9FA']}
                    style={styles.card}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    {/* Header de la carte */}
                    <TouchableOpacity
                        style={styles.cardHeader}
                        onPress={() => { showTransactionsDetails(item.code) }}
                    >
                        <View style={styles.iconContainer}>
                            <Image style={{ height: 24, width: 24 }} source={item.icon} />
                            {/* <Ionicons name={item.icon as any} size={24} color={item.color} /> */}
                        </View>

                        <View style={styles.titleContainer}>
                            <Text style={styles.operationTitle}>{item.title}</Text>
                            <Text style={styles.recipientText}>{item.subtitle}</Text>
                        </View>

                        <View style={styles.amountContainer}>
                            <Text style={[
                                styles.amountText,
                                { color: item.type === 'withdrawal' || item.type === 'payment' ? '#F44336' : '#4CAF50' }
                            ]}>
                                {item.type === 'withdrawal' || item.type === 'payment' ? '-' : '+'}{item.amount}
                            </Text>
                        </View>
                    </TouchableOpacity>

                    {/* Footer de la carte */}
                    <View style={styles.cardFooter}>
                        <View style={styles.statusContainer}>
                            <Ionicons
                                name={getStatusIcon(item.status) as any}
                                size={16}
                                color={getStatusColor(item.status)}
                            />
                            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                                {item.status}
                            </Text>
                        </View>

                        <Text style={styles.dateText}>{formatDate(item.date)}</Text>

                        <TouchableOpacity
                            style={[
                                styles.redoButton,
                                isProcessing && styles.redoButtonProcessing
                            ]}
                            onPress={() => handleRedoOperation(item)}
                            onPressIn={handlePressIn}
                            onPressOut={handlePressOut}
                            disabled={isProcessing}
                        >
                            {isProcessing ? (
                                <Ionicons name="refresh" size={16} color="#FFF" style={styles.spinningIcon} />
                            ) : (
                                <Ionicons name="repeat" size={16} color="#FFF" />
                            )}
                            <Text style={styles.redoButtonText}>
                                {isProcessing ? t.fields.proressingTraitment + '...' : t.transactions.remake}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </LinearGradient>
            </Animated.View>
        );
    });

    const renderOperationCard: ListRenderItem<Operation> = ({ item }) => (
        <OperationCard item={item} />
    );

    return (
        !isAuthenticated ? <PasswordForm onAction={handlePassword} isProcessing={refreshing} />
            :
            <>
                <View style={styles.balanceContainer}>
                    <Text style={styles.label}>💰 Solde disponible</Text>
                    <Text style={styles.amount}>
                        {showBenaccPrice(balance, 1)}
                    </Text>
                </View>
                <View style={styles.container}>
                    <TransactionDetails
                        onClose={() => { setIsVisible(false) }}
                        visible={isVisible}
                        operation={operationSelected}
                    />
                    <ErrorModal visible={errorMessage !== ''} type='error' onClose={() => { setErrorMessage('') }} message={errorMessage} />
                    {/* Liste des opérations */}
                    <FlatList
                        data={operations}
                        renderItem={renderOperationCard}
                        keyExtractor={(item) => item.code}
                        contentContainerStyle={styles.listContent}
                        initialNumToRender={10}
                        maxToRenderPerBatch={10}
                        windowSize={5}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={() => { loadOperations(password) }}
                                colors={['#667eea']}
                                tintColor="#667eea"
                            />
                        }
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Ionicons name="list" size={64} color="#DDD" />
                                <Text style={styles.emptyText}>{t.transactions.empty}</Text>
                                <Text style={styles.emptySubtext}>
                                    {t.transactions.here}
                                </Text>
                            </View>
                        }
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            </>


    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    header: {
        padding: 24,
        paddingTop: 60,
        paddingBottom: 30,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        marginBottom: 8
    },
    headerSubtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center'
    },
    listContent: {
        padding: 10,
        paddingBottom: 40
    },
    cardContainer: {
        marginBottom: 6,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 3
    },
    card: {
        borderRadius: 20,
        padding: 7,
        borderWidth: 1,
        borderColor: '#F0F0F0'
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 3
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10
    },
    titleContainer: {
        flex: 1
    },
    operationTitle: {
        fontSize: 12,
        fontFamily: 'Poppins-Bold',
        color: '#2D3748',
        marginBottom: 2
    },
    recipientText: {
        fontSize: 10,
        fontFamily: 'Poppins-Regular',
        color: '#718096'
    },
    amountContainer: {
        alignItems: 'flex-end'
    },
    amountText: {
        fontSize: 12,
        fontFamily: 'Poppins-Bold',
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap'
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 12
    },
    statusText: {
        fontSize: 14,
        fontWeight: '500',
        marginLeft: 6
    },
    dateText: {
        fontSize: 12,
        color: '#A0AEC0',
        flex: 1,
        marginRight: 12,
        fontFamily: 'Poppins-Regular',
    },
    redoButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fcbf00',
        paddingHorizontal: 16,
        paddingVertical: 5,
        borderRadius: 20,
        minWidth: 100,
        justifyContent: 'center'
    },
    redoButtonProcessing: {
        backgroundColor: '#4ECDC4'
    },
    redoButtonText: {
        color: 'white',
        fontWeight: '600',
        fontFamily: 'Poppins-Regular',
        fontSize: 11,
        marginLeft: 6
    },
    spinningIcon: {
        transform: [{ rotate: '360deg' }]
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
        marginTop: 50
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#A0AEC0',
        marginTop: 16,
        marginBottom: 8
    },
    emptySubtext: {
        fontSize: 14,
        color: '#CBD5E0',
        textAlign: 'center'
    },
    balanceContainer: {
        backgroundColor: '#F5F7FA',
        padding: 10,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        elevation: 3,
        margin: 20,
    },
    label: {
        fontSize: 14,
        color: '#555',
        marginBottom: 8,
    },
    amount: {
        fontSize: 16,
        fontFamily: 'Poppins-Bold',
        color: '#1A1F71', // Bleu Visa
    },
});

export default TransactionsScreen;