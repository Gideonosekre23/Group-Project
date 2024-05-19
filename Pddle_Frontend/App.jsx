import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import {Provider as PaperProvider, DefaultTheme} from 'react-native-paper';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LandingScreen from './src/LandingScreen';
import LoginScreen from './src/LoginScreen';
import RegisterScreen from './src/RegisterScreen';
import MainScreen from './src/MainScreen';
import ProfileScreen from './src/components/ProfileScreen';
import SettingsScreen from './src/components/SettingsScreen';
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
        setInitialRoute("MainScreen");
      } else if (statusCode == 401) {
        AsyncStorage.removeItem('token');
        console.log("Token Invalid");
        setInitialRoute("LandingScreen");
      }
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
              name="Profile"
              component={ProfileScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="SettingsScreen"
              component={SettingsScreen}
              options={{headerShown: false}}
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
