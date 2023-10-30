import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import firestore, {firebase} from '@react-native-firebase/firestore';
import {Dispatch} from 'redux';
import {setUserData} from '@/redux/common';
import {COLLECTIONS} from '@/common/constant/firestore';

async function googleSignInUser(dispatch: Dispatch<any>): Promise<void> {
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    const googleCredential = auth.GoogleAuthProvider.credential(
      userInfo.idToken,
    );
    await auth().signInWithCredential(googleCredential);

    const {name, email} = userInfo.user;
    const userId = firebase.auth().currentUser?.uid;
    const userDocRef = await firestore()
      .collection(COLLECTIONS.USERS)
      .doc(userId)
      .get();

    if (!userDocRef.exists) {
      await firestore().collection(COLLECTIONS.USERS).doc(userId).set({
        uid: userId,
        email,
        fullName: name,
        phoneNumber: '',
        role: 'Driver',
      });
    }

    // await firestoreAdd({
    //   collection: COLLECTIONS.PARKING_SLOTS,
    //   userId: userId,
    //   values: {lotID: 'A02', status: lotStatus.a, userId},
    // });
    dispatch(
      setUserData({
        name: name || '',
        email,
        phoneNumber: '',
        role: userDocRef.data()?.role,
      }),
    );
  } catch (error: any) {
    console.error('Sign-in error:', error);

    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      // user cancelled the login flow
    } else if (error.code === statusCodes.IN_PROGRESS) {
      // operation (e.g. sign in) is in progress already
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      // play services not available or outdated
    } else {
      // some other error happened
    }
  }
}

export default googleSignInUser;
