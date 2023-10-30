//import liraries
import {createFireStore} from '@/common/api/main';
import {colors} from '@/common/constant/colors';
import {COLLECTIONS} from '@/common/constant/firestore';
import {images} from '@/common/constant/images';
import {pickImage, uploadImage} from '@/common/helper/pickImageAndUpload';
import {EmailProps} from '@/common/schema/main';
import {StackMainNavigationProp} from '@/navigators/DashboardNavigator';
import TextInput from '@/screens/auth/sign-up/component/TextIntput';
import {
  Box,
  Button,
  HStack,
  IconButton,
  ScrollView,
  Spacer,
  Text,
  TextArea,
  VStack,
} from 'native-base';
import React, {useState} from 'react';
import {Image, StyleSheet, TouchableOpacity} from 'react-native';
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Dialog,
} from 'react-native-alert-notification';
import {ActivityIndicator} from 'react-native-paper';
import Icon from 'react-native-vector-icons/AntDesign';

// create a component
const Support = ({navigation}: {navigation: StackMainNavigationProp}) => {
  const [emailOrPhone, setEmailOrPhone] = useState<string>('');
  const [issue, setIssue] = useState<string>('');
  const [imagePath, setImagePath] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [parkingSpaceName, setParkingSpaceName] = useState<string>('');
  const [slotNumber, setSlotNumber] = useState<string>('');

  const submitHandler = async () => {
    setIsLoading(true);
    const url = await uploadImage(imagePath);
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
                                      <p style="line-height: 22px; color:"white" ">From: ${emailOrPhone}</p>
                                    </h1>
                                  </td>
                                </tr>
                                <tr>
                                <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:15px 10px 10px 20px;font-family:arial,helvetica,sans-serif;" align="left">
                                  <h1 class="v-text-align" style="margin: 0px; color: #ffffff; line-height: 110%; text-align: left; word-wrap: break-word; font-size: 20px; font-weight: 700;">
                                    <span style="line-height: 22px;"></span>
                                    <p style="line-height: 22px; color:"white" ">Parking Space / Slot: ${parkingSpaceName} / ${slotNumber}</p>
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
                                        <span style="line-height: 18.2px; color: #ecf0f1;">${issue}</span>
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
        subject: `Issue from ${emailOrPhone} `,
        text: issue,
      },
    };

    await createFireStore({collection: COLLECTIONS.mail, values});
    Dialog.show({
      type: ALERT_TYPE.SUCCESS,
      title: 'Issue sent',
      textBody: '',
      button: 'Ok',
      onHide: () => navigation.goBack(),
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
  return (
    <AlertNotificationRoot>
      <VStack flex={1} bgColor="white">
        {/* HEADER */}
        <Box safeAreaTop={12} px={4} h="20%" w="full" bgColor={colors.bgColor}>
          <HStack justifyContent="space-between">
            <VStack>
              <TouchableOpacity
                style={{paddingBottom: 8}}
                onPress={() => navigation.goBack()}>
                <Icon name="arrowleft" color={colors.textDark} size={26} />
              </TouchableOpacity>
              <Text style={{...styles.fontStyleDefault}} fontSize="3xl">
                Support
              </Text>
              <Text
                style={{...styles.fontStyleDefault, fontSize: 14}}
                color="dark.500">
                Contact Us
              </Text>
            </VStack>
            <Box style={{position: 'absolute', right: 1}}>
              <Image
                source={images.support}
                style={{
                  width: 154,
                  height: 132,
                }}
                resizeMode="contain"
                alt="img"
              />
            </Box>
          </HStack>
        </Box>
        {/* GREEN HEADER */}
        <HStack
          px={4}
          py={2}
          h="10%"
          w="full"
          borderTopRadius={32}
          bgColor={colors.primary}>
          {/* <TouchableOpacity>
            <HStack space={2} pt={6} pl={4}>
              <Icon name="phone" color="white" size={22} />
              <Text
                style={{
                  ...styles.fontStyleDefault,
                  fontWeight: '400',
                  fontSize: 16,
                }}
                color="white">
                Call Us
              </Text>
            </HStack>
          </TouchableOpacity>
          <Divider
            orientation="vertical"
            thickness={2}
            mt={4}
            bgColor="white"
            style={{height: 32}}
          />*/}
          <TouchableOpacity>
            <HStack space={2} p={4}>
              <Icon name="mail" color="white" size={22} />
              <Text
                style={{
                  ...styles.fontStyleDefault,
                  fontWeight: '400',
                  fontSize: 16,
                }}
                color="white">
                Mail Us
              </Text>
            </HStack>
          </TouchableOpacity>
        </HStack>

        {/* WHITE */}
        <ScrollView
          bgColor="white"
          zIndex={4}
          style={{
            borderTopEndRadius: 32,
            borderTopStartRadius: 32,
            bottom: 24,
          }}>
          <VStack
            style={{borderTopEndRadius: 32, borderTopStartRadius: 32}}
            p={6}
            space={2}>
            <Text style={{...styles.fontStyleDefault}} fontSize="3xl">
              Write Us
            </Text>
            <Text
              style={{...styles.fontStyleDefault, fontSize: 14}}
              color="dark.500">
              Let us know your query
            </Text>

            <TextInput
              keyboardType="default"
              title="Phone Number/Email"
              placeholder="Add Contact Info"
              value={emailOrPhone}
              onChangeText={e => setEmailOrPhone(e.toLocaleLowerCase())}
              error={null}
            />

            <TextInput
              keyboardType="default"
              title="Parking space"
              placeholder="Add parking space Info"
              value={parkingSpaceName}
              onChangeText={e => setParkingSpaceName(e)}
              error={null}
            />

            <TextInput
              keyboardType="default"
              title="Slot Number"
              placeholder="Add slot no. Info"
              value={slotNumber}
              onChangeText={e => setSlotNumber(e)}
              error={null}
            />

            <Box pt={4} />
            <HStack alignItems="center" justifyContent="space-between">
              <Text
                style={{...styles.fontStyleDefault, fontSize: 16}}
                color="dark.100">
                Add your issue/feedback
              </Text>
              <VStack>
                <IconButton
                  alignSelf="flex-start"
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
            </HStack>

            <TextArea
              aria-label="t1"
              numberOfLines={4}
              placeholder="Write your message"
              onChangeText={e => setIssue(e)}
              _dark={{
                placeholderTextColor: 'gray.300',
              }}
              mb="5"
              autoCompleteType
            />
            <Spacer />
            {isLoading ? (
              <ActivityIndicator />
            ) : (
              <Button
                bgColor={colors.primary}
                onPress={() => submitHandler()}
                mb={24}>
                Submit
              </Button>
            )}
          </VStack>
        </ScrollView>
      </VStack>
    </AlertNotificationRoot>
  );
};

// define your styles
const styles = StyleSheet.create({
  fontStyleDefault: {
    fontWeight: '600',
    fontFamily: 'OpenSans-Regular',
    fontSize: 20,
  },
});

//make this component available to the app
export default Support;
