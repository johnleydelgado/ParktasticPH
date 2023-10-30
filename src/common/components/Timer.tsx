/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import firestore, {firebase} from '@react-native-firebase/firestore';
import {differenceInMilliseconds} from 'date-fns';
import {Box, Image, Text, VStack} from 'native-base';
import {CountdownCircleTimer} from 'react-native-countdown-circle-timer';
import {COLLECTIONS} from '../constant/firestore';
import {images} from '../constant/images';

const Timer = ({
  starteBooking,
  duration,
}: {
  starteBooking: string;
  duration: number;
}) => {
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const userId = firebase.auth().currentUser?.uid;
  const [remainingTimeState, setRemainingTimeState] = useState<number | null>(
    null,
  );

  const fetchStartTime = async () => {
    const doc = await firestore()
      .collection(COLLECTIONS.BOOKING_LOGS)
      .where('timeLog', '==', starteBooking)
      .get();

    if (duration) {
      const startTime = doc.docs[0].data().timeLog ?? new Date().toISOString();
      const currentTime = new Date();
      const timePassed = differenceInMilliseconds(
        currentTime,
        new Date(startTime),
      );
      const initialTimeRemaining = duration * 3600000 - timePassed; // 1 hour in milliseconds - time already passed

      setTimeRemaining(initialTimeRemaining);
    }
  };

  useEffect(() => {
    fetchStartTime();
  }, []);

  useEffect(() => {
    if (remainingTimeState !== null) {
      // You can use remainingTimeState here to do something whenever it changes
    }
  }, [remainingTimeState]);

  useEffect(() => {
    // Start a new interval only if timeRemaining is greater than zero
    if (timeRemaining !== null && timeRemaining > 0) {
      const id = setInterval(() => {
        // setTimeRemaining(prevTime => Math.max((prevTime ?? 0) - 1000, 0));
      }, 1000);

      // Clear this interval when the component unmounts or re-renders
      return () => clearInterval(id);
    }
  }, [timeRemaining]);

  const startTimer = async () => {
    const currentTime = new Date().toISOString();
    await firebase.firestore().collection('timers').doc(userId).set({
      startTime: currentTime,
    });

    setTimeRemaining(3600000); // 1 hour in milliseconds
  };

  const displayTime = (time: number) => {
    const hours = Math.floor(time / 3600000);
    const minutes = Math.floor((time % 3600000) / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    return `0${hours}:0${minutes}:${seconds}`;
  };

  return (
    <Box pt={4}>
      <VStack justifyContent="center" alignItems="center" space={2}>
        {/* <CountdownCircleTimer
          isPlaying
          duration={Math.floor(timeRemaining / 1000)}
          colors={['#004777', '#F7B801', '#A30000', '#A30000']}
          colorsTime={[7, 5, 2, 0]}>
          {({remainingTime}) => (
            <Text>{displayTime(remainingTime * 1000)}</Text>
          )}
        </CountdownCircleTimer> */}
        <CountdownCircleTimer
          isPlaying
          duration={Math.floor(timeRemaining / 1000)}
          colors={['#4CAF50', '#F7B801', '#A30000', '#A30000']}
          colorsTime={[7, 5, 2, 0]}>
          {({remainingTime}) => {
            setTimeout(() => {
              setRemainingTimeState(remainingTime);
            }, 0);
            return (
              <Image
                source={images.car_green}
                style={{
                  width: 140,
                  height: 140,
                }}
                resizeMode="contain"
                alt="img2"
              />
            );
          }}
        </CountdownCircleTimer>
        <Text fontFamily="OpenSans-Regular" fontSize={38} fontWeight="bold">
          {displayTime(remainingTimeState * 1000)}
        </Text>
        <Text
          fontFamily="OpenSans-Regular"
          fontSize={14}
          fontWeight="bold"
          color="gray.400">
          Remaining Parking Time
        </Text>
        {/* <Button title="Start Timer" onPress={startTimer} /> */}
      </VStack>
    </Box>
  );
};

export default Timer;
