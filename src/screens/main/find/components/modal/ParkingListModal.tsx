/* eslint-disable react-hooks/exhaustive-deps */
//import liraries
import {useAppDispatch, useAppSelector} from '@/hooks/reduxHooks';
import {colors} from '@common/constant/colors';
import {modalName} from '@common/constant/modal';
import {Box, HStack, Text, VStack, Image, Spinner} from 'native-base';
import React, {useEffect} from 'react';
import {Dimensions, StyleSheet, TouchableOpacity, View} from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Carousel from 'react-native-reanimated-carousel';
import ParkingDetails from '../ParkingListModalComponent/ParkingDetails';
import {images} from '@/common/constant/images';
import ParkingBookingModal from './ParkingBooking';
import {closeModal, setParkingSpaceData} from '@/redux/nonPersistState';
import {fetchParkingSpaces} from '@/common/api/main';
import {useQuery} from '@tanstack/react-query';
import {isEmpty} from 'lodash';
import {ParkingSpacesProps} from '@/common/schema/main';
import {AlertNotificationRoot} from 'react-native-alert-notification';
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';

// create a component
const ParkingListModal = ({
  closeParkingBookingModal,
}: {
  closeParkingBookingModal: () => void;
}) => {
  const {openModals} = useAppSelector(state => state.nonPersistState);
  const {isOpenParkingBooking} = useAppSelector(state => state.nonPersistState);
  const {searchLocLatLang} = useAppSelector(state => state.nonPersistState);

  const {data, isLoading, isRefetching, refetch} = useQuery<
    ParkingSpacesProps[]
  >({
    queryKey: ['parkingSpaces'],
    queryFn: () => fetchParkingSpaces(searchLocLatLang),
    enabled: false,
  });

  const dispatch = useAppDispatch();
  const {width, height} = Dimensions.get('window');
  const closeFilter = () => {
    dispatch(closeModal(modalName.BOOK_PARKING_LIST));
  };

  const handleParkingBooking = (obj: ParkingSpacesProps | null) => {
    // Handle the gesture event here
    if (obj) {
      closeParkingBookingModal();
      dispatch(setParkingSpaceData(obj));
    }
  };

  useEffect(() => {
    if (openModals.includes(modalName.BOOK_PARKING_LIST)) {
      refetch();
    }
  }, [openModals]);

  const CarouselWithHoc = gestureHandlerRootHOC(() => (
    <Carousel
      loop={false}
      width={width}
      height={height}
      data={data || []}
      scrollAnimationDuration={300}
      onSnapToItem={index => console.log('current index:', index)}
      mode="parallax"
      modeConfig={{
        parallaxScrollingScale: 0.95,
        parallaxScrollingOffset: 55,
      }}
      renderItem={({index}) => (
        <ParkingDetails
          key={index}
          goToParkingBooking={() =>
            handleParkingBooking(data ? data[index] : null)
          }
          parkingData={data && data[index]}
        />
      )}
    />
  ));

  return (
    <View>
      <Modal
        animationIn="fadeInUp"
        isVisible={openModals.includes(modalName.BOOK_PARKING_LIST)}
        style={{margin: 0}}>
        {isOpenParkingBooking ? (
          <AlertNotificationRoot>
            <ParkingBookingModal />
          </AlertNotificationRoot>
        ) : (
          <VStack flex={1} bgColor={colors.bgColor} safeAreaTop={12}>
            <HStack justifyContent="space-between">
              <VStack px={4}>
                <TouchableOpacity
                  style={{paddingBottom: 8}}
                  onPress={closeFilter}>
                  <Icon name="arrow-left" color={colors.textDark} size={26} />
                </TouchableOpacity>
                <Text style={{...styles.fontStyleDefault}} fontSize="3xl">
                  Booking
                </Text>
                <Text
                  style={{...styles.fontStyleDefault, fontSize: 14}}
                  color="dark.500">
                  List of available parking lots
                </Text>
              </VStack>
              <Box style={{position: 'absolute', right: 1}}>
                <Image
                  source={images.myVehicle}
                  style={{
                    width: 154,
                    height: 164,
                  }}
                  resizeMode="contain"
                  alt="img"
                />
              </Box>
            </HStack>
            {isLoading || isRefetching ? (
              <Spinner />
            ) : !isEmpty(data) ? (
              <CarouselWithHoc />
            ) : (
              <VStack
                mt={12}
                justifyContent="center"
                alignItems="center"
                rounded="2xl"
                p={32}
                space={4}>
                <Image source={images.noResult} alt="noresult" h="32" w="32" />
                <Text fontWeight="bold" w="48" textAlign="center">
                  There is no parking lot available nearby this location.
                </Text>
              </VStack>
            )}
          </VStack>
        )}
      </Modal>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  fontStyleDefault: {
    fontWeight: '600',
    fontFamily: 'OpenSans-Regular',
    fontSize: 20,
  },
});

//make this component available to the app
export default ParkingListModal;
