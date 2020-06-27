import React from 'react';
import Routes from './routes';
import { AuthProvider } from './services/Firebase/authContext';
import { CardsProvider } from './services/Contexto/cardsContext';

import Toast from './components/Toast';

import 'react-toastify/dist/ReactToastify.css';
import './global.css';

const App = () => {
  return (
    <AuthProvider>
      <CardsProvider>
        <Routes />
        <Toast />
      </CardsProvider>
    </AuthProvider>
  );
};

export default App;
