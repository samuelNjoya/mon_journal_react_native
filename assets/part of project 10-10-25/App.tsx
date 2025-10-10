import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';
import AppLoading from 'expo-app-loading';
import { FontAwesome5, FontAwesome6, Ionicons, MaterialCommunityIcons,} from '@expo/vector-icons';


import ExpenseScreen from './src/screens/ExpenseScreen';
import StatsScreen from './src/screens/StatsScreen';

import { COLORS } from './assets/constants';
import HomeScreen from './src/screens/HomeScreen';
import Assistance from './src/screens/Assistance';
import { ExpenseProvider } from './contexts/ExpenseContext';



const Tab = createBottomTabNavigator();

export default function App() {

    // Charge les polices Poppins
  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  // Affiche <AppLoading /> tant que les polices ne sont pas chargées
  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <ExpenseProvider>
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Accueil"
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: COLORS.yellow_color,
          tabBarInactiveTintColor: COLORS.textSecondary,
          tabBarStyle: { backgroundColor: COLORS.white },
          tabBarIcon: ({ color, size }) => {
          //  let iconName;
            let iconName: keyof typeof Ionicons.glyphMap; //uniquement pour mes icones valides pour cette famille

            if (route.name === 'Accueil') {
              iconName = 'home-outline';
              return <Ionicons name={iconName} size={size} color={color} />;
            } else if (route.name === 'Mes gains') {
            //  iconName = 'chart-line';
             // size = 24;
              return <FontAwesome6 name='chart-line' size={size} color={color} />;
             } else if (route.name === 'Dépenses') {
              iconName = 'wallet-outline';
              return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
             } else if (route.name === 'Assistance') {
              iconName = 'headset';
              return<FontAwesome5 name={iconName} size={size} color={color} />;
             } else if (route.name === 'Paramètres') {
              iconName = 'settings-sharp';
              return<Ionicons name={iconName} size={size} color={color} />;
            } else if (route.name === 'Stats') {
            //  iconName = 'chart-box-outline';
              return <MaterialCommunityIcons name={"chart-box-outline" as keyof typeof MaterialCommunityIcons.glyphMap} size={size} color={color} />;
            }

            return null;
          }
        })}
      >
      
        <Tab.Screen name="Accueil" component={HomeScreen} />
        <Tab.Screen name="Mes gains" component={Assistance} />
        <Tab.Screen name="Dépenses" component={ExpenseScreen} />
        <Tab.Screen name="Assistance" component={Assistance}  />
        {/* <Tab.Screen name="Stats" component={StatsScreen} /> */}
        <Tab.Screen name="Paramètres" component={Assistance} />
       
        {/* <Tab.Screen name="Stats" component={StatsScreen} options={{ 
        tabBarIcon: ({ color, size }) => ( 
          <MaterialCommunityIcons name="chart-box-outline" size={size} color={color} />
        ),
      }} /> */}
      </Tab.Navigator>
    </NavigationContainer>
    </ExpenseProvider>
  );
}
