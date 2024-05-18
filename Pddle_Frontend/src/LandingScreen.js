import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { COLORS } from './constants/colors';
import { globalStyles, theme } from './constants/styles';

const LandingScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.imageContainer}
        onPress={() => navigation.navigate('Login')}>
        <Image
          source={require('../assets/images/BackGroundImage.webp')}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
        <Text style={[globalStyles.text, styles.appName]}>Paddle</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.contentContainer}
        onPress={() => navigation.navigate('Login')}>
        <Text style={[globalStyles.text, styles.title]}>
          Get started with Paddle Plus
        </Text>
        <View style={[globalStyles.button, styles.button]}>
          <Text style={[globalStyles.text, styles.buttonText]}>Continue</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    flex: 0.85,
    position: 'relative',
  },
  appName: {
    position: 'absolute',
    top: 20,
    right: 20,
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    zIndex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    flex: 0.15,
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'left',
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 50,
    paddingVertical: 10,
    borderRadius: 6,
    marginTop: 10,
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: COLORS.buttonText,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LandingScreen;