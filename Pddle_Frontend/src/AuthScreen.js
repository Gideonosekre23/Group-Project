// AuthScreen.js
import React from 'react';
import { View, Text, Button, StyleSheet, Image, TouchableOpacity } from 'react-native';

const AuthScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
            source={require('../assets/images/Logo-transparent.png')}
            style={styles.logo}
          />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    position: 'absolute',
    top: 50,
    width: '100%',
    alignItems: 'center',
  },
  logo: {
    width: 140,  // Logo dimensions
    height: 140,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#11DAAA',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 30,
  },
  button: {
    backgroundColor: '#15ADA4',
    color: 'white',
    paddingHorizontal: 30,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#15ADA4',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
  },
  buttonText: {
    color: 'white', // Set the text color
    fontSize: 16, // Set text size
    fontWeight: 'bold',
  }
});

export default AuthScreen;