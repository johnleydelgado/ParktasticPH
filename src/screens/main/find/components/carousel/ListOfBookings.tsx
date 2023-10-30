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
import {useCallback, useEffect, useState} from 'react';
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

interface ListProps {
  isStarted: boolean;
  index: number;
  timeLog: string;
  duration: number;
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

  const fetchData = async () => {
    const bookingLogs = (await firestoreReadWithoutCol({
      collection: COLLECTIONS.BOOKING_LOGS,
    })) as bookingLogsProps[];

    if (bookingLogs) {
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
            // You can now use index and item2 as needed
          }
        }
      }
      if (tempList) {
        setListOfStartedBooking(tempList);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Center w="100%" h="full">
      <Carousel
        loop={false}
        width={width}
        height={height * 0.7}
        data={data}
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
        renderItem={({index}) => {
          const dateObject = data[index]?.booking_date.toDate();
          const address = data[index]?.address || '';
          const duration = data[index]?.duration || '';
          const formattedDate = format(dateObject, 'EEE, MMMM d yyyy');
          const formattedTime = format(dateObject, 'hh:mm aa');
          const starteBooking = listOfStartedBooking.find(
            a => a.index === index,
          )?.timeLog;
          const starteBookingDuration = listOfStartedBooking.find(
            a => a.index === index,
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
                        Slot {data[index]?.qr_code?.lotId}
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
                          {/* <SwipeButton
                          Icon={<Icon name="right" color="white" size={22} />}
                          onComplete={() => Alert.alert('Completed')}
                          title="End Parking"
                          titleStyle={{color: 'black'}}
                          height={44}
                          width={width * 0.8}
                          underlayStyle={{
                            borderRadius: height / 4,
                            backgroundColor: isSwipe ? 'white' : 'transparent',
                          }}
                          onSwipeStart={() => setIsSwipe(true)}
                          onSwipeEnd={() => setIsSwipe(false)}
                          circleBackgroundColor="black"
                        /> */}
                          <Button
                            bgColor="black"
                            _text={{color: 'white'}}
                            _pressed={{bgColor: 'gray.700'}}>
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
                        uri: `https://maps.googleapis.com/maps/api/streetview?location=${data[index]?.address}&fov=80&heading=180&pitch=0&key=${GOOGLE_PLACES_AUTOCOMPLETE_KEY}&size=600x400`,
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
                            Rate : ₱ {Number(data[index]?.rate).toFixed(2)} |
                          </Text>
                          <Text
                            style={{...styles.fontStyleDefault, fontSize: 12}}
                            flexWrap="wrap">
                            Payment : {data[index]?.payment_method} |
                          </Text>
                          <Text
                            style={{...styles.fontStyleDefault, fontSize: 12}}
                            flexWrap="wrap">
                            Duration :{' '}
                            {data[index]?.duration === 1
                              ? `${data[index].duration} hr`
                              : `${data[index]?.duration} hrs`}
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
                            email: data[index]?.qr_code.email,
                            qrCode: data[index]?.qr_code.qrCode,
                            bookingId: data[index]?.qr_code.bookingId,
                            address: data[index]?.qr_code.address,
                            lotId: data[index]?.qr_code.lotId,
                            parkingSpaceId: data[index]?.qr_code.parkingSpaceId,
                            parkingLotId: data[index]?.qr_code.parkingLotId,
                            booking_date: data[index]?.qr_code.booking_date,
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
                        onPress={() => handleSelectedBooking(data[index])}
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
        length={data.length}
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
