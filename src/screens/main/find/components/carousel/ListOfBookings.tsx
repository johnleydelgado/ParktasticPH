/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/react-in-jsx-scope */
import {
  Box,
  Button,
  Center,
  Divider,
  HStack,
  Image,
  ScrollView,
  Text,
  VStack,
  View,
} from 'native-base';
import Carousel from 'react-native-reanimated-carousel';
import AnimatedDotsCarousel from 'react-native-animated-dots-carousel';
import {Dimensions, RefreshControl, StyleSheet} from 'react-native';
import {useCallback, useState} from 'react';
import {BookingProps, bookingLogsProps, qrProps} from '@/common/schema/main';
import {GOOGLE_PLACES_AUTOCOMPLETE_KEY} from '@env';
import Icon from 'react-native-vector-icons/AntDesign';
import {colors} from '@/common/constant/colors';
import {add, format} from 'date-fns';
import {useAppDispatch} from '@/hooks/reduxHooks';
import {setSelectedBooking} from '@/redux/nonPersistState';
import {firestoreReadWithoutCol} from '@/common/api/main';
import {COLLECTIONS} from '@/common/constant/firestore';
import Timer from '@/common/components/Timer';
import {useFocusEffect} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
interface ListProps {
  isStarted: boolean;
  bookingId: string;
  timeLog: string;
  duration: number;
  allData?: any;
}

