/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */
//import liraries
import {colors} from '@/common/constant/colors';
import {listOfBookingProps} from '@/common/schema/main';
import {useAppDispatch} from '@/hooks/reduxHooks';
import {setSelectedParkingLot} from '@/redux/nonPersistState';
import {Center, Text, VStack} from 'native-base';
import {StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
type CircleProps = {
  status: 'Available' | 'Reserved' | 'Not Available';
  text: string;
  setSelectedTypeOfParking: any;
  data: listOfBookingProps;
};
// create a component
const Circle: React.FC<CircleProps> = ({
  status,
  text,
  setSelectedTypeOfParking,
  data,
}) => {
  const dispatch = useAppDispatch();

  const handleCircleTouch = () => {
    setSelectedTypeOfParking(status);
    dispatch(setSelectedParkingLot(data));
  };

  return (
    <TouchableOpacity onPress={() => handleCircleTouch()}>
      <VStack alignItems="center">
        <Center
          rounded="full"
          h={38}
          w={38}
          bgColor={
            status === 'Available'
              ? colors.primary
              : status === 'Reserved'
              ? 'yellow.400'
              : 'red.400'
          }>
          <Icon name="check" color="white" />
        </Center>

        <VStack alignItems="center">
          <Text
            style={{
              ...styles.fontStyleDefault,
              fontWeight: '600',
              fontSize: 12,
            }}>
            {text}
          </Text>
          {status === 'Available' ? null : status === 'Reserved' ? null : (
            <Text
              style={{
                ...styles.fontStyleDefault,
                fontWeight: '600',
                fontSize: 12,
              }}>
              (00:54)
            </Text>
          )}
        </VStack>
      </VStack>
    </TouchableOpacity>
  );
};

// define your styles
const styles = StyleSheet.create({
  fontStyleDefault: {
    fontWeight: '700',
    fontFamily: 'OpenSans-Regular',
    fontSize: 20,
  },
});

//make this component available to the app
export default Circle;
