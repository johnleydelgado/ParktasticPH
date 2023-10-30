//import liraries
import {colors} from '@/common/constant/colors';
import {images} from '@/common/constant/images';
import {BookingProps} from '@/common/schema/main';
import {format} from 'date-fns';
import {Center, HStack, Text, VStack} from 'native-base';
import React from 'react';
import {Image, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
// create a component

const HistoryCard = ({data}: {data: BookingProps | undefined}) => {
  return (
    <VStack shadow="4" bgColor="white" rounded="lg">
      <VStack space={2} p={4}>
        <VStack>
          <Text style={styles.fontStyleDefault} color="gray.400">
            Parked on
          </Text>
          <Text style={styles.fontStyleDefault} color="dark.100" fontSize={22}>
            {/* 05 Jun, 10:00 am */}
            {format(
              data?.booking_date.toDate() || new Date(),
              'dd MMM, hh:mm a',
            )}
          </Text>
        </VStack>
        <Image
          source={images.car1}
          style={styles.imageStyle}
          alt="car1"
          resizeMode="contain"
        />

        <HStack space={2} alignItems="center">
          <Icon name="map-marker-alt" size={16} color="green" />
          <Text
            style={styles.fontStyleDefault}
            color="gray.400"
            fontSize={14}
            w="3/4">
            {data?.address || ''}
          </Text>
        </HStack>
      </VStack>
      <Center
        bgColor={colors.bgColor}
        p={4}
        borderBottomRadius={8}
        _text={{
          color: colors.primary,
          ...styles.fontStyleDefault,
        }}>
        RE-PARK
      </Center>
    </VStack>
  );
};

// define your styles
const styles = StyleSheet.create({
  fontStyleDefault: {
    fontWeight: '600',
    fontFamily: 'OpenSans-Regular',
  },
  imageStyle: {
    width: 80,
    height: 52,
    position: 'absolute',
    bottom: 1,
    right: 1,
  },
});

//make this component available to the app
export default HistoryCard;
