import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {ALERT_TYPE, Dialog} from 'react-native-alert-notification';
import firestore from '@react-native-firebase/firestore';
import {COLLECTIONS} from '@/common/constant/firestore';
import {setUserData} from '@/redux/common';
import {Dispatch} from '@reduxjs/toolkit';

const SignInUser = async (
  email: string,
  password: string,
  dispatch: Dispatch<any>,
): Promise<FirebaseAuthTypes.UserCredential | null> => {
  console.log('aaa');
  try {
    const querySnapshot = await firestore()
      .collection(COLLECTIONS.USERS)
      .where('email', '==', email)
      .get();

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();
      console.log('userData', userData);
      const {fullName, email, phoneNumber, role} = userData;

      dispatch(
        setUserData({
          name: fullName || '',
          email,
          phoneNumber: phoneNumber,
          role,
        }),
      );

      const response = await auth().signInWithEmailAndPassword(email, password);
      return response;
    }

    Dialog.show({
      type: ALERT_TYPE.WARNING,
      title: 'Warning',
      textBody: 'Please check password and email',
      button: 'close',
    });
    return null;
  } catch (error) {
    Dialog.show({
      type: ALERT_TYPE.DANGER,
      title: 'Error',
      textBody: String(error),
      button: 'close',
    });
    return null;
  }
};

export default SignInUser;
