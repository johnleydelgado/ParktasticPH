import {SignUpUserProps} from '@/common/schema/main';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const signUpUser = async ({
  email,
  password,
  fullName,
  phoneNumber,
}: SignUpUserProps) => {
  const result = await auth().createUserWithEmailAndPassword(email, password);
  if (result.user) {
    const {uid, email} = result.user;
    await firestore().collection('Users').doc(uid).set({
      uid,
      email,
      fullName,
      phoneNumber,
    });
    return result.user;
  }
  throw new Error('Failed to sign up');
};

export default signUpUser;
