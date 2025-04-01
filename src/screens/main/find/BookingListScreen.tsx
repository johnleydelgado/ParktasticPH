/* eslint-disable react-hooks/exhaustive-deps */
//import liraries
import React, {useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import ListOfBookings from './components/carousel/ListOfBookings';
import useBookingHistory from '@/hooks/useBookingHistory';
import {
  Center,
  HStack,
  IconButton,
  Image,
  Text,
  VStack,
  View,
} from 'native-base';
import {colors} from '@/common/constant/colors';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {TabMainNavigationProp} from '@/navigators/DashboardNavigator';
import FadeInView from '@/common/components/FadeInView';
import {STACKS} from '@/common/constant/screens';
import {isEmpty} from 'lodash';
import {images} from '@/common/constant/images';
import {isFuture, isToday} from 'date-fns';
import {BookingProps, qrProps} from '@/common/schema/main';
import firestore from '@react-native-firebase/firestore';
import {COLLECTIONS} from '@/common/constant/firestore';

// create a component
const BookingListScreen = ({
  navigation,
}: {
  navigation: TabMainNavigationProp;
}) => {
  const {data: bookingHistory} = useBookingHistory();

  const [selectedQr, setSelectedQr] = useState<qrProps>();
  const [filteredBookings, setFilteredBookings] = useState<BookingProps[]>([]);

  useEffect(() => {
    if (bookingHistory) {
      const getFilteredBookings = async () => {
        const bookingChecks = await Promise.all(
          bookingHistory?.map(async booking => {
            const querySnapshot = await firestore()
              .collection(COLLECTIONS.BOOKING_LOGS)
              .where('bookingId', '==', booking.qr_code.bookingId)
              .get();

            const bookingLogs = querySnapshot.docs.map(doc => doc.data());
            const bookingDate = booking.booking_date?.toDate();

            return (
              !bookingLogs[0]?.timeOutLog &&
              (isFuture(bookingDate) || isToday(bookingDate))
            );
          }),
        );

        const filtered = bookingHistory?.filter(
          (_, index) => bookingChecks[index],
        );
        setFilteredBookings(filtered);
      };
      getFilteredBookings();
    }
  }, [bookingHistory]);

  useEffect(() => {
    setSelectedQr({
      qrCode: '',
      email: '',
      bookingId: '',
      lotId: '',
      address: '',
      parkingSpaceId: '',
      parkingLotId: '',
      booking_date: null,
    });
  }, []);

  useEffect(() => {
    if (selectedQr?.qrCode) {
      navigation.navigate(STACKS.QR_STACK, {
        qr: {
          qrCode: selectedQr.qrCode,
          email: selectedQr.email,
          bookingId: selectedQr.bookingId,
          lotId: selectedQr.lotId,
          address: selectedQr.address,
          parkingSpaceId: selectedQr.parkingSpaceId,
          parkingLotId: selectedQr.parkingLotId,
          booking_date: selectedQr.booking_date,
        },
      });
    }
  }, [selectedQr]);

  return (
    <FadeInView>
      <VStack style={styles.container} safeAreaTop={16} rounded={8} shadow="xl">
        <HStack alignItems="center" px={4} justifyContent="space-between">
          <View style={{width: 50}}>
            <Text> </Text>
          </View>

          <Text fontFamily="OpenSans-Regular" fontSize={22} textAlign="center">
            Parking Session
          </Text>
          <IconButton
            onPress={() => navigation.goBack()}
            _icon={{
              color: colors.primary,
              size: 'xl',
              as: Icon,
              name: 'times',
            }}
          />
        </HStack>

        {isEmpty(filteredBookings) ? (
          <Center h="3/4">
            <Image
              source={images.emptyData}
              style={{
                width: 222,
                height: 222,
              }}
              resizeMode="contain"
              alt="img2"
            />
            <Text fontFamily="OpenSans-Regular" fontSize={22}>
              Empty Data !
            </Text>
          </Center>
        ) : (
          <ListOfBookings
            data={filteredBookings}
            setQR={qrData => setSelectedQr(qrData)}
            goBack={() => navigation.goBack()}
          />
        )}
      </VStack>
    </FadeInView>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

//make this component available to the app
export default BookingListScreen;
