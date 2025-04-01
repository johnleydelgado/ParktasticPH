/* eslint-disable @typescript-eslint/no-unused-vars */
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
import {pickImage, uploadImage} from '../helper/pickImageAndUpload';
import {useFormik} from 'formik';
import {object, string} from 'yup';
import {isEmpty} from 'lodash';
import {ALERT_TYPE, Dialog as Diag} from 'react-native-alert-notification';
import {EmailProps} from '../schema/main';
import {createFireStore, firestoreReadWithoutCol} from '../api/main';
import {COLLECTIONS} from '../constant/firestore';
import firestore, {firebase} from '@react-native-firebase/firestore';

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
  vehicle: string().required(''),
  licenseNo: string().required(''),
  issue: string().required(''),
  email: string().email().required(''),
});

const AdminReportBookingDialog = () => {
  const {openModals, selectedParkingLot} = useAppSelector(
    state => state.nonPersistState,
  );
  const [imagePath, setImagePath] = React.useState<any>();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const dispatch = useAppDispatch();
  const hideDialog = () => {
    dispatch(closeModal(modalName.ADMIN_REPORT_BOOKING));
  };

  const formik = useFormik({
    initialValues: INITIAL_DATA,
    enableReinitialize: true,
    validationSchema: dialogReportSchema,
    onSubmit: async _values => {
      try {
        console.log('aa');
        await submitHandler();
        // mutation.mutate(values);
      } catch (e: any) {
        console.error('Error during mutation:', e);
      }
    },
  });

  const submitHandler = async () => {
    setIsLoading(true);
    const url = await uploadImage(imagePath);
    const querySnapshot = await firestore()
      .collection(COLLECTIONS.PARKING_SLOTS)
      .doc(selectedParkingLot?.parkingLotId)
      .get();

    console.log('querySnapshot', querySnapshot.data());

    const data = querySnapshot.data();

    const values: EmailProps = {
      to: 'parktasticph01@gmail.com',
      message: {
        html: `<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
        <head>
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta name="x-apple-disable-message-reformatting">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <title></title>
          <style type="text/css">
            @media only screen and (min-width: 620px) {
              .u-row {
                width: 600px !important;
              }

              .u-row .u-col {
                vertical-align: top;
              }

              .u-row .u-col-37p17 {
                width: 223.02px !important;
              }

              .u-row .u-col-62p83 {
                width: 376.98px !important;
              }

              .u-row .u-col-100 {
                width: 600px !important;
              }
            }

            @media (max-width: 620px) {
              .u-row-container {
                max-width: 100% !important;
                padding-left: 0px !important;
                padding-right: 0px !important;
              }

              .u-row .u-col {
                min-width: 320px !important;
                max-width: 100% !important;
                display: block !important;
              }

              .u-row {
                width: 100% !important;
              }

              .u-col {
                width: 100% !important;
              }

              .u-col>div {
                margin: 0 auto;
              }
            }

            body {
              margin: 0;
              padding: 0;
            }

            table,
            tr,
            td {
              vertical-align: top;
              border-collapse: collapse;
            }

            p {
              margin: 0;
            }

            .ie-container table,
            .mso-container table {
              table-layout: fixed;
            }

            * {
              line-height: inherit;
            }

            a[x-apple-data-detectors='true'] {
              color: inherit !important;
              text-decoration: none !important;
            }

            table,
            td {
              color: #000000;
            }

            @media (max-width: 480px) {
              #u_content_heading_1 .v-container-padding-padding {
                padding: 20px 10px 0px 30px !important;
              }

              #u_content_heading_2 .v-container-padding-padding {
                padding: 10px 10px 0px 30px !important;
              }

              #u_content_heading_4 .v-container-padding-padding {
                padding: 30px 10px 0px 30px !important;
              }

              #u_content_divider_2 .v-container-padding-padding {
                padding: 10px 30px !important;
              }

              #u_content_image_1 .v-container-padding-padding {
                padding: 10px 0px 0px 30px !important;
              }

              #u_content_image_1 .v-text-align {
                text-align: left !important;
              }

              #u_content_heading_5 .v-container-padding-padding {
                padding: 15px 10px 10px 30px !important;
              }

              #u_content_text_2 .v-container-padding-padding {
                padding: 0px 30px 10px !important;
              }

              #u_content_divider_3 .v-container-padding-padding {
                padding: 0px 30px 10px !important;
              }
            }
          </style>
        </head>
        <body class="clean-body u_body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color:'white';color: #000000">
          <table style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: 'white';width:100%" cellpadding="0" cellspacing="0">
            <tbody>
              <tr style="vertical-align: top">
                <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
                  <div class="u-row-container" style="padding: 0px;background-color: transparent">
                    <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
                      <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                        <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                          <div style="background-color: #eeeeee;height: 100%;width: 100% !important;">
                            <div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
                              <table id="u_content_heading_1" style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                <tbody>
                                  <tr>
                                    <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:40px 10px 0px 50px;font-family:arial,helvetica,sans-serif;" align="left">
                                      <h1 class="v-text-align" style="margin: 0px; line-height: 110%; text-align: left; word-wrap: break-word; font-size: 37px; font-weight: 700;">
                                        <span style="line-height: 40.7px;"></span> Parking PH App <br /> Reported Issue
                                      </h1>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <table id="u_content_heading_2" style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                <tbody>
                                  <tr>
                                    <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:10px 10px 0px 50px;font-family:arial,helvetica,sans-serif;" align="left">
                                      <h1 class="v-text-align" style="margin: 0px; line-height: 140%; text-align: left; word-wrap: break-word; font-size: 17px; font-weight: 400;">
                                        <span>Issue ID #256632869</span>
                                      </h1>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                <tbody>
                                  <tr>
                                    <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">
                                      <table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="86%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #BBBBBB;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                        <tbody>
                                          <tr style="vertical-align: top">
                                            <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                              <span>&#160;</span>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="u-row-container" style="padding: 0px;background-color: transparent">
                    <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
                      <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                        <div style="background-color: #44576b;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                          <div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                            <table id="u_content_heading_4" style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                              <tbody>
                                <tr>
                                  <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:40px 10px 0px 50px;font-family:arial,helvetica,sans-serif;" align="left">
                                    <h1 class="v-text-align" style="margin: 0px; color: #ffffff; line-height: 140%; text-align: left; word-wrap: break-word; font-size: 20px; font-weight: 400">
                                      </span>
                                      <span>Details of the issue</span>
                                    </h1>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <table id="u_content_divider_2" style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                              <tbody>
                                <tr>
                                  <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:10px 50px;font-family:arial,helvetica,sans-serif;" align="left">
                                    <table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #687481;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                      <tbody>
                                        <tr style="vertical-align: top">
                                          <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                            <span>&#160;</span>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  </div>
                  <div class="u-row-container" style="padding: 0px;background-color: transparent">
                    <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
                      <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                        <div class="u-col u-col-37p17" style="max-width: 320px;min-width: 223.02px;display: table-cell;vertical-align: top;">
                          <div style="background-color: #44576b;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                            <div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                              <!--
                                  <![endif]-->
                              <table id="u_content_image_1" style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                <tbody>
                                  <tr>
                                    <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:10px 0px 0px;font-family:arial,helvetica,sans-serif;" align="left">
                                      <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                        <tr>
                                          <td class="v-text-align" style="padding-right: 0px;padding-left: 0px; padding-bottom: 8px" align="right">
                                            <img align="right" border="0" src=${url} alt="image" title="image" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 100%;max-width: 172px;" width="172" />
                                          </td>
                                        </tr>
                                      </table>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                        <div style="background-color: #44576b;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                          <div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                            <!--
                                <![endif]-->
                            <table id="u_content_heading_5" style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                              <tbody>
                                <tr>
                                  <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:15px 10px 10px 20px;font-family:arial,helvetica,sans-serif;" align="left">
                                    <h1 class="v-text-align" style="margin: 0px; color: #ffffff; line-height: 110%; text-align: left; word-wrap: break-word; font-size: 20px; font-weight: 700;">
                                      <span style="line-height: 22px;"></span>
                                      <p style="line-height: 22px; color:"white" ">From: ${
                                        formik.values.email
                                      }</p>
                                    </h1>
                                  </td>
                                </tr>
                                <tr>
                                <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:15px 10px 10px 20px;font-family:arial,helvetica,sans-serif;" align="left">
                                  <h1 class="v-text-align" style="margin: 0px; color: #ffffff; line-height: 110%; text-align: left; word-wrap: break-word; font-size: 20px; font-weight: 700;">
                                    <span style="line-height: 22px;"></span>
                                    <p style="line-height: 22px; color:"white" ">Parking Space / Slot: ${
                                      data?.lotId || 'N/A'
                                    }</p>
                                  </h1>
                                </td>
                              </tr>
                              </tbody>
                            </table>
                            <table id="u_content_text_2" style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                              <tbody>
                                <tr>
                                  <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:0px 100px 10px 20px;font-family:arial,helvetica,sans-serif;" align="left">
                                    <div class="v-text-align" style="font-size: 14px; color: #5ab9b6; line-height: 130%; text-align: left; word-wrap: break-word;">
                                      <p style="line-height: 130%;">
                                        <span data-metadata="&lt;!--(figmeta)eyJmaWxlS2V5IjoiMnk1YTR0OTU5aGt5MmdGR2JvazREOSIsInBhc3RlSUQiOjExMDUyNzA4MDMsImRhdGFUeXBlIjoic2NlbmUifQo=(/figmeta)--&gt;" style="line-height: 18.2px;"></span>
                                        <span style="line-height: 18.2px;"></span>
                                        <span style="line-height: 18.2px; color: #ecf0f1;">${
                                          formik.values.issue
                                        }</span>
                                      </p>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <table id="u_content_divider_3" style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                              <tbody>
                                <tr>
                                  <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:0px 50px 10px 20px;font-family:arial,helvetica,sans-serif;" align="left">
                                    <table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #687481;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                      <tbody>
                                        <tr style="vertical-align: top">
                                          <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                            <span>&#160;</span>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </body>
      </html>`,
        subject: `Issue from ${formik.values.email} `,
        text: formik.values.issue,
      },
    };

    await createFireStore({collection: COLLECTIONS.mail, values});
    Diag.show({
      type: ALERT_TYPE.SUCCESS,
      title: 'Report sent',
      textBody: '',
      button: 'Ok',
      onHide: () => hideDialog(),
    });
    setIsLoading(false);
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

  const formikProps = (field: keyof ReportDialogProps) => {
    return {
      onChangeText: formik.handleChange(field),
      value: formik.values[field],
      error:
        formik.touched[field] && formik.errors[field]
          ? formik.errors[field]
          : null,
    };
  };

  React.useEffect(() => {
    if (!isEmpty(formik.errors) && formik.isSubmitting) {
      Diag.show({
        type: ALERT_TYPE.DANGER,
        title: 'ERROR',
        textBody: 'Please fill up all the fields or invalid format',
        button: 'close',
      });
    }
  }, [formik.errors, formik.isSubmitting]);

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
                  onChangeText={a => formik.setFieldValue('issue', a)}
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
