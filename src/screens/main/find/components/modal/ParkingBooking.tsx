/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/react-in-jsx-scope */
import {colors} from '@/common/constant/colors';
import {useAppDispatch, useAppSelector} from '@/hooks/reduxHooks';
import {resetModal, setOpenParkingBooking} from '@/redux/nonPersistState';
import {
  Box,
  Button,
  HStack,
  IconButton,
  Pressable,
  Slider,
  // Slider,
  Text,
  VStack,
} from 'native-base';
import {useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import DatePicker from 'react-native-date-picker';
import Icon from 'react-native-vector-icons/FontAwesome5';
import SelectDropdown from 'react-native-select-dropdown';
import {useFormik} from 'formik';
import {BookingProps} from '@/common/schema/main';
import firestore, {firebase} from '@react-native-firebase/firestore';
import {COLLECTIONS} from '@/common/constant/firestore';
import generateRandomString from '@/common/helper/generateRandomChar';
import {ALERT_TYPE, Dialog} from 'react-native-alert-notification';
// import RangeSlider from 'rn-range-slider';

const INITIAL_DATA: BookingProps = {
  booking_date: new Date(),
  duration: 0,
  parking_space_id: '',
  payment_method: 'wallet',
  plate_no: '',
  qr_code: '',
  rate: 0,
  vehicle: '',
};

const ParkingBooking = () => {
  const dispatch = useAppDispatch();
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const closeFilter = () => {
    dispatch(setOpenParkingBooking(false));
  };
  const {parkingSpaceData} = useAppSelector(state => state.nonPersistState);

  const [hrs, setHrs] = useState<number>(1);
  const {selectedVehicle} = useAppSelector(state => state.common);
  const [selectedSlot, setSelectedSlot] = useState<string>('');

  const formik = useFormik({
    initialValues: INITIAL_DATA,
    enableReinitialize: true,
    onSubmit: values => {
      try {
        const userId = firebase.auth().currentUser?.uid;
        firestore()
          .collection(COLLECTIONS.BOOKING)
          .doc(userId)
          .collection(userId || '')
          .add(values)
          .then(() => {
            // closeCreateUpdateModal();
            Dialog.show({
              type: ALERT_TYPE.SUCCESS,
              title: 'Success',
              textBody: 'Yey, 1 parking slot already booked for you.',
              button: 'close',
              onHide: () => {
                dispatch(resetModal());
              },
            });
          })
          .catch((err: any) => {
            Dialog.show({
              type: ALERT_TYPE.DANGER,
              title: 'Fail',
              textBody: err,
              button: 'close',
            });
            // closeCreateUpdateModal();
          });
      } catch (e: any) {
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: 'Fail',
          textBody: e,
          button: 'close',
        });
        // closeCreateUpdateModal();
      }

      //   alert(JSON.stringify(values, null, 2));
    },
  });
  const {openModals} = useAppSelector(state => state.common);
  console.log('openModals', openModals);
  useEffect(() => {
    if (parkingSpaceData) {
      formik.setFieldValue(
        'vehicle',
        `${selectedVehicle.modelYear} ${selectedVehicle.make} ${selectedVehicle.brand}`,
      );
      formik.setFieldValue('rate', parkingSpaceData.rate);
      formik.setFieldValue('plate_no', selectedVehicle.licenseNum);
      formik.setFieldValue('parking_space_id', parkingSpaceData.id);
      formik.setFieldValue('qr_code', generateRandomString(8));
    }
  }, [parkingSpaceData]);

  useEffect(() => {
    if (hrs) {
      formik.setFieldValue('duration', hrs);
    }
  }, [hrs]);

  return (
    <VStack flex={1} bgColor="white">
      <Box safeAreaTop={12} h="20%" w="full" bgColor="white">
        <Box px={8} alignItems="center" justifyContent="center">
          <Pressable
            position="absolute"
            left={6}
            onPress={closeFilter}
            p={2}
            rounded={16}
            _pressed={{bgColor: 'gray.200'}}>
            <Icon name="arrow-left" color={colors.textDark} size={26} />
          </Pressable>
          <Text style={{...styles.fontStyleDefault}} fontSize="3xl">
            Booking
          </Text>
        </Box>
        <HStack space={2} px={8} pt={2} alignItems="center">
          <Text style={{...styles.fontStyleDefault, fontSize: 14}} pr={4}>
            Select Slot
          </Text>
          <SelectDropdown
            data={Object.entries(parkingSpaceData?.parking_lot || [])
              .filter(([key, value]) => value === false)
              .map(([key, value]) => key)}
            buttonStyle={{
              borderColor: colors.primary,
              backgroundColor: 'white',
              borderWidth: 1,
              borderRadius: 8,
            }}
            onSelect={(selectedItem, index) => {
              console.log(selectedItem, index);
              setSelectedSlot(selectedItem);
            }}
            buttonTextAfterSelection={(selectedItem, index) => {
              // text represented after item is selected
              // if data array is an array of objects then return selectedItem.property to render after item is selected
              return selectedItem;
            }}
            rowTextForSelection={(item, index) => {
              // text represented for each item in dropdown
              // if data array is an array of objects then return item.property to represent item in dropdown
              return item;
            }}
          />
        </HStack>
        <VStack p={8} space={4}>
          <HStack justifyContent="space-between" alignItems="center">
            <Text style={{...styles.fontStyleDefault, fontSize: 14}}>
              Duration
            </Text>
            <IconButton
              size={18}
              p={4}
              onPress={() => setOpen(true)}
              _icon={{
                color: colors.primary,
                size: 'md',
                as: Icon,
                name: 'calendar',
              }}
              _pressed={{
                bg: 'green.600:alpha.20',
              }}
            />
          </HStack>
          <VStack space={2} alignItems="center">
            <Text color="gray.400" fontSize="4xl" fontWeight="medium">
              {hrs} hrs
            </Text>
            <Slider
              w="full"
              maxW="300"
              defaultValue={1}
              minValue={1}
              maxValue={12}
              step={1}
              colorScheme="green"
              onChange={e => setHrs(e)}>
              <Slider.Track>
                <Slider.FilledTrack />
              </Slider.Track>
              <Slider.Thumb />
            </Slider>
          </VStack>

          <VStack bgColor={colors.bgColor} p={8} space={4}>
            <Text>VEHICLE</Text>
            <HStack space={2}>
              <Text fontWeight="bold">
                {selectedVehicle.modelYear} {selectedVehicle.make}{' '}
                {selectedVehicle.brand}
              </Text>
              <Text fontWeight="bold">• {selectedVehicle.licenseNum}</Text>
            </HStack>

            <Text>PARKING LOT</Text>
            <HStack space={2} flexWrap="wrap">
              <Text fontWeight="bold">{parkingSpaceData?.address}</Text>
              <Text fontWeight="bold">• Slot {selectedSlot}</Text>
            </HStack>
          </VStack>

          <HStack
            justifyContent="space-between"
            bgColor="blue.100"
            borderLeftWidth={6}
            mt={-4}
            zIndex={99}
            borderLeftColor={colors.primary}
            p={4}>
            <Text color="gray.500">TOTAL</Text>
            <Text fontWeight="bold">P{parkingSpaceData?.rate}.00</Text>
          </HStack>

          <Button
            my={8}
            rounded={8}
            bgColor={colors.primary}
            _pressed={{bgColor: 'gray.600'}}
            _text={{fontWeight: 'bold'}}
            onPress={() => formik.handleSubmit()}>
            Confirm & Pay
          </Button>

          <DatePicker
            modal
            open={open}
            date={date}
            onConfirm={date => {
              setOpen(false);
              setDate(date);
            }}
            onCancel={() => {
              setOpen(false);
            }}
          />
        </VStack>
      </Box>
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

export default ParkingBooking;
