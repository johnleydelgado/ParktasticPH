/* eslint-disable react-native/no-inline-styles */
import React, {FC} from 'react';
import {
  Image,
  // Dimensions,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {colors} from '@common/constant/colors';
import {images} from '@common/constant/images';
import {Box, Button, HStack, Input, Text, VStack} from 'native-base';
import {AuthNavigationProp} from '@/navigators/AuthNavigator';
// import {IOS_AUTH_GOOGLE_KEY} from '@env';
import {useAppDispatch} from '@/hooks/reduxHooks';
import {setUserData} from '@/redux/common';
import auth from '@react-native-firebase/auth';

interface SignInProps {
  navigation: AuthNavigationProp;
}

const SignIn: FC<SignInProps> = ({navigation}) => {
  // const {width} = Dimensions.get('window');
  const dispatch = useAppDispatch();
  GoogleSignin.configure({
    iosClientId:
      '322891877752-chhud8qia6mjlv54g44cmr5v329jcf35.apps.googleusercontent.com',
    webClientId:
      '322891877752-pusqk96lbtrg4d4r6nvbg9jrkbqa6drd.apps.googleusercontent.com',
  });

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(
        userInfo.idToken,
      );
      auth().signInWithCredential(googleCredential);

      const {name, email} = userInfo.user;
      dispatch(setUserData({name: name || '', email, phoneNumber: ''}));
    } catch (error: any) {
      console.error('eeee', error);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };

  return (
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
              />
            </Box>
            <Button
              style={{backgroundColor: colors.primary, borderRadius: 12}}
              onPress={() => navigation.navigate('SIGN_UP_SCREEN')}>
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
              onPress={signIn}>
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
  );
};

export default SignIn;
