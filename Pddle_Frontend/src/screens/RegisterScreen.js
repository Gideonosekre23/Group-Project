import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import Geolocation from 'react-native-geolocation-service';
import { COLORS } from '../styles/colors';
import { registerUser, registerDriver } from '../api/auth';

const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [cpn, setCpn] = useState('');
  const [age, setAge] = useState('');
  const [phone_number, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isDriver, setIsDriver] = useState(false);

  const handleRegister = async () => {
    if (error) {
      setError('');
    }

    const fields = [
      { name: 'Username', value: username },
      { name: 'Email', value: email },
      { name: 'CNP', value: cpn },
      { name: 'Age', value: age },
      { name: 'Address', value: address },
      { name: 'Phone', value: phone_number },
      { name: 'Password', value: password }
    ];

    const emptyFields = fields.filter(field => field.value === '');

    if (emptyFields.length > 0) {
      const emptyFieldsName = emptyFields.map(field => field.name).join(', ');
      setError(`The following fields are required: ${emptyFieldsName}`);
      return;
    }

    if (cpn.length != 13) {
      setError("Invalid CNP!");
    }

    try {
      if (isDriver)
        {
          let lat, long;
          Geolocation.getCurrentPosition(
            position => {
              const {latitude, longitude} = position.coords;
              lat = latitude;
              long = longitude;
            });
          
          const messageResponse =
            await registerDriver({ username, email, password, phone_number, address, cpn, lat, long })
          console.log("Register driver successfull? Rsp.msg here -> ", messageResponse.message);
          navigation.navigate('Login');
        } else {
          const messageResponse =
            await registerUser({ username, email, password, phone_number, address, cpn })
          console.log("Register user successfull? Rsp.msg here -> ", messageResponse.message);
          navigation.navigate('Login');
        }
    } catch (error) {
      if (error.response) {
        console.log(error.response.data);
        setError(error.response.data.error);
      } else if (error.request) {
        console.log(error.request);
        setError('No response from the server.');
      } else {
        console.log('Error', error.message);
        setError('An error occurred. Please try again.');
      }
    }
  };

  return (
    <View style={styles.container}>
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
        placeholder="Address"
        placeholderTextColor="#bfbfbf"
        value={address}
        onChangeText={setAddress}
      />
      <TextInput
        style={styles.input}
        placeholder="CNP"
        placeholderTextColor="#bfbfbf"
        value={cpn}
        onChangeText={setCpn}
      />
      <TextInput
        style={styles.input}
        placeholder="Age"
        placeholderTextColor="#bfbfbf"
        value={age}
        onChangeText={setAge}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone"
        placeholderTextColor="#bfbfbf"
        value={phone_number}
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
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <View style={styles.checkboxContainer}>
        <CheckBox
          value={isDriver}
          onValueChange={setIsDriver}
          tintColors={{ true: COLORS.primary, false: '#bfbfbf' }}
        />
        <Text style={styles.checkboxLabel}>Register as Driver</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
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
    color: '#333333',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkboxLabel: {
    marginLeft: 8,
    color: '#333333',
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
    color: COLORS.buttonText,
    fontSize: 16,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});

export default RegisterScreen;
