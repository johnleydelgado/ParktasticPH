import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {StatusBar} from 'react-native';
import AuthNavigator from './navigators/AuthNavigator';

const MainNav = ({}) => {
  return (
    <NavigationContainer>
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="transparent"
      />
      <AuthNavigator />
    </NavigationContainer>
  );
};

export default MainNav;
