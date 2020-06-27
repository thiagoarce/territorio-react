import React, { useCallback, useContext, useEffect } from 'react';
import { AuthContext } from '../../services/Firebase/authContext';
import CreateFloatingButton from '../../components/CreateFloatingButton';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { firestore } from '../../services/Firebase';
import CartaoCard from '../../components/CartaoCard';
import Container from '@material-ui/core/Container';
import { CardsContext } from '../../services/Contexto/cardsContext';
import Button from '@material-ui/core/Button';
const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    width: '100%',
    maxWidth: '1120px',
    height: '100vh',
    margin: '20px auto',
    padding: '0 30px',
  },
}));

const Home = () => {
  const [user] = useContext(AuthContext);
  const { cartoes, setCartoes } = useContext(CardsContext);
  const classes = useStyles();

  const obterCartoes = useCallback(() => {
    const today = new Date();
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    firestore
      .collection('designacoes')
      .where('emails', 'array-contains', user.email)
      .where('designadoEm', '>', monthAgo)
      .orderBy('designadoEm', 'desc')
      .get()
      .then(response => response.docs.map(doc => doc.data()))
      .then(data => setCartoes(data));
  }, []);

  return (
    <Container className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={8}>
          <h3>Bem Vindo,</h3>
          <h1>{user.displayName}</h1>
          {cartoes.length != 0 && (
            <h2>Estes são os cartões designados para você:</h2>
          )}
        </Grid>
        <Grid item xs={4}>
          <Button variant="contained" color="secondary" onClick={obterCartoes}>
            {cartoes.length != 0 ? `Recarregar Cartões` : `Carregar Cartões`}
          </Button>
        </Grid>

        {cartoes.map(cartao => (
          <Grid item key={cartao.nome} xs={12} sm={6} md={4}>
            <CartaoCard cartao={cartao} />
          </Grid>
        ))}
      </Grid>

      <CreateFloatingButton />
    </Container>
  );
};

export default Home;