export default function ListOfBookings({
  data,
  setQR,
  goBack,
}: {
  data: BookingProps[];
  setQR: (qrData: qrProps) => void;
  goBack: any;
}) {
  const {width, height} = Dimensions.get('window');
  const [index, setIndex] = useState<number>(0);
  const [fData, setFData] = useState<any[]>([]);
  const dispatch = useAppDispatch();
  const [listOfStartedBooking, setListOfStartedBooking] = useState<ListProps[]>(
    [],
  );

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    // Simulating a network request or any refreshing tasks
    setTimeout(() => {
      setRefreshing(false);
      fetchData(); // Calling another function once refreshing is completed
    }, 2000);
  }, []);

  // const [isSwipe, setIsSwipe] = useState<boolean>(false);

  const handleIndex = (indexF: number) => {
    setIndex(indexF);
  };

  const handleSelectedBooking = (bookingData: BookingProps) => {
    const dateObject = bookingData.booking_date.toDate();
    const formattedDate = format(dateObject, 'MM/dd/yyyy');
    const finalData = {...bookingData};
    finalData.booking_date = formattedDate;
    goBack();
    dispatch(setSelectedBooking(finalData));
  };

  const fetchData = useCallback(async () => {
    const bookingLogs = (await firestoreReadWithoutCol({
      collection: COLLECTIONS.BOOKING_LOGS,
    })) as bookingLogsProps[];

    if (bookingLogs) {
      let tempList = [];
      let tempFData = [...fData];
      for (let item1 of bookingLogs) {
        for (let index = 0; index < data.length; index++) {
          let item2 = data[index];

          if (item1.bookingId === item2.id) {
            if (!item1.timeOutLog) {
              // Add item2 to tempFData if item1 does not have a timeOutLog
              tempFData.push(item2);
              tempList.push({
                bookingId: item1.bookingId,
                isStarted: true,
                timeLog: item1.timeLog,
                duration: item2.duration,
                allData: item1,
              });
            }
          }
        }
      }
      if (tempList.length > 0) {
        setListOfStartedBooking(tempList);
      }
      setFData(tempFData);
    }
  }, []);

  const endParkingHandler = async (dataN: ListProps | null) => {
    // await createFireStore({collection: COLLECTIONS.BOOKING_LOGS, values: data});
    const obj: bookingLogsProps = {
      ...dataN?.allData,
      timeOutLog: new Date().toISOString(),
    };

    try {
      // Step 1: Query to find documents that match your conditions
      const querySnapshot = await firestore()
        .collection(COLLECTIONS.BOOKING_LOGS)
        .where('bookingId', '==', obj.bookingId)
        .get();

      // // Step 2: Update each document individually
      const updatePromises = querySnapshot.docs.map(doc => doc.ref.update(obj));

      // // Wait for all updates to complete
      await Promise.all(updatePromises);
      fetchData();
      return true;
    } catch (error) {
      console.log('Error in updating documents:', error);
      return false;
    }
  };
  useFocusEffect(
    useCallback(() => {
      fetchData();
      // Optional: Return a function that runs on blur
      return () => {
        // Cleanup if needed
      };
    }, [fetchData]),
  );

  return (
    <Center w="100%" h="full">
      <Carousel
        loop={false}
        width={width}
        height={height * 0.7}
        data={fData}
        scrollAnimationDuration={300}
        onSnapToItem={index => console.log('current index:', index)}
        pagingEnabled
        modeConfig={{
          parallaxScrollingScale: 0.95,
          parallaxScrollingOffset: 55,
        }}
        onProgressChange={(_, absoluteProgress) => {
          handleIndex(Math.round(absoluteProgress));
        }}
        renderItem={({item, index}) => {
          const dateObject = fData[index]?.booking_date.toDate();
          const address = fData[index]?.address || '';
          const duration = fData[index]?.duration || '';
          const formattedDate = format(dateObject, 'EEE, MMMM d yyyy');
          const formattedTime = format(dateObject, 'hh:mm aa');
          const starteBooking = listOfStartedBooking.find(
            a => a.bookingId === item.id,
          )?.timeLog;
          const bookingLogData = listOfStartedBooking.find(
            a => a.bookingId === item.id,
          );
          const starteBookingDuration = listOfStartedBooking.find(
            a => a.bookingId === item.id,
          )?.duration;

          return (
            <View>
              {starteBooking ? (
                <ScrollView
                  refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                    />
                  }>
                  <VStack w="full" h="full" p={4} space={6}>
                    <Timer
                      starteBooking={starteBooking}
                      duration={starteBookingDuration || 0}
                    />
                    <VStack
                      p={6}
                      bgColor={colors.primary}
                      rounded="lg"
                      shadow="1"
                      space={4}>
                      <Text
                        fontFamily="OpenSans-Regular"
                        fontSize={14}
                        fontWeight="medium"
                        color="white">
                        Slot {fData[index]?.qr_code?.lotId}
                      </Text>
                      <VStack>
                        <HStack justifyContent="space-between">
                          <Text
                            fontFamily="OpenSans-Regular"
                            fontSize={12}
                            fontWeight="medium"
                            color="white">
                            Arrival Time
                          </Text>
                          <Text
                            fontFamily="OpenSans-Regular"
                            fontSize={12}
                            fontWeight="medium"
                            color="white">
                            Departure Time
                          </Text>
                        </HStack>
                        <HStack
                          justifyContent="space-between"
                          space={4}
                          h="6"
                          alignItems="center"
                          px={30}>
                          <Divider w="16" />
                          {/* <Button
                          variant="outline"
                          borderColor="green.600"
                          borderRadius={22}
                          h="4"
                          _text={{color: 'black'}}>
                          1 hour
                        </Button> */}
                          <Box
                            borderWidth={1}
                            borderColor="white"
                            p={2}
                            borderRadius={22}
                            alignItems="center" // Vertically center the content
                            justifyContent="center" // Horizontally center the content
                          >
                            <Text // Wrapped the content inside Text components
                              color="white"
                              h={4}
                              textAlign="center">
                              {duration} hour{Number(duration) > 1 ? 's' : ''}
                            </Text>
                          </Box>
                          <Divider w="16" />
                        </HStack>
                        <HStack justifyContent="space-between">
                          <Text
                            fontFamily="OpenSans-Regular"
                            fontSize={12}
                            fontWeight="medium"
                            color="white">
                            {format(new Date(starteBooking), 'hh:mm aa')}
                          </Text>
                          <Text
                            fontFamily="OpenSans-Regular"
                            fontSize={12}
                            fontWeight="medium"
                            color="white">
                            {format(
                              new Date(
                                add(new Date(starteBooking), {
                                  hours: duration || 0,
                                }),
                              ),
                              'hh:mm aa',
                            )}
                          </Text>
                        </HStack>

                        <Box pt={5}>
                          <Button
                            bgColor="black"
                            _text={{color: 'white'}}
                            _pressed={{bgColor: 'gray.700'}}
                            onPress={() =>
                              endParkingHandler(bookingLogData || null)
                            }>
                            End Parking
                          </Button>
                        </Box>
                      </VStack>
                    </VStack>
                  </VStack>
                </ScrollView>
              ) : (
                <ScrollView
                  refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                    />
                  }>
                  <VStack w="full" h="full" p={4} space={2}>
                    <Image
                      source={{
                        uri: `https://maps.googleapis.com/maps/api/streetview?location=${fData[index]?.address}&fov=80&heading=180&pitch=0&key=${GOOGLE_PLACES_AUTOCOMPLETE_KEY}&size=600x400`,
                      }}
                      h="40"
                      w="full"
                      alt="a"
                      rounded={16}
                      resizeMode="cover"
                    />
                    <HStack p={4} justifyContent="space-between">
                      <VStack>
                        <HStack space={2} alignItems="center">
                          <Icon
                            name="calendar"
                            color={colors.primary}
                            size={18}
                          />
                          <Text>Date</Text>
                        </HStack>
                        <Text
                          style={{...styles.fontStyleDefault, fontSize: 12}}>
                          {formattedDate}
                        </Text>
                      </VStack>

                      <VStack>
                        <HStack space={2} alignItems="center">
                          <Icon
                            name="clockcircleo"
                            color={colors.primary}
                            size={18}
                          />
                          <Text>Time</Text>
                        </HStack>
                        <Text
                          style={{...styles.fontStyleDefault, fontSize: 12}}>
                          {formattedTime}
                        </Text>
                      </VStack>
                    </HStack>

                    <Divider />
                    <HStack p={4} justifyContent="space-between">
                      <VStack space={2} flex={1} maxW="1/2">
                        <HStack space={2} alignItems="center">
                          <Icon
                            name="enviromento"
                            color={colors.primary}
                            size={18}
                          />
                          <Text>Location</Text>
                        </HStack>
                        <Text
                          style={{...styles.fontStyleDefault, fontSize: 12}}
                          flexWrap="wrap">
                          {address}
                        </Text>
                      </VStack>

                      <Image
                        source={{
                          uri: 'https://t3.ftcdn.net/jpg/04/49/73/64/360_F_449736488_IAGo58o7DloC8Os5S5v9vppX3BIxzK4S.jpg',
                        }}
                        h="24"
                        w="24"
                        alt="a"
                        rounded={16}
                        resizeMode="cover"
                      />
                    </HStack>
                    <Divider />
                    <HStack p={4} justifyContent="space-between">
                      <VStack space={2}>
                        <HStack space={2} alignItems="center">
                          <Icon
                            name="infocirlceo"
                            color={colors.primary}
                            size={18}
                          />
                          <Text>Details</Text>
                        </HStack>
                        <HStack flexWrap="wrap" space={2}>
                          <Text
                            style={{...styles.fontStyleDefault, fontSize: 12}}
                            flexWrap="wrap">
                            Rate : ₱ {Number(fData[index]?.rate).toFixed(2)} |
                          </Text>
                          <Text
                            style={{...styles.fontStyleDefault, fontSize: 12}}
                            flexWrap="wrap">
                            Payment : {fData[index]?.payment_method} |
                          </Text>
                          <Text
                            style={{...styles.fontStyleDefault, fontSize: 12}}
                            flexWrap="wrap">
                            Duration :{' '}
                            {fData[index]?.duration === 1
                              ? `${fData[index].duration} hr`
                              : `${fData[index]?.duration} hrs`}
                          </Text>
                        </HStack>
                      </VStack>
                    </HStack>

                    {/* QR */}
                    <HStack justifyContent="center" space={8} px={4}>
                      <Button
                        bgColor={colors.primary}
                        rounded="full"
                        alignSelf="center"
                        px={6}
                        onPress={() =>
                          setQR({
                            email: fData[index]?.qr_code.email,
                            qrCode: fData[index]?.qr_code.qrCode,
                            bookingId: fData[index]?.qr_code.bookingId,
                            address: fData[index]?.qr_code.address,
                            lotId: fData[index]?.qr_code.lotId,
                            parkingSpaceId:
                              fData[index]?.qr_code.parkingSpaceId,
                            parkingLotId: fData[index]?.qr_code.parkingLotId,
                            booking_date: fData[index]?.qr_code.booking_date,
                          })
                        }
                        _text={{...styles.fontStyleDefault, fontSize: 12}}
                        _pressed={{bgColor: 'green.900'}}>
                        OPEN QR
                      </Button>
                      <Button
                        bgColor={colors.primary}
                        rounded="full"
                        alignSelf="center"
                        px={6}
                        onPress={() => handleSelectedBooking(fData[index])}
                        _text={{...styles.fontStyleDefault, fontSize: 12}}
                        _pressed={{bgColor: 'green.900'}}>
                        START DRIVING
                      </Button>
                    </HStack>
                  </VStack>
                </ScrollView>
              )}
            </View>
          );
          // <ParkingDetails
          //   key={index}
          //   goToParkingBooking={() =>
          //     handleParkingBooking(data ? data[index] : null)
          //   }
          //   parkingData={data && data[index]}
          // />
        }}
      />
      <AnimatedDotsCarousel
        length={fData.length}
        currentIndex={index}
        maxIndicators={4}
        interpolateOpacityAndColor={true}
        activeIndicatorConfig={{
          color: 'green',
          margin: 3,
          opacity: 1,
          size: 8,
        }}
        inactiveIndicatorConfig={{
          color: 'green',
          margin: 3,
          opacity: 0.5,
          size: 8,
        }}
        decreasingDots={[
          {
            config: {
              color: 'white',
              margin: 3,
              opacity: 0.5,
              size: 6,
            },
            quantity: 1,
          },
          {
            config: {
              color: 'white',
              margin: 3,
              opacity: 0.5,
              size: 4,
            },
            quantity: 1,
          },
        ]}
      />
    </Center>
  );
}

const styles = StyleSheet.create({
  fontStyleDefault: {
    fontWeight: '600',
    fontFamily: 'OpenSans-Regular',
    fontSize: 20,
  },
});
