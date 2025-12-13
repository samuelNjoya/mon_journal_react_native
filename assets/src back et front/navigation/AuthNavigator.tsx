import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import { RootStackParamList } from './AppNavigator';
import { useTranslation } from '../hooks/useTranslation';

const AuthStack = createStackNavigator<RootStackParamList>();

const AuthNavigator: React.FC = () => {
    const { t } = useTranslation();
    return (
        <AuthStack.Navigator
            screenOptions={{
                headerShown: false,
                gestureEnabled: true,
            }}
            initialRouteName="Login"
        >
            <AuthStack.Screen
                name="Login"
                component={LoginScreen}
                options={{
                    title: t.auth.Login,
                    animationTypeForReplace: 'pop'
                }}
            />
            <AuthStack.Screen name="Signup" component={SignupScreen} />
        </AuthStack.Navigator>
    );
};

export default AuthNavigator;