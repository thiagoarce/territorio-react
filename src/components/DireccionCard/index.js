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

  labelEdit: {
    backgroundColor: '#3f51b5',
    color: '#fff',
    fontWeight: 'bold',
    padding: '0.5em',
    textAlign: 'right',
  },
  labelDelete: {
    backgroundColor: red[500],
    color: '#fff',
    fontWeight: 'bold',
    padding: '0.5em',
    textAlign: 'right',
  },
}));
const DireccionCard = ({ id, publicadores }) => {
  const { enderecos } = useContext(CardsContext);
  const endereco = enderecos[id];
  const classes = useStyles();
  const ultimaData = endereco.visitas
    ? new Date(endereco.visitas.latest.date.seconds * 1000)
    : '';

  const headerInicial = endereco.visitas
    ? {
        tipo: modoVisita[endereco.visitas.latest.modo].header,
        publicador: endereco.visitas.latest.por,
        date: Intl.DateTimeFormat('pt-BR', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        }).format(ultimaData),
      }
    : null;

  const [isEditable, setIsEditable] = useState(false);
  const [header, setHeader] = useState(headerInicial);
  const [editado, setEditado] = useState(Boolean(endereco.editado));
  const [deletado, setDeletado] = useState(Boolean(endereco.deletado));

  const handleCloseEdition = () => {
    setIsEditable(!isEditable);
  };

  const handleHeaderChange = (situacao, publicador) => {
    if (!situacao) {
      return setHeader(null);
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
      {editado && <div className={classes.labelEdit}>Edição Solicitada</div>}
      {deletado && (
        <div className={classes.labelDelete}>Exclusão Solicitada</div>
      )}
      <CardHeader
        avatar={
          <Avatar aria-label="serial" className={classes.avatar}>
            {endereco.id.toString().padStart(4, '0')}
          </Avatar>
        }
        title={
          header ? `${header.tipo} por ${header.publicador}` : 'Nunca visitado'
        }
        subheader={header && `Em ${header.date}`}
      />
      {isEditable ? (
        <CardForm
          docId={id}
          endereco={endereco}
          onClose={handleCloseEdition}
          publicadores={publicadores}
          setEditado={setEditado}
        />
      ) : (
        <CardInfo
          docId={id}
          endereco={endereco}
          handleEditButton={handleCloseEdition}
          changeHeader={handleHeaderChange}
          publicadores={publicadores}
          setEditado={setEditado}
          setDeletado={setDeletado}
        />
      )}
    </Card>
  );
};
export default DireccionCard;
