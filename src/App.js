import React from 'react';
import Routes from './routes';
import './global.css';
import { AuthProvider } from './context/AuthContext'


const App = () => {

  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
}

export default App;
