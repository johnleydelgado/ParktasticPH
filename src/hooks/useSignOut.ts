import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

export const useSignOut = () => {
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
  };

  return {signOut};
};
