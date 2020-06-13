import React, { useEffect, useState, createContext } from 'react';
import { auth, firestore } from './index';
import { trackPromise } from 'react-promise-tracker';

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
        console.log('chamada');
        trackPromise(
          firestore
            .doc(`users/${authUser.uid}`)
            .get()
            .then(snapshot => {
              const dbUser = snapshot.data();
              const userData = {
                uid: authUser.uid,
                email: authUser.email,
                displayName: dbUser.displayName,
                congregation: dbUser.congregation,
                role: dbUser.role,
              };
              setUser(userData);
              localStorage.setItem('authUser', JSON.stringify(userData));
            }),
        );
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
