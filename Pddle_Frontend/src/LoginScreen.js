import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { COLORS } from './constants/colors';
import { scheduleTokenDeletion, loginUser } from './api/auth';

const LoginScreen = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (error) {
      setError('');
    }

    if (!username || !password) {
      setError('Please enter both email and password');
      return;
    }

    try {
      await loginUser({ username, password });
      console.log("Login Successful with username: " + username + "password: " + password);
      navigation.navigate('MainScreen');
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
        autoCapitalize="words"
        textContentType="username"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#bfbfbf"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
        textContentType="password"
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <View style={styles.loginButtonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <Text style={styles.registerText} onPress={() => navigation.navigate('Register')}>Don't have an account? Register here!</Text>
      </View>
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
  loginButtonContainer: {
    
  },
  registerText: {
    color: COLORS.text,
    fontSize: 14,
    marginTop: 6,
    textDecorationLine: 'underline',
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

export default LoginScreen;
