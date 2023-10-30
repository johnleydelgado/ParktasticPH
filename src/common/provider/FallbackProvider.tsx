import React, {useEffect, useState, ReactNode} from 'react';
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
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const firebaseUnsubscribe = auth().onAuthStateChanged(user => {
      console.log('Firebase state changed:', !!user);
      setIsSignedIn(!!user);
      setIsLoading(false);
    });

    return () => {
      firebaseUnsubscribe();
    };
  }, []);

  return isLoading ? (
    <HStack space={2} justifyContent="center" alignItems="center">
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
