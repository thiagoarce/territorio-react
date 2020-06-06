import React, { useState, useCallback, useContext } from 'react';
import { Link, useHistory, Redirect } from 'react-router-dom'
import {AuthContext} from '../Firebase/authContext'
import { FiLogIn } from 'react-icons/fi'
import './styles.css'


import './styles.css'
import { auth } from '../Firebase';

const Logon = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const history = useHistory();

    const handleLogin = useCallback(async (e) => {
        e.preventDefault();

        try {
            await auth.signInWithEmailAndPassword(email, password);
            history.push('/');
        } catch (error) {
            console.log(error);
        }


    }, [email, history, password]);

    const {user} = useContext(AuthContext);

    if(user){
        return <Redirect to="/"/>
    }

    return (
        <div className="logon-container">
            <section className="form">
                <form onSubmit={handleLogin}>
                    <h1>Faça seu login</h1>

                    <input
                        placeholder="Seu Email"
                        value={email}
                        type="email"
                        onChange={e => setEmail(e.target.value)}
                    />

                    <input
                        placeholder="Sua Senha"
                        value={password}
                        type="password"
                        onChange={e => setPassword(e.target.value)}
                    />

                    <button className="button" type="submit">Entrar</button>

                    <Link className="back-link" to="/register">
                        <FiLogIn size={16} color="#E02041" />
                        Não tenho cadastro
                    </Link>
                    <Link className="back-link" to="/register">
                        <FiLogIn size={16} color="#E02041" />
                        Esqueci minha senha
                    </Link>
                </form>
            </section>
        </div>
    )
};

export default Logon;