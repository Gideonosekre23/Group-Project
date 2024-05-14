import React, { useState, useRef } from 'react';
import { View, Text, Animated, StyleSheet, TouchableOpacity } from 'react-native';

const NavigationDrawer = ({ isOpen, toggleDrawer }) => {
  const drawerWidth = 300; // Adjust width as needed
  const translateX = useRef(new Animated.Value(-drawerWidth)).current; // Start off-screen

  // Animation for sliding in and out
  const animateDrawer = () => {
    Animated.spring(translateX, {
      toValue: isOpen ? 0 : -drawerWidth,
      useNativeDriver: true
    }).start();
  };

  // Trigger animation when isOpen changes
  React.useEffect(() => {
    animateDrawer();
  }, [isOpen]);

  return (
    <Animated.View style={[styles.drawer, { transform: [{ translateX }] }]}>
      <Text style={styles.option}>Option 1</Text>
      <Text style={styles.option}>Option 2</Text>
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
    zIndex: 1000 // Ensure it overlays other content
  },
  option: {
    fontSize: 18,
    marginBottom: 20,
    color: 'black',
  }
});

export default NavigationDrawer;