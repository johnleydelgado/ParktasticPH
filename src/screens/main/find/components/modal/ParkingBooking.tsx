/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/react-in-jsx-scope */
import {colors} from '@/common/constant/colors';
import {useAppDispatch, useAppSelector} from '@/hooks/reduxHooks';
import {resetModal, setOpenParkingBooking} from '@/redux/nonPersistState';
import {Box, Button, HStack, Pressable, Text, VStack} from 'native-base';
import {useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import DatePicker from 'react-native-date-picker';
import Icon from 'react-native-vector-icons/FontAwesome5';
import SelectDropdown from 'react-native-select-dropdown';
import {useFormik} from 'formik';
import {BookingProps, ParkingLotDataProps} from '@/common/schema/main';
import firestore, {firebase} from '@react-native-firebase/firestore';
import {COLLECTIONS} from '@/common/constant/firestore';
import generateRandomString from '@/common/helper/generateRandomChar';
import {ALERT_TYPE, Dialog} from 'react-native-alert-notification';
import {lotStatus} from '@/common/constant/common';
import {format, isValid, parseISO} from 'date-fns';
import {fetchBookingWithAvailableSlot} from '@/common/api/main';
import {useQuery} from '@tanstack/react-query';

const INITIAL_DATA: BookingProps = {
  booking_date: new Date(),
  duration: 0,
  parking_space_id: '',
  payment_method: 'wallet',
  plate_no: '',
  qr_code: {
    qrCode: '',
    email: '',
    bookingId: '',
    lotId: '',
    address: '',
    parkingLotId: '',
    parkingSpaceId: '',
    booking_date: null,
  },
  rate: 0,
  vehicle: '',
  createdById: '',
};

const ParkingBooking = () => {
  const dispatch = useAppDispatch();
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const closeFilter = () => {
    dispatch(setOpenParkingBooking(false));
  };
  const {parkingSpaceData} = useAppSelector(state => state.nonPersistState);
  const {selectedBookingDate} = useAppSelector(state => state.nonPersistState);

  const {data: bookingSlots} = useQuery<ParkingLotDataProps[]>({
    queryKey: ['bookingAvailableSlots'],
    queryFn: () =>
      fetchBookingWithAvailableSlot(
        selectedBookingDate || null,
        parkingSpaceData || undefined,
      ),
  });

  const [hrs, setHrs] = useState<number>(1);
  const {selectedVehicle, user} = useAppSelector(state => state.common);
  const [selectedSlot, setSelectedSlot] = useState<string>('');

  const formik = useFormik({
    initialValues: INITIAL_DATA,
    enableReinitialize: true,
    onSubmit: async values => {
      try {
        const userId = firebase.auth().currentUser?.uid;
        const fValues = {...values, createdById: userId};

        const parkingLot = parkingSpaceData?.parking_lot.find(
          a => a.lotId === selectedSlot,
        );

        const parkingSpaceDocRef = await firestore()
          .collection(COLLECTIONS.PARKING_SPACES)
          .where('createdById', '==', parkingSpaceData?.createdById)
          .get();

        const parkingSpaceId = parkingSpaceDocRef.docs[0].id;

        const db = firestore();
        const userDocRef = db.collection(COLLECTIONS.BOOKING);

        fValues.qr_code = {
          ...fValues.qr_code,
          address: fValues.address || '',
          parkingLotId: parkingLot?.parkingLotId || '',
          lotId: selectedSlot,
          parkingSpaceId: parkingSpaceId,
        };

        // Create the parent document with a placeholder field.
        // userDocRef.set({placeholderField: true}, {merge: true});

        userDocRef
          .add(fValues)
          .then(async docRef => {
            await docRef.update({
              qr_code: {
                ...fValues.qr_code,
                bookingId: docRef.id,
              },
            });

            if (parkingLot) {
              // const querySnapshot = await firestore()
              //   .collection(COLLECTIONS.PARKING_SLOTS)
              //   .doc(parkingLot?.parkingLotId)
              //   .get();

              const batch = firestore().batch();
              // const ref = querySnapshot.ref;
              // batch.update(ref, {status: lotStatus.na});
              await batch.commit();
            }

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
      }
    },
  });
  useEffect(() => {
    if (parkingSpaceData) {
      const dateObject = new Date(
        selectedBookingDate?.bookingDate || new Date(),
      );

      // Convert the JavaScript Date object to a Firestore Timestamp
      const firestoreTimestamp =
        firebase.firestore.Timestamp.fromDate(dateObject);

      formik.setFieldValue(
        'vehicle',
        `${selectedVehicle.modelYear} ${selectedVehicle.make} ${selectedVehicle.brand}`,
      );
      formik.setFieldValue('rate', parkingSpaceData.rate);
      formik.setFieldValue('plate_no', selectedVehicle.licenseNum);
      formik.setFieldValue('parking_space_id', parkingSpaceData.id);
      formik.setFieldValue('qr_code', {
        qrCode: generateRandomString(8),
        email: user.email,
      });
      formik.setFieldValue('duration', selectedBookingDate?.duration || 0);
      formik.setFieldValue('booking_date', firestoreTimestamp);
    }
  }, [parkingSpaceData]);

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
            data={bookingSlots ? bookingSlots.map(lot => lot.lotId) : []}
            buttonStyle={{
              borderColor: colors.primary,
              backgroundColor: 'white',
              borderWidth: 1,
              borderRadius: 8,
              height: 32,
            }}
            defaultButtonText=" "
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
        {selectedSlot ? (
          <VStack p={8} space={4}>
            <VStack bgColor={colors.bgColor} p={8} space={2}>
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

              <Text>DATE:</Text>
              <Text fontWeight="bold">
                {selectedBookingDate?.bookingDate
                  ? format(
                      new Date(selectedBookingDate?.bookingDate),
                      'MMM dd yyyy hh:mm aaa',
                    )
                  : ''}
              </Text>
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
        ) : null}
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
