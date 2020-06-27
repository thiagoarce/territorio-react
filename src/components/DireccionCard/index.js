import React, { useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import { red } from '@material-ui/core/colors';
import CardForm from './CardForm';
import CardInfo from './CardInfo';
import { CardsContext } from '../../services/Contexto/cardsContext';
import { modoVisita } from '../../constants/direccionConfig';

const useStyles = makeStyles(theme => ({
  avatar: {
    backgroundColor: red[500],
    fontSize: '16px',
  },
}));
const DireccionCard = ({ id, publicadores }) => {
  const { enderecos } = useContext(CardsContext);
  const endereco = enderecos[id];
  const classes = useStyles();
  const ultimaData = new Date(endereco.visitas.latest.date.seconds * 1000);

  const headerInicial = {
    tipo: modoVisita[endereco.visitas.latest.modo].header,
    publicador: endereco.visitas.latest.por,
    date: Intl.DateTimeFormat('pt-BR', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(ultimaData),
  };

  const [isEditable, setIsEditable] = useState(false);
  const [header, setHeader] = useState(headerInicial);

  const handleEditButton = () => {
    setIsEditable(!isEditable);
  };

  const handleHeaderChange = (situacao, publicador) => {
    if (!situacao) {
      return setHeader(headerInicial);
    }
    const today = new Date();

    const newHeader = {
      tipo: modoVisita[situacao].header,
      publicador,
      date: Intl.DateTimeFormat('pt-BR', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }).format(today),
    };

    setHeader(newHeader);
  };

  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar aria-label="serial" className={classes.avatar}>
            {endereco.id.toString().padStart(4, '0')}
          </Avatar>
        }
        title={`${header.tipo} por ${header.publicador}`}
        subheader={`Em ${header.date}`}
      />
      {isEditable ? (
        <CardForm
          endereco={endereco}
          handleEditButton={handleEditButton}
          changeHeader={handleHeaderChange}
          publicadores={publicadores}
        />
      ) : (
        <CardInfo
          endereco={endereco}
          handleEditButton={handleEditButton}
          changeHeader={handleHeaderChange}
          publicadores={publicadores}
        />
      )}
    </Card>
  );
};
export default DireccionCard;
