/* eslint-disable react-hooks/exhaustive-deps */
import FadeInView from '@/common/components/FadeInView';
import {colors} from '@/common/constant/colors';
import {useAppDispatch, useAppSelector} from '@/hooks/reduxHooks';
import {
  HStack,
  IconButton,
  ScrollView,
  Spinner,
  Stack,
  Text,
  VStack,
} from 'native-base';
import * as React from 'react';
import {StyleSheet} from 'react-native';
import {AlertNotificationRoot} from 'react-native-alert-notification';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import Circle from './components/Circle';
import {TabAdminMainNavigationProp} from '@/navigators/AdminNavigator';
import useGetBookingLogs from '@/hooks/useGetBookingLogs';
import {useIsFocused} from '@react-navigation/native';
import AdminDialog, {ModalAdminProps} from '@/common/dialog/AdminDialog';
import modalProps from './constants/modalProps';
import AdminAddBookingDiaglog from '@/common/dialog/AdminAddBookingDiaglog';
import AdminReportBookingDialog from '@/common/dialog/AdminReportBookingDialog';
import {openModal} from '@/redux/nonPersistState';
import {modalName} from '@/common/constant/modal';
import AdminEndSessionDiaglog from '@/common/dialog/AdminEndSessionDiaglog';

const Admin = ({navigation}: {navigation: TabAdminMainNavigationProp}) => {
  const {user} = useAppSelector(state => state.common);
  const dispatch = useAppDispatch();
  const {bookingListLogs, refetch, loading, isRefetching} =
    useGetBookingLogs(false);
  const isFocused = useIsFocused();
  const [modalPropsData, setModalPropsData] = React.useState<ModalAdminProps>();
  const [selectedTypeOfParking, setSelectedTypeOfParking] = React.useState();
  const [visible, setVisible] = React.useState(false);
  const getModalProps = modalProps(dispatch);

  // const {bookingHistory} = useGetAllBooking();
  // const userId = firebase.auth().currentUser?.uid;

  const qrHandler = () => {
    navigation.navigate('QRTabScreen');
  };

  React.useEffect(() => {
    if (isFocused) {
      refetch();
    }
  }, [isFocused]);

  React.useEffect(() => {
    if (selectedTypeOfParking) {
      const parkingTypeToIndexMap = {
        Available: 0,
        Reserved: 1,
        ['Not Available']: 2,
      };
      const index = parkingTypeToIndexMap[selectedTypeOfParking];

      if (index === 2) {
        dispatch(openModal(modalName.ADMIN_END_SESSION_BOOKING));
        // @ts-ignore
        setSelectedTypeOfParking('');
        return;
      }

      if (index !== undefined) {
        const foundItem = getModalProps[index];
        setModalPropsData(foundItem);
        // @ts-ignore
        setSelectedTypeOfParking('');
      }
    }
  }, [selectedTypeOfParking]);

  React.useEffect(() => {
    if (modalPropsData) {
      setVisible(true);
    }
  }, [modalPropsData]);

  return (
    <FadeInView>
      {modalPropsData ? (
        <AdminDialog
          {...modalPropsData}
          visibleModal={visible}
          setVisibleModal={setVisible}
          setModalPropsData={setModalPropsData}
        />
      ) : null}

      <AdminAddBookingDiaglog />
      <AdminReportBookingDialog />
      <AdminEndSessionDiaglog />
      <AlertNotificationRoot>
        <VStack flex={1} bgColor="white" safeAreaTop={8} py={6} px={5}>
          <HStack justifyContent="flex-end" pb={6}>
            <IconButton
              alignSelf="flex-start"
              backgroundColor="white"
              shadow="6"
              rounded="2xl"
              _pressed={{bgColor: 'gray.200'}}
              onPress={() => qrHandler()}
              _icon={{
                color: colors.primary,
                size: 'xl',
                as: Icon,
                name: 'qrcode',
              }}
            />
          </HStack>
          <ScrollView>
            <HStack space={1}>
              <Text
                style={{
                  ...styles.fontStyleDefault,
                  fontWeight: '400',
                  fontSize: 28,
                }}>
                Hi
              </Text>
              <Text
                style={{
                  ...styles.fontStyleDefault,
                  fontSize: 28,
                }}>
                {user.name},
              </Text>
            </HStack>

            <HStack space={1}>
              <Text
                style={{
                  ...styles.fontStyleDefault,
                  fontSize: 28,
                }}>
                Welcome ! 😻
              </Text>
            </HStack>

            <VStack space={4} pt={6}>
              <Text
                style={{
                  ...styles.fontStyleDefault,
                  fontWeight: '600',
                  fontSize: 22,
                }}>
                Slots & Bookings
              </Text>
              <HStack space={4} justifyContent="space-between">
                <VStack
                  bgColor="#f0fcf0"
                  p={4}
                  flex={1}
                  rounded="xl"
                  alignItems="center">
                  <Text
                    style={{
                      ...styles.fontStyleDefault,
                      fontWeight: 'bold',
                      fontSize: 12,
                    }}
                    textAlign="center">
                    No. of available slots
                  </Text>
                  <AnimatedCircularProgress
                    size={120}
                    width={15}
                    fill={8}
                    tintColor="#81d887"
                    onAnimationComplete={() =>
                      console.log('onAnimationComplete')
                    }
                    backgroundColor="white">
                    {() => (
                      <Text
                        color="#8adb90"
                        style={{
                          ...styles.fontStyleDefault,
                          fontWeight: 'bold',
                          fontSize: 22,
                        }}>
                        12
                      </Text>
                    )}
                  </AnimatedCircularProgress>
                </VStack>
                <VStack
                  flex={1}
                  bgColor="#ffefe2"
                  p={4}
                  rounded="xl"
                  alignItems="center">
                  <Text
                    style={{
                      ...styles.fontStyleDefault,
                      fontWeight: 'bold',
                      fontSize: 12,
                    }}
                    textAlign="center">
                    Monthly Revenue
                  </Text>
                  <AnimatedCircularProgress
                    size={120}
                    width={15}
                    fill={55}
                    tintColor="#ffb681"
                    onAnimationComplete={() =>
                      console.log('onAnimationComplete')
                    }
                    backgroundColor="white">
                    {() => (
                      <Text
                        color="#ffb785"
                        style={{
                          ...styles.fontStyleDefault,
                          fontWeight: 'bold',
                          fontSize: 22,
                        }}>
                        55
                      </Text>
                    )}
                  </AnimatedCircularProgress>
                </VStack>
              </HStack>
            </VStack>

            <AlertNotificationRoot>
              <VStack space={4} pt={6}>
                <HStack
                  space={4}
                  alignItems="center"
                  justifyContent="space-between">
                  <Text
                    style={{
                      ...styles.fontStyleDefault,
                      fontWeight: '600',
                      fontSize: 22,
                    }}>
                    List of parking lots
                  </Text>
                  <Text underline>See more</Text>
                </HStack>

                {loading || isRefetching ? (
                  <Spinner />
                ) : (
                  <Stack
                    bgColor="green.200"
                    w="full"
                    rounded="lg"
                    p={4}
                    px={6}
                    space={6}
                    direction="row"
                    flexWrap="wrap">
                    {bookingListLogs?.map((a, index) => (
                      <Circle
                        status={a.status}
                        text={a.lotId}
                        key={index}
                        data={a}
                        setSelectedTypeOfParking={setSelectedTypeOfParking}
                      />
                    ))}
                  </Stack>
                )}
              </VStack>
            </AlertNotificationRoot>
          </ScrollView>
        </VStack>
      </AlertNotificationRoot>
    </FadeInView>
  );
};

export default Admin;

const styles = StyleSheet.create({
  fontStyleDefault: {
    fontWeight: '700',
    fontFamily: 'OpenSans-Regular',
    lineHeight: 34,
    fontSize: 20,
  },
});
