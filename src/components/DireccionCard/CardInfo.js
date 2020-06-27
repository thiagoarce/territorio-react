import React, { useState } from 'react';
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
import { PhoneDialog, DoneDialog, PublicadorDialog } from './Dialogs';

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
  endereco,
  handleEditButton,
  publicadores,
  changeHeader,
}) => {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);
  const [openPhone, setOpenPhone] = useState(false);
  const [openDone, setOpenDone] = useState(false);
  const [openPublicador, setOpenPublicador] = useState(false);
  const [checkAsDone, setCheckAsDone] = useState(false);
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
    setCheckAsDone(false);
    changeHeader(null, null);
  };

  const handleDone = value => {
    setOpenDone(!openDone);
    value && setSituacao(value);
    value && setOpenPublicador(!openPublicador);
  };

  const handlePublicador = publicador => {
    setOpenPublicador(!openPublicador);
    publicador && situacao && changeHeader(situacao, publicador);
    publicador && situacao && setCheckAsDone(true);
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
          style={{ fontSize: '1.1rem' }}
          aria-label="rua e número"
        >
          {endereco.calle
            ? [endereco.calle, endereco.numero].filter(Boolean).join(', ')
            : endereco.contato[0]}
        </Typography>
        <Typography variant="body1" aria-label="referência">
          {endereco.referencia}
        </Typography>
        <Typography variant="body2" color="textSecondary" aria-label="bairro">
          {endereco.barrio}
        </Typography>
        <Typography variant="body2" color="textSecondary" aria-label="idiomas">
          {endereco.idioma && `Fala ${endereco.idioma.join('y ')}`}
        </Typography>
        <Typography variant="body2" color="textSecondary" aria-label="telefone">
          {endereco.calle && endereco.contato && `${endereco.contato[0]}`}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        {checkAsDone ? (
          <IconButton
            aria-label="Marcar como feito"
            onClick={handleUndoneButton}
          >
            <CheckCircleIcon />
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
          <IconButton aria-label="ver no mapa" onClick={handleOpenMaps}>
            <MapIcon />
          </IconButton>
        )}
        {endereco.contato && (
          <>
            <IconButton aria-label="Ligar para endereço" onClick={handlePhone}>
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
          <Button aria-label="deletar endereço" color="secondary">
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
    </>
  );
};

export default CardInfo;
