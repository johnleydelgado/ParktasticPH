import {useAppDispatch, useAppSelector} from '@/hooks/reduxHooks';
import {
  Button,
  FormControl,
  HStack,
  IconButton,
  Input,
  ScrollView,
  Text,
  TextArea,
  VStack,
} from 'native-base';
import * as React from 'react';
import {Dialog, Portal} from 'react-native-paper';
import {modalName} from '../constant/modal';
import {closeModal} from '@/redux/nonPersistState';
import {colors} from '../constant/colors';
import Icon from 'react-native-vector-icons/AntDesign';
import {pickImage} from '../helper/pickImageAndUpload';
import {useFormik} from 'formik';
import {object, string} from 'yup';
import {isEmpty} from 'lodash';
import {ALERT_TYPE, Dialog as Diag} from 'react-native-alert-notification';

interface ReportDialogProps {
  vehicle: string;
  licenseNo: string;
  email: string;
  issue: string;
}

const INITIAL_DATA: ReportDialogProps = {
  vehicle: '',
  licenseNo: '',
  email: '',
  issue: '',
};

let dialogReportSchema = object({
  vehicle: string().email().required(),
  licenseNo: string().email().required(),
  issue: string().email().required(),
  email: string().email().required(),
});

const AdminReportBookingDialog = () => {
  const {openModals} = useAppSelector(state => state.nonPersistState);
  const [imagePath, setImagePath] = React.useState<any>();

  const dispatch = useAppDispatch();
  const hideDialog = () => {
    dispatch(closeModal(modalName.ADMIN_REPORT_BOOKING));
  };

  const handleImagePick = () => {
    pickImage()
      .then(sourcePath => {
        console.log('aa', sourcePath);
        setImagePath(sourcePath);
      })
      .catch(error => {
        console.error(error); // or handle the error as you prefer
      });
  };

  const formik = useFormik({
    initialValues: INITIAL_DATA,
    enableReinitialize: true,
    validationSchema: dialogReportSchema,
    onSubmit: values => {
      try {
        console.log('aa');
        // mutation.mutate(values);
      } catch (e: any) {
        console.error('Error during mutation:', e);
      }
    },
  });

  const formikProps = (field: keyof ReportDialogProps) => {
    return {
      onChangeText: formik.handleChange(field),
      onBlur: () => formik.handleBlur(field),
      value: formik.values[field],
      error:
        formik.touched[field] && formik.errors[field]
          ? formik.errors[field]
          : null,
    };
  };

  React.useEffect(() => {
    console.log('aaa', formik.errors);
    if (!isEmpty(formik.errors)) {
      Diag.show({
        type: ALERT_TYPE.DANGER,
        title: 'ERROR',
        textBody: 'Please fill up all the fields',
        button: 'close',
      });
    }
  }, [formik.errors]);

  return (
    <Portal>
      <Dialog
        visible={openModals.includes(modalName.ADMIN_REPORT_BOOKING)}
        onDismiss={hideDialog}>
        <ScrollView keyboardShouldPersistTaps="handled">
          <Dialog.Title>Report Illegal Parking</Dialog.Title>
          <Dialog.Content>
            <VStack space={2} alignItems="center">
              <FormControl>
                <FormControl.Label>Vehicle Details</FormControl.Label>
                <Input
                  placeholder="2023 Vios Toyota"
                  borderColor={colors.primary}
                  {...formikProps('vehicle')}
                />
                <FormControl.Label>License Plate Number</FormControl.Label>
                <Input
                  placeholder="Enter License Plate Number"
                  borderColor={colors.primary}
                  {...formikProps('licenseNo')}
                />
                <FormControl.Label>Email</FormControl.Label>
                <Input
                  placeholder="Enter Email"
                  borderColor={colors.primary}
                  {...formikProps('email')}
                />
              </FormControl>
              <FormControl>
                <VStack alignItems="flex-end">
                  <IconButton
                    onPress={() => handleImagePick()}
                    _icon={{
                      color: colors.primary,
                      size: 'md',
                      as: Icon,
                      name: 'upload',
                    }}
                  />
                  <Text fontSize={8}>Attach file</Text>
                </VStack>
                <FormControl.Label>Issue</FormControl.Label>
                <TextArea
                  h={20}
                  placeholder="Please enter your issue in the text area provided."
                  w="full"
                  maxW="300"
                  autoCompleteType={undefined}
                  {...formikProps('issue')}
                />
              </FormControl>
            </VStack>
          </Dialog.Content>
          <Dialog.Actions
            style={{
              display: 'flex',
              justifyContent: 'center',
            }}>
            <HStack space={4} px={2}>
              <Button
                onPress={() => hideDialog()}
                rounded="3xl"
                px={4}
                bgColor="red.500">
                Cancel
              </Button>
              <Button
                onPress={() => formik.handleSubmit()}
                rounded="3xl"
                px={4}
                _pressed={{bgColor: 'green.600'}}
                bgColor="green.500">
                Save
              </Button>
            </HStack>
          </Dialog.Actions>
        </ScrollView>
      </Dialog>
    </Portal>
  );
};

export default AdminReportBookingDialog;
