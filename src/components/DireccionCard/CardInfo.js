import React, { useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import MapIcon from '@material-ui/icons/Map';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PhoneIcon from '@material-ui/icons/Phone';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import { firestore } from '../../services/Firebase';
import { toast } from 'react-toastify';
import { CardsContext } from '../../services/Contexto/cardsContext';
import {
  PhoneDialog,
  DoneDialog,
  PublicadorDialog,
  DeleteDialog,
} from './Dialogs';
import { trackPromise } from 'react-promise-tracker';

const useStyles = makeStyles(theme => ({
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
}));

const CardInfo = ({
  docId,
  endereco,
  handleEditButton,
  publicadores,
  setDeletado,
  setEditado,
  changeHeader,
}) => {
  const classes = useStyles();
  const { enderecos, setEnderecos } = useContext(CardsContext);
  const [expanded, setExpanded] = useState(false);
  const [openPhone, setOpenPhone] = useState(false);
  const [openDone, setOpenDone] = useState(false);
  const [openPublicador, setOpenPublicador] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [checkAsDone, setCheckAsDone] = useState(Boolean(endereco.feito));
  const [situacao, setSituacao] = useState('');

  const handleExpand = () => {
    setExpanded(!expanded);
  };

  const handlePhone = () => {
    setOpenPhone(!openPhone);
  };

  const handleDoneButton = () => {
    setOpenDone(!openDone);
  };

  const handleUndoneButton = () => {
    if (!Boolean(endereco.deletado)) {
      setCheckAsDone(false);
      undoVisita();
      endereco.visitas.previous
        ? changeHeader(
            endereco.visitas.previous.modo,
            endereco.visitas.previous.por,
          )
        : changeHeader(null, null);
    }
  };

  const handleDone = value => {
    setOpenDone(!openDone);
    value && setSituacao(value);
    value && setOpenPublicador(!openPublicador);
  };

  const handlePublicador = publicador => {
    setOpenPublicador(!openPublicador);
    publicador && situacao && insertVisita(situacao, publicador);
    publicador && situacao && changeHeader(situacao, publicador);
    publicador && situacao && setCheckAsDone(true);
    publicador && situacao && setExpanded(false);
  };

  const insertVisita = (situacao, publicador) => {
    const today = new Date();

    const visitas = endereco.visitas
      ? {
          ...endereco.visitas,
          latest: {
            date: {
              seconds: Math.floor(today.getTime() / 1000),
              nanoseconds: 0,
            },
            por: publicador,
            modo: situacao,
          },
          previous: endereco.visitas.latest,
          [endereco.visitas.latest.date.seconds.toString()]: endereco.visitas
            .latest,
        }
      : {
          latest: {
            date: {
              seconds: Math.floor(today.getTime() / 1000),
              nanoseconds: 0,
            },
            por: publicador,
            modo: situacao,
          },
        };
    //adiciona ao estado
    const newEndereco = {
      ...endereco,
      visitas,
      feito: true,
    };

    setEnderecos({ ...enderecos, [docId]: newEndereco });

    trackPromise(
      firestore
        .collection('enderecos')
        .doc(docId)
        .set({ visitas, feito: true }, { merge: true }),
    );
  };

  const undoVisita = () => {
    const visitas = endereco.visitas.previous
      ? {
          ...endereco.visitas,
          latest: endereco.visitas.previous,
        }
      : '';
    //adiciona ao estado
    const newEndereco = {
      ...endereco,
      visitas,
      feito: false,
    };

    setEnderecos({ ...enderecos, [docId]: newEndereco });

    trackPromise(
      firestore
        .collection('enderecos')
        .doc(docId)
        .set({ visitas, feito: false }, { merge: true }),
    );
  };

  const handleDeleteButton = () => {
    setOpenDelete(!openDelete);
  };

  const handleDelete = (publicador, motivo) => {
    setOpenDelete(!openDelete);
    publicador && motivo && doDelete(publicador, motivo);
    publicador && motivo && setCheckAsDone(true);
    publicador && motivo && setExpanded(false);
  };

  const doDelete = async (publicador, motivo) => {
    try {
      const today = new Date();
      const newIdField = today.getTime().toString();

      //Cria uma edição em lote
      const batch = firestore.batch();
      const enderecoRef = firestore.collection('enderecos').doc(docId);
      const changeRef = firestore.collection('changes').doc(docId);

      //Adiciona ao banco de changeLog
      batch.set(
        changeRef,
        {
          [newIdField]: {
            previous: { ...endereco },
            dataDeDelecao: today,
            status: {
              deletado: true,
              por: publicador,
              motivo,
              verificado: false,
            },
          },
        },
        { merge: true },
      );

      //adiciona ao banco de dados
      batch.set(
        enderecoRef,
        {
          feito: true,
          editado: false,
          deletado: true,
        },
        { merge: true },
      );

      await trackPromise(batch.commit());

      setDeletado(true);
      setEditado(false);

      //adiciona ao estado
      const newEndereco = {
        ...endereco,
        feito: true,
        editado: false,
        deletado: true,
      };
      setEnderecos({ ...enderecos, [docId]: newEndereco });

      toast.info('Endereço editado com sucesso!');
    } catch (e) {
      console.log(e);
      toast.error('❌ Não foi possível editar');
    }
  };

  const handleOpenMaps = () => {
    const lat = endereco.coordenadas.latitude;
    const long = endereco.coordenadas.longitude;

    if (
      /* if we're on iOS, open in Apple Maps */
      navigator.platform.indexOf('iPhone') !== -1 ||
      navigator.platform.indexOf('iPad') !== -1 ||
      navigator.platform.indexOf('iPod') !== -1
    )
      window.open(`maps://maps.google.com/maps?daddr=${lat},${long}&amp;ll=`);
    /* if we're android  use Google Maps App */ else if (
      navigator.platform.indexOf('Linux') !== -1 ||
      navigator.platform.indexOf('Android') !== -1
    )
      window.open(`geo:0,0?q=${lat},${long}`);
    /* else use Google */ else
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${lat},${long}`,
      );
  };

  return (
    <>
      <CardContent>
        <Typography
          variant="h6"
          style={
            checkAsDone
              ? { fontSize: '1.1rem', color: 'gray' }
              : { fontSize: '1.1rem' }
          }
          aria-label="rua e número"
        >
          {endereco.calle
            ? [endereco.calle, endereco.numero].filter(Boolean).join(', ')
            : endereco.contato[0]}
        </Typography>
        <Typography
          variant="body1"
          aria-label="referência"
          style={checkAsDone ? { color: 'gray' } : {}}
        >
          {endereco.referencia}
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          aria-label="bairro"
          style={checkAsDone ? { color: 'gray' } : {}}
        >
          {endereco.barrio}
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          aria-label="idiomas"
          style={checkAsDone ? { color: 'gray' } : {}}
        >
          {endereco.idioma && `Fala ${endereco.idioma.join('y ')}`}
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          aria-label="telefone"
          style={checkAsDone ? { color: 'gray' } : {}}
        >
          {endereco.calle && endereco.contato && `${endereco.contato[0]}`}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        {checkAsDone ? (
          <IconButton
            aria-label="Marcar como feito"
            onClick={handleUndoneButton}
          >
            <CheckCircleIcon style={{ color: 'green' }} />
          </IconButton>
        ) : (
          <IconButton aria-label="Marcar como feito" onClick={handleDoneButton}>
            <CheckCircleOutlineIcon />
          </IconButton>
        )}
        <PhoneDialog
          contatos={endereco.contato}
          open={openPhone}
          onClose={handlePhone}
        />
        {endereco.coordenadas && (
          <IconButton
            aria-label="ver no mapa"
            onClick={handleOpenMaps}
            disabled={checkAsDone}
          >
            <MapIcon />
          </IconButton>
        )}
        {endereco.contato && (
          <>
            <IconButton
              aria-label="Ligar para endereço"
              onClick={handlePhone}
              disabled={checkAsDone}
            >
              <PhoneIcon />
            </IconButton>
            <PhoneDialog
              contatos={endereco.contato}
              open={openPhone}
              onClose={handlePhone}
            />
          </>
        )}
        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded,
          })}
          onClick={handleExpand}
          aria-expanded={expanded}
          aria-label="show more"
          disabled={checkAsDone}
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography variant="subtitle2">Nome</Typography>
          <Typography variant="body1" gutterBottom aria-label="nome">
            {endereco.nome}
          </Typography>
          <Typography variant="subtitle2">Nacionalidade</Typography>
          <Typography variant="body1" aria-label="nacionalidade" gutterBottom>
            {endereco.nacionalidade}
          </Typography>
          {endereco.contato && (
            <>
              <Typography variant="subtitle2">Telefones</Typography>
              <Typography variant="body1" aria-label="telefones" gutterBottom>
                {endereco.contato.join(', ')}
              </Typography>
            </>
          )}
          {endereco.email && (
            <>
              <Typography variant="subtitle2">Email</Typography>
              <Typography variant="body1" aria-label="email" gutterBottom>
                {endereco.email}
              </Typography>
            </>
          )}
        </CardContent>
        <CardActions disableSpacing>
          <Button
            aria-label="editar localização"
            color="primary"
            onClick={handleEditButton}
          >
            Editar Dados
          </Button>
          <Button
            aria-label="deletar endereço"
            color="secondary"
            onClick={handleDeleteButton}
          >
            Deletar Endereço
          </Button>
        </CardActions>
      </Collapse>
      <DoneDialog onClose={handleDone} open={openDone} />
      <PublicadorDialog
        onClose={handlePublicador}
        open={openPublicador}
        publicadores={publicadores}
      />
      <DeleteDialog
        onClose={handleDelete}
        open={openDelete}
        publicadores={publicadores}
      />
    </>
  );
};

export default CardInfo;
