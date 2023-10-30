import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import {
  MediaType,
  PhotoQuality,
  launchImageLibrary,
} from 'react-native-image-picker';

// Initialize Firebase (do this only once)
const firebaseConfig = {
  apiKey: 'AIzaSyBMKEpPANhglAjfcV8kW8uEWXpOGaxmz4M',
  authDomain: 'parktasticph-395211.firebaseapp.com',
  projectId: 'parktasticph-395211',
  storageBucket: 'parktasticph-395211.appspot.com',
  messagingSenderId: '322891877752',
  appId: '1:322891877752:web:e06d72aff83062f7270c8d',
  measurementId: 'G-H3QFZTMLW2',
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const pickImage = () => {
  return new Promise((resolve, reject) => {
    const options = {
      quality: 1 as PhotoQuality,
      mediaType: 'photo' as MediaType,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        reject('User cancelled image picker');
      } else if (response.errorMessage) {
        reject(`ImagePicker Error: ${response.errorMessage}`);
      } else {
        const sourcePath = response.assets?.[0].uri;
        resolve(sourcePath);
      }
    });
  });
};

const uploadImage = (sourcePath: any) => {
  return new Promise((resolve, reject) => {
    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}-${(
      currentDate.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}-${currentDate
      .getDate()
      .toString()
      .padStart(2, '0')}_${currentDate
      .getHours()
      .toString()
      .padStart(2, '0')}-${currentDate
      .getMinutes()
      .toString()
      .padStart(2, '0')}-${currentDate
      .getSeconds()
      .toString()
      .padStart(2, '0')}`;

    const filename =
      `${formattedDate}_` +
      sourcePath?.substring(sourcePath.lastIndexOf('/') + 1);
    console.log('filename', filename);
    console.log('sourcePath', sourcePath);

    const storageRef = firebase.storage().ref(`images/${filename}`);
    if (sourcePath) {
      fetch(sourcePath)
        .then(res => res.blob())
        .then(blob => {
          const uploadTask = storageRef.put(blob);

          uploadTask.on(
            'state_changed',
            _snapshot => {},
            error => {
              reject(`Failed to upload the image to Firebase. Error: ${error}`);
            },
            () => {
              uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
                resolve(downloadURL);
              });
            },
          );
        });
    }
  });
};

export {pickImage, uploadImage};
