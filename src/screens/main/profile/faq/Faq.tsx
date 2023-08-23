//import liraries
import {colors} from '@/common/constant/colors';
import {images} from '@/common/constant/images';
import {StackMainNavigationProp} from '@/navigators/DashboardNavigator';
import {Box, HStack, ScrollView, Text, VStack} from 'native-base';
import React from 'react';
import {Image, StyleSheet, TouchableOpacity} from 'react-native';
import {List} from 'react-native-paper';
import Icon from 'react-native-vector-icons/AntDesign';

// create a component
const Faq = ({navigation}: {navigation: StackMainNavigationProp}) => {
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
              FAQs
            </Text>
            <Text
              style={{...styles.fontStyleDefault, fontSize: 14}}
              color="dark.500">
              Get your answers
            </Text>
          </VStack>
          <Box style={{position: 'absolute', right: 1}}>
            <Image
              source={images.faq}
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
          space={4}>
          <List.Section title="">
            <List.Accordion title="How to Offer a ride?">
              <List.Item title="Lorem Ipsum is simply dummy text of the printing and typesetting industry Lorem Ipsum has been the industry's standard dummy text ever since the 1500s." />
              <List.Item title="Lorem Ipsum is simply dummy text of the printing and typesetting industry Lorem Ipsum has been the industry's standard dummy text ever since the 1500s." />
            </List.Accordion>

            <List.Accordion
              title="How to chat ?"
              // expanded={expanded}
              // onPress={handlePress}
            >
              <List.Item title="Lorem Ipsum is simply dummy text of the printing and typesetting industry Lorem Ipsum has been the industry's standard dummy text ever since the 1500s." />
              <List.Item title="Lorem Ipsum is simply dummy text of the printing and typesetting industry Lorem Ipsum has been the industry's standard dummy text ever since the 1500s." />
            </List.Accordion>

            <List.Accordion
              title="How to add money in wallet ?"
              // expanded={expanded}
              // onPress={handlePress}
            >
              <List.Item title="Lorem Ipsum is simply dummy text of the printing and typesetting industry Lorem Ipsum has been the industry's standard dummy text ever since the 1500s." />
              <List.Item title="Lorem Ipsum is simply dummy text of the printing and typesetting industry Lorem Ipsum has been the industry's standard dummy text ever since the 1500s." />
            </List.Accordion>

            <List.Accordion
              title="How to add my Vehicle ?"
              // expanded={expanded}
              // onPress={handlePress}
            >
              <List.Item title="Lorem Ipsum is simply dummy text of the printing and typesetting industry Lorem Ipsum has been the industry's standard dummy text ever since the 1500s." />
              <List.Item title="Lorem Ipsum is simply dummy text of the printing and typesetting industry Lorem Ipsum has been the industry's standard dummy text ever since the 1500s." />
            </List.Accordion>

            <List.Accordion
              title="Can i login through social account ? "
              // expanded={expanded}
              // onPress={handlePress}
            >
              <List.Item title="Lorem Ipsum is simply dummy text of the printing and typesetting industry Lorem Ipsum has been the industry's standard dummy text ever since the 1500s." />
              <List.Item title="Lorem Ipsum is simply dummy text of the printing and typesetting industry Lorem Ipsum has been the industry's standard dummy text ever since the 1500s." />
            </List.Accordion>
          </List.Section>
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
export default Faq;
