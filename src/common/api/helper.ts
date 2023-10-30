import {addDays, addHours, isWithinInterval, parse} from 'date-fns';

export interface bookingDateProps {
  duration: number;
  bookingDate: string;
}

const isTimeSlotWithinBounds = (
  requestedSlot: bookingDateProps,
  time_from: string,
  time_to: string,
) => {
  const boundaryStart = parse(time_from, 'hh:mm aa', new Date());
  let boundaryEnd = parse(time_to, 'hh:mm aa', new Date());

  // Adjust boundaryEnd to next day if it's before boundaryStart
  if (boundaryEnd < boundaryStart) {
    boundaryEnd = addDays(boundaryEnd, 1);
  }

  const formatString = "EEE MMM dd yyyy HH:mm:ss 'GMT'X";
  const requestStart = parse(
    requestedSlot.bookingDate,
    formatString,
    new Date(),
  );
  const requestEnd = addHours(requestStart, requestedSlot.duration);
  console.log('aa', requestStart, {start: boundaryStart, end: boundaryEnd});
  return (
    isWithinInterval(requestStart, {start: boundaryStart, end: boundaryEnd}) &&
    isWithinInterval(requestEnd, {start: boundaryStart, end: boundaryEnd})
  );
};

function isSlotAvailable(bookedSlots: any, requestedSlot: bookingDateProps) {
  const requestStart = parse(
    requestedSlot.bookingDate,
    "EEE MMM dd yyyy HH:mm:ss 'GMT'X",
    new Date(),
  );
  const requestEnd = addHours(requestStart, requestedSlot.duration);

  const bookedStart = bookedSlots.booking_date.toDate();
  const bookedEnd = addHours(bookedStart, bookedSlots.duration);

  if (
    isWithinInterval(requestStart, {start: bookedStart, end: bookedEnd}) ||
    isWithinInterval(requestEnd, {start: bookedStart, end: bookedEnd}) ||
    (requestStart <= bookedStart && requestEnd >= bookedEnd)
  ) {
    return false; // Slot is not available
  }
  return true; // Slot is available
}

export {isTimeSlotWithinBounds, isSlotAvailable};
