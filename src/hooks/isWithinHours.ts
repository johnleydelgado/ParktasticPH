import {BookingProps} from '@/common/schema/main';
import {differenceInHours, isPast, isSameDay} from 'date-fns';

const isWithinTwoHours = (bookingObj: BookingProps) => {
  const currentTime = new Date();
  const bookingTime = bookingObj.booking_date.toDate(); // Convert Firestore timestamp to JS Date

  // Check if the bookingTime is in the past
  if (isPast(bookingTime)) {
    return false;
  }

  // Check if the booking date is the same as the current date
  if (!isSameDay(currentTime, bookingTime)) {
    return false;
  }

  // Check if the difference in hours is 2 or less
  return differenceInHours(bookingTime, currentTime) <= 2;
};

export default isWithinTwoHours;
