import React, { useContext } from 'react';
import { AuthContext } from '../../services/Firebase/authContext';
import CreateFloatingButton from '../../components/CreateFloatingButton';
import Container from '@material-ui/core/Container';
import DireccionCard from '../../components/DireccionCard';

const Home = () => {
  const [user] = useContext(AuthContext);

  return (
    <div>
      <Container>
        <h1>Bem vindo, {user.displayName}</h1>
        <DireccionCard />
        <DireccionCard />
        <CreateFloatingButton />
      </Container>
    </div>
  );
};

export default Home;
