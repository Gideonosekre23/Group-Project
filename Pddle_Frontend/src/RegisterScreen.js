import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { COLORS } from './constants/colors';
import { getCustomerInfo } from './api/auth';

const RegisterScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [cnp, setCnp] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [birthday, setBirthday] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = ({navigation}) => {
    // Handle the registration logic here
    navigation.navigate('Auth');
  };

  const handleGetCustomerInfo = async () => {
    try {
      const data = await getCustomerInfo();
      console.log("In handleGetInfo");
      console.log(data);
    } catch (err) {
      alert(err.message || 'Error fetching customer info');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="First Name"
        placeholderTextColor="#bfbfbf"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        placeholderTextColor="#bfbfbf"
        value={lastName}
        onChangeText={setLastName}
      />
      <TextInput
        style={styles.input}
        placeholder="CNP"
        placeholderTextColor="#bfbfbf"
        value={cnp}
        onChangeText={setCnp}
      />
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#bfbfbf"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#bfbfbf"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Birthday"
        placeholderTextColor="#bfbfbf"
        value={birthday}
        onChangeText={setBirthday}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone"
        placeholderTextColor="#bfbfbf"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#bfbfbf"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleGetCustomerInfo}>
        <Text style={styles.buttonText}>Get Customer Info</Text>
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
  },
  button: {
    backgroundColor: COLORS.primary,
    color: COLORS.buttonText,
    paddingHorizontal: 30,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
  },
  buttonText: {
    color: COLORS.buttonText, // Set the text color
    fontSize: 16, // Set text size
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
