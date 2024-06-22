import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import {Provider as PaperProvider, DefaultTheme} from 'react-native-paper';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LandingScreen from './src/screens/LandingScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import MainScreen from './src/screens/MainScreen';
import MainScreenDriver from './src/screens/MainScreenDriver';
import ProfileScreen from './src/screens/ProfileScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import AddBikeScreen from './src/screens/AddBikeScreen';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import { checkTokenValidity } from './src/api/auth';
import { navigationRef } from './src/services/NavigationService';

const Stack = createStackNavigator();

const App = () => {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const checkTokenValid = async () => {
      const statusCode = await checkTokenValidity();
      if (!statusCode || statusCode == 500 || statusCode == 404) {
        AsyncStorage.removeItem('token');
        console.log("Error getting status code / token validity");
        setInitialRoute("LandingScreen");
      } else if (statusCode == 200) {
        console.log("Token valid");
        role = await AsyncStorage.getItem('role');

        if (!role){
          setInitialRoute("LandingScreen");
          return;
        }

        console.log(role);
        if (role == 'customer') {
          setInitialRoute("MainScreen");
          return;
        }
        setInitialRoute('MainScreenDriver');
      } else if (statusCode == 401) {
        AsyncStorage.removeItem('token');
        console.log("Token Invalid");
        setInitialRoute("LandingScreen");
      }
      setInitialRoute("LandingScreen");
    }

    checkTokenValid();
  }, []);

  if (!initialRoute) {
    return <ActivityIndicator
            style={styles.activityIndicator}
            size="large"
            color="#0000ff"
          />
  }

  return (
    <GestureHandlerRootView>
      <PaperProvider theme={DefaultTheme}>
        <NavigationContainer ref={navigationRef}>
          <Stack.Navigator initialRouteName={initialRoute}>
            <Stack.Screen
              name="LandingScreen"
              component={LandingScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="MainScreen"
              component={MainScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="MainScreenDriver"
              component={MainScreenDriver}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="SettingsScreen"
              component={SettingsScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="AddBikeScreen"
              component={AddBikeScreen}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  activityIndicator: {
    height: '100%',
    backgroundColor: '#fff', 
  },
});

export default App;
