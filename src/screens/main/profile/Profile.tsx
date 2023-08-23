//import liraries
import {colors} from '@/common/constant/colors';
import {
  Avatar,
  Box,
  Button,
  HStack,
  ScrollView,
  Text,
  VStack,
} from 'native-base';
import React from 'react';

import {StyleSheet} from 'react-native';
import FadeInView from '@/common/components/FadeInView';
import {images} from '@/common/constant/images';
import Icon from 'react-native-vector-icons/AntDesign';
import SettingItem from './components/SettingItem';
import {StackMainNavigationProp} from '@/navigators/DashboardNavigator';
import {STACKS} from '@/common/constant/screens';
import {useAppSelector} from '@/hooks/reduxHooks';
import {useSignOut} from '@/hooks/useSignOut';

interface Props {
  navigation: StackMainNavigationProp;
}

// create a component
const Profile = ({navigation}: Props) => {
  const {user} = useAppSelector(state => state.common);
  const {signOut} = useSignOut();
  const ITEMS = [
    {
      iconName: 'car-alt',
      title: 'My Vehicle',
      subTitle: 'Add Vehicle Information',
      navigation: () => navigation.navigate(STACKS.MY_VEHICLE_STACK),
    },
    {
      iconName: 'map-marker-alt',
      title: 'Manage address',
      subTitle: 'Pre Saved Address',
      navigation: () => navigation.navigate(STACKS.MY_ADDRESS_STACK),
    },
    {
      iconName: 'hands-helping',
      title: 'Support',
      subTitle: 'Connect us for issues & feedback',
      navigation: () => navigation.navigate(STACKS.SUPPORT_STACK),
    },
    {
      iconName: 'user-shield',
      title: 'Privacy Policy',
      subTitle: 'Know Our Privacy Policies',
      navigation: () => navigation.navigate(STACKS.PRIVACY_STACK),
    },
    {
      iconName: 'question',
      title: 'FAQs',
      subTitle: 'Get your question`s answered',
      navigation: () => navigation.navigate(STACKS.FAQ_STACK),
    },
  ];

  return (
    <FadeInView>
      <VStack flex={1} bgColor={colors.bgColor}>
        {/* HEADER */}
        <Box safeAreaTop={12} px={4} h="20%" w="full" bgColor={colors.bgColor}>
          <Text style={styles.fontStyleDefault} pb={4}>
            Account
          </Text>
          <HStack justifyContent="space-between">
            <VStack>
              <Text style={{...styles.fontStyleDefault}} fontSize="3xl">
                {user.name}
              </Text>
              <Text
                style={{...styles.fontStyleDefault, fontSize: 14}}
                color="dark.500">
                My Profile
              </Text>
            </VStack>
            <Avatar source={images.car1} size={62} />
          </HStack>
        </Box>
        {/* GREEN HEADER */}
        <HStack
          px={4}
          py={2}
          h="14%"
          w="full"
          borderTopRadius={32}
          bgColor={colors.primary}
          justifyContent="space-between">
          <VStack pt={6}>
            <HStack space={4}>
              <Icon name="wallet" color="white" size={22} />
              <Text
                style={{...styles.fontStyleDefault, fontSize: 14}}
                color="white">
                Wallet
              </Text>
            </HStack>

            <Text
              pl={10}
              style={{
                ...styles.fontStyleDefault,
                fontWeight: '400',
                fontSize: 14,
              }}
              color="white">
              Quick Payments
            </Text>
          </VStack>
          <HStack space={2} pt={6}>
            <Text
              style={{...styles.fontStyleDefault, fontSize: 18}}
              color="white">
              ₱ 199.60
            </Text>
            <Icon name="right" color="white" size={18} />
          </HStack>
        </HStack>
        {/* WHITE */}
        <ScrollView
          bgColor="white"
          zIndex={4}
          h="full"
          style={{
            borderTopEndRadius: 32,
            borderTopStartRadius: 32,
            bottom: 24,
          }}>
          <VStack
            style={{borderTopEndRadius: 32, borderTopStartRadius: 32}}
            p={6}
            space={4}>
            {ITEMS.map(a => (
              <SettingItem {...a} key={a.title} />
            ))}
            <Button
              bgColor="red.400"
              rounded="full"
              _pressed={{bgColor: 'red.600'}}
              onPress={signOut}>
              Sign Out
            </Button>
          </VStack>
        </ScrollView>
      </VStack>
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
export default Profile;
