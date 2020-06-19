import React, { useEffect, useState, createContext } from 'react';
import { auth } from './index';

export const AuthContext = createContext();

export const AuthProvider = props => {
  const currentUser = localStorage.getItem('authUser')
    ? JSON.parse(localStorage.getItem('authUser'))
    : null;
  const { children } = props;
  const [user, setUser] = useState(currentUser);

  useEffect(() => {
    auth.onAuthStateChanged(authUser => {
      if (authUser) {
        const userData = {
          ...JSON.parse(authUser.displayName),
          uid: authUser.uid,
          email: authUser.email,
        };

        setUser(userData);
        localStorage.setItem('authUser', JSON.stringify(userData));
      } else {
        setUser(null);
        localStorage.setItem('authUser', null);
      }
    });
  }, []);

  return (
    <AuthContext.Provider value={[user, setUser]}>
      {children}
    </AuthContext.Provider>
  );
};
