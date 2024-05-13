import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';

const RegisterScreen = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [cnp, setCnp] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [birthday, setBirthday] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = ({ navigation }) => {
    // Handle the registration logic here
    navigation.navigate('Auth');
  };

  return (
    <View style={styles.container}>
      <TextInput style={styles.input} placeholder="First Name" placeholderTextColor="#bfbfbf" value={firstName} onChangeText={setFirstName} />
      <TextInput style={styles.input} placeholder="Last Name" placeholderTextColor="#bfbfbf" value={lastName} onChangeText={setLastName} />
      <TextInput style={styles.input} placeholder="CNP" placeholderTextColor="#bfbfbf" value={cnp} onChangeText={setCnp} />
      <TextInput style={styles.input} placeholder="Username" placeholderTextColor="#bfbfbf" value={username} onChangeText={setUsername} />
      <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#bfbfbf" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Birthday" placeholderTextColor="#bfbfbf" value={birthday} onChangeText={setBirthday} />
      <TextInput style={styles.input} placeholder="Phone" placeholderTextColor="#bfbfbf" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
      <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#bfbfbf" value={password} onChangeText={setPassword} secureTextEntry />
      <TouchableOpacity
          style={styles.button}
          onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    marginBottom: 12,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    color: 'red',
    color: '#333333',
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

export default RegisterScreen;