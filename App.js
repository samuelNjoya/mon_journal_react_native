import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Home from './components/Home';
import { transform } from '@babel/core';

const Stack = createStackNavigator();

export default function App() {


  return (
    <NavigationContainer style={styles.container}>
      <StatusBar style="auto" />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyleInterpolator: ({ current, layouts }) =>{
            return {
              cardStyle:{
                  transform:[
                    {
                      translateX:current.progress.interpolate({
                        inputRange:[0,1],
                        outputRange:[layouts.screen.width,0]
                      })
                    }
                  ]
              }
            }
          }
      }}
      >

      <Stack.Screen name='Home' component={Home}></Stack.Screen>
    </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
