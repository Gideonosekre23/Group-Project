import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import { COLORS } from '../styles/colors';

const ProfileScreen = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/Profile_Picture.png')}
        style={styles.profilePicture}
      />
      <Text style={styles.name}>John Doe</Text>
      <Text style={styles.email}>john.doe@example.com</Text>
      <Text style={styles.phoneNumber}>+40735378594</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profilePicture: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  email: {
    fontSize: 18,
    color: COLORS.text,
    marginBottom: 20,
  },
});

export default ProfileScreen;
