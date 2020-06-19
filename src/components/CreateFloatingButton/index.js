import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import CreateIcon from '@material-ui/icons/Create';

const useStyles = makeStyles(theme => ({
  margin: {
    top: 'auto',
    right: 20,
    bottom: 20,
    left: 'auto',
    position: 'fixed',
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}));

const CreateFloatingButton = () => {
  const classes = useStyles();

  return (
    <Fab variant="extended" color="secondary" className={classes.margin}>
      <CreateIcon className={classes.extendedIcon} />
      Cadastrar Novo Endereço
    </Fab>
  );
};

export default CreateFloatingButton;
