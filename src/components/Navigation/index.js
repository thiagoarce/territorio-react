import React, { useState, useEffect, useContext } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { locations } from '../../constants/locations';
import { AuthContext } from '../../services/Firebase/authContext';

//Imports do Firebase
import { auth } from '../../services/Firebase';

//Imports do MaterialUI
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Menu from '@material-ui/core/Menu';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import MenuItem from '@material-ui/core/MenuItem';

import MenuIcon from '@material-ui/icons/Menu';
import WorldIcon from '@material-ui/icons/Public';
import CreateIcon from '@material-ui/icons/Create';
import BagIcon from '@material-ui/icons/BusinessCenter';
import AssignIcon from '@material-ui/icons/AssignmentInd';
import ReportIcon from '@material-ui/icons/Assessment';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import PeopleIcon from '@material-ui/icons/PermContactCalendar';
import AccountCircle from '@material-ui/icons/AccountCircle';

import { useStyles } from './styles';
import { ListItemLink } from './ListItemLink';

export default function Nav() {
  const [user] = useContext(AuthContext);
  const classes = useStyles();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [anchorMenu, setAnchorMenu] = useState(null);
  const [pageName, setPageName] = useState('Meus Territórios');
  const openMenu = Boolean(anchorMenu);
  const history = useHistory();

  let location = useLocation();

  useEffect(() => {
    setPageName(locations[location.pathname]);
  }, [location.pathname]);

  const handleMenu = event => {
    setAnchorMenu(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorMenu(null);
  };

  const goToAccount = () => {
    setPageName('Meu Perfil');
    history.push('/account');
    setAnchorMenu(null);
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      history.push('/Logon');
    } catch (e) {
      console.log('Não foi possível deslogar');
    }
  };

  const list = () => (
    <div
      className={classes.list}
      onClick={() => setOpenDrawer(false)}
      onKeyDown={() => setOpenDrawer(false)}
    >
      <List>
        <ListItemLink to="/" primary="Meus Territórios" icon={<BagIcon />} />
        <ListItemLink
          to="/new"
          primary="Cadastrar Endereço"
          icon={<CreateIcon />}
        />
      </List>
      {(user.role === 'dir' || user.role === 'admin') && (
        <>
          <Divider />
          <List>
            <ListItemLink
              to="/assign"
              primary="Designar território"
              icon={<AssignIcon />}
            />
          </List>
        </>
      )}
      {user.role === 'admin' && (
        <>
          <Divider />
          <List>
            <ListItemLink
              to="/publishers"
              primary="Publicadores"
              icon={<PeopleIcon />}
            />
            <ListItemLink
              to="/general"
              primary="Todas as regiões"
              icon={<WorldIcon />}
            />
            <ListItemLink
              to="/approvals"
              primary="Aprovar Alterações"
              icon={<PlaylistAddCheckIcon />}
            />
            <ListItemLink
              to="/reports"
              primary="Relatórios"
              icon={<ReportIcon />}
            />
          </List>
        </>
      )}
    </div>
  );

  return (
    <div>
      <>
        <div className={classes.root}>
          <AppBar position="static">
            <Toolbar>
              <IconButton
                onClick={() => setOpenDrawer(true)}
                edge="start"
                className={classes.menuButton}
                color="inherit"
                aria-label="menu"
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" className={classes.title}>
                {pageName}
              </Typography>

              <div>
                <IconButton
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorMenu}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={openMenu}
                  onClose={handleClose}
                >
                  <MenuItem onClick={goToAccount}>Meu Perfil</MenuItem>
                  <MenuItem onClick={handleLogout}>Sair</MenuItem>
                </Menu>
              </div>
            </Toolbar>
          </AppBar>
        </div>

        <SwipeableDrawer
          open={openDrawer}
          onClose={() => setOpenDrawer(false)}
          onOpen={() => setOpenDrawer(true)}
        >
          {list()}
        </SwipeableDrawer>
      </>
    </div>
  );
}
