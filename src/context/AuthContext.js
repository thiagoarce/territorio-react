import React, { useEffect, useState, createContext } from 'react'
import { auth } from '../services/firebase'

export const AuthContext = createContext();

export const AuthProvider = props => {
    const { children } = props;
    const [user, setUser] = useState(null);
    const [waiting, setWaiting] = useState(true);

    useEffect(() => {
        auth.onAuthStateChanged(id => {
            setUser(id);
            setWaiting(false);
        });
    }, []);

    if (waiting) {
        return <>Carregando...</>;
    }

    return (
        <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
    );

};