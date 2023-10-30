/* eslint-disable react-native/no-inline-styles */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BottomTabNavigationProp,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {
  RouteProp,
  getFocusedRouteNameFromRoute,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {
  CardStyleInterpolators,
  StackNavigationProp,
  createStackNavigator,
} from '@react-navigation/stack';
import React from 'react';
//@ts-ignore
import Icons from 'react-native-vector-icons/FontAwesome5';

import {
  MAIN,
  STACKS,
  STACKS_ADMIN,
  TABS,
  TABS_ADMIN,
} from '../common/constant/screens';
import {View} from 'react-native';
import {Pressable} from 'react-native';
import {Box} from '@react-native-material/core';
import {
  FaqScreen,
  FindScreen,
  HistoryScreen,
  MyAddressScreen,
  MyVehicleScreen,
  PrivacyScreen,
  ProfileScreen,
  SupportScreen,
} from '@screens/index';
import {colors} from '@common/constant/colors';
import {Text} from 'react-native-paper';
import Admin from '@/screens/admin/Admin';
import QRAdminScreen from '@/screens/admin/QRAdminScreen';

// import DashboardNavigator from "./DashboardNavigator";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

type RootStackParamList = {
  DashboardTabScreen: undefined;
  HomeTabScreen: undefined;
  QRTabScreen: undefined;
  // Add other screens here
};

// Create a navigation prop type

export type QrAdminScreenRouteProp = RouteProp<
  RootStackParamList,
  'DashboardTabScreen'
>;

export type TabAdminMainNavigationProp = BottomTabNavigationProp<
  RootStackParamList,
  'DashboardTabScreen'
>;

function TabBar({state, descriptors, navigation}) {
  const focusedOptions = descriptors[state.routes[state.index].key].options;
  if (focusedOptions.tabBarVisible === false) {
    return null;
  }
  return (
    <View
      key={state.index}
      style={{
        position: 'absolute',
        bottom: 32,
        padding: 16,
        zIndex: 1,
        elevation: 1,
        flexDirection: 'row',
        height: 72,
        borderRadius: 75,
        justifyContent: 'space-between',
        alignSelf: 'center',
        // width: '90%',
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.0,
      }}>
      {state.routes.map((route: any, index: number) => {
        const {options} = descriptors[route.key];
        const routeLabels = {
          [TABS_ADMIN.HOME_TAB]: 'Home',
          [TABS_ADMIN.PROFILE_TAB]: 'Profile',
        };

        const routeName = routeLabels[route.name] || route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          // if (route.name == 'Payment') {
          //   Alert.alert('Feature Coming Soon!')
          // }

          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };
        let iconName;

        switch (route.name) {
          case TABS_ADMIN.HOME_TAB:
            iconName = isFocused ? 'home' : 'home';
            break;
          case TABS_ADMIN.PROFILE_TAB:
            iconName = isFocused ? 'user-circle' : 'user-circle';
            break;
          default:
            iconName = isFocused ? 'home' : 'home';
        }
        return (
          <Pressable key={index} onPress={onPress}>
            <Box
              style={{
                width: 80,
                height: 40,
                borderRadius: 32,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Icons
                name={iconName}
                size={18}
                color={isFocused ? colors.primary : colors.textLight2}
              />
              <Text style={{fontSize: 10, paddingTop: 6}}>{routeName}</Text>
            </Box>
          </Pressable>
        );
      })}
    </View>
  );
}

const AdminNavigator = () => {
  // const {roomStatus} = useSelector(state => state.user);
  // const initialRoute = roomStatus.ongoing ? STACKS.RANKGAME : STACKS.DASHBOARD;
  return (
    <Stack.Navigator
      // initialRouteName={initialRoute}
      screenOptions={{headerShown: false}}>
      <Stack.Screen name={STACKS_ADMIN.DASHBOARD} component={DashboardTab} />
    </Stack.Navigator>
  );
};

const DashboardTab = () => {
  return (
    <Tab.Navigator tabBar={props => <TabBar {...props} />}>
      <Tab.Screen
        name={TABS_ADMIN.HOME_TAB}
        component={HomeStack}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name={TABS_ADMIN.PROFILE_TAB}
        component={ProfileStack}
        options={{headerShown: false}}
      />
    </Tab.Navigator>
  );
};

const HomeStack = ({navigation, route}) => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name={STACKS_ADMIN.HOME_STACK} component={Admin} />
      <Stack.Screen name={STACKS_ADMIN.QR_SCAN} component={QRAdminScreen} />
    </Stack.Navigator>
  );
};

const ProfileStack = ({navigation, route}) => {
  // React.useLayoutEffect(() => {
  //   const tabHiddenRoutes = [STACKS.MEETING, 'Map'];
  //   if (tabHiddenRoutes.includes(getFocusedRouteNameFromRoute(route))) {
  //     navigation.setOptions({tabBarStyle: {display: 'none'}});
  //   } else {
  //     navigation.setOptions({tabBarStyle: {display: 'flex'}});
  //   }
  // }, [navigation, route]);

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen
        name={STACKS_ADMIN.PROFILE_STACK}
        component={ProfileScreen}
      />
      <Stack.Screen
        name={STACKS.MY_VEHICLE_STACK}
        component={MyVehicleScreen}
      />
      <Stack.Screen
        name={STACKS.MY_ADDRESS_STACK}
        component={MyAddressScreen}
      />
      <Stack.Screen name={STACKS.SUPPORT_STACK} component={SupportScreen} />
      <Stack.Screen name={STACKS.PRIVACY_STACK} component={PrivacyScreen} />
      <Stack.Screen name={STACKS.FAQ_STACK} component={FaqScreen} />
    </Stack.Navigator>
  );
};

export default AdminNavigator;
