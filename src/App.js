import React from 'react';
import Routes from './routes';
import './global.css';
import { AuthProvider } from './services/Firebase/authContext';
import Loader from 'react-loader-spinner';
import { usePromiseTracker } from 'react-promise-tracker';

const LoadingIndicator = props => {
  const { promiseInProgress } = usePromiseTracker();

  return (
    promiseInProgress && (
      <div
        style={{
          width: '100%',
          height: '100',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Loader type="ThreeDots" color="#2BAD60" height="100" width="100" />
      </div>
    )
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Routes />
      <LoadingIndicator />
    </AuthProvider>
  );
};

export default App;
