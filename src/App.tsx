import React from 'react';
import {FallbackProvider} from '@common/provider/FallbackProvider';
import {PrivateView, PublicView} from './MainView';
import {NativeBaseProvider} from 'native-base';
import {Provider} from 'react-redux';
import {store} from './redux/store';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {PaperProvider, MD3LightTheme as DefaultTheme} from 'react-native-paper';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'tomato',
    secondary: 'yellow',
  },
};

function App(): JSX.Element {
  const queryClient = new QueryClient();
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <NativeBaseProvider>
          <PaperProvider theme={theme}>
            <FallbackProvider fallbackContent={<PublicView />}>
              <PrivateView />
            </FallbackProvider>
          </PaperProvider>
        </NativeBaseProvider>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
