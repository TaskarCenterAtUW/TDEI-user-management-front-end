import { hot } from 'react-hot-loader/root';
import React from 'react';
import { QueryClient, QueryClientProvider} from 'react-query';
import { ReactQueryDevtools} from 'react-query/devtools'
import { Provider } from 'react-redux';
import {RouterProvider} from 'react-router-dom';
import store from '../store';
import router from '../routes'

const App = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 0
      }
    }
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools position='bottom-right' initialOpen={false}/>
      <Provider store={store}>
      <RouterProvider router={router}/>
      {/* <h1>KKK</h1> */}
      </Provider>
    </QueryClientProvider>
  );
};

export default App;
