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
import { useTranslation } from '../../hooks/useTranslation';
import { ListRenderItem } from 'react-native'

interface Operation {
    id: number
    title: string
    image?: string
    color?: string
    navigation: string;
}
interface Service {
    id: number
    title: string
    image?: string
    color?: string
    navigate: string;
}

export default function OperationServiceComponent({ navigation }: any) {
    const { t } = useTranslation();
    // Services disponibles
    const operations = [
        { id: 1, title: t.operations.accountTransfer, image: "transfert", color: "#2A4D8E", navigation: "accountTransfert" },
        { id: 2, title: t.operations.noAccountTransfer, image: "transfert_non_abonne", color: "#2A4D8E", navigation: "nonAccountTransfert" },
        { id: 3, title: t.operations.deposit, image: "recharge_compte", color: "#4CD964", navigation: "topUpAccount" },
        { id: 4, title: t.operations.myBalance, image: 'solde', color: "#FF9500", navigation: "" },
        { id: 5, title: t.operations.myTransactions, image: 'transactions', color: "#FF9500", navigation: "" },
        { id: 6, title: t.operations.visaDeposit, image: 'carte_visa', color: "#FF9500", navigation: "topUpVisaAVisa" },
    ];
    const serviceImages: any = {
        virement: require('../../../assets/canalplus.png'),
    };

    const operationImages: any = {
        transfert: require('../../../assets/operations/transfert.png'),
        transfert_non_abonne: require('../../../assets/operations/transfert_non_abonne.png'),
        recharge_compte: require('../../../assets/operations/recharger_compte.png'),
        solde: require('../../../assets/operations/solde.png'),
        transactions: require('../../../assets/operations/transactions.png'),
        carte_visa: require('../../../assets/operations/recharge_carte_visa.png'),
    };

    // Opérations possibles
    const services = [
        { id: 1, title: t.operations.payCanalBill, image: "virement", navigate: 'TvSubscription' },
    ];

    const formatBalance = (amount: number) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'XAF'
        }).format(amount);
    };



    const renderService: ListRenderItem<Service> = ({ item }) => (
        <TouchableOpacity style={styles.serviceItem}
            onPress={() => {
                navigation.navigate('TvSubscription')
            }}
        >
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
    const renderOperation: ListRenderItem<Operation> = ({ item }) => (
        <TouchableOpacity
            onPress={() => {
                navigation.navigate(item.navigation)
            }}
            style={styles.serviceItem}>
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

    return (
        <View style={styles.section}>
            <View style={styles.grid}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>{t.title.services}</Text>
                    {/* <TouchableOpacity>
                        <Text style={styles.seeAll}>Tout voir</Text>
                    </TouchableOpacity> */}
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
                    <Text style={styles.sectionTitle}>{t.title.operations}</Text>
                    {/* <TouchableOpacity>
                        <Text style={styles.seeAll}>Tout voir</Text>
                    </TouchableOpacity> */}
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
    );
}

const styles = StyleSheet.create({
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
    servicesGrid: {
        padding: 5,
    },
    serviceItem: {
        flex: 1,
        alignItems: 'center',
        margin: 8,
        maxWidth: '33%',
    },
    serviceText: {
        fontSize: 8,
        textAlign: 'center',
        //color: '#666',
        color: '#1a171a',
        fontFamily: 'Poppins-Regular',
        marginBottom: 10
    },
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
        fontSize: 10,
        fontFamily: 'Poppins-Regular',
        color: '#1a171a',
        // marginBottom: 2,
        textAlign: 'center',
    },
    operationDesc: {
        fontSize: 8,
        fontFamily: 'Poppins-Regular',
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
});