//import liraries
import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {BarCodeReadEvent, RNCamera} from 'react-native-camera';
import {HStack, Spinner, Text} from 'native-base';
import {isEmpty} from 'lodash';
import {COLLECTIONS} from '@/common/constant/firestore';
import {bookingLogsProps, qrProps} from '@/common/schema/main';
import {TabAdminMainNavigationProp} from '@/navigators/AdminNavigator';
import useGetBookingLogs from '@/hooks/useGetBookingLogs';
import firestore from '@react-native-firebase/firestore';

// create a component
const QRAdminScreen = ({
  navigation,
}: {
  navigation: TabAdminMainNavigationProp;
}) => {
  const [isLoading, setIsLoading] = useState<boolean>();
  const {refetch} = useGetBookingLogs(false);

  const startTimerHandler = async (data: bookingLogsProps) => {
    setIsLoading(true);

    // Step 1: Query to find documents that match your conditions
    const querySnapshot = await firestore()
      .collection(COLLECTIONS.BOOKING_LOGS)
      .where('bookingId', '==', data.bookingId)
      .get();

    // // Step 2: Update each document individually
    const updatePromises = querySnapshot.docs.map(doc => doc.ref.update(data));

    // // Wait for all updates to complete
    await Promise.all(updatePromises);

    setIsLoading(false);
    refetch();
    navigation.goBack();
  };

  function scanHandler(e: BarCodeReadEvent): void {
    const data = JSON.parse(e.data) as qrProps;
    if (!isEmpty(data)) {
      startTimerHandler({...data, timeLog: new Date().toISOString()});
    }
  }

  return (
    <HStack safeAreaTop={32}>
      {isLoading ? (
        <Spinner />
      ) : (
        <QRCodeScanner
          onRead={e => scanHandler(e)}
          flashMode={RNCamera.Constants.FlashMode.torch}
          topContent={
            <Text style={{...styles.fontStyleDefault, fontSize: 12}}>
              Scan QR
            </Text>
          }
          showMarker
          reactivate
          reactivateTimeout={5000}
          //   bottomContent={
          //     <TouchableOpacity
          //       style={{alignItems: 'center'}}
          //       onPress={() => setScanning(!scanning)}>
          //       <Icon
          //         as={<Ionicons name="restaurant-outline" />}
          //         size={12}
          //         color={colors.error}
          //       />
          //       <Text fontSize="20" fontWeight="bold" textAlign="center">
          //         Cancel
          //       </Text>
          //     </TouchableOpacity>
          //   }
          cameraStyle={{
            overflow: 'hidden',
            // position: 'absolute',
            width: '90%',
            alignSelf: 'center',
            borderRadius: 22,
          }}
        />
      )}
    </HStack>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  fontStyleDefault: {
    fontWeight: '600',
    fontFamily: 'OpenSans-Regular',
    fontSize: 20,
  },
});

//make this component available to the app
export default QRAdminScreen;
