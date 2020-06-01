import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Tarjeta from './pages/Tarjeta';
import Regioes from './pages/Regioes';
import Logon from './pages/Logon';
import Cadastrar from './pages/Cadastrar';

import {PrivateRoute} from './components/PrivateRoute'

const Routes = () => {

    return(
    <BrowserRouter>
        <Switch>
            <Route path="/Logon" exact component={Logon}/>
            <Route path="/register" exact component={Cadastrar}/>
            <PrivateRoute path="/tarjeta" exact component={Tarjeta}/>
            <PrivateRoute path="/" exact component={Regioes}/>
            <PrivateRoute path="/endereco/new" exact component={Regioes}/>

        </Switch>
    </BrowserRouter>);
}

export default Routes;