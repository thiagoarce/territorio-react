import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import {PrivateRoute} from './components/PrivateRoute'

//Componentes
import Direction from './components/Direction';
import PwForget from './components/PwForget'
import General from './components/General';
import Logon from './components/Logon';
import Register from './components/Register';
import Profile from './components/Profile';
import NewDireccion from './components/NewDireccion';
import MyTerritory from './components/MyTerritory';
import Assign from './components/Assign'
import Publishers from './components/Publishers'
import Approvals from './components/Approvals'
import Reports from './components/Reports'


const Routes = () => {

    return(
    <BrowserRouter>
        <Switch>
            <Route path="/logon" exact component={Logon}/>
            <Route path="/register" exact component={Register}/>
            <Route path="/pwforgot" exact component={PwForget}/>
            
            <PrivateRoute path="/profile" exact component={Profile}/>

            <PrivateRoute path="/" exact component={MyTerritory}/>
            <PrivateRoute path="/new" exact component={NewDireccion}/>
            <PrivateRoute path="/assign" exact component={Assign}/>
            <PrivateRoute path="/publishers" exact component={Publishers}/>
            <PrivateRoute path="/general" exact component={General}/>
            <PrivateRoute path="/approvals" exact component={Approvals}/>
            <PrivateRoute path="/reports" exact component={Reports}/>


            <PrivateRoute path="/tarjeta" exact component={Direction}/>
        </Switch>
    </BrowserRouter>);
}

export default Routes;