//import liraries
import {colors} from '@/common/constant/colors';
import {Box, ScrollView, Text, VStack} from 'native-base';
import React, {useEffect, useState} from 'react';

import HistoryCard from './components/Card';
import {StyleSheet} from 'react-native';
import FadeInView from '@/common/components/FadeInView';

import {isEmpty} from 'lodash';
import {useAppSelector} from '@/hooks/reduxHooks';
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Dialog,
} from 'react-native-alert-notification';
import {TabMainNavigationProp} from '@/navigators/DashboardNavigator';
import {useFocusEffect} from '@react-navigation/native';
import useBookingHistory from '@/hooks/useBookingHistory';
import {BookingProps} from '@/common/schema/main';
import {COLLECTIONS} from '@/common/constant/firestore';
import firestore from '@react-native-firebase/firestore';

type HistoryCardProps = BookingProps & {
  timeOut: string;
  timeIn: string;
};

// create a component
const History = ({navigation}: {navigation: TabMainNavigationProp}) => {
  const {selectedVehicle} = useAppSelector(state => state.common);
  const {data: bookingHistory} = useBookingHistory();
  const [filteredBookings, setFilteredBookings] = useState<HistoryCardProps[]>(
    [],
  );

  useEffect(() => {
    // const getFilteredBookings = async () => {
    //   if (bookingHistory) {
    //     let allBookingLogs: any[] = [];

    //     await Promise.all(
    //       bookingHistory.map(async booking => {
    //         const querySnapshot = await firestore()
    //           .collection(COLLECTIONS.BOOKING_LOGS)
    //           .where('bookingId', '==', booking.qr_code.bookingId)
    //           .get();
    //         const bookingLogs = querySnapshot.docs
    //           .map(doc => doc.data())
    //           .filter(log => log.timeOutLog != null); // Filter logs where timeOutLog exists

    //         allBookingLogs = allBookingLogs.concat(bookingLogs);
    //       }),
    //     );

    //     console.log('All filtered bookings:', allBookingLogs);
    //     setFilteredBookings(allBookingLogs);
    //     // return allBookingLogs;
    //   }
    // };

    const getFilteredBookings = async () => {
      let tempBookingHistory: HistoryCardProps[] = [];
      const bookingChecks = await Promise.all(
        bookingHistory?.map(async booking => {
          const querySnapshot = await firestore()
            .collection(COLLECTIONS.BOOKING_LOGS)
            .where('bookingId', '==', booking.qr_code.bookingId)
            .get();

          const bookingLogs = querySnapshot.docs.map(doc => doc.data());
          tempBookingHistory.push({
            ...booking,
            timeOut: bookingLogs[0]?.timeOutLog,
            timeIn: bookingLogs[0]?.timeLog,
          });
          return bookingLogs[0]?.timeOutLog;
        }),
      );

      const filtered = tempBookingHistory?.filter(
        (_, index) => bookingChecks[index],
      );
      setFilteredBookings(filtered);
    };

    getFilteredBookings();
  }, [bookingHistory]);
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
            "Before you can use the history features, you'll need to set up your vehicle first.",
          button: 'Go to profile',
          onHide: () => navigation.navigate('ProfileTabScreen'),
        });
      }
    }, [navigation, selectedVehicle]), // don't forget to include dependencies here
  );

  return (
    <FadeInView>
      <AlertNotificationRoot>
        <VStack flex={1} bgColor="white">
          <Box
            safeAreaTop={12}
            px={4}
            h="12%"
            w="full"
            bgColor="white"
            justifyContent="flex-end">
            <Text style={styles.fontStyleDefault} pb={4}>
              My Bookings
            </Text>
          </Box>
          <ScrollView bgColor={colors.bgColor}>
            <VStack
              style={{borderTopEndRadius: 32, borderTopStartRadius: 32}}
              p={8}
              pb={120}
              space={4}
              h="88%">
              {!isEmpty(filteredBookings)
                ? filteredBookings?.map((a, index) => (
                    <HistoryCard data={a} key={index} />
                  ))
                : null}
            </VStack>
          </ScrollView>
        </VStack>
      </AlertNotificationRoot>
    </FadeInView>
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
export default History;
