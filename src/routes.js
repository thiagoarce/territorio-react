import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { PrivateRoute } from './components/PrivateRoute';

//Componentes
import Tarjeta from './pages/Tarjeta';
import PwForget from './pages/PwForget';
import General from './pages/General';
import Logon from './pages/Logon';
import Register from './pages/Register';
import Account from './pages/Account';
import NewDireccion from './pages/NewDireccion';
import Home from './pages/Home';
import Assign from './pages/Assign';
import Publishers from './pages/Publishers';
import Approvals from './pages/Approvals';
import Reports from './pages/Reports';

const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/logon" exact component={Logon} />
        <Route path="/register" exact component={Register} />
        <Route path="/pwforgot" exact component={PwForget} />

        <PrivateRoute path="/account" exact component={Account} />

        <PrivateRoute path="/" exact component={Home} />
        <PrivateRoute path="/new" exact component={NewDireccion} />
        <PrivateRoute path="/assign" exact component={Assign} />
        <PrivateRoute path="/publishers" exact component={Publishers} />
        <PrivateRoute path="/general" exact component={General} />
        <PrivateRoute path="/approvals" exact component={Approvals} />
        <PrivateRoute path="/reports" exact component={Reports} />

        <PrivateRoute path="/tarjeta" exact component={Tarjeta} />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
