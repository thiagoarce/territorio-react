import React, { useEffect, useState, createContext } from 'react'
import { auth } from './index'

export const AuthContext = createContext();

export const AuthProvider = props => {
    const { children } = props;
    const [user, setUser] = useState(null);

    useEffect(() => {
        auth.onAuthStateChanged(userAuth => {
            setUser(userAuth);
        });
    }, []);

    return (
        <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
    );

};