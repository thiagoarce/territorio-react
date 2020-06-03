import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

//Imports do Firebase
import { auth } from '../Firebase'

//Imports do MaterialUI
import {
    AppBar, Toolbar, Typography, IconButton,
    SwipeableDrawer, Menu, List, Divider, MenuItem,
} from '@material-ui/core';
import {
    Menu as MenuIcon, Public as WorldIcon, Create as CreateIcon,
    BusinessCenter as BagIcon, AssignmentInd as AssignIcon,
    Assessment as ReportIcon, PlaylistAddCheck as PlaylistAddCheckIcon,
    AccountCircle, PermContactCalendar as PeopleIcon
} from '@material-ui/icons';
import { useStyles } from './styles'
import { ListItemLink } from './ListItemLink'



export default function Nav() {
    const classes = useStyles();
    const [openDrawer, setOpenDrawer] = useState(false);
    const [anchorMenu, setAnchorMenu] = useState(null);
    const openMenu = Boolean(anchorMenu);
    const history = useHistory();

    const handleMenu = (event) => {
        setAnchorMenu(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorMenu(null);
    };

    const goToProfile = () => {
        history.push('/profile');
        setAnchorMenu(null);
    };

    const handleLogout = async () => {

        try {
            await auth.signOut();
            history.push('/Logon')
        }
        catch (e) { console.log("Não foi possível deslogar") }

    }


    const list = () => (
        <div
            className={classes.list}
            onClick={() => setOpenDrawer(false)}
            onKeyDown={() => setOpenDrawer(false)}
        >
            <List>
                <ListItemLink to="/" primary="Meus Territórios" icon={<BagIcon />} />
                <ListItemLink to="/new" primary="Cadastrar Endereço" icon={<CreateIcon />} />
            </List>
            <Divider />
            <List>
                <ListItemLink to="/assign" primary="Designar território" icon={<AssignIcon />} />
            </List>
            <Divider />
            <List>
                <ListItemLink to="/publishers" primary="Publicadores" icon={<PeopleIcon />} />
                <ListItemLink to="/general" primary="Todas as regiões" icon={<WorldIcon />} />
                <ListItemLink to="/approvals" primary="Aprovar Alterações" icon={<PlaylistAddCheckIcon />} />
                <ListItemLink to="/reports" primary="Relatórios" icon={<ReportIcon />} />
            </List>
        </div>
    );



    return (
        <div>
            <>
                <div className={classes.root}>
                    <AppBar position="static">
                        <Toolbar>
                            <IconButton onClick={() => setOpenDrawer(true)} edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                                <MenuIcon />
                            </IconButton>
                            <Typography variant="h6" className={classes.title}>
                                Photos
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
                                    <MenuItem onClick={goToProfile}>Meu Perfil</MenuItem>
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
