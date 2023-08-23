import React from 'react';

import {AUTH} from '@common/constant/screens';
import {
  CardStyleInterpolators,
  StackNavigationProp,
  createStackNavigator,
} from '@react-navigation/stack';
import {LoginScreen, SignUpScreen} from '@screens/index';
// import DashboardNavigator from "./DashboardNavigator";

const Stack = createStackNavigator();

type RootStackParamList = {
  LOGIN_SCREEN: undefined;
  SIGN_UP_SCREEN: undefined;
  // Add other screens here
};

// Create a navigation prop type
export type AuthNavigationProp = StackNavigationProp<
  RootStackParamList,
  'LOGIN_SCREEN'
>;

const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        headerShown: false,
      }}
      // initialRouteName={isLoggedIn ? MAIN.DASHBOARD : MAIN.ONBOARDING}
    >
      <Stack.Screen name={AUTH.LOGIN} component={LoginScreen} />
      <Stack.Screen name={AUTH.SIGN_UP} component={SignUpScreen} />

      {/* <Stack.Screen name={ONBOARDING.ONBOARDING} component={OnBoardingScreen} /> */}
    </Stack.Navigator>
  );
};

export default AuthNavigator;
