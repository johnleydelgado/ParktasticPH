/* eslint-disable react/react-in-jsx-scope */
import {NavigationContainer} from '@react-navigation/native';
import AuthNavigator from './navigators/AuthNavigator';
import DashboardNavigator from './navigators/DashboardNavigator';
import {StatusBar} from 'react-native';
import {useAppSelector} from './hooks/reduxHooks';
import AdminNavigator from './navigators/AdminNavigator';
import {ActivityIndicator} from 'react-native-paper';
import {Center} from 'native-base';

const PublicView = () => (
  <NavigationContainer>
    <StatusBar barStyle="default" translucent backgroundColor="transparent" />

    <AuthNavigator />
  </NavigationContainer>
);

const PrivateView = () => {
  const {user} = useAppSelector(state => state.common);
  return (
    <NavigationContainer>
      <StatusBar barStyle="default" translucent backgroundColor="transparent" />
      {user.role === 'Driver' ? (
        <DashboardNavigator />
      ) : user.role === 'Parktastic Buddy' ? (
        <AdminNavigator />
      ) : (
        <Center>
          <ActivityIndicator />
        </Center>
      )}
    </NavigationContainer>
  );
};

export {PublicView, PrivateView};
