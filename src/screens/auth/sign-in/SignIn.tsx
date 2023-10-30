/* eslint-disable react-native/no-inline-styles */
import React, {FC, useState} from 'react';
import {
  Image,
  // Dimensions,
  Keyboard,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {colors} from '@common/constant/colors';
import {images} from '@common/constant/images';
import {Box, Button, HStack, Input, Pressable, Text, VStack} from 'native-base';
import {AuthNavigationProp} from '@/navigators/AuthNavigator';
import Icon from 'react-native-vector-icons/AntDesign';

// import {IOS_AUTH_GOOGLE_KEY} from '@env';

import googleSignInUser from './api/googleSignInUser';
import {useAppDispatch} from '@/hooks/reduxHooks';
import SignInUser from './api/SignInUser';
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Dialog,
} from 'react-native-alert-notification';

interface SignInProps {
  navigation: AuthNavigationProp;
}

const SignIn: FC<SignInProps> = ({navigation}) => {
  // const {width} = Dimensions.get('window');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [show, setShow] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  GoogleSignin.configure({
    iosClientId:
      '322891877752-chhud8qia6mjlv54g44cmr5v329jcf35.apps.googleusercontent.com',
    webClientId:
      Platform.OS === 'ios'
        ? '322891877752-chhud8qia6mjlv54g44cmr5v329jcf35.apps.googleusercontent.com'
        : '322891877752-pusqk96lbtrg4d4r6nvbg9jrkbqa6drd.apps.googleusercontent.com',
  });

  const handleGoogleSignIn = async () => {
    await googleSignInUser(dispatch);
  };

  const handleSignIn = async () => {
    if (email && password) {
      SignInUser(email, password, dispatch);
    } else {
      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: 'Warning',
        textBody: 'Please complete all the required details.',
        button: 'close',
      });
    }
  };

  return (
    <AlertNotificationRoot>
      <VStack>
        <Box
          h="25%"
          safeAreaTop={8}
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}>
          <Box
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              source={images.primary_logo}
              resizeMode="contain"
              style={{width: '80%', height: 82}}
              alt="logo"
            />
          </Box>
          <Box
            position="absolute"
            rounded="full"
            width={342}
            height={322}
            bgColor="#4CAF50"
            opacity="0.1"
            left={-102}
            top={-54}
          />
        </Box>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <VStack h="75%" p={4} space={2} style={{alignItems: 'center'}}>
            <Text
              style={{
                color: colors.textDark,
                fontSize: 18,
                fontWeight: '200',
                fontFamily: 'OpenSans-Regular',
                paddingVertical: 4,
              }}>
              Sign in Now
            </Text>
            <VStack space={22} pr={22} pl={22} w="100%">
              <Box>
                <Text
                  style={{
                    fontFamily: 'OpenSans-Regular',
                    fontWeight: '500',
                    fontSize: 16,
                  }}>
                  Email
                </Text>
                <Input
                  style={{
                    borderColor: 'transparent',
                    borderBottomColor: colors.textLight,
                    paddingTop: 4,
                    paddingBottom: 8,
                    fontFamily: 'OpenSans-Regular',
                  }}
                  onChangeText={e => setEmail(e.toLocaleLowerCase())}
                  variant="underlined"
                  placeholder="Enter Email"
                  keyboardType="email-address"
                />
              </Box>
              <Box>
                <Text
                  style={{
                    fontFamily: 'OpenSans-Regular',
                    fontWeight: '500',
                    fontSize: 16,
                  }}>
                  Password
                </Text>
                <Input
                  onChangeText={e => setPassword(e)}
                  style={{
                    borderColor: 'transparent',
                    borderBottomColor: colors.textLight,
                    paddingTop: 4,
                    paddingBottom: 8,
                    fontFamily: 'OpenSans-Regular',
                  }}
                  variant="underlined"
                  placeholder="Enter Password"
                  keyboardType="visible-password"
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
                />
              </Box>

              <Button
                _pressed={{bgColor: 'green.700'}}
                bgColor={colors.primary}
                rounded="full"
                onPress={() => handleSignIn()}>
                Submit
              </Button>

              <Box
                style={{
                  display: 'flex',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color: colors.textDark,
                    fontSize: 12,
                    fontWeight: '200',
                    fontFamily: 'OpenSans-Regular',
                  }}>
                  Or Continue with
                </Text>
              </Box>

              <Button
                w="48"
                alignSelf="center"
                bgColor="white"
                rounded="lg"
                shadow="lg"
                _text={{color: 'black'}}
                _pressed={{bgColor: 'gray.100'}}
                leftIcon={
                  <Image
                    source={images.googleIcon}
                    style={{
                      width: 22,
                      height: 22,
                      paddingRight: 8,
                    }}
                    resizeMode="contain"
                    alt="img2"
                  />
                }
                onPress={handleGoogleSignIn}>
                Sign in with google
              </Button>

              <HStack
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                space={2}>
                <Text
                  style={{
                    color: colors.textDark,
                    fontSize: 12,
                    fontWeight: '200',
                    fontFamily: 'OpenSans-Regular',
                  }}>
                  Dont have an account?
                </Text>
                <Text
                  style={{
                    color: colors.textDark,
                    fontWeight: '600',
                    fontFamily: 'OpenSans-Regular',
                    textDecorationLine: 'underline',
                    fontSize: 13,
                  }}
                  onPress={() => navigation.navigate('SIGN_UP_SCREEN')}>
                  Sign Up
                </Text>
              </HStack>
            </VStack>
          </VStack>
        </TouchableWithoutFeedback>
      </VStack>
    </AlertNotificationRoot>
  );
};

export default SignIn;
