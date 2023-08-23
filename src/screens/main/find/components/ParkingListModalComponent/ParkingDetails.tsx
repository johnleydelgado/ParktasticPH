import {colors} from '@/common/constant/colors';
import {ParkingSpacesProps} from '@/common/schema/main';
// import {getCollectionRef} from '@/common/helper/FirestoreHelper';
import {GOOGLE_PLACES_AUTOCOMPLETE_KEY} from '@env';

import {
  Box,
  Button,
  HStack,
  Image,
  ScrollView,
  Text,
  VStack,
} from 'native-base';
import * as React from 'react';
import {Dimensions, GestureResponderEvent} from 'react-native';
import {StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

type GestureHandler = (event: GestureResponderEvent) => void | null | undefined;

const ParkingDetails = ({
  goToParkingBooking,
  parkingData,
}: {
  goToParkingBooking: GestureHandler;
  parkingData: ParkingSpacesProps | undefined;
}) => {
  const {width} = Dimensions.get('window');

  const slotAvailable = Object.values(parkingData?.parking_lot || {}).filter(
    value => value === false,
  ).length;

  return (
    <Box px={4}>
      <ScrollView bgColor="white" rounded={32} w={width * 0.9}>
        <VStack h="80%" px={8} pt={8} space={4} bgColor="white" rounded={32}>
          <Text
            style={{
              fontWeight: '400',
              fontFamily: 'OpenSans-Regular',
              fontSize: 18,
            }}>
            Parking details
          </Text>
          <Image
            source={{
              uri: `https://maps.googleapis.com/maps/api/streetview?location=${parkingData?.location?.lat},${parkingData?.location?.lng}&fov=80&heading=180&pitch=0&key=${GOOGLE_PLACES_AUTOCOMPLETE_KEY}&size=600x400`,
            }}
            h="40"
            w="full"
            alt="a"
            rounded={16}
            resizeMode="cover"
          />

          <HStack>
            <VStack>
              {/* ADDRESS */}
              <Text
                style={{
                  fontWeight: '600',
                  fontFamily: 'OpenSans-Regular',
                  fontSize: 14,
                }}>
                {parkingData?.name}
              </Text>
              <Text
                color="gray.400"
                style={{
                  fontWeight: '400',
                  fontFamily: 'OpenSans-Regular',
                  fontSize: 11,
                }}>
                {parkingData?.address}
              </Text>
              {/* KM and TIME */}
              <HStack pt={4} space={2}>
                <HStack
                  bgColor="blue.100"
                  px={3}
                  py={1}
                  borderRadius={22}
                  mb={2}
                  alignItems="center"
                  space={2}>
                  <Icon name="map-marker-alt" size={12} color="green" />
                  <Text>
                    {Number(parkingData?.km) > 1
                      ? `${parkingData?.km} km`
                      : `${parkingData?.m} m`}
                  </Text>
                </HStack>
                <HStack
                  bgColor="blue.100"
                  px={3}
                  py={1}
                  borderRadius={22}
                  mb={2}
                  alignItems="center"
                  space={2}>
                  <Icon name="clock" size={12} color="green" />
                  <Text>
                    {parkingData?.time_from} - {parkingData?.time_to}
                  </Text>
                </HStack>
              </HStack>

              {/* RULES*/}
              <VStack py={4} space={2}>
                <Text
                  color="gray.400"
                  style={{
                    ...styles.defaultFont,
                    fontWeight: '400',
                  }}>
                  RULES
                </Text>
                <Text
                  color="gray.800"
                  numberOfLines={3}
                  style={{
                    ...styles.defaultFont,
                    fontWeight: '400',
                  }}>
                  {parkingData?.rules}
                </Text>
              </VStack>
              {/* SLOT AND PRICE DETAILS */}
              <HStack space={2}>
                <Box
                  bgColor="blue.100"
                  px={4}
                  py={4}
                  w="1/2"
                  display="flex"
                  alignItems="center"
                  borderLeftWidth={8}
                  borderLeftColor={colors.primary}>
                  <Text>{slotAvailable} slot available</Text>
                </Box>

                <Box
                  bgColor="blue.100"
                  px={4}
                  py={4}
                  w="1/2"
                  alignItems="center"
                  borderLeftWidth={8}
                  borderLeftColor={colors.primary}>
                  <Text>P{parkingData?.rate} Flat Rate</Text>
                </Box>
              </HStack>
              {/* Action */}
              <Button
                my={8}
                rounded={8}
                bgColor={colors.primary}
                _pressed={{bgColor: 'gray.600'}}
                onPress={goToParkingBooking}>
                Book Parking
              </Button>
            </VStack>
          </HStack>
        </VStack>
      </ScrollView>
    </Box>
  );
};

export default ParkingDetails;

const styles = StyleSheet.create({
  defaultFont: {
    fontWeight: '600',
    fontFamily: 'OpenSans-Regular',
  },
});
