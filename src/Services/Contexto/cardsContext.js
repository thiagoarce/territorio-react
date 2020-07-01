import React, { useState, createContext, useEffect } from 'react';
import { Firebase, firestore } from '../../services/Firebase';
import { trackPromise } from 'react-promise-tracker';
export const CardsContext = createContext();

export const CardsProvider = ({ children }) => {
  const currentCartoes = localStorage.getItem('cartoes')
    ? JSON.parse(localStorage.getItem('cartoes'))
    : [];

  const currentEnderecos = localStorage.getItem('enderecos')
    ? JSON.parse(localStorage.getItem('enderecos'))
    : {};

  const [cartoes, setCartoes] = useState(currentCartoes);
  const [enderecos, setEnderecos] = useState(currentEnderecos);

  useEffect(() => {
    localStorage.setItem('enderecos', JSON.stringify(enderecos));
  }, [enderecos]);

  useEffect(() => {
    localStorage.setItem('cartoes', JSON.stringify(cartoes));

    cartoes.forEach(async cartao => {
      console.log('chamada');

      const response = await trackPromise(
        firestore
          .collection('enderecos')
          .where(
            Firebase.firestore.FieldPath.documentId(),
            'in',
            cartao.enderecos,
          )
          .get(),
      );

      let data = {};
      response.docs.forEach(item =>
        Object.assign(data, { [item.id]: item.data() }),
      );

      setEnderecos(prevState => {
        return { ...prevState, ...data };
      });
    });
  }, [cartoes]);

  return (
    <CardsContext.Provider
      value={{ cartoes, setCartoes, enderecos, setEnderecos }}
    >
      {children}
    </CardsContext.Provider>
  );
};
