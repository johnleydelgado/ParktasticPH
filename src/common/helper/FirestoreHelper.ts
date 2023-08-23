import firestore from '@react-native-firebase/firestore';

export const getCollectionRef = async (collectionName: string) => {
  return await firestore().collection(collectionName).get();
};

export const getDocumentRef = async (
  collectionName: string,
  documentID: string,
) => {
  return await firestore().collection(collectionName).doc(documentID);
};
