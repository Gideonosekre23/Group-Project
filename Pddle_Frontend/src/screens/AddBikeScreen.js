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
  Image,
  Animated,
  Easing,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import { COLORS } from '../styles/colors';
import { addBike } from '../api/auth';

const AddBikeScreen = ({ navigation }) => {
  const [region, setRegion] = useState(null);
  const [markerTitle, setMarkerTitle] = useState('');
  const [selectedCoordinate, setSelectedCoordinate] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const slideAnim = useState(new Animated.Value(Dimensions.get('window').height))[0];

  useEffect(() => {
    if (Platform.OS === 'android') {
      requestLocationPermission();
    } else {
      locateCurrentPosition();
    }
  }, []);

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

  const toggleDrawer = () => {
    if (drawerVisible) {
      Animated.timing(slideAnim, {
        toValue: Dimensions.get('window').height,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start(() => setDrawerVisible(false));
    } else {
      setDrawerVisible(true);
      Animated.timing(slideAnim, {
        toValue: Dimensions.get('window').height * 0.3,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleAddBike = async () => {
    if (selectedCoordinate && markerTitle) {
      const newBike = {
        brand: 'Brand Placeholder',
        model: 'Model Placeholder',
        color: 'Color Placeholder',
        size: 'Size Placeholder',
        year: new Date().getFullYear(),
        description: 'Description Placeholder',
        latitude: selectedCoordinate.latitude,
        longitude: selectedCoordinate.longitude,
      };

      try {
        const response = await addBike(newBike);
        if (response.status === 201) {
          Alert.alert('Success', 'Bike added successfully');
          navigation.goBack();
        } else {
          Alert.alert('Error', 'Failed to add bike');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to add bike');
      }
    } else {
      Alert.alert('Error', 'Please provide a name and select a location on the map.');
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
      <TouchableOpacity style={styles.drawerToggle} onPress={toggleDrawer}>
        <Text style={styles.drawerToggleText}>↑</Text>
      </TouchableOpacity>
      {drawerVisible && ( // TODO: Separate into separate component
        <Animated.View style={[styles.drawer, { transform: [{ translateY: slideAnim }] }]}>
          <TextInput
            placeholder="Enter bike name"
            style={styles.input}
            value={markerTitle}
            onChangeText={setMarkerTitle}
          />
          <TouchableOpacity style={styles.createButton} onPress={handleAddBike}>
            <Text style={styles.createButtonText}>Create Bike</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: '100%', // Full screen height
  },
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  drawerToggle: {
    position: 'absolute',
    bottom: 20,
    left: Dimensions.get('window').width / 2 - 20,
    zIndex: 1000,
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  drawerToggleText: {
    color: 'white',
    fontSize: 24,
  },
  drawer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '70%',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    width: '100%',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  createButton: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  createButtonText: {
    color: 'white',
    fontSize: 18,
  },
  bikeImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
});

export default AddBikeScreen;
