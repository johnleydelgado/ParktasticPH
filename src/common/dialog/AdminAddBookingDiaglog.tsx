/* eslint-disable react-hooks/exhaustive-deps */
import {useAppDispatch, useAppSelector} from '@/hooks/reduxHooks';
import {
  Button,
  FormControl,
  HStack,
  Input,
  ScrollView,
  Slider,
  Text,
  VStack,
} from 'native-base';
import * as React from 'react';
import {Dialog, Portal} from 'react-native-paper';
import {modalName} from '../constant/modal';
import {
  ManualBookingProps,
  closeModal,
  setManualBooking,
  setSelectedBookingDate,
  setSelectedParkingLot,
} from '@/redux/nonPersistState';
import {colors} from '../constant/colors';
import DatePicker from 'react-native-date-picker';
import {Animated} from 'react-native';
import useManualBooking from '@/screens/admin/hooks/useManualBooking';
import {isEmpty} from 'lodash';

const AdminAddBookingDiaglog = () => {
  const {openModals, manualBooking} = useAppSelector(
    state => state.nonPersistState,
  );

  const [hrs, setHrs] = React.useState<number>(1);
  const [date, setDate] = React.useState(new Date());

  const [toggle, setToggle] = React.useState(false);
  const position1 = React.useState(new Animated.Value(0))[0];
  const position2 = React.useState(new Animated.Value(500))[0]; // assuming -500 hides it initially
  const [heightAnim] = React.useState(new Animated.Value(500));
  const [manualBookingData, setManualBookingData] =
    React.useState<ManualBookingProps | null>(null);

  const {saveManualBooking} = useManualBooking();

  const dispatch = useAppDispatch();
  const hideDialog = () => {
    // Reset animated values to initial positions instantly
    position1.setValue(0); // Reset to initial position
    position2.setValue(500); // Reset to initial off-screen position
    heightAnim.setValue(500); // Reset to initial height

    // Close the modal and update the state
    dispatch(closeModal(modalName.ADMIN_ADD_BOOKING));
    setToggle(false);
    dispatch(setSelectedParkingLot(null));
  };

  const toggleViews = () => {
    setToggle(!toggle);
    Animated.parallel([
      Animated.timing(position1, {
        toValue: toggle ? 0 : -500, // moving right
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(position2, {
        toValue: toggle ? 500 : 0, // coming from left to right
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(heightAnim, {
        // animate height too
        toValue: toggle ? 500 : 270,
        duration: 500,
        useNativeDriver: false,
      }),
    ]).start();
    if (date && hrs) {
      dispatch(
        setSelectedBookingDate({
          bookingDate: date.toString(),
          duration: hrs,
        }),
      );
    }
  };

  const textFieldOnChange = (key: string, value: string) => {
    const initData = {
      booking_date: '',
      duration: 0,
      payment_method: 'wallet',
      plate_no: '',
      vehicle: '',
    };

    switch (key) {
      case 'vehicle':
        setManualBookingData(prev => {
          if (prev === null) {
            return {
              ...initData,
              vehicle: value,
            };
          }
          return {...prev, vehicle: value};
        });
        break;

      case 'plate_no':
        setManualBookingData(prev => {
          if (prev === null) {
            return {
              ...initData,
              plate_no: value,
            };
          }
          return {...prev, plate_no: value};
        });
        break;

      default:
        return;
    }
  };

  const saveHandler = () => {
    // `${selectedVehicle.modelYear} ${selectedVehicle.make} ${selectedVehicle.brand}`,
    if (!isEmpty(manualBookingData)) {
      dispatch(
        setManualBooking({
          ...manualBookingData,
          booking_date: date.toString(),
          duration: hrs,
          payment_method: 'wallet',
        }),
      );
    }
  };

  React.useEffect(() => {
    if (!isEmpty(manualBooking)) {
      saveManualBooking();
    }
  }, [manualBooking]);

  return (
    <Portal>
      <Dialog
        visible={openModals.includes(modalName.ADMIN_ADD_BOOKING)}
        onDismiss={hideDialog}>
        <ScrollView keyboardShouldPersistTaps="handled">
          <Dialog.Title>Create manual booking</Dialog.Title>
          <Animated.View
            style={{
              position: 'relative',
              height: heightAnim, // Animated height
            }}>
            <Animated.View
              style={{
                position: 'absolute',
                width: '100%',
                transform: [{translateX: position1}],
              }}>
              <Dialog.Content>
                <VStack space={2} alignItems="flex-start">
                  <Text color="gray.500" fontSize="xl" fontWeight="medium">
                    Select Duration
                  </Text>
                  <Text
                    color="gray.400"
                    fontSize="4xl"
                    fontWeight="medium"
                    alignSelf="center">
                    {hrs} hrs
                  </Text>
                  <Slider
                    defaultValue={0}
                    minValue={0}
                    maxValue={12}
                    accessibilityLabel="a"
                    onChange={e => setHrs(e)}
                    value={hrs}
                    step={1}>
                    <Slider.Track shadow={1}>
                      <Slider.FilledTrack bgColor={colors.primary} />
                    </Slider.Track>
                    <Slider.Thumb shadow={1} bgColor={colors.primary} />
                  </Slider>
                  <Text
                    color="gray.500"
                    fontSize="xl"
                    fontWeight="medium"
                    pt={4}>
                    Select Date & Time
                  </Text>
                  <DatePicker
                    date={date}
                    androidVariant="nativeAndroid"
                    onDateChange={date => {
                      setDate(date);
                    }}
                  />
                </VStack>
              </Dialog.Content>
              <Dialog.Actions
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                }}>
                <HStack space={4} px={2}>
                  <Button
                    onPress={() => hideDialog()}
                    rounded="3xl"
                    px={4}
                    bgColor="red.500">
                    Cancel
                  </Button>
                  <Button
                    onPress={() => toggleViews()}
                    rounded="3xl"
                    px={4}
                    bgColor="green.500">
                    Next
                  </Button>
                </HStack>
              </Dialog.Actions>
            </Animated.View>
            <Animated.View
              style={{
                position: 'absolute',
                width: '100%',
                transform: [{translateX: position2}],
              }}>
              <Dialog.Content>
                <VStack space={2} alignItems="center">
                  <FormControl>
                    <FormControl.Label>Vehicle Details</FormControl.Label>
                    <Input
                      placeholder="2023 Vios Toyota"
                      borderColor={colors.primary}
                      onChangeText={e => textFieldOnChange('vehicle', e)}
                    />
                    <FormControl.Label>License Plate Number</FormControl.Label>
                    <Input
                      placeholder="Enter License Plate Number"
                      borderColor={colors.primary}
                      onChangeText={e => textFieldOnChange('plate_no', e)}
                    />
                    <FormControl.Label>Email</FormControl.Label>
                    <Input
                      placeholder="Enter Email"
                      borderColor={colors.primary}
                    />
                  </FormControl>
                </VStack>
              </Dialog.Content>
              <Dialog.Actions
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                }}>
                <HStack space={4} px={2}>
                  <Button
                    onPress={() => toggleViews()}
                    rounded="3xl"
                    px={4}
                    bgColor="red.500">
                    Prev
                  </Button>
                  <Button
                    onPress={() => saveHandler()}
                    rounded="3xl"
                    px={4}
                    bgColor="green.500">
                    Save
                  </Button>
                </HStack>
              </Dialog.Actions>
            </Animated.View>
          </Animated.View>
        </ScrollView>
      </Dialog>
    </Portal>
  );
};

export default AdminAddBookingDiaglog;
