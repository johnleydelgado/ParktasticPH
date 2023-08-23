import firestore from '@react-native-firebase/firestore';
import {ParkingSpacesProps} from '../schema/main';
import Geocoder from 'react-native-geocoding';
import {GOOGLE_PLACES_AUTOCOMPLETE_KEY} from '@env';
import {getDistance, isPointWithinRadius} from 'geolib';

interface LocLatLngProps {
  lat: string;
  lng: string;
}

export const fetchParkingSpaces = async (
  searchLocLatLang: LocLatLngProps | null,
): Promise<ParkingSpacesProps[]> => {
  Geocoder.init(GOOGLE_PLACES_AUTOCOMPLETE_KEY);

  const querySnapshot = await firestore().collection('ParkingSpaces').get();

  const parkingSpaces: ParkingSpacesProps[] = [];
  let promises: Promise<void>[] = [];

  if (searchLocLatLang) {
    promises = querySnapshot.docs.map(async documentSnapshot => {
      const docId = documentSnapshot.id; // Extract the document ID
      const data = documentSnapshot.data() as ParkingSpacesProps;
      try {
        const json = await Geocoder.from(data.address);
        const {lat, lng} = json.results[0].geometry.location;
        const isWithin = isPointWithinRadius(
          {latitude: lat, longitude: lng},
          {
            latitude: searchLocLatLang.lat,
            longitude: searchLocLatLang.lng,
          },
          2000,
        );

        const distanceM = getDistance(
          {latitude: lat, longitude: lng},
          {
            latitude: searchLocLatLang.lat,
            longitude: searchLocLatLang.lng,
          },
        );

        data.km = distanceM / 1000;
        data.m = distanceM;
        data.id = docId;
        data.location = {lat, lng};
        if (isWithin) {
          parkingSpaces.push(data);
        }
      } catch (error) {
        console.warn(error);
      }
    });

    // Wait for all promises to complete before returning the result
    await Promise.all(promises);
  }

  return parkingSpaces;
};
