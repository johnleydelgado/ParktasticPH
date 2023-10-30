import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import {
  BookingProps,
  ParkingLotDataProps,
  ParkingSpacesProps,
} from '../schema/main';
import {getDistance, isPointWithinRadius} from 'geolib';
import {COLLECTIONS} from '../constant/firestore';
import {
  bookingDateProps,
  isSlotAvailable,
  isTimeSlotWithinBounds,
} from './helper';
import {isEmpty} from 'lodash';
// import {firebase} from '@react-native-firebase/auth';

interface LocLatLngProps {
  lat: string;
  lng: string;
}

export const fetchParkingSpaces = async (
  searchLocLatLang: LocLatLngProps | null,
  bookingDate: bookingDateProps | null,
): Promise<ParkingSpacesProps[]> => {
  const querySnapshot = await firestore().collection('ParkingSpaces').get();
  // const userId = firebase.auth().currentUser?.uid;
  const parkingSpaces: ParkingSpacesProps[] = [];
  let promises: Promise<void>[] = [];

  if (searchLocLatLang) {
    promises = querySnapshot.docs.map(async documentSnapshot => {
      const docId = documentSnapshot.id; // Extract the document ID
      const data = documentSnapshot.data() as ParkingSpacesProps;
      try {
        // const parkingLotSnapshot = await firestoreReadWithoutCol({
        //   collection: COLLECTIONS.PARKING_SLOTS,
        // });

        const parkingLotsCol = await firestore()
          .collection(COLLECTIONS.PARKING_SLOTS)
          .get();
        // const parkingLotSnapshot = parkingLotsCol.docs.map(doc => {

        //   return {
        //     ...doc.data(),
        //     parkingLotId: doc.id,
        //   };
        // });

        const parkingLotSnapshot = data.parking_lot.flatMap(i => {
          return parkingLotsCol.docs
            .filter(doc => doc.id === i.id)
            .map(doc => ({
              ...doc.data(),
              parkingLotId: doc.id,
            }));
        });

        const location = data.location;
        const isWithin = isPointWithinRadius(
          {latitude: location?.lat || 0, longitude: location?.lng || 0},
          {
            latitude: searchLocLatLang.lat,
            longitude: searchLocLatLang.lng,
          },
          2000,
        );

        const distanceM = getDistance(
          {latitude: location?.lat || 0, longitude: location?.lng || 0},
          {
            latitude: searchLocLatLang.lat,
            longitude: searchLocLatLang.lng,
          },
        );

        data.km = distanceM / 1000;
        data.m = distanceM;
        data.id = docId;

        data.parking_lot =
          parkingLotSnapshot as unknown as ParkingLotDataProps[];
        if (bookingDate) {
          if (
            isWithin &&
            isTimeSlotWithinBounds(bookingDate, data.time_from, data.time_to)
          ) {
            parkingSpaces.push(data);
          }
        }
      } catch (error) {
        console.warn(error);
      }
    });

    // Wait for all promises to complete before returning the result
    await Promise.all(promises);
  }

  return parkingSpaces;
};

export const fetchBookingWithAvailableSlot = async (
  bookingDate: bookingDateProps | null,
  parkingData: ParkingSpacesProps | undefined,
): Promise<ParkingLotDataProps[]> => {
  const querySnapshot = await firestore().collection(COLLECTIONS.BOOKING).get();

  if (!parkingData?.parking_lot) {
    return []; // Ensure to return an empty array if parkingData?.parking_lot is not available
  }

  const promises = parkingData.parking_lot.map(a => {
    const isBookingAlreadyExist = querySnapshot.docs.find(documentSnapshot => {
      const data = documentSnapshot.data() as BookingProps;
      if (bookingDate) {
        if (
          data.qr_code.parkingLotId === a.parkingLotId &&
          !isSlotAvailable(data, bookingDate)
        ) {
          return data;
        }
      }
      return false;
    });
    if (isEmpty(isBookingAlreadyExist)) {
      return a;
    } else {
      if (bookingDate) {
        if (isBookingAlreadyExist) {
          return null;
        }
      }
    }
  });

  const results = await Promise.all(promises);
  return results.filter(result => result !== null) as ParkingLotDataProps[]; // Filter out null values and assert the type
};

export const firestoreAdd = async <
  T extends FirebaseFirestoreTypes.DocumentData,
>({
  collection,
  userId,
  values,
}: {
  collection: string;
  userId: string | undefined;
  values: T;
}) => {
  try {
    await firestore()
      .collection(collection)
      .doc(userId || '')
      .collection(userId || '')
      .add(values);

    console.log('Successfully added parking slot');
    return true;
  } catch (error) {
    console.log('Error adding parking slot:', error);
    return false;
  }
};

export const createFireStore = async <
  T extends FirebaseFirestoreTypes.DocumentData,
>({
  collection,
  values,
}: {
  collection: string;
  values: T;
}) => {
  try {
    await firestore().collection(collection).add(values);

    console.log('Successfully created');
    return true;
  } catch (error) {
    console.log('Error in creation:', error);
    return false;
  }
};

export const firestoreRead = async <T>({
  collection,
  userId,
}: {
  collection: string;
  userId: string | undefined;
}): Promise<T[] | null> => {
  try {
    const querySnapshot = await firestore()
      .collection(collection)
      .doc(userId || '')
      .collection(userId || '')
      .get();

    const data: T[] = querySnapshot.docs.map(doc => doc.data() as T);

    console.log('Successfully fetched data');
    return data;
  } catch (error) {
    console.log('Error fetching data:', error);
    return null;
  }
};

export const firestoreReadWithoutCol = async <T>({
  collection,
}: {
  collection: string;
}): Promise<T[] | null> => {
  try {
    const querySnapshot = await firestore().collection(collection).get();

    const data: T[] = querySnapshot.docs.map(doc => doc.data() as T);
    console.log('Successfully fetched data');
    return data;
  } catch (error) {
    console.log('Error fetching data:', error);
    return null;
  }
};
