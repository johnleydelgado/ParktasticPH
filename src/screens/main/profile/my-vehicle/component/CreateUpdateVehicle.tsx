/* eslint-disable @typescript-eslint/no-unused-vars */

import {colors} from '@/common/constant/colors';
import {modalName} from '@/common/constant/modal';
import CustomTextInput from '@/common/textinput/CustomTextInput';
import {useAppDispatch, useAppSelector} from '@/hooks/reduxHooks';
import {closeModal} from '@/redux/nonPersistState';
import {useFormik} from 'formik';
import {
  Box,
  Button,
  Center,
  FormControl,
  HStack,
  IconButton,
  Input,
  KeyboardAvoidingView,
  ScrollView,
  VStack,
} from 'native-base';
import * as React from 'react';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/FontAwesome5';
import firestore, {firebase} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import uuid from 'react-native-uuid';
import {COLLECTIONS} from '@/common/constant/firestore';
import {Keyboard, Platform, TouchableWithoutFeedback} from 'react-native';
import {firestoreAdd} from '@/common/api/main';

interface VehicleProps {
  brand: string;
  make: string;
  licenseNum: string;
  modelYear: string;
}

const INITIAL_DATA: VehicleProps = {
  brand: '',
  make: '',
  licenseNum: '',
  modelYear: '',
};

const CreateUpdateVehicle = () => {
  const {openModals} = useAppSelector(state => state.nonPersistState);
  const dispatch = useAppDispatch();

  const formik = useFormik({
    initialValues: INITIAL_DATA,
    enableReinitialize: true,
    onSubmit: async values => {
      try {
        const userId = firebase.auth().currentUser?.uid;
        await firestoreAdd({
          collection: COLLECTIONS.VEHICLES,
          userId: userId,
          values: values,
        });
      } catch (e: any) {
        closeCreateUpdateModal();
      } finally {
        closeCreateUpdateModal();
      }
    },
  });

  const closeCreateUpdateModal = () => {
    dispatch(closeModal(modalName.ADD_EDIT_VEHICLE));
    formik.resetForm();
  };

  const formikProps = (field: keyof VehicleProps) => {
    return {
      onChangeText: formik.handleChange(field),
      onBlur: formik.handleBlur(field),
      value: formik.values[field],
      error:
        formik.touched[field] && formik.errors[field]
          ? formik.errors[field]
          : null,
    };
  };

  return (
    <Modal
      animationIn="fadeInUp"
      isVisible={openModals.includes(modalName.ADD_EDIT_VEHICLE)}
      style={{margin: 0, justifyContent: 'flex-end'}}>
      <Box rounded="lg" bgColor="white" p={6} borderTopRadius={32} h="1/2">
        <Center>
          <HStack space={4} pb={8} alignItems="center">
            <CustomTextInput style={{fontWeight: 'bold', fontSize: 16}}>
              ADD VEHICLE
            </CustomTextInput>
          </HStack>
          <IconButton
            position="absolute"
            right={1}
            bottom={6}
            onPress={closeCreateUpdateModal}
            _icon={{
              as: Icon,
              name: 'times',
              color: colors.primary,
            }}
          />
        </Center>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{flex: 1}}>
          <ScrollView keyboardShouldPersistTaps="handled">
            <VStack alignItems="center" space={4}>
              <FormControl>
                <FormControl.Label>Brand</FormControl.Label>
                <Input
                  placeholder="Enter Brand"
                  borderColor={colors.primary}
                  {...formikProps('brand')}
                />
                <FormControl.Label>Make</FormControl.Label>
                <Input
                  placeholder="Enter Make"
                  borderColor={colors.primary}
                  {...formikProps('make')}
                />
                <FormControl.Label>License Plate Number</FormControl.Label>
                <Input
                  placeholder="Enter License Plate Number"
                  borderColor={colors.primary}
                  {...formikProps('licenseNum')}
                />
                <FormControl.Label>Model Year</FormControl.Label>
                <Input
                  placeholder="Enter Model Year"
                  borderColor={colors.primary}
                  {...formikProps('modelYear')}
                />
              </FormControl>
              <Button
                variant="outline"
                rounded="full"
                px={8}
                alignSelf="flex-end"
                onPress={() => formik.handleSubmit()}
                _text={{color: colors.primary}}>
                Save
              </Button>
            </VStack>
          </ScrollView>
        </KeyboardAvoidingView>
      </Box>
    </Modal>
  );
};

export default CreateUpdateVehicle;
