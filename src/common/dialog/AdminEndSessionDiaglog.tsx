import {useAppDispatch, useAppSelector} from '@/hooks/reduxHooks';
import {Button, HStack} from 'native-base';
import * as React from 'react';
import {Dialog, Portal, Text} from 'react-native-paper';
import {modalName} from '../constant/modal';
import {closeModal} from '@/redux/nonPersistState';
import {bookingLogsProps} from '../schema/main';
import firestore from '@react-native-firebase/firestore';
import {COLLECTIONS} from '../constant/firestore';
import useGetBookingLogs from '@/hooks/useGetBookingLogs';

export interface ModalAdminProps {}

const AdminEndSessionDiaglog: React.FC<ModalAdminProps> = () => {
  const {openModals, selectedParkingLot} = useAppSelector(
    state => state.nonPersistState,
  );

  const {refetch} = useGetBookingLogs(false);

  const dispatch = useAppDispatch();
  const endSessionHandler = async () => {
    try {
      const querySnapshot = await firestore()
        .collection(COLLECTIONS.BOOKING_LOGS)
        .where('bookingId', '==', selectedParkingLot?.bookingId)
        .get();

      const userDoc = querySnapshot.docs[0];
      const bookingLogsData = userDoc.data() as bookingLogsProps;

      // setVisibleModal(false);
      const obj: bookingLogsProps = {
        ...bookingLogsData,
        timeOutLog: new Date().toISOString(),
      };

      // // Step 2: Update each document individually
      const updatePromises = querySnapshot.docs.map(doc => doc.ref.update(obj));

      // // Wait for all updates to complete
      await Promise.all(updatePromises);
      refetch();
      dispatch(closeModal(modalName.ADMIN_END_SESSION_BOOKING));
    } catch (e) {
      console.error(e);
    }

    // setModalPropsData(null);
  };

  const hideDialog = async () => {
    dispatch(closeModal(modalName.ADMIN_END_SESSION_BOOKING));
    // setModalPropsData(null);
  };

  return (
    <Portal>
      <Dialog
        visible={openModals.includes(modalName.ADMIN_END_SESSION_BOOKING)}
        onDismiss={hideDialog}>
        <Dialog.Title>This parking space is already occupied</Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium">Please select actions</Text>
        </Dialog.Content>
        <Dialog.Actions
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <HStack space={2}>
            <Button
              onPress={() => {
                endSessionHandler();
              }}
              rounded="3xl"
              bgColor={'red.500'}
              _pressed={{bgColor: 'red.200'}}>
              End Session
            </Button>
          </HStack>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default AdminEndSessionDiaglog;
