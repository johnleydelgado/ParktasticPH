//import liraries
import {colors} from '@/common/constant/colors';
import {images} from '@/common/constant/images';
import {StackMainNavigationProp} from '@/navigators/DashboardNavigator';
import {Box, HStack, ScrollView, Text, VStack} from 'native-base';
import React from 'react';
import {Image, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';

// create a component
const PrivaryPolicy = ({navigation}: {navigation: StackMainNavigationProp}) => {
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
              Privacy Policy
            </Text>
            <Text
              style={{...styles.fontStyleDefault, fontSize: 14}}
              color="dark.500">
              How we work
            </Text>
          </VStack>
          <Box style={{position: 'absolute', right: 1}}>
            <Image
              source={images.privacy_policy}
              style={{
                width: 154,
                height: 92,
              }}
              resizeMode="contain"
              alt="img"
            />
          </Box>
        </HStack>
      </Box>

      {/* WHITE */}
      <ScrollView
        bgColor="white"
        zIndex={4}
        style={{
          borderTopEndRadius: 32,
          borderTopStartRadius: 32,
        }}>
        <VStack
          style={{borderTopEndRadius: 32, borderTopStartRadius: 32}}
          p={6}
          pb={102}
          space={2}>
          <Text style={{...styles.fontStyleDefault}} fontSize="3xl">
            Terms of use
          </Text>
          <Text
            style={{...styles.fontStyleDefault, fontSize: 14}}
            color="dark.500">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book.
          </Text>

          <Text style={{...styles.fontStyleDefault}} fontSize="3xl">
            Privacy Policy
          </Text>
          <Text
            style={{...styles.fontStyleDefault, fontSize: 14}}
            color="dark.500">
            It has survived not only five centuries, but also the leap into
            electronic typesetting, remaining essentially unchanged. It was
            popularised in the 1960s with the release of Letraset sheets
            containing Lorem Ipsum passages, and more recently with desktop
            publishing software like Aldus PageMaker including versions of Lorem
            Ipsum
          </Text>
          <Text
            style={{...styles.fontStyleDefault, fontSize: 14}}
            color="dark.500">
            It is a long established fact that a reader will be distracted by
            the readable content of a page when looking at its layout. The point
            of using Lorem Ipsum is that it has a more-or-less normal
            distribution of letters, as opposed to using 'Content here, content
            here', making it look like readable English. Many desktop publishing
            packages and web page editors now use Lorem Ipsum as their default
            model text, and a search for 'lorem ipsum' will uncover many web
            sites still in their infancy.
          </Text>
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
export default PrivaryPolicy;
