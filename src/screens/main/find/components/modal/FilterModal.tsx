/* eslint-disable react/no-unstable-nested-components */
//import liraries
import {useAppDispatch, useAppSelector} from '@/hooks/reduxHooks';
import {closeModal} from '@/redux/nonPersistState';
import {colors} from '@common/constant/colors';
import {images} from '@common/constant/images';
import {modalName} from '@common/constant/modal';
import {
  Box,
  HStack,
  Image,
  Pressable,
  Text,
  Slider,
  VStack,
  Button,
  Spacer,
} from 'native-base';
import React from 'react';
import {View} from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/FontAwesome5';
// create a component
const FilterModal = () => {
  const {openModals} = useAppSelector(state => state.nonPersistState);
  const dispatch = useAppDispatch();
  const ITEMS = [
    'Covered Roof',
    'Camera',
    'Overnight',
    'Charging',
    'Disabled Parking',
    'Security Guard',
    'Valet Parking',
  ];

  const FacilityList = ({title}: {title: string}) => (
    <Pressable bgColor="blue.100" px={4} py={2} borderRadius={22} mb={2}>
      <Text color="dark.400" fontWeight="bold">
        {title}
      </Text>
    </Pressable>
  );

  const PaymentList = ({title}: {title: string}) => (
    <Pressable
      bgColor="blue.100"
      px={4}
      py={4}
      borderRadius={12}
      mb={2}
      w="1/2">
      <HStack>
        {title === 'Wallet' ? (
          <Image
            source={images.wallet}
            alt="asd"
            h="6"
            w="6"
            resizeMode="contain"
          />
        ) : (
          <Image
            source={{
              uri: 'https://w7.pngwing.com/pngs/860/297/png-transparent-gcash-logo.png',
            }}
            alt="asd"
            h="6"
            w="6"
          />
        )}

        <Text color="dark.100" fontWeight="bold" pl={22}>
          {title}
        </Text>
      </HStack>
    </Pressable>
  );

  const closeFilter = () => {
    dispatch(closeModal(modalName.OPEN_FILTER));
  };

  return (
    <View>
      <Modal
        animationIn="fadeInUp"
        isVisible={openModals.includes(modalName.OPEN_FILTER)}
        style={{margin: 0}}>
        <VStack flex={1} bgColor={colors.bgColor}>
          <Box safeAreaTop={8} h="full" w="full">
            <HStack
              h="20%"
              alignItems="flex-end"
              justifyContent="space-between">
              <HStack
                w="full"
                style={{
                  position: 'absolute',
                  top: 1,
                  justifyContent: 'space-between',
                }}
                p={6}>
                <Button onPress={() => closeFilter()} variant="ghost">
                  <Icon name="arrow-left" size={20} color={colors.textDark} />
                </Button>
                <Button variant="ghost">
                  <Text
                    color={colors.primary}
                    style={{
                      fontWeight: '600',
                      fontFamily: 'OpenSans-Regular',
                      fontSize: 18,
                    }}>
                    RESET
                  </Text>
                </Button>
              </HStack>
              <VStack space={2} pb={8}>
                <Text
                  style={{
                    fontWeight: '600',
                    fontFamily: 'OpenSans-Regular',
                    fontSize: 20,
                  }}>
                  Filter
                </Text>
                <Text
                  style={{
                    fontFamily: 'OpenSans-Regular',
                    fontSize: 14,
                    fontWeight: '600',
                    color: colors.textLight,
                  }}>
                  Search with filtration
                </Text>
              </VStack>
              <Box h="100%">
                <Image
                  source={images.sign_img}
                  style={{
                    width: 154,
                    height: 222,
                  }}
                  resizeMode="contain"
                  alt="img"
                />
              </Box>
            </HStack>
            <VStack
              h="80%"
              px={8}
              pt={8}
              space={4}
              bgColor="white"
              style={{borderTopEndRadius: 32, borderTopStartRadius: 32}}>
              <Text
                style={{
                  fontWeight: '600',
                  fontFamily: 'OpenSans-Regular',
                  fontSize: 14,
                }}>
                Price
              </Text>
              <Slider
                colorScheme="green"
                p={4}
                w="full"
                defaultValue={70}
                minValue={0}
                maxValue={100}
                step={1}>
                <Slider.Track>
                  <Slider.FilledTrack />
                </Slider.Track>
                <Slider.Thumb />
              </Slider>
              <Text
                style={{
                  fontWeight: '600',
                  fontFamily: 'OpenSans-Regular',
                  fontSize: 14,
                }}>
                Facilities
              </Text>
              <HStack space={4} flexWrap="wrap" alignItems="center">
                {ITEMS.map(a => (
                  <FacilityList title={a} key={a} />
                ))}
              </HStack>
              <Text
                pt={2}
                style={{
                  fontWeight: '600',
                  fontFamily: 'OpenSans-Regular',
                  fontSize: 14,
                }}>
                Payment Accepted
              </Text>
              <HStack space={2} alignItems="center">
                <PaymentList title="Wallet" />
                <PaymentList title="Gcash" />
              </HStack>
              <Spacer />
              <Button
                bgColor={colors.primary}
                _text={{fontWeight: 'bold'}}
                mb={8}
                rounded={12}>
                APPLY
              </Button>
            </VStack>
          </Box>
        </VStack>
      </Modal>
    </View>
  );
};

//make this component available to the app
export default FilterModal;
