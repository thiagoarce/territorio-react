import React from 'react';
import Routes from './routes';
import { AuthProvider } from './services/Firebase/authContext';
import { CardsProvider } from './services/Contexto/cardsContext';
import LoadingIndicator from './components/LoadingIndicator';
import ServiceWorkerWrapper from './components/ServiceWorkerWrapper';

import Toast from './components/Toast';

import 'react-toastify/dist/ReactToastify.css';
import './global.css';

const App = () => {
  return (
    <CardsProvider>
      <AuthProvider>
        <Routes />
        <LoadingIndicator />
        <Toast />
        <ServiceWorkerWrapper />
      </AuthProvider>
    </CardsProvider>
  );
};

export default App;
