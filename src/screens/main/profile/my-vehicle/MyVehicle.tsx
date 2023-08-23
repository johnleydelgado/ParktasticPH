//import liraries
import {colors} from '@/common/constant/colors';
import {images} from '@/common/constant/images';
import {modalName} from '@/common/constant/modal';
import {useAppDispatch, useAppSelector} from '@/hooks/reduxHooks';
import {StackMainNavigationProp} from '@/navigators/DashboardNavigator';
import {openModal} from '@/redux/nonPersistState';
import {Box, HStack, Pressable, ScrollView, Text, VStack} from 'native-base';
import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import CreateUpdateVehicle from './component/CreateUpdateVehicle';
import firestore, {firebase} from '@react-native-firebase/firestore';
import {COLLECTIONS} from '@/common/constant/firestore';
import {VehicleProps} from '@/common/schema/main';
import {setSelectedVehicle} from '@/redux/common';

// create a component
const MyVehicle = ({navigation}: {navigation: StackMainNavigationProp}) => {
  const dispatch = useAppDispatch();
  const {selectedVehicle} = useAppSelector(state => state.common);
  const openCreateUpdateModal = () => {
    dispatch(openModal(modalName.ADD_EDIT_VEHICLE));
  };

  const [vehicles, setVehicles] = useState<VehicleProps[]>();

  useEffect(() => {
    const userId = firebase.auth().currentUser?.uid;
    const vehiclesRef = firestore()
      .collection(COLLECTIONS.VEHICLES)
      .doc(userId)
      .collection(userId || '');

    const subscriber = vehiclesRef.onSnapshot(async querySnapshot => {
      let data: VehicleProps[] = [];
      querySnapshot.forEach(documentSnapshot => {
        data.push(documentSnapshot.data() as VehicleProps);
      });
      setVehicles(data);
    });

    // Stop listening for updates when no longer required
    return () => subscriber();
  }, [navigation]);

  return (
    <VStack flex={1} bgColor="white">
      <CreateUpdateVehicle />
      {/* HEADER */}
      <Box safeAreaTop={12} px={4} h="20%" w="full" bgColor={colors.bgColor}>
        <HStack justifyContent="space-between">
          <VStack>
            <TouchableOpacity
              style={{paddingBottom: 8}}
              onPress={() => navigation.goBack()}>
              <Icon name="arrowleft" color={colors.textDark} size={26} />
            </TouchableOpacity>
            <Text style={{...styles.fontStyleDefault}} fontSize="3xl">
              My Vehicle
            </Text>
            <Text
              style={{...styles.fontStyleDefault, fontSize: 14}}
              color="dark.500">
              Vehicles you own
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
        <TouchableOpacity onPress={openCreateUpdateModal}>
          <HStack space={6} pt={6} pl={4}>
            <Icon name="plus" color="white" size={22} />
            <Text
              style={{
                ...styles.fontStyleDefault,
                fontWeight: '400',
                fontSize: 16,
              }}
              color="white">
              Add new vehicle
            </Text>
          </HStack>
        </TouchableOpacity>
      </HStack>

      {/* WHITE */}
      <ScrollView
        bgColor="white"
        zIndex={4}
        style={{
          borderTopEndRadius: 32,
          borderTopStartRadius: 32,
          bottom: 24,
        }}>
        <VStack
          style={{borderTopEndRadius: 32, borderTopStartRadius: 32}}
          p={12}
          space={4}>
          {/* <Radio.Group
            name="exampleGroup"
            accessibilityLabel="favorite colorscheme">
            <VStack space={8}>
              {vehicles?.map((a, index: number) => (
                <Radio
                  colorScheme="emerald"
                  value={String(index + 1)}
                  my={index + 1}>
                  <p>
                    {a.brand} {a.make}
                  </p>
                </Radio>
              ))}
            </VStack>
          </Radio.Group> */}

          {vehicles?.map((a, index: number) => (
            <Pressable
              shadow="4"
              rounded="lg"
              bgColor="white"
              p={6}
              _pressed={{bgColor: 'gray.50'}}
              onPress={() => dispatch(setSelectedVehicle(a))}
              key={index}>
              <HStack justifyContent="space-between" alignItems="center">
                <VStack>
                  <Text fontFamily="OpenSans-Regular" fontWeight="light">
                    {a.brand} {a.make}
                  </Text>
                  <Text
                    color="gray.400"
                    fontFamily="OpenSans-Regular"
                    fontWeight="light">
                    {a.modelYear} | {a.licenseNum}
                  </Text>
                </VStack>
                {selectedVehicle.licenseNum === a.licenseNum ? (
                  <Icon name="checkcircle" color={colors.textDark} size={26} />
                ) : null}
              </HStack>
            </Pressable>
          ))}

          {/* {ITEMS.map(a => (
            <SettingItem {...a} key={a.title} />
          ))} */}
        </VStack>
      </ScrollView>
    </VStack>
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
export default MyVehicle;
