import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import PhoneIcon from '@material-ui/icons/Phone';
import PersonIcon from '@material-ui/icons/Person';
import { blue } from '@material-ui/core/colors';
import { modoVisita } from '../../constants/direccionConfig';

const useStyles = makeStyles({
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
  },
});

export const PhoneDialog = ({ onClose, open, contatos }) => {
  const classes = useStyles();

  const handleClose = () => {
    onClose();
  };

  const handleListItemClick = value => {
    window.open(`tel:${value}`);
    onClose();
  };

  return (
    <>
      {contatos && (
        <Dialog
          onClose={handleClose}
          aria-labelledby="phone-dialog-title"
          open={open}
        >
          <DialogTitle id="phone-dialog-title">
            Selecione um número para ligar
          </DialogTitle>
          <List>
            {contatos.map(phone => (
              <ListItem
                button
                onClick={() => handleListItemClick(phone)}
                key={phone}
              >
                <ListItemAvatar>
                  <Avatar className={classes.avatar}>
                    <PhoneIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={phone} />
              </ListItem>
            ))}
          </List>
        </Dialog>
      )}
    </>
  );
};

PhoneDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export const DoneDialog = ({ onClose, open }) => {
  const classes = useStyles();
  const situacoes = Object.entries(modoVisita).filter(situacao =>
    Boolean(situacao[1].mensagem),
  );

  const handleClose = () => {
    onClose(null);
  };

  const handleListItemClick = value => {
    onClose(value);
  };

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="done-dialog-title"
      open={open}
    >
      <DialogTitle id="done-dialog-title">Selecione uma situação</DialogTitle>
      <List>
        {situacoes.map(situacao => (
          <ListItem
            button
            onClick={() => handleListItemClick(situacao[0].toString())}
            key={situacao[0]}
          >
            <ListItemText primary={situacao[1].mensagem} />
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
};

export const PublicadorDialog = ({ onClose, open, publicadores }) => {
  const classes = useStyles();

  const handleClose = () => {
    onClose(null);
  };

  const handleListItemClick = value => {
    onClose(value);
  };

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="publicador-dialog-title"
      open={open}
    >
      <DialogTitle id="publicador-dialog-title">
        Publicador responsável
      </DialogTitle>
      <List>
        {publicadores.map(publicador => (
          <ListItem
            button
            onClick={() => handleListItemClick(publicador)}
            key={publicador}
          >
            <ListItemAvatar>
              <Avatar className={classes.avatar}>
                <PersonIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={publicador} />
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
};
