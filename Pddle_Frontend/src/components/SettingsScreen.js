// SettingsScreen.js
import React from 'react';
import {View, Text, StyleSheet, Switch} from 'react-native';

const SettingsScreen = () => {
  const [isDarkModeEnabled, setIsDarkModeEnabled] = React.useState(false);

  const toggleDarkMode = () => {
    setIsDarkModeEnabled(prev => !prev);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Theme Settings</Text>
      <View style={styles.setting}>
        <Text>Dark Mode</Text>
        <Switch
          trackColor={{false: '#767577', true: '#81b0ff'}}
          thumbColor={isDarkModeEnabled ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleDarkMode}
          value={isDarkModeEnabled}
        />
      </View>
      {/* Add other settings here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
});

export default SettingsScreen;
