//import liraries
import {colors} from '@/common/constant/colors';
import {Box, ScrollView, Text, VStack} from 'native-base';
import React, {useEffect, useState} from 'react';

import HistoryCard from './components/Card';
import {StyleSheet} from 'react-native';
import FadeInView from '@/common/components/FadeInView';
import {COLLECTIONS} from '@/common/constant/firestore';
import {BookingProps} from '@/common/schema/main';
import firestore, {firebase} from '@react-native-firebase/firestore';
import {isEmpty} from 'lodash';
import {useAppSelector} from '@/hooks/reduxHooks';
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Dialog,
} from 'react-native-alert-notification';
import {TabMainNavigationProp} from '@/navigators/DashboardNavigator';
import {useFocusEffect} from '@react-navigation/native';

// create a component
const History = ({navigation}: {navigation: TabMainNavigationProp}) => {
  const {selectedVehicle} = useAppSelector(state => state.common);
  const [bookingHistory, setBookingHistory] = useState<BookingProps[]>();
  useEffect(() => {
    const userId = firebase.auth().currentUser?.uid;
    const vehiclesRef = firestore()
      .collection(COLLECTIONS.BOOKING)
      .doc(userId)
      .collection(userId || '');

    const subscriber = vehiclesRef.onSnapshot(async querySnapshot => {
      let data: BookingProps[] = [];
      querySnapshot.forEach(documentSnapshot => {
        data.push(documentSnapshot.data() as BookingProps);
      });
      setBookingHistory(data);
    });

    // Stop listening for updates when no longer required
    return () => subscriber();
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
            "Before you can use the history features, you'll need to set up your vehicle first.",
          button: 'Go to profile',
          onHide: () => navigation.navigate('ProfileTabScreen'),
        });
        console.log('11', selectedVehicle);
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
              {!isEmpty(bookingHistory)
                ? bookingHistory?.map(a => <HistoryCard data={a} />)
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
