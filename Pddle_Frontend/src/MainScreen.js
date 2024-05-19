import React, {useEffect, useState} from 'react';
import {
  Alert,
  View,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
  Platform,
  PermissionsAndroid,
  ActivityIndicator,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import MapView from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import NavigationDrawer from './components/NavigationDrawer';
import { useFocusEffect } from '@react-navigation/native';

const MainScreen = () => {
  const [region, setRegion] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'android') {
      requestLocationPermission();
    } else {
      locateCurrentPosition();
    }
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        // You can show an alert to confirm exit
        Alert.alert(
          "Exit App",
          "Are you sure you want to exit?",
          [
            {
              text: "Cancel",
              onPress: () => null,
              style: "cancel"
            },
            { text: "YES", onPress: () => BackHandler.exitApp() }
          ]
        );
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [])
  );

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Access Required',
          message: 'This app needs to access your location',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Locate curr pos');
        locateCurrentPosition();
      } else {
        alert('Location permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const locateCurrentPosition = () => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setRegion({
          latitude,
          longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        });
      },
      error => {
        alert(error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  return (
    <View style={styles.container}>
      {region ? (
        <MapView
          style={styles.map}
          region={region}
          showsUserLocation={true}
          followUserLocation={true}
          zoomEnabled={true}
        />
      ) : (
        <ActivityIndicator
          style={styles.activityIndicator}
          size="large"
          color="#0000ff"
        />
      )}
      <View style={styles.searchBar}>
        <TextInput
          placeholder="Search for a location"
          style={styles.searchInput}
        />
      </View>
      <TouchableOpacity style={styles.menuButton} onPress={toggleDrawer}>
        <Text style={styles.menuIcon}>☰</Text>
      </TouchableOpacity>
      <NavigationDrawer isOpen={drawerOpen} toggleDrawer={toggleDrawer} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: '80%', // 70% of screen height
  },
  searchBar: {
    height: '20%', // 30% of screen height
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
  },
  activityIndicator: {
    height: '80%',
    backgroundColor: '#fff',
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  menuButton: {
    position: 'absolute',
    top: 20,
    left: 10,
    zIndex: 1200, // Ensure it's above the navigation drawer
    backgroundColor: '#dbdbdb',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#dbdbdb',
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIcon: {
    color: 'white',
    fontSize: 24,
  },
});

export default MainScreen;