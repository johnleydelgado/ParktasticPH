import {useEffect, useState} from 'react';
import firestore, {firebase} from '@react-native-firebase/firestore';
import {BookingProps, ParkingSpacesProps} from '@/common/schema/main';
import {COLLECTIONS} from '@/common/constant/firestore';

const useBookingHistory = () => {
  const [bookingHistory, setBookingHistory] = useState<BookingProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);

    const userId = firebase.auth().currentUser?.uid;
    const vehiclesRef = firestore()
      .collection(COLLECTIONS.BOOKING)
      .where('createdById', '==', userId);

    const subscriber = vehiclesRef.onSnapshot(async querySnapshot => {
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

        const data = await Promise.all(dataPromises);

        setBookingHistory(data);
        setLoading(false);
      } catch (e: any) {
        setError(e);
        setLoading(false);
      }
    });

    // Stop listening for updates when no longer required
    return () => subscriber();
  }, []);

  return {bookingHistory, loading, error};
};

export default useBookingHistory;
