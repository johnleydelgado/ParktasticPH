/* eslint-disable react-hooks/exhaustive-deps */
import {useEffect, useState} from 'react';
import firestore, {firebase} from '@react-native-firebase/firestore';
import {BookingProps, ParkingSpacesProps} from '@/common/schema/main';
import {COLLECTIONS} from '@/common/constant/firestore';
import {useAppSelector} from './reduxHooks';

const useBookingHistory = () => {
  const [data, setBookingHistory] = useState<BookingProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateTrigger, setUpdateTrigger] = useState(false);
  const {user} = useAppSelector(state => state.common);

  // Real-time listener for a specific Firestore collection
  useEffect(() => {
    const unsubscribe = firestore()
      .collection(COLLECTIONS.BOOKING_LOGS)
      .where('email', '==', user.email)
      .onSnapshot(() => {
        // Set a trigger to indicate that the collection has been updated
        setUpdateTrigger(prev => !prev); // Toggles the trigger
      });

    return () => unsubscribe(); // Clean up the listener when the component unmounts
  }, []);

  useEffect(() => {
    setLoading(true);

    const userId = firebase.auth().currentUser?.uid;
    const vehiclesRef = firestore()
      .collection(COLLECTIONS.BOOKING)
      .where('createdById', '==', userId);

    const subscriber = vehiclesRef.onSnapshot(
      async querySnapshot => {
        try {
          const dataPromises: Promise<BookingProps>[] = querySnapshot.docs.map(
            async documentSnapshot => {
              const fData = documentSnapshot.data() as BookingProps;
              const id = documentSnapshot.id;
              const parkingSpaceSnapshot = await firestore()
                .collection(COLLECTIONS.PARKING_SPACES)
                .doc(fData.parking_space_id)
                .get();

              if (parkingSpaceSnapshot.exists) {
                const parkingSpaceData =
                  parkingSpaceSnapshot.data() as ParkingSpacesProps;
                fData.address = parkingSpaceData.address;
                fData.id = id;
              } else {
                console.error(
                  `Document with ID ${fData.parking_space_id} does not exist.`,
                );
              }

              return fData;
            },
          );

          const dataF = await Promise.all(dataPromises);

          setBookingHistory(dataF);
          setLoading(false);
        } catch (e: any) {
          setError(e);
          setLoading(false);
        }
      },
      error => {
        console.error('Error with onSnapshot listener:', error); // Listener error logging
      },
    );

    // Stop listening for updates when no longer required
    return () => subscriber();
  }, [updateTrigger]);

  return {data, loading, error};
};

export default useBookingHistory;
