import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import { NavigationContainer } from '@react-navigation/native';
import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import { useTranslation } from '../hooks/useTranslation';
import SettingsScreen from '../screens/SettingsScreen';
//import ProfileScreen from '../screens/ProfileScreen';
import LanguageScreen from '../screens/settings/LanguageScreen';
import CurrencyScreen from '../screens/settings/CurrencyScreen';
import SecurityScreen from '../screens/settings/SecurityScreen';
import ProfilScreen from '../screens/settings/ProfilScreen';
import AssistanceScreen from '../screens/AssistanceScreen';
import { HomeStackNavigator } from './HomeNavigator';
import AssistanceNavigator from './AssistanceNavigator';
import BenefitScreen from '../screens/settings/BenefitScreen';
import ShareAppScreen from '../screens/settings/ShareAppScreen';
import TutoScreen from '../screens/settings/TutoScreen';
import ExpenseScreen from '../screens/ExpenseScreen';
import { ExpenseProvider } from '../context/ExpenseContext';
import { TransCatProvider } from '../context/TransacACategoriserContext';
import { BudgetProvider } from '../context/BudgetsContext';

// Types de navigation
export type RootStackParamList = {
    MainTabs: undefined;
    Settings: undefined;
    Language: undefined;
    Currency: undefined;
    Security: undefined;
    Profile: undefined;
};

export type SettingsStackParamList = {
    SettingsMain: undefined;
    Language: undefined;
    Currency: undefined;
    Security: undefined;
    Profile: undefined;
    benefit: undefined;
    Share: undefined;
    Tuto: undefined;
};

export type TabParamList = {
    HomeStack: undefined;
    Transactions: undefined;
    Cards: undefined;
    Assistance: undefined;
    Dépenses: undefined;
    SettingsStack: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();
const SettingsStack = createStackNavigator<SettingsStackParamList>();
const RootStack = createStackNavigator<RootStackParamList>();

// Navigateur des paramètres (Stack)
const SettingsStackNavigator = () => {
    const { t, language } = useTranslation();
    return (
        <SettingsStack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#fcbf00',
                },
                headerTintColor: '#1a171a',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
                // cardStyle: {
                //     backgroundColor: '#fff3c2',
                // },
            }}
        >
            <SettingsStack.Screen
                name="SettingsMain"
                component={SettingsScreen}
                options={{ title: 'Paramètres' }}
            />
            <SettingsStack.Screen
                name="Language"
                component={LanguageScreen}
                options={{ title: t.language.value }}
            />
            <SettingsStack.Screen
                name="Currency"
                component={CurrencyScreen}
                options={{ title: 'Devise' }}
            />
            <SettingsStack.Screen
                name="Security"
                component={SecurityScreen}
                options={{ title: 'Sécurité' }}
            />
            <SettingsStack.Screen
                name="Profile"
                component={ProfilScreen}
                options={{ title: t.profil.value }}
            />
            <SettingsStack.Screen
                name="benefit"
                component={BenefitScreen}
                options={{ title: t.migrations.benefitAccount }}
            />
            <SettingsStack.Screen
                name="Tuto"
                component={TutoScreen}
                options={{ title: "Tutoriel" }}
            />
        </SettingsStack.Navigator>
    )
}

const MainNavigator: React.FC = () => {
    const { t } = useTranslation();
    return (

        <ExpenseProvider>
            <TransCatProvider>
                <BudgetProvider>
                    <Tab.Navigator
                        screenOptions={({ route }) => ({
                            tabBarIcon: ({ color, size }) => {
                                let iconName: any = 'home-outline';
                                if (route.name === 'SettingsStack') iconName = 'settings-outline';
                                if (route.name === 'Dépenses') iconName = 'chart-line';
                                if (route.name === 'Assistance') iconName = 'headset-outline';
                                return <Ionicons name={iconName} size={size + 2} color={color} />;
                            },
                            headerShown: false,
                            // tabBarActiveTintColor: '#007AFF',
                            tabBarInactiveTintColor: 'gray',
                            tabBarActiveTintColor: '#fcbf00',
                            tabBarStyle: {
                                //backgroundColor: '#1a171a',
                                borderTopWidth: 0,
                                paddingBottom: 10,
                            },
                            tabBarLabelStyle: {
                                fontSize: 11,
                                fontFamily: 'Poppins-SemiBold',
                            },
                            headerStyle: {
                                backgroundColor: '#fcbf00',
                            },
                            headerTintColor: '#1a171a',
                            headerTitleStyle: {
                                fontFamily: 'Poppins-SemiBold',
                            },
                        })}
                    >
                        <Tab.Screen name="HomeStack" component={HomeStackNavigator}
                            options={{
                                title: t.common.home,
                                headerShown: false,
                            }}
                        />

                        <Tab.Screen
                            name="Dépenses"
                            component={ExpenseScreen}
                            options={{
                                title: t.expense.title,
                                tabBarIcon: ({ color, size }) => (
                                    
                                    // <FontAwesome6 name='chart-line' size={size} color={color} />;
                                    <Ionicons name="wallet-outline" size={size} color={color} />
                                ),
                            }}
                        />

                        <Tab.Screen
                            name="Assistance"
                            component={AssistanceNavigator}
                            options={{
                                tabBarIcon: ({ color, size }) => (
                                    <Ionicons name="headset" size={size} color={color} />
                                ),
                            }}
                        />

                        {/* <Tab.Screen
                name="Assistance"
                component={AssistanceScreen}
                options={{
                    title: t.homenavigator.assistance,
                }}
            /> */}

                        <Tab.Screen
                            name="SettingsStack"
                            component={SettingsStackNavigator}
                            options={{
                                title: t.homenavigator.settings,
                                headerShown: false,
                            }}
                        />
                    </Tab.Navigator>
                </BudgetProvider>
            </TransCatProvider>
        </ExpenseProvider>
    );
};

export default MainNavigator;