import React, { useEffect, useState } from 'react';
import {
  Alert,
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import NavigationDrawer from '../components/NavigationDrawer';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS } from '../styles/colors';
import { getDriverBikes } from '../api/auth';

const MainScreenDriver = ( {navigation} ) => { // TODO: rename this to DriverMainScreen
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBikes();
    Alert.alert("On driver screen", "driver screen");
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

  const fetchBikes = async () => {
    try {
      const response = await getDriverBikes();
      setBikes(response);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch bikes.');
    } finally {
      setLoading(false);
    }
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleAddBike = () => {
    navigation.navigate('AddBikeScreen');
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.bikeItem}>
      <Text style={styles.bikeText}>{index + 1}. {item.brand}</Text>
      <Text style={styles.bikeText}>{item.model}</Text>
      <Text style={styles.bikeText}>{item.color}</Text>
      <Text style={styles.bikeText}>{item.year}</Text>
      <Text style={styles.bikeText}>{item.description}</Text>
      <Text style={styles.bikeText}>{item.is_available ? "Available" : "Not Available"}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator style={styles.activityIndicator} size="large" color="#0000ff" />
      ) : bikes.length === 0 ? (
        <View style={styles.noBikesContainer}>
          <Text style={styles.noBikesText}>No bikes present. Add one right now!</Text>
        </View>
      ) : (
        <FlatList
          style={styles.bikeList}
          data={bikes}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
      <View style={styles.addButtonContainer}>
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
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noBikesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noBikesText: {
    fontSize: 18,
    color: 'gray',
  },
  bikeList: {
    marginTop: 70,
  },
  bikeItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
  },
  bikeText: {
    fontSize: 16,
    color: 'black',
  },
  addButtonContainer: {
    position: 'absolute',
    bottom: 20,
    left: Dimensions.get('window').width / 2 - 50,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
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
});

export default MainScreenDriver;
