import React, {useContext} from 'react';
import {Route, Redirect } from 'react-router-dom';
import { AuthContext } from '../Firebase/authContext'
import Nav from '../Navigation'

export const PrivateRoute = props => {
    const {component: RouteComponent, ...other} = props;
    const {user} = useContext(AuthContext);

    return(
        <Route
            {...other}
            render={routeProps => 
            !!user ? (
                <>
                <Nav />
                <RouteComponent {...routeProps}/>
                </>
            ) : (
                <Redirect to="/Logon"/>
            )
            }/>
    );
};
