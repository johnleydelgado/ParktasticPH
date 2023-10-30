import {useEffect, useState} from 'react';
import firestore, {firebase} from '@react-native-firebase/firestore';
import {BookingProps, ParkingSpacesProps} from '@/common/schema/main';
import {COLLECTIONS} from '@/common/constant/firestore';

const useGetAllBooking = () => {
  const [bookingHistory, setBookingHistory] = useState<BookingProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);

      const topCollection = await firestore()
        .collection(COLLECTIONS.BOOKING)
        .get();

      for (const doc of topCollection.docs) {
        const userId = doc.id;

        const subCollectionSnapshot = await firestore()
          .collection(COLLECTIONS.BOOKING)
          .doc(userId)
          .collection(userId)
          .get();

        const subCollectionData = subCollectionSnapshot.docs.map(subDoc =>
          subDoc.data(),
        );
        console.log('userId', subCollectionData);

        // allData.push({ userId, subCollectionData });
      }
      // topCollection.forEach(async a => {
      //   const test = await firestore().collection(a.ref.id).get();
      //   const subCollectionData = test.docs.map(subDoc => subDoc.data());
      //   console.log('subCollectionData', test.size);
      // });
    };

    getData();
  }, []);

  return {bookingHistory, loading, error};
};

export default useGetAllBooking;
