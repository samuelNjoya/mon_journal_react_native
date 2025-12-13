import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AssistanceScreen from '../screens/assistance/AssistanceScreen';
import TicketListScreen from '../screens/assistance/TicketListScreen';
import AnnouncementsScreen from '../screens/assistance/AnnouncementsScreen';
import FAQScreen from '../screens/assistance/FAQScreen';
import AnnouncementDetailScreen from '../screens/assistance/AnnouncementDetailScreen';
import TicketDetailScreen from '../screens/assistance/TicketMessagesScreen';
import CreateTicketScreen from '../screens/assistance/CreateTicketScreen';
import AgenciesScreen from '../screens/assistance/LocalisationScreen';

export type AssistanceStackParamList = {
    AssistanceMain: undefined;
    TicketList: undefined;
    Announcements: undefined;
    AnnouncementDetail: { announcement: any };
    FAQ: undefined;
    ticketDetail: any;
    createTicket: undefined;
    pointsOfSales: any
};

const Stack = createStackNavigator<AssistanceStackParamList>();

const AssistanceNavigator: React.FC = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#fcbf00',
                    shadowColor: 'transparent',
                    elevation: 0,
                },
                headerTintColor: '#1a171a',
                headerTitleStyle: {
                    fontFamily: 'Poppins-SemiBold',
                    fontSize: 18,
                },
                // headerBackTitleVisible: false,
                cardStyle: {
                    backgroundColor: '#F8F9FA',
                },
            }}
        >
            <Stack.Screen
                name="AssistanceMain"
                component={AssistanceScreen}
                options={{
                    title: 'Assistance',
                    headerShown: true,
                }}
            />
            <Stack.Screen
                name="TicketList"
                component={TicketListScreen}
                options={{
                    title: 'Mes Tickets',
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="Announcements"
                component={AnnouncementsScreen}
                options={{
                    title: 'Annonces',
                }}
            />
            <Stack.Screen
                name="AnnouncementDetail"
                component={AnnouncementDetailScreen}
                options={{
                    title: 'Détails de l\'annonce',

                }}
            />
            <Stack.Screen
                name="ticketDetail"
                component={TicketDetailScreen}
                options={{
                    title: 'Détails du ticket',
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="createTicket"
                component={CreateTicketScreen}
                options={{
                    title: 'Détails du ticket',
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="FAQ"
                component={FAQScreen}
                options={{
                    title: 'Foire aux Questions',
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="pointsOfSales"
                component={AgenciesScreen}
                options={{
                    title: 'Foire aux Questions',
                    headerShown: false,
                }}
            />
        </Stack.Navigator>
    );
};

export default AssistanceNavigator;