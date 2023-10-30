//import liraries
import React from 'react';
import {StyleSheet} from 'react-native';
import {Center, HStack, IconButton, Text, VStack} from 'native-base';
import {colors} from '@/common/constant/colors';
import Icon from 'react-native-vector-icons/AntDesign';
import {
  QrScreenRouteProp,
  TabMainNavigationProp,
} from '@/navigators/DashboardNavigator';
import FadeInView from '@/common/components/FadeInView';
import QRCode from 'react-native-qrcode-svg';
import {useAppSelector} from '@/hooks/reduxHooks';
// create a component
const QrScreen = ({
  route,
  navigation,
}: {
  route: QrScreenRouteProp;
  navigation: TabMainNavigationProp;
}) => {
  const user = useAppSelector(state => state.common.user);

  const {qr} = route.params;

  return (
    <FadeInView>
      <VStack style={styles.container} safeAreaTop={16} rounded={8} shadow="xl">
        <HStack alignItems="center">
          <IconButton
            alignSelf="flex-start"
            ml={4}
            onPress={() => navigation.goBack()}
            _icon={{
              color: colors.primary,
              size: 'xl',
              as: Icon,
              name: 'left',
            }}
          />
          <Text style={{...styles.fontStyleDefault, fontSize: 12}}>
            Go back
          </Text>
        </HStack>

        <VStack p={10} space={4}>
          <HStack space={2} alignItems="center">
            <Icon name="user" color={colors.primary} size={18} />
            <Text>User Info</Text>
          </HStack>
          <Text style={{...styles.fontStyleDefault, fontSize: 12}}>
            FullName : {user.name}
          </Text>
          <Text style={{...styles.fontStyleDefault, fontSize: 12}}>
            Email : {user.email}
          </Text>
        </VStack>

        <Center>
          <QRCode value={JSON.stringify(qr)} size={304} />
          <Text style={{...styles.fontStyleDefault, fontSize: 12}}>
            {qr.qrCode}
          </Text>
        </Center>
        {/* <ListOfBookings data={bookingHistory} /> */}
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
  fontStyleDefault: {
    fontWeight: '600',
    fontFamily: 'OpenSans-Regular',
    fontSize: 20,
  },
});

//make this component available to the app
export default QrScreen;
