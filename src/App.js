import React from 'react';
import Routes from './routes';
import './global.css';
import { AuthProvider } from './components/Firebase/authContext'


const App = () => {

  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
}

export default App;
