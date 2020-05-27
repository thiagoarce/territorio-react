import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Tarjeta from './pages/Tarjeta';
import Regioes from './pages/Regioes';
import Logon from './pages/Logon'

const Routes = () => {

    return(
    <BrowserRouter>
        <Switch>
            <Route path="/" exact component={Logon}/>
            <Route path="/tarjeta" exact component={Tarjeta}/>
            <Route path="/regioes" exact component={Regioes}/>
            <Route path="/endereco/new" exact component={Regioes}/>

        </Switch>
    </BrowserRouter>);
}

export default Routes;