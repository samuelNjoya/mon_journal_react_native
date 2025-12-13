import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuthAuthContext } from '../context/auth/AuthContext';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import WelcomeScreen from '../screens/WelcomeScreen';
import LanguageScreen from '../screens/LanguageScreen';
import LoadingScreen from '../components/LoadingScreen';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import SignupScreen from '../screens/SignupScreen';

export type RootStackParamList = {
    Welcome: undefined;
    Language: undefined;
    Auth: undefined;
    Main: undefined;
    Login: undefined;
    Signup: undefined;
    Home: undefined;
    PaymentSuccess: undefined;
    Assistance: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
    const { authState } = useAuthAuthContext();

    if (authState.isLoading) {
        return <LoadingScreen />;
    }

    // Détermine l'écran initial basé sur l'état
    const getInitialRouteName = () => {
        if (authState.isFirstLaunch) return 'Language';
        if (!authState.isOnboardingCompleted) return 'Welcome';
        if (authState.user) return 'Main';
        return 'Auth';
    };

    return (
        // <NavigationContainer>
        //     <Stack.Navigator
        //         initialRouteName={getInitialRouteName()}
        //         screenOptions={{
        //             headerShown: false,
        //         }}
        //     >
        //         <Stack.Screen name="Language" component={LanguageScreen} />
        //         <Stack.Screen name="Welcome" component={WelcomeScreen} />
        //         <Stack.Screen name="Auth" component={AuthNavigator} />
        //         <Stack.Screen name="Main" component={MainNavigator} />

        //         {/* Ajoutez aussi les écrans individuels pour les accès directs */}
        //         <Stack.Screen name="Login" component={AuthNavigator} />
        //         <Stack.Screen name="Signup" component={AuthNavigator} />
        //     </Stack.Navigator>
        // </NavigationContainer>
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {authState.isFirstLaunch ? (
                    <>
                        <Stack.Screen name="Language" component={LanguageScreen} />
                        <Stack.Screen name="Welcome" component={WelcomeScreen} />
                        <Stack.Screen name="Login" component={LoginScreen} />
                        <Stack.Screen name="Signup" component={SignupScreen} />
                    </>
                ) : authState.user ? (
                    <Stack.Screen name="Main" component={MainNavigator} />
                ) : (
                    <>
                        <Stack.Screen name="Auth" component={AuthNavigator} />
                        {/* <Stack.Screen name="Signup" component={SignupScreen} /> */}
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;