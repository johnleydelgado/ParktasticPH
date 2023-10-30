//import liraries
import {colors} from '@/common/constant/colors';
import {Box, ScrollView, Text, VStack} from 'native-base';
import React from 'react';

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

// create a component
const History = ({navigation}: {navigation: TabMainNavigationProp}) => {
  const {selectedVehicle} = useAppSelector(state => state.common);
  const {bookingHistory} = useBookingHistory();

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
              {!isEmpty(bookingHistory)
                ? bookingHistory?.map((a, index) => (
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
