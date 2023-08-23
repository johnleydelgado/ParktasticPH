import {colors} from '@/common/constant/colors';
import {images} from '@/common/constant/images';
import {AuthNavigationProp} from '@/navigators/AuthNavigator';
import {
  Box,
  Button,
  HStack,
  Input,
  Pressable,
  ScrollView,
  Text,
  VStack,
} from 'native-base';
import React, {useState} from 'react';
import {Image, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import TextIntput from './component/TextIntput';
import {Spacer} from '@react-native-material/core';
import {useFormik} from 'formik';
import {SignUpUserProps} from '@/common/schema/main';
import {number, object, string} from 'yup';
import {useMutation} from '@tanstack/react-query';
import signUpUser from './api/signUpUser';
import {setUserData} from '@/redux/common';
import {useAppDispatch} from '@/hooks/reduxHooks';

const INITIAL_DATA: SignUpUserProps = {
  email: '',
  password: '',
  fullName: '',
  phoneNumber: '',
};

let userSignUpSchema = object({
  email: string().email().required(),
  phoneNumber: number()
    .required('Phone Number is required field')
    .test('len', 'Must be exactly 11 digits', val => {
      if (val) {
        const length = val.toString().length;
        return length === 10 || length === 11;
      }
      return false;
    }),
  password: string().min(8).max(16).required(),
  fullName: string().required('Full Name is required field'),
});

// create a component
const SignUp = ({navigation}: {navigation: AuthNavigationProp}) => {
  const [show, setShow] = useState(false);
  const dispatch = useAppDispatch();
  const mutation = useMutation(signUpUser, {
    onSuccess: (data, variables) => {
      console.log('User successfully created:', variables);
      dispatch(
        setUserData({
          name: variables.fullName || '',
          email: variables.email,
          phoneNumber: variables.phoneNumber,
        }),
      );
      // queryClient.invalidateQueries('someQueryKey');
    },
    onError: error => {
      console.log('Failed to sign up:', error);
    },
  });

  const formik = useFormik({
    initialValues: INITIAL_DATA,
    enableReinitialize: true,
    validationSchema: userSignUpSchema,
    onSubmit: values => {
      try {
        mutation.mutate(values);
      } catch (e: any) {
        console.error('Error during mutation:', e);
      }
    },
  });

  const formikProps = (field: keyof SignUpUserProps) => {
    return {
      onChangeText: formik.handleChange(field),
      onBlur: () => formik.handleBlur(field),
      value: formik.values[field],
      error:
        formik.touched[field] && formik.errors[field]
          ? formik.errors[field]
          : null,
    };
  };

  return (
    <VStack flex={1} bgColor={colors.bgColor}>
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
              Register
            </Text>
            <Text
              style={{...styles.fontStyleDefault, fontSize: 14}}
              color="dark.500">
              In less than a minute
            </Text>
          </VStack>
          <Box style={{position: 'absolute', right: 1, top: 28}}>
            <Image
              source={images.register}
              style={{
                width: 102,
                height: 102,
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
          space={4}>
          <TextIntput
            placeholder="Enter Full Name"
            keyboardType="default"
            title="Full Name"
            {...formikProps('fullName')}
          />
          <TextIntput
            placeholder="Enter Email Address"
            keyboardType="email-address"
            title="Email Address"
            {...formikProps('email')}
          />

          <Box pt={2}>
            <Text
              style={{
                fontFamily: 'OpenSans-Regular',
                fontWeight: '500',
                fontSize: 16,
              }}>
              Password
            </Text>
            <Input
              style={{
                borderColor: 'transparent',
                paddingTop: 8,
                paddingBottom: 8,
                borderWidth: 1,
              }}
              variant="underlined"
              placeholder="Enter password"
              type={show ? 'text' : 'password'}
              InputRightElement={
                <Pressable
                  onPress={() => setShow(!show)}
                  rounded="lg"
                  p={2}
                  _pressed={{bgColor: 'gray.100'}}>
                  <Icon
                    name={!show ? 'eye' : 'eyeo'}
                    color={colors.textDark}
                    size={26}
                  />
                </Pressable>
              }
              {...formikProps('password')}
            />
            {formikProps('password').error && (
              <Text style={{color: 'red'}}>
                {formikProps('password').error}
              </Text>
            )}
          </Box>

          <TextIntput
            placeholder="Enter Phone Number"
            keyboardType="phone-pad"
            title="Phone Number"
            {...formikProps('phoneNumber')}
          />

          <Spacer />
          <Button
            _pressed={{bgColor: 'green.500'}}
            bgColor={colors.primary}
            rounded="lg"
            onPress={() => formik.handleSubmit()}>
            CONTINUE
          </Button>
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
export default SignUp;
