//import liraries
import {colors} from '@/common/constant/colors';
import {images} from '@/common/constant/images';
import {StackMainNavigationProp} from '@/navigators/DashboardNavigator';
import {Box, HStack, ScrollView, Text, VStack} from 'native-base';
import React from 'react';
import {Image, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';

// create a component
const Address = ({navigation}: {navigation: StackMainNavigationProp}) => {
  return (
    <VStack flex={1} bgColor="white">
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
              Manage Address
            </Text>
            <Text
              style={{...styles.fontStyleDefault, fontSize: 14}}
              color="dark.500">
              Pre saved Address
            </Text>
          </VStack>
          <Box style={{position: 'absolute', right: 1}}>
            <Image
              source={images.address}
              style={{
                width: 154,
                height: 132,
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
        <TouchableOpacity>
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
          p={6}
          space={4}>
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
export default Address;
