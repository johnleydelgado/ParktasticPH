/* eslint-disable react-hooks/exhaustive-deps */
import {useAppDispatch, useAppSelector} from '@/hooks/reduxHooks';
import {Button, HStack, ScrollView, Slider, Text, VStack} from 'native-base';
import * as React from 'react';
import {Dialog, Portal} from 'react-native-paper';
import {
  closeModal,
  openModal,
  setSelectedBookingDate,
} from '@/redux/nonPersistState';
import {modalName} from '@/common/constant/modal';
import {colors} from '@/common/constant/colors';
import DatePicker from 'react-native-date-picker';

const SelectBookingDate = () => {
  const {openModals, selectedBookingDate} = useAppSelector(
    state => state.nonPersistState,
  );
  const [hrs, setHrs] = React.useState<number>(0);
  const [date, setDate] = React.useState(new Date());

  const dispatch = useAppDispatch();
  const hideDialog = () => {
    dispatch(closeModal(modalName.BOOKING_DATE));
  };

  const saveHandler = () => {
    if (date && hrs) {
      dispatch(
        setSelectedBookingDate({
          bookingDate: date.toString(),
          duration: hrs,
        }),
      );
      hideDialog();
    }
  };

  React.useEffect(() => {
    if (selectedBookingDate) {
      dispatch(openModal(modalName.BOOK_PARKING_LIST));
    }
  }, [selectedBookingDate]);

  return (
    <Portal>
      <Dialog
        visible={openModals.includes(modalName.BOOKING_DATE)}
        onDismiss={hideDialog}>
        <ScrollView keyboardShouldPersistTaps="handled">
          <Dialog.Title>Please choose a date, time, and duration.</Dialog.Title>
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
              <Text color="gray.500" fontSize="xl" fontWeight="medium" pt={4}>
                Select Date & Time
              </Text>
              <DatePicker
                date={date}
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
                _pressed={{bgColor: 'green.100'}}
                onPress={saveHandler}
                rounded="3xl"
                px={4}
                bgColor="green.500">
                Save
              </Button>
            </HStack>
          </Dialog.Actions>
        </ScrollView>
      </Dialog>
    </Portal>
  );
};

export default SelectBookingDate;
