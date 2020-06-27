import React from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

const CartaoCard = props => {
  const classes = useStyles();
  const cartao = props.cartao;
  const history = useHistory();
  const data = new Date(cartao.designadoEm.seconds * 1000);
  const designadoEm = Intl.DateTimeFormat('pt-BR', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(data);

  const handleCardOpen = () => {
    history.push('/tarjeta', { cartao });
  };

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography
          className={classes.title}
          color="textSecondary"
          gutterBottom
        >
          Designado em: {designadoEm}
        </Typography>
        <Typography variant="h5" component="h2">
          {cartao.nome}
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
          {cartao.enderecos.length} registros
        </Typography>
        <Typography variant="body2" component="p">
          Designado para {cartao.designadoPara.join(', ')}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={handleCardOpen}>
          Abrir
        </Button>
      </CardActions>
    </Card>
  );
};

export default CartaoCard;
