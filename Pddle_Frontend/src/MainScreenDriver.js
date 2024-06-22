import React, { useEffect, useState } from 'react';
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
  Image,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import NavigationDrawer from './components/NavigationDrawer';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS } from './constants/colors';
import { addBikeLocation } from './api/auth'; // Import the function from ./api/auth

const MainScreenDriver = () => {
  const [region, setRegion] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [markerTitle, setMarkerTitle] = useState('');
  const [markers, setMarkers] = useState([]);
  const [selectedCoordinate, setSelectedCoordinate] = useState(null);

  useEffect(() => {
    Alert.alert("On driver screen", "driver screen");
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
        const { latitude, longitude } = position.coords;
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
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  };

  const handleMapPress = (event) => {
    const coordinate = event.nativeEvent.coordinate;
    setSelectedCoordinate(coordinate);
  };

  const handleAddBike = () => {
    if (selectedCoordinate && markerTitle) {
      const newMarker = {
        latitude: selectedCoordinate.latitude,
        longitude: selectedCoordinate.longitude,
        title: markerTitle,
      };
      setMarkers([...markers, newMarker]);
      addBikeLocation(markerTitle, newMarker.latitude, newMarker.longitude);
      setMarkerTitle('');
      setSelectedCoordinate(null);
    } else {
      Alert.alert('Error', 'Please provide a title and select a location on the map.');
    }
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
          onPress={handleMapPress}
        >
          {markers.map((marker, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: marker.latitude,
                longitude: marker.longitude,
              }}
              title={marker.title}
            >
              <Image source={require('../assets/images/Bike-transparent.png')} style={styles.bikeImage} />
            </Marker>
          ))}
          {selectedCoordinate && (
            <Marker
              coordinate={selectedCoordinate}
              title="Selected Location"
            >
              <Image source={require('../assets/images/Bike-transparent.png')} style={styles.bikeImage} />
            </Marker>
          )}
        </MapView>
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
          value={markerTitle}
          onChangeText={setMarkerTitle}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddBike}>
          <Text style={styles.addButtonText}>Add Bike</Text>
        </TouchableOpacity>
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
    height: '80%', // 80% of screen height
  },
  searchBar: {
    height: '20%', // 20% of screen height
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
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
    flex: 1,
  },
  addButton: {
    marginLeft: 10,
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: 'white',
  },
  menuButton: {
    position: 'absolute',
    top: 20,
    left: 10,
    zIndex: 1200,
    backgroundColor: COLORS.primary,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: COLORS.primary,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIcon: {
    color: 'white',
    fontSize: 24,
  },
  bikeImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
});

export default MainScreenDriver;