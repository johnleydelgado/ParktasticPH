/* eslint-disable @typescript-eslint/no-unused-vars */
//import liraries
import {colors} from '@common/constant/colors';
import {
  Actionsheet,
  Box,
  Button,
  HStack,
  IconButton,
  Image,
  Pressable,
  Text,
  VStack,
} from 'native-base';
import React, {useEffect, useRef, useState} from 'react';
import {Badge, Searchbar} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5';
import FilterModal from './components/modal/FilterModal';
import {modalName} from '@common/constant/modal';
import {useAppDispatch, useAppSelector} from '@/hooks/reduxHooks';
import FadeInView from '@/common/components/FadeInView';
import {StyleSheet} from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {GOOGLE_PLACES_AUTOCOMPLETE_KEY} from '@env';
import ParkingListModal from './components/modal/ParkingListModal';
import {TabMainNavigationProp} from '@/navigators/DashboardNavigator';
import Geocoder from 'react-native-geocoding';

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
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Dialog,
} from 'react-native-alert-notification';
import useBookingHistory from '@/hooks/useBookingHistory';
import {isFuture, isToday} from 'date-fns';

import ListOfBookings from './components/carousel/ListOfBookings';
import {STACKS} from '@/common/constant/screens';
import {isEmpty} from 'lodash';
import SelectBookingDate from './components/modal/SelectBookingDate';
// create a component
const Find = ({navigation}: {navigation: TabMainNavigationProp}) => {
  const dispatch = useAppDispatch();
  Geocoder.init(GOOGLE_PLACES_AUTOCOMPLETE_KEY);
  const mapRef = useRef(null);
  const {selectedVehicle} = useAppSelector(state => state.common);
  const {selectedBooking} = useAppSelector(state => state.nonPersistState);

  const {bookingHistory} = useBookingHistory();
  const [destination, setDestination] = useState({latitude: 0, longitude: 0});

  const filteredBookings = bookingHistory.filter(a => {
    if (!isEmpty(a.booking_date)) {
      const bookingDate = a.booking_date?.toDate();
      return isToday(bookingDate) || isFuture(bookingDate);
    } // Convert Firestore Timestamp to JavaScript Date
  });

  const googlePlacesRef = useRef<any>(null);

  const openFilter = () => {
    dispatch(openModal(modalName.OPEN_FILTER));
  };

  const openModalParkingBookingList = ({lat, lng}: {lat: any; lng: any}) => {
    dispatch(setSearchLocLatLang({lat, lng}));
    dispatch(openModal(modalName.BOOKING_DATE));
  };

  const openModalParkingBooking = () => {
    dispatch(setOpenParkingBooking(true));
  };

  const [initialRegion, setInitialRegion] = useState({
    latitude: 14.61134584548066,
    longitude: 120.99919913113298,
  });

  const allKeysEmpty = Object.values(
    selectedVehicle
      ? selectedVehicle
      : {brand: '', licenseNum: '', make: '', modelYear: ''},
  ).every(value => value === '');

  useEffect(() => {
    let watcher: number | null = null;

    const askPermission = async () => {
      let permission;

      if (Platform.OS === 'android') {
        permission = PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
        const result = await check(permission);

        if (result !== RESULTS.GRANTED) {
          const newResult = await request(permission);

          if (newResult === RESULTS.GRANTED) {
            watcher = Geolocation.watchPosition(
              position => {
                const {latitude, longitude} = position.coords;
                console.log('newResult', latitude, longitude);
                setInitialRegion({latitude, longitude});
              },
              error => console.error('Error watching position:', error),
              {enableHighAccuracy: true, distanceFilter: 10, interval: 1000},
            );
          } else {
            console.log('Permission denied');
          }
        } else {
          watcher = Geolocation.watchPosition(
            position => {
              const {latitude, longitude} = position.coords;
              setInitialRegion({latitude, longitude});
            },
            error => console.error('Error watching position:', error),
            {enableHighAccuracy: true, distanceFilter: 10, interval: 1000},
          );
        }
      }

      if (Platform.OS === 'ios') {
        Geolocation.requestAuthorization('whenInUse').then(result => {
          if (result === 'granted') {
            watcher = Geolocation.watchPosition(
              position => {
                const {latitude, longitude} = position.coords;
                setInitialRegion({latitude, longitude});
              },
              error => console.error('Error watching position:', error),
              {enableHighAccuracy: true, distanceFilter: 10, interval: 1000},
            );
          }
        });
      }
    };

    askPermission();

    return () => {
      if (watcher !== null) {
        Geolocation.clearWatch(watcher);
      }
    };
  }, []);

  useEffect(() => {
    const fetchDestination = async () => {
      if (!isEmpty(selectedBooking)) {
        const json = await Geocoder.from(selectedBooking?.address || '');
        const {lat, lng} = json.results[0].geometry.location;
        setDestination({latitude: lat, longitude: lng});
      }
    };

    fetchDestination();
  }, [selectedBooking]);

  useFocusEffect(() => {
    if (allKeysEmpty) {
      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: 'Warning',
        textBody:
          "Before you can use the find features, you'll need to set up your vehicle first.",
        button: 'Go to profile',
        onHide: () => navigation.navigate('ProfileTabScreen'),
      });
      console.log('Focus Effect:', selectedVehicle);
    }
  });

  const getCurrentLocHandler = () => {
    // Animate map to the new region
    //@ts-ignore
    mapRef?.current?.animateToRegion(
      {
        ...initialRegion,
        latitudeDelta: 0.003,
        longitudeDelta: 0.003,
      },
      2000,
    ); // Duration in milliseconds
  };

  return (
    <FadeInView>
      <AlertNotificationRoot>
        <VStack flex={1} bgColor="white">
          <HStack
            safeAreaTop={12}
            px={4}
            zIndex={99}
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
                openModalParkingBookingList({
                  lat: points?.lat,
                  lng: points?.lng,
                });
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
          </HStack>
          <Box
            zIndex={99}
            top={32}
            w="full"
            display="flex"
            alignItems="flex-end">
            <Pressable
              bgColor="white"
              shadow="8"
              p={4}
              rounded="full"
              mr={6}
              w={54}
              onPress={getCurrentLocHandler}
              _pressed={{bgColor: 'gray.100'}}>
              <Icon name="location-arrow" size={22} color={colors.primary} />
            </Pressable>
          </Box>

          <HStack position="absolute" zIndex={99} right={6} bottom={32}>
            <Pressable
              bgColor="white"
              shadow="8"
              p={4}
              rounded="full"
              onPress={() => navigation.navigate(STACKS.BOOKING_LIST_STACK)}
              _pressed={{bgColor: 'gray.100'}}>
              <Icon name="directions" size={22} color={colors.primary} />
              <Badge style={{position: 'absolute', backgroundColor: 'green'}}>
                {filteredBookings.length}
              </Badge>
            </Pressable>
          </HStack>
          <FilterModal />
          <SelectBookingDate />
          <ParkingListModal
            closeParkingBookingModal={openModalParkingBooking}
          />
          {initialRegion && !allKeysEmpty ? (
            <MapView
              region={{
                ...initialRegion,
                latitudeDelta: 0.003, // Adjust these values for desired zoom level
                longitudeDelta: 0.003,
              }}
              ref={mapRef}
              style={{...StyleSheet.absoluteFillObject, zIndex: 1}}
              followsUserLocation
              showsUserLocation={isEmpty(selectedBooking)}>
              {isEmpty(selectedBooking) ? null : (
                <>
                  <Marker coordinate={initialRegion}>
                    <Box>
                      <Image
                        source={{
                          uri: 'https://images.freeimages.com/vhq/images/previews/6e6/turquois-racing-car-top-view-105016.png',
                        }}
                        h="12"
                        w="12"
                        resizeMode="contain"
                        alt="a"
                      />
                    </Box>
                  </Marker>

                  <Marker coordinate={destination} />
                  <MapViewDirections
                    origin={initialRegion}
                    destination={destination}
                    apikey={GOOGLE_PLACES_AUTOCOMPLETE_KEY}
                    strokeWidth={10}
                    strokeColor="green"
                    optimizeWaypoints
                    mode="DRIVING"
                  />
                </>
              )}
            </MapView>
          ) : null}
        </VStack>
      </AlertNotificationRoot>
    </FadeInView>
  );
};

const styles = StyleSheet.create({
  floating: {
    position: 'absolute',
    bottom: 132,
    alignSelf: 'center',
    zIndex: 99,
  },
  floatingNow: {
    // alignSelf: 'center',
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // zIndex: 99,
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
    // elevation: 5,
    // backgroundColor: 'white',
    // padding: 18,
    // paddingHorizontal: 22,
    // borderRadius: 22,
    // alignItems: 'center',
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
