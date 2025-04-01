// import {useState} from 'react';
import {BookingProps} from '@/common/schema/main';
import useGetBookingLogs from '@/hooks/useGetBookingLogs';
import {useAppDispatch, useAppSelector} from '@/hooks/reduxHooks';
import firestore, {firebase} from '@react-native-firebase/firestore';
import generateRandomString from '@/common/helper/generateRandomChar';
import {COLLECTIONS} from '@/common/constant/firestore';
import {ALERT_TYPE, Dialog} from 'react-native-alert-notification';
import {closeModal} from '@/redux/nonPersistState';
import {modalName} from '@/common/constant/modal';
import {createFireStore} from '@/common/api/main';

export default function useManualBooking() {
  const {parkingSpaceData, loading} = useGetBookingLogs(true);
  const {manualBooking, selectedParkingLot} = useAppSelector(
    state => state.nonPersistState,
  );
  const {user} = useAppSelector(state => state.common);
  const dispatch = useAppDispatch();

  // const [isLoading, setLoading] = useState(false);
  const saveManualBooking = () => {
    if (!loading) {
      const userId = firebase.auth().currentUser?.uid;
      const dateObject = new Date(manualBooking?.booking_date || new Date());
      console.log('selectedParkingLot', selectedParkingLot);
      // Convert the JavaScript Date object to a Firestore Timestamp
      const firestoreTimestamp =
        firebase.firestore.Timestamp.fromDate(dateObject);
      let fValues: BookingProps = {
        createdById: userId,
        booking_date: firestoreTimestamp,
        parking_space_id: parkingSpaceData?.id || '',
        payment_method: 'wallet',
        plate_no: manualBooking?.plate_no || '',
        rate: parkingSpaceData?.rate || 0,
        vehicle: manualBooking?.vehicle || '',
        qr_code: {
          qrCode: generateRandomString(8),
          email: user.email,
          address: '',
          bookingId: '',
          lotId: selectedParkingLot?.lotId || '',
          parkingLotId: selectedParkingLot?.parkingLotId || '',
          parkingSpaceId: parkingSpaceData?.id || '',
          booking_date: firestoreTimestamp,
        },
        duration: manualBooking?.duration || 0,
        parkBuddyId: parkingSpaceData?.createdById || '',
      };

      const userDocRef = firestore().collection(COLLECTIONS.BOOKING);

      userDocRef
        .add(fValues)
        .then(async docRef => {
          await docRef.update({
            qr_code: {
              ...fValues.qr_code,
              bookingId: docRef.id,
            },
          });

          await createFireStore({
            collection: COLLECTIONS.BOOKING_LOGS,
            values: {
              ...fValues.qr_code,
              bookingId: docRef.id,
              parkBuddyId: parkingSpaceData?.createdById || '',
            },
          });

          if (selectedParkingLot) {
            const batch = firestore().batch();
            await batch.commit();
          }

          Dialog.show({
            type: ALERT_TYPE.SUCCESS,
            title: 'Success',
            textBody: 'Yey, 1 parking slot booked manually',
            button: 'close',
            onHide: () => {
              dispatch(closeModal(modalName.ADMIN_ADD_BOOKING));
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
    }
  };

  return {saveManualBooking};
}
