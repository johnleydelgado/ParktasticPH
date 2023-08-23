import {NavigationContainer} from '@react-navigation/native';
import AuthNavigator from './navigators/AuthNavigator';
import DashboardNavigator from './navigators/DashboardNavigator';
import {StatusBar} from 'react-native';

const PublicView = () => (
  <NavigationContainer>
    <StatusBar barStyle="default" translucent backgroundColor="transparent" />

    <AuthNavigator />
  </NavigationContainer>
);

const PrivateView = () => (
  <NavigationContainer>
    <StatusBar barStyle="default" translucent backgroundColor="transparent" />
    <DashboardNavigator />
  </NavigationContainer>
);

export {PublicView, PrivateView};
