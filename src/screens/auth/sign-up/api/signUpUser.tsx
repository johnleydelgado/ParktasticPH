import {COLLECTIONS} from '@/common/constant/firestore';
import {SignUpUserProps} from '@/common/schema/main';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const signUpUser = async ({
  email,
  password,
  fullName,
  phoneNumber,
  role,
}: SignUpUserProps) => {
  const result = await auth().createUserWithEmailAndPassword(email, password);
  if (result.user) {
    const {uid, email} = result.user;

    await firestore().collection(COLLECTIONS.USERS).doc(uid).set({
      uid,
      email,
      fullName,
      phoneNumber,
      role,
    });
    return result.user;
  }
  throw new Error('Failed to sign up');
};

export default signUpUser;
