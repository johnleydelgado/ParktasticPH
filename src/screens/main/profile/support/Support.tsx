//import liraries
import {colors} from '@/common/constant/colors';
import {images} from '@/common/constant/images';
import {StackMainNavigationProp} from '@/navigators/DashboardNavigator';
import TextIntput from '@/screens/auth/sign-up/component/TextIntput';
import {
  Box,
  Button,
  Divider,
  HStack,
  ScrollView,
  Spacer,
  Text,
  TextArea,
  VStack,
} from 'native-base';
import React from 'react';
import {Image, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';

// create a component
const Support = ({navigation}: {navigation: StackMainNavigationProp}) => {
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
              Support
            </Text>
            <Text
              style={{...styles.fontStyleDefault, fontSize: 14}}
              color="dark.500">
              Contact Us
            </Text>
          </VStack>
          <Box style={{position: 'absolute', right: 1}}>
            <Image
              source={images.support}
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
        px={12}
        py={2}
        h="14%"
        w="full"
        borderTopRadius={32}
        justifyContent="space-between"
        bgColor={colors.primary}>
        <TouchableOpacity>
          <HStack space={2} pt={6} pl={4}>
            <Icon name="phone" color="white" size={22} />
            <Text
              style={{
                ...styles.fontStyleDefault,
                fontWeight: '400',
                fontSize: 16,
              }}
              color="white">
              Call Us
            </Text>
          </HStack>
        </TouchableOpacity>
        <Divider
          orientation="vertical"
          thickness={2}
          mt={4}
          bgColor="white"
          style={{height: 32}}
        />
        <TouchableOpacity>
          <HStack space={2} pt={6} pl={4}>
            <Icon name="mail" color="white" size={22} />
            <Text
              style={{
                ...styles.fontStyleDefault,
                fontWeight: '400',
                fontSize: 16,
              }}
              color="white">
              Mail Us
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
          space={2}>
          <Text style={{...styles.fontStyleDefault}} fontSize="3xl">
            Write Us
          </Text>
          <Text
            style={{...styles.fontStyleDefault, fontSize: 14}}
            color="dark.500">
            Let us know your query
          </Text>

          <TextIntput
            keyboardType="default"
            title="Phone Number/Email"
            placeholder="Add Contact Info"
          />

          <Box pt={4} />
          <Text
            style={{...styles.fontStyleDefault, fontSize: 16}}
            color="dark.100">
            Add your issue/feedback
          </Text>

          <TextArea
            aria-label="t1"
            numberOfLines={4}
            placeholder="Write your message"
            _dark={{
              placeholderTextColor: 'gray.300',
            }}
            mb="5"
            autoCompleteType
          />
          <Spacer />
          <Button bgColor={colors.primary}>Submit</Button>
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
export default Support;
