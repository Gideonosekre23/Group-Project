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
  Image,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import NavigationDrawer from '../components/NavigationDrawer';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS } from '../styles/colors';
import { getGeocode, getDistanceMatrix } from '../api/geoapi';

const MainScreen = () => {
  const [region, setRegion] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [price, setPrice] = useState(null);
  const [bikes, setBikes] = useState([]);

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
        locateCurrentPosition();
      } else {
        alert('Location permission denied');
      }
    } catch (err) {
      console.warn(err);
      setLoading(false);
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
        setLoading(false);
      },
      error => {
        Alert.alert('Error', error.message);
        setLoading(false);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  // TODO: Change functionality of this function
  const searchLocation = async () => {
    if (searchQuery.trim() === '') {
      Alert.alert('Error', 'Please enter a location to search.');
      return;
    }

    try {
      setLoading(true);
      const geocodeData = await getGeocode(searchQuery);

      if (geocodeData.status === 'OK') {
        const location = geocodeData.results[0].geometry.location;
        setRegion({
          latitude: location.lat,
          longitude: location.lng,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        });

        const origin = `${region.latitude},${region.longitude}`;
        const destination = `${location.lat},${location.lng}`;

        const distanceMatrixData = await getDistanceMatrix(origin, destination);

        if (distanceMatrixData.status === 'OK') {
          const element = distanceMatrixData.rows[0].elements[0];
          const distance_km = element.distance.value / 1000; // distance in km
          const duration_hours = element.duration.value / 3600; // duration in hours

          setDistance(element.distance.text);
          setDuration(element.duration.text);

          // const rideData = await searchForRide({
          //   latitude: region.latitude,
          //   longitude: region.longitude,
          //   distance_km: distance_km,
          //   duration_hours: duration_hours,
          // });

          // if (rideData.available_bikes) {
          //   setBikes(rideData.available_bikes);
          //   setPrice(rideData.price);
          // } else {
          //   Alert.alert('No bikes available', rideData.message);
          // }
        } else {
          Alert.alert('Error', 'Failed to calculate distance and time');
        }
      } else {
        Alert.alert('Error', 'Location not found');
      }
    } catch (error) {
      console.error('Error fetching location:', error);
      Alert.alert('Error', 'Failed to search location. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // TODO: Remove search bar and change the info-container
  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator
          style={styles.activityIndicator}
          size="large"
          color="#0000ff"
        />
      ) : (
        <MapView
          style={styles.map}
          region={region}
          showsUserLocation={true}
          followUserLocation={true}
          zoomEnabled={true}>
          {region && (
            <Marker
              coordinate={{
                latitude: region.latitude,
                longitude: region.longitude,
              }}>
              <Image
                source={require('../assets/images/Bike-transparent.png')}
                style={styles.bikeImage}
              />
            </Marker>
          )}
          {bikes.map((bike, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: bike.latitude,
                longitude: bike.longitude,
              }}
              title={`Bike ${index + 1}`}
              description={`Bike available here`}
            />
          ))}
        </MapView>
      )}
      <View style={styles.searchBar}>
        <TextInput
          placeholder="Search for a location"
          placeholderTextColor="#bfbfbf"
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.searchButton} onPress={searchLocation}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>
      {distance && duration && price && (
        <View style={styles.infoContainer}>
          <Text>Distance: {distance}</Text>
          <Text>Duration: {duration}</Text>
          <Text>Price: ${price}</Text>
        </View>
      )}
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
    height: '100%', // Changed to occupy full height
  },
  searchBar: {
    position: 'absolute',
    bottom: 30,
    width: '90%',
    left: '5%',
    height: 50,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
  activityIndicator: {
    height: '100%',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 0,
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  searchButton: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 5,
  },
  searchButtonText: {
    color: 'white',
    fontWeight: 'bold',
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
  infoContainer: {
    position: 'absolute', // Make it overlay on the map
    bottom: 80, // Above the search bar
    width: '90%',
    left: '5%',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
});

export default MainScreen;