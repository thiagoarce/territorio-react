import React, { useCallback, useContext, useEffect } from 'react';
import { AuthContext } from '../../services/Firebase/authContext';
import { trackPromise } from 'react-promise-tracker';
import CreateFloatingButton from '../../components/CreateFloatingButton';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { firestore } from '../../services/Firebase';
import CartaoCard from '../../components/CartaoCard';
import Container from '@material-ui/core/Container';
import { CardsContext } from '../../services/Contexto/cardsContext';
import IconButton from '@material-ui/core/IconButton';
import SyncIcon from '@material-ui/icons/Sync';
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

  useEffect(() => {
    if (cartoes.length === 0) {
      console.log('chamou');
      const today = new Date();
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
      trackPromise(
        firestore
          .collection('designacoes')
          .where('emails', 'array-contains', user.email)
          .where('designadoEm', '>', monthAgo)
          .orderBy('designadoEm', 'desc')
          .get()
          .then(response => response.docs.map(doc => doc.data()))
          .then(data => setCartoes(data)),
      );
    }
  }, [cartoes.length, setCartoes, user]);

  const atualizaCartoes = useCallback(() => {
    console.log('chamada');
    const today = new Date();
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    trackPromise(
      firestore
        .collection('designacoes')
        .where('emails', 'array-contains', user.email)
        .where('designadoEm', '>', monthAgo)
        .orderBy('designadoEm', 'desc')
        .get()
        .then(response => response.docs.map(doc => doc.data()))
        .then(data => setCartoes(data)),
    );
  }, [user, setCartoes]);

  return (
    <Container className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={10}>
          <h3>Bem Vindo,</h3>
          <h1>{user.displayName}</h1>
        </Grid>
        <Grid item xs={2}>
          <IconButton
            aria-label="Atualizar os cartões"
            onClick={atualizaCartoes}
          >
            <SyncIcon fontSize="large" />
          </IconButton>
        </Grid>
        {user.congregation === 'pend' && (
          <Grid item xs={12}>
            <h2>
              Seu cadastro se encontra pendente. Solicite a um admnistrador para
              designar sua congregação.
            </h2>
          </Grid>
        )}
        {cartoes.length !== 0 && (
          <Grid item xs={12}>
            <h2>Estes são os cartões designados para você:</h2>
          </Grid>
        )}

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
