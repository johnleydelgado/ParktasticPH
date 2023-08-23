import React from 'react';
import {FallbackProvider} from '@common/provider/FallbackProvider';
import {PrivateView, PublicView} from './MainView';
import {NativeBaseProvider} from 'native-base';
import {Provider} from 'react-redux';
import {store} from './redux/store';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

function App(): JSX.Element {
  const queryClient = new QueryClient();
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <NativeBaseProvider>
          <FallbackProvider fallbackContent={<PublicView />}>
            <PrivateView />
          </FallbackProvider>
        </NativeBaseProvider>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
