import React, {useEffect, useState, ReactNode} from 'react';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {HStack, Heading, Spinner} from 'native-base';
// import {useAppSelector} from '@/hooks/reduxHooks';
import auth from '@react-native-firebase/auth';
interface FallbackProviderProps {
  children: ReactNode;
  fallbackContent: ReactNode;
}

export const FallbackProvider: React.FC<FallbackProviderProps> = ({
  children,
  fallbackContent,
}) => {
  const [isFirebaseSignedIn, setIsFirebaseSignedIn] = useState(false);
  const [isGoogleSignedIn, setIsGoogleSignedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // const {user: userState} = useAppSelector(state => state.common);

  const isSignedIn = isFirebaseSignedIn || isGoogleSignedIn;

  useEffect(() => {
    setIsLoading(true);

    // For Firebase Email/Password
    const firebaseUnsubscribe = auth().onAuthStateChanged(user => {
      setIsFirebaseSignedIn(!!user);
    });

    // For Google Sign-In
    const checkGoogleSignIn = async () => {
      const signedIn = await GoogleSignin.isSignedIn();
      setIsGoogleSignedIn(signedIn);
      setIsLoading(false);
    };

    // Check Google Sign-In
    checkGoogleSignIn();

    // Cleanup subscriptions
    return () => {
      firebaseUnsubscribe();
    };
  }, []);

  // Show children if user is signed in, fallbackContent otherwise
  return isLoading ? (
    <HStack space={2} justifyContent="center">
      <Spinner accessibilityLabel="Loading posts" />
      <Heading color="primary.500" fontSize="md">
        Loading
      </Heading>
    </HStack>
  ) : isSignedIn ? (
    children
  ) : (
    fallbackContent
  );
};
