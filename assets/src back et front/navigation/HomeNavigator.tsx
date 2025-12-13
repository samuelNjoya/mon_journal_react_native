import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import MigrationScreen from '../screens/MigrationScreen';
import PaymentScreen from '../screens/PaymentScreen';
import PaymentSuccessScreen from '../screens/PaymentSuccessScreen';
import SubscriptionManagementScreen from '../screens/TvSubscriptionScreen';
import TVRenewalOrdersScreen from '../screens/TvRenewalsOrdersScreen';
import PaymentScreen1 from '../screens/PayTvPackagesScreen';
import DepositScreen from '../screens/DepositScreen';
import VisaDepositScreen from '../screens/VisaDepositScreen';
import TransactionsScreen from '../screens/TransactionsScreen';
import AccountTransferScreen from '../screens/AccountTransfertScreen';
import NoAccountTransferScreen from '../screens/NoAccountTransferScreen';
import GainsScreen from '../screens/GainsScreen';
import { useTranslation } from '../hooks/useTranslation';

// Types de navigation
export type RootStackParamList = {
    MainTabs: undefined;
    Settings: undefined;
    Language: undefined;
    Currency: undefined;
    Security: undefined;
    Profile: undefined;
};

export type HomeStackParamList = {
    HomeMain: undefined;
    Migration: any;
    Payment: undefined;
    PaymentSuccess: undefined;
    TvSubscription: undefined;
    RenewalOrders: undefined;
    Payment1: any;
    topUpAccount: undefined;
    topUpVisaAVisa: any;
    transactions: any;
    accountTransfert: any;
    nonAccountTransfert: any;
    gains: any;
};

const HomeStack = createStackNavigator<HomeStackParamList>();

// Navigateur des paramètres (Stack)
export const HomeStackNavigator = () => {
    const { t } = useTranslation();

    return (
        <HomeStack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#fcbf00',
                },
                headerTintColor: '#1a171a',
                headerTitleStyle: {
                    fontSize: 13, // 👈 Taille du texte du titre
                    fontFamily: 'Poppins-Bold'
                },
            }}
        >
            <HomeStack.Screen
                name="HomeMain"
                component={HomeScreen}
                options={{
                    title: t.common.home,
                    headerShown: false,
                }}
            />
            <HomeStack.Screen
                name="Migration"
                component={MigrationScreen}
                options={{
                    title: t.homenavigator.benaccs,
                }}
            />
            <HomeStack.Screen
                name="Payment"
                component={PaymentScreen}
                options={{ title: t.homenavigator.paybenacc }}
            />
            <HomeStack.Screen
                name="Payment1"
                component={PaymentScreen1}
                options={{ title: t.homenavigator.paybenacc }}
            />
            <HomeStack.Screen
                name="PaymentSuccess"
                component={PaymentSuccessScreen}
                options={{ headerShown: false }}
            />
            <HomeStack.Screen
                name="TvSubscription"
                component={SubscriptionManagementScreen}
                options={{ title: t.homenavigator.tvpackages }}
            />
            <HomeStack.Screen
                name="RenewalOrders"
                component={TVRenewalOrdersScreen}
                options={{ title: t.homenavigator.tvorders }}
            />
            <HomeStack.Screen
                name="topUpAccount"
                component={DepositScreen}
                options={{ title: t.homenavigator.deposit }}
            />
            <HomeStack.Screen
                name="topUpVisaAVisa"
                component={VisaDepositScreen}
                options={{ title: t.homenavigator.visadeposit }}
            />
            <HomeStack.Screen
                name="transactions"
                component={TransactionsScreen}
                options={{ title: t.homenavigator.transactions }}
            />
            <HomeStack.Screen
                name="accountTransfert"
                component={AccountTransferScreen}
                options={{ title: t.homenavigator.accountTransfer }}
            />
            <HomeStack.Screen
                name="nonAccountTransfert"
                component={NoAccountTransferScreen}
                options={{ title: t.homenavigator.noAccountTransfer }}
            />
            <HomeStack.Screen
                name="gains"
                component={GainsScreen}
                options={{ title: t.homenavigator.earnings }}
            />
            {/* <SettingsStack.Screen
            name="Security"
            component={SecurityScreen}
            options={{ title: 'Sécurité' }}
        />
        <SettingsStack.Screen
            name="Profile"
            component={ProfilScreen}
            options={{ title: 'Profil' }}
        /> */}
        </HomeStack.Navigator>
    )
};