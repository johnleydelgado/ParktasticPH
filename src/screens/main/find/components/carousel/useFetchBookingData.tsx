import {firestoreReadWithoutCol} from '@/common/api/main';
import {BookingProps, bookingLogsProps} from '@/common/schema/main';
import {useFocusEffect} from '@react-navigation/native';
import {useQuery} from '@tanstack/react-query';
import {useCallback} from 'react';

const COLLECTIONS = {
  BOOKING_LOGS: 'booking_logs', // Replace with your actual collection name
};

const useFetchBookingData = ({data}: {data: BookingProps[]}) => {
  // Define your query function
  console.log('data', data);

  const fetchBookingLogs = async () => {
    const bookingLogs = (await firestoreReadWithoutCol({
      collection: COLLECTIONS.BOOKING_LOGS,
    })) as bookingLogsProps[];

    if (!bookingLogs) {
      return [];
    }

    let tempList = [];

    for (let item1 of bookingLogs) {
      for (let index = 0; index < data.length; index++) {
        let item2 = data[index];
        if (item1.bookingId === item2.id) {
          console.log('Matching bookingId found at index:', index);
          tempList.push({
            index,
            isStarted: true,
            timeLog: item1.timeLog,
            duration: item2.duration,
          });
        }
      }
    }
    return tempList;
  };

  // Use useQuery to fetch data
  const {
    data: listOfStartedBooking,
    isLoading,
    isError,
    refetch,
  } = useQuery(['fetchBookingLogs'], fetchBookingLogs);

  useFocusEffect(
    useCallback(() => {
      refetch();
      // Optional: Return a function that runs on blur
      return () => {
        // Cleanup if needed
      };
    }, [refetch]),
  );

  return {listOfStartedBooking, isLoading, isError, refetch};
};

export default useFetchBookingData;
