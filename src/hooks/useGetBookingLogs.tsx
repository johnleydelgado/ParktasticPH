/* eslint-disable react-hooks/exhaustive-deps */
import {useEffect, useState} from 'react';
import firestore, {firebase} from '@react-native-firebase/firestore';
import {
  BookingProps,
  // BookingProps,
  // ParkingSlotsProps,
  ParkingSpacesProps,
  bookingLogsProps,
  listOfBookingProps,
} from '@/common/schema/main';
import {COLLECTIONS} from '@/common/constant/firestore';
import {
  add,
  formatISO,
  fromUnixTime,
  isWithinInterval,
  parseISO,
} from 'date-fns';
// import isWithinTwoHours from './isWithinHours';

function convertTimestampToDate(seconds: number, nanoseconds: number) {
  // Converting seconds and nanoseconds to a date
  const dateInSeconds = fromUnixTime(seconds);
  const dateInMilliseconds = new Date(
    dateInSeconds.getTime() + nanoseconds / 1e6,
  );

  // Formatting the date to an ISO string
  return formatISO(dateInMilliseconds);
}

const useGetBookingLogs = (onlyGetParkingSpaceData: boolean) => {
  const [bookingListLogs, setBookingListLogs] = useState<listOfBookingProps[]>(
    [],
  );
  const [parkingSpaceData, setParkingSpaceData] =
    useState<ParkingSpacesProps>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const userId = firebase.auth().currentUser?.uid;

  // const fetchData = async () => {
  //   setLoading(true);
  //   try {
  //     let allData: any[] = [];

  //     const parkingLotsCollection = await firestore()
  //       .collection(COLLECTIONS.PARKING_SLOTS)
  //       .where('userId', '==', userId)
  //       .get();

  //     for (const doc of parkingLotsCollection.docs) {
  //       try {
  //         const parkingLotId = doc.id;
  //         // const docData = doc.data() as ParkingSlotsProps;

  //         const bookingLogsCollection = await firestore()
  //           .collection(COLLECTIONS.BOOKING_LOGS)
  //           .where('parkingLotId', '==', parkingLotId)
  //           .get();

  //         const BookingCollection = await firestore()
  //           .collection(COLLECTIONS.BOOKING)
  //           .where('qr_code.parkingLotId', '==', parkingLotId)
  //           .get();

  //         const bookingLogsObj =
  //           bookingLogsCollection.docs[0]?.data() as bookingLogsProps;

  //         const bookingsObj = BookingCollection.docs[0]?.data() as BookingProps;
  //         let status, dataToPush;

  //         if (!bookingsObj) {
  //           status = 'Available';
  //           dataToPush = {...doc.data()};
  //           allData.push({
  //             ...dataToPush,
  //             status,
  //             parkingLotId,
  //           });
  //           continue;
  //         }

  //         // const bookingObj =
  //         //   bookingLogsCollection.docs[0]?.data() as BookingProps;
  //         const timeLog = parseISO(bookingLogsObj?.timeLog);
  //         // const timeReserved = parseISO(bookingsObj?.booking_date);
  //         const isoDate = convertTimestampToDate(
  //           bookingsObj?.booking_date.seconds,
  //           bookingsObj?.booking_date.nanoseconds,
  //         );
  //         const currentDate = new Date();
  //         const timeReserved = new Date(isoDate);
  //         // Convert the JavaScript Date object to a Firestore Timestamp

  //         // Defining the range around the current date.
  //         // For example, I'm using a range of one hour before and after the current time.
  //         // Check if the timeLog is within specific hour ranges
  //         const isWithinRange = (
  //           startHours: number,
  //           endHours: number,
  //           isTimeLog: boolean,
  //         ) =>
  //           isWithinInterval(isTimeLog ? timeLog : timeReserved, {
  //             start: add(currentDate, {hours: startHours}),
  //             end: add(currentDate, {hours: endHours}),
  //           });
  //         // Decide the status and the data to push based on the range
  //         if (isWithinRange(-1, 1, true)) {
  //           status = 'Not Available';
  //           dataToPush = {...doc.data()};
  //         } else if (isWithinRange(-3, 3, false)) {
  //           status = 'Reserved';
  //           dataToPush = {...doc.data()};
  //         } else {
  //           status = 'Available';
  //           dataToPush = {...doc.data()};
  //         }
  //         // Push the decided data with status and parkingLotId
  //         allData.push({
  //           ...dataToPush,
  //           status,
  //           parkingLotId,
  //         });
  //       } catch (e) {
  //         continue;
  //       }
  //     }
  //     setBookingListLogs(allData);
  //   } catch (e: any) {
  //     console.log('ERROR: ', e);
  //     setError(e);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const fetchParkingSpaceData = async () => {
  //   setLoading(true);
  //   // get parkingSpace data
  //   const parkingSpaceData = await firestore()
  //     .collection(COLLECTIONS.PARKING_SPACES)
  //     .where('createdById', '==', userId)
  //     .get();

  //   const parkingSpaceArray = parkingSpaceData.docs.map(doc => ({
  //     id: doc.id,
  //     ...doc.data(),
  //   }));
  //   setParkingSpaceData(parkingSpaceArray[0] as ParkingSpacesProps);
  // };

  useEffect(() => {
    const unsubscribes: {(): void; (): void}[] = []; // To hold unsubscribe functions

    const fetchData = () => {
      setLoading(true);

      const parkingLotsUnsub = firestore()
        .collection(COLLECTIONS.PARKING_SLOTS)
        .where('userId', '==', userId)
        .onSnapshot(
          async parkingLotsSnapshot => {
            let allData: any[] = [];
            for (const doc of parkingLotsSnapshot.docs) {
              try {
                const parkingLotId = doc.id;
                // const docData = doc.data() as ParkingSlotsProps;

                const bookingLogsCollection = await firestore()
                  .collection(COLLECTIONS.BOOKING_LOGS)
                  .where('parkingLotId', '==', parkingLotId)
                  .get();

                const BookingCollection = await firestore()
                  .collection(COLLECTIONS.BOOKING)
                  .where('qr_code.parkingLotId', '==', parkingLotId)
                  .get();

                const bookingLogsObj =
                  bookingLogsCollection.docs[0]?.data() as bookingLogsProps;

                const bookingsObj =
                  BookingCollection.docs[0]?.data() as BookingProps;
                let status, dataToPush;

                if (!bookingsObj) {
                  status = 'Available';
                  dataToPush = {...doc.data()};
                  allData.push({
                    ...dataToPush,
                    status,
                    parkingLotId,
                  });
                  continue;
                }

                // const bookingObj =
                //   bookingLogsCollection.docs[0]?.data() as BookingProps;
                const timeLog = parseISO(bookingLogsObj?.timeLog);
                // const timeReserved = parseISO(bookingsObj?.booking_date);
                const isoDate = convertTimestampToDate(
                  bookingsObj?.booking_date.seconds,
                  bookingsObj?.booking_date.nanoseconds,
                );
                const currentDate = new Date();
                const timeReserved = new Date(isoDate);
                // Convert the JavaScript Date object to a Firestore Timestamp

                // Defining the range around the current date.
                // For example, I'm using a range of one hour before and after the current time.
                // Check if the timeLog is within specific hour ranges
                const isWithinRange = (
                  startHours: number,
                  endHours: number,
                  isTimeLog: boolean,
                ) =>
                  isWithinInterval(isTimeLog ? timeLog : timeReserved, {
                    start: add(currentDate, {hours: startHours}),
                    end: add(currentDate, {hours: endHours}),
                  });
                // Decide the status and the data to push based on the range
                if (isWithinRange(-1, 1, true)) {
                  status = 'Not Available';
                  dataToPush = {...doc.data()};
                } else if (isWithinRange(-3, 3, false)) {
                  status = 'Reserved';
                  dataToPush = {...doc.data()};
                } else {
                  status = 'Available';
                  dataToPush = {...doc.data()};
                }
                // Push the decided data with status and parkingLotId
                allData.push({
                  ...dataToPush,
                  status,
                  parkingLotId,
                });
              } catch (e) {
                continue;
              }
            }
            setBookingListLogs(allData);
            unsubscribes.push(parkingLotsUnsub);
            setLoading(false);
          },
          error => {
            setError(error);
            setLoading(false);
          },
        );
    };

    const fetchParkingSpaceData = () => {
      setLoading(true);
      const parkingSpaceUnsub = firestore()
        .collection(COLLECTIONS.PARKING_SPACES)
        .where('createdById', '==', userId)
        .onSnapshot(
          snapshot => {
            const parkingSpaceArray = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
            }));
            setParkingSpaceData(parkingSpaceArray[0] as ParkingSpacesProps);
            setLoading(false);
          },
          error => {
            setError(error);
            setLoading(false); // Also, ensure loading is turned off in case of an error
          },
        );
      unsubscribes.push(parkingSpaceUnsub);
    };

    if (onlyGetParkingSpaceData) {
      fetchParkingSpaceData();
    } else {
      fetchData();
    }

    return () => {
      // Cleanup
      unsubscribes.forEach(unsub => unsub()); // Unsubscribe from all listeners on component unmount
    };
  }, []);

  useEffect(() => {
    if (parkingSpaceData) {
      setLoading(false);
    }
  }, [parkingSpaceData]);

  const refetch = () => {
    // fetchData();
  };

  return {bookingListLogs, parkingSpaceData, loading, error, refetch};
};

export default useGetBookingLogs;
