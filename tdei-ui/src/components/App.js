import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools'
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store from '../store';
import Router from '../routes'
import AuthProvider from './AuthProvider';
import Header from './Header';
import style from './App.module.css';

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
      <ReactQueryDevtools position='bottom-right' initialOpen={false} />
      <Provider store={store}>
        <BrowserRouter>
          <AuthProvider>
            <>
              <Header />
              <div className={style.container}>
                <Router />
              </div>
            </>
          </AuthProvider>
        </BrowserRouter>
      </Provider>
    </QueryClientProvider>
  );
};

export default App;
