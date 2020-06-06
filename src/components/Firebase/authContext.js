import React, { useEffect, useState, createContext } from 'react'
import { auth, firestore } from './index'

export const AuthContext = createContext();

export const AuthProvider = props => {
    const { children } = props;
    const [user, setUser] = useState(null);

    useEffect(() => {
        auth.onAuthStateChanged(authUser => {
    
            if (authUser) {
                firestore.doc(`users/${authUser.uid}`)
                    .get()
                    .then(snapshot => {
                        const dbUser = snapshot.data();
                        
                            setUser({...authUser, ...dbUser});
                    });
            } else {
                setUser(null)
            }
        })}, []);

        return (
            <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
        );

   };