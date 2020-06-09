import React, {useContext} from 'react';
import {AuthContext} from '../../services/Firebase/authContext'


const Home = () => {
  const [user] = useContext(AuthContext)

  return (
  <div>
    <h1>Bem vindo, {user.displayName}</h1>
  </div>
)};

export default Home;