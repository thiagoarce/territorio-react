import React, { useContext } from 'react';
import { AuthContext } from '../../services/Firebase/authContext';
import DireccionCard from '../../components/DireccionCard';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';

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

const Tarjeta = props => {
  const [user] = useContext(AuthContext);
  const { enderecos, designadoPara } = props.location.state.cartao;
  const classes = useStyles();

  return (
    <Container className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <h1>Bem vindo, {user.displayName}</h1>
          <h2>Estes são os cartões designados para você:</h2>
        </Grid>
        {enderecos.map(endereco => (
          <Grid item key={endereco} xs={12} sm={6} md={4}>
            <DireccionCard id={endereco} publicadores={designadoPara} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Tarjeta;
