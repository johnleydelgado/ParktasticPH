//import liraries
import {colors} from '@/common/constant/colors';
import {Box, HStack, Pressable, Text, VStack} from 'native-base';
import React from 'react';
import {StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

interface SettingItemProps {
  iconName: string;
  title: string;
  subTitle: string;
  navigation: any;
}

// create a component
const SettingItem = ({
  iconName,
  title,
  subTitle,
  navigation,
}: SettingItemProps) => {
  return (
    <Pressable
      _pressed={{bgColor: 'gray.100'}}
      p={2}
      rounded={8}
      onPress={navigation}>
      <VStack>
        <HStack space={4}>
          <Box style={{display: 'flex'}} w="10%">
            <Icon name={iconName} color={colors.primary} size={22} />
          </Box>
          <VStack>
            <Text
              style={{...styles.fontStyleDefault, fontSize: 14}}
              color="dark.200">
              {title}
            </Text>
            <Text
              style={{
                ...styles.fontStyleDefault,
                fontWeight: '400',
                fontSize: 14,
              }}
              color="dark.500">
              {subTitle}
            </Text>
          </VStack>
        </HStack>
      </VStack>
    </Pressable>
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
export default SettingItem;
