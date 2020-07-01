import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import CreateIcon from '@material-ui/icons/Create';
import { useHistory } from 'react-router-dom';

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
  const history = useHistory(0);

  const handleClick = () => {
    history.push('/new');
  };

  return (
    <Fab
      variant="extended"
      color="secondary"
      className={classes.margin}
      onClick={handleClick}
    >
      <CreateIcon className={classes.extendedIcon} />
      Cadastrar Novo Endereço
    </Fab>
  );
};

export default CreateFloatingButton;
