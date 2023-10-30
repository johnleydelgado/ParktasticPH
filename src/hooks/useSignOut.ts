import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {useAppDispatch} from './reduxHooks';
import {resetCommonState} from '@/redux/common';

export const useSignOut = () => {
  const dispatch = useAppDispatch();
  // Function to sign out from Firebase
  const firebaseSignOut = async () => {
    try {
      await auth().signOut();
    } catch (error) {
      console.error('Error signing out from Firebase:', error);
    }
  };

  // Function to sign out from Google Sign-In
  const googleSignOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
    } catch (error) {
      console.error('Error signing out from Google:', error);
    }
  };

  // Function to sign out from both
  const signOut = async () => {
    await firebaseSignOut();
    await googleSignOut();
    dispatch(resetCommonState());
  };

  return {signOut};
};
