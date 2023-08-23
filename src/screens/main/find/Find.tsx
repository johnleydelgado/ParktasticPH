/* eslint-disable @typescript-eslint/no-unused-vars */
//import liraries
import {colors} from '@common/constant/colors';
import {Button, HStack, IconButton, Text, VStack} from 'native-base';
import React, {useEffect, useRef, useState} from 'react';
import {Searchbar} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5';
import FilterModal from './components/modal/FilterModal';
import {modalName} from '@common/constant/modal';
import {useAppDispatch, useAppSelector} from '@/hooks/reduxHooks';
import FadeInView from '@/common/components/FadeInView';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {GOOGLE_PLACES_AUTOCOMPLETE_KEY} from '@env';
import ParkingListModal from './components/modal/ParkingListModal';
import {TabMainNavigationProp} from '@/navigators/DashboardNavigator';
import ParkingBookingModal from './components/modal/ParkingBooking';
import {
  openModal,
  setOpenParkingBooking,
  setSearchLocLatLang,
} from '@/redux/nonPersistState';
import MapView, {Marker, Polyline} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import MapViewDirections from 'react-native-maps-directions';
import {Platform} from 'react-native';
import {PERMISSIONS, RESULTS, check, request} from 'react-native-permissions';
import {useFocusEffect} from '@react-navigation/native';
import {ALERT_TYPE, Dialog} from 'react-native-alert-notification';
// create a component
const Find = ({navigation}: {navigation: TabMainNavigationProp}) => {
  const dispatch = useAppDispatch();
  const {selectedVehicle} = useAppSelector(state => state.common);
  const googlePlacesRef = useRef<any>(null);

  const openFilter = () => {
    dispatch(openModal(modalName.OPEN_FILTER));
  };

  const openModalParkingBookingList = ({lat, lng}: {lat: any; lng: any}) => {
    dispatch(setSearchLocLatLang({lat, lng}));
    dispatch(openModal(modalName.BOOK_PARKING_LIST));
  };

  const openModalParkingBooking = () => {
    dispatch(setOpenParkingBooking(true));
  };

  const [initialRegion, setInitialRegion] = useState({
    latitude: 14.61134584548066,
    longitude: 120.99919913113298,
  });

  useEffect(() => {
    const askPermission = async () => {
      let permission;

      if (Platform.OS === 'android') {
        permission = PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
        // Check permission
        const result = await check(permission);

        if (result !== RESULTS.GRANTED) {
          // Request permission
          const newResult = await request(permission);

          if (newResult === RESULTS.GRANTED) {
            Geolocation.getCurrentPosition(
              position => {
                const {latitude, longitude} = position.coords;
                setInitialRegion({
                  latitude,
                  longitude,
                });
              },
              error => {
                console.error('Error getting current location:', error);
              },
              {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
            );
          } else {
            console.log('Permission denied');
          }
        } else {
          Geolocation.getCurrentPosition(
            position => {
              const {latitude, longitude} = position.coords;
              setInitialRegion({
                latitude,
                longitude,
              });
            },
            error => {
              console.error('Error getting current location:', error);
            },
            {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
          );
        }
      }

      if (Platform.OS === 'ios') {
        Geolocation.requestAuthorization('whenInUse').then(result => {
          if (result === 'granted') {
            Geolocation.getCurrentPosition(
              position => {
                const {latitude, longitude} = position.coords;
                setInitialRegion({
                  latitude,
                  longitude,
                });
              },
              error => {
                console.error('Error getting current location:', error);
              },
              {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
            );
          }
        });
      }
    };

    askPermission();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const allKeysEmpty = Object.values(selectedVehicle).every(
        value => value === '',
      );

      if (allKeysEmpty) {
        Dialog.show({
          type: ALERT_TYPE.WARNING,
          title: 'Warning',
          textBody:
            'Before you can use the find features, you`ll need to set up your vehicle first.',
          button: 'Go to profile',
          onHide: () => navigation.navigate('ProfileTabScreen'),
        });
      }
    }, [navigation, selectedVehicle]), // don't forget to include dependencies here
  );

  const destination = {
    latitude: 14.608687615679122,
    longitude: 120.9980544549867,
  };

  return (
    <FadeInView>
      <VStack flex={1} bgColor="white">
        <HStack
          safeAreaTop={12}
          px={4}
          zIndex={22}
          position="absolute"
          top={1}
          justifyContent="space-between"
          space={2}>
          <GooglePlacesAutocomplete
            placeholder="Search"
            ref={googlePlacesRef}
            fetchDetails
            GooglePlacesDetailsQuery={{fields: 'geometry'}}
            textInputProps={{
              placeholderTextColor: 'black',
              clearButtonMode: 'never',
            }}
            renderRightButton={() => (
              <Button
                variant="ghost"
                style={styles.btnSlider}
                onPress={() => openFilter()}>
                <Icon name="sliders-h" color={colors.primary} size={18} />
              </Button>
            )}
            styles={{
              textInputContainer: {
                borderRadius: 42,
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 1,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 32,
                width: '100%',
              },
              textInput: {
                alignItems: 'center',
                paddingHorizontal: 22,
                color: 'black',
              },
              description: {color: 'black'},
            }}
            onPress={(data, details = null) => {
              // 'details' is provided when fetchDetails = true
              const points = details?.geometry.location;
              openModalParkingBookingList({lat: points?.lat, lng: points?.lng});
            }}
            query={{
              key: GOOGLE_PLACES_AUTOCOMPLETE_KEY,
              language: 'en',
            }}
          />
          <IconButton
            style={{position: 'absolute', right: 92, top: 48}}
            onPress={() => googlePlacesRef.current?.setAddressText('')}
            _icon={{
              color: colors.primary,
              size: 'md',
              as: Icon,
              name: 'times',
            }}
          />
          {/* <Button
            variant="ghost"
            style={styles.btnSlider}
            onPress={() => openFilter()}>
            <Icon name="sliders-h" color={colors.primary} size={18} />
          </Button> */}
        </HStack>

        <HStack style={styles.floating} space={2}>
          <Icon name="clock" color={colors.primary} size={18} />
          <Text>Now - 12:00pm</Text>
        </HStack>
        <FilterModal />
        <ParkingListModal closeParkingBookingModal={openModalParkingBooking} />
        {initialRegion && (
          <MapView
            initialRegion={{
              ...initialRegion,
              latitudeDelta: 0.001, // Adjust these values for desired zoom level
              longitudeDelta: 0.001,
            }}
            style={{...StyleSheet.absoluteFillObject, zIndex: 1}}
            showsUserLocation>
            {/* <Marker coordinate={initialRegion} /> */}
            <MapViewDirections
              origin={initialRegion}
              destination={destination}
              apikey={GOOGLE_PLACES_AUTOCOMPLETE_KEY}
              strokeWidth={2}
              strokeColor="green"
              optimizeWaypoints
            />
          </MapView>
        )}
      </VStack>
    </FadeInView>
  );
};

const styles = StyleSheet.create({
  floating: {
    position: 'absolute',
    bottom: 122,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    zIndex: 99,
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: 'white',
    padding: 18,
    paddingHorizontal: 22,
    borderRadius: 22,
    alignItems: 'center',
  },
  btnSlider: {
    borderRadius: 12,
    width: '15%',
    height: 44,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: 'white',
    marginLeft: 14,
  },
  searchBar: {},
});

//make this component available to the app
export default Find;
