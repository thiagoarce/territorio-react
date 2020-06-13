import React from 'react';
import Routes from './routes';
import { AuthProvider } from './services/Firebase/authContext';
import LoadingIndicator from './components/LoadingIndicator';
import Toast from './components/Toast';

import 'react-toastify/dist/ReactToastify.css';
import './global.css';

const App = () => {
  return (
    <AuthProvider>
      <Routes />
      <LoadingIndicator />
      <Toast />
    </AuthProvider>
  );
};

export default App;
