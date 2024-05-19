// NavigationDrawer.js
import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  Animated,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { logoutUser, getCustomerInfo, updateProfile } from '../api/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NavigationDrawer = ({isOpen, toggleDrawer}) => {
  const drawerWidth = 300;
  const translateX = useRef(new Animated.Value(-drawerWidth)).current;
  const navigation = useNavigation();

  // Animation for sliding in and out
  const animateDrawer = () => {
    Animated.spring(translateX, {
      toValue: isOpen ? 0 : -drawerWidth,
      useNativeDriver: true,
    }).start();
  };

  // Trigger animation when isOpen changes
  React.useEffect(() => {
    animateDrawer();
  }, [isOpen]);

  const goToProfileScreen = () => {
    navigation.navigate('Profile');
    toggleDrawer();
  };

  const goToSettingsScreen = () => {
    navigation.navigate('SettingsScreen');
    toggleDrawer();
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      Alert.alert('Logout Successful', 'You have been logged out.');
      AsyncStorage.removeItem('token');
      navigation.navigate('Login');
      toggleDrawer();
    } catch (error) {
      Alert.alert('Logout Failed', 'An error occurred during logout. Please try again.');
    }
  };

  const handleGetCustomerInfo = async () => {
    try {
      const data = await getCustomerInfo();
      console.log("In handleGetInfo");
      console.log(data);
    } catch (err) {
      Alert(err.message || 'Error fetching customer info');
    }
  };

  const handleUpdate = async () => {
    await updateProfile();
  };

  return (
    <Animated.View style={[styles.drawer, {transform: [{translateX}]}]}>
      <TouchableOpacity
        onPress={goToProfileScreen}
        style={styles.profileIconContainer}>
        <Image
          source={require('../../assets/images/Profile_Picture.png')}
          style={styles.profileIcon}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={goToSettingsScreen}>
        <Text style={styles.option}>Settings</Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Text style={styles.option}>Payment Method</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleLogout}>
        <Text style={styles.option}>Log out</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleUpdate}>
        <Text style={styles.option}>Update profile test</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleGetCustomerInfo}>
        <Text style={styles.option}>Get Customer Info</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  drawer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 300, // Same as drawerWidth
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    zIndex: 1000, // Ensure it overlays other content
  },
  option: {
    fontSize: 18,
    marginBottom: 20,
    color: 'black',
  },
  profileIconContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  profileIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
});

export default NavigationDrawer;
