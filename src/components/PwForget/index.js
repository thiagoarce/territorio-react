import React, { useState, useCallback, useContext } from 'react';
import { useHistory, Redirect } from 'react-router-dom'
import {AuthContext} from '../Firebase/authContext'
import { erros } from '../../constants/erros'
import './styles.css'


import './styles.css'
import { auth } from '../Firebase';

const PwForget = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState(null);
    const history = useHistory();

    const handleLogin = useCallback(async (e) => {
        e.preventDefault();

        try {
            await auth.sendPasswordResetEmail(email);
            alert("Um email com um link de recuperação de senha foi enviado para sua caixa de entrada")
            history.push('/');
        } catch (error) {
            console.log(error)
            if(erros[error.code]){
                error.message = erros[error.code]}
            setError(error);
        }


    }, [email, history]);

    const {user} = useContext(AuthContext);

    if(user){
        return <Redirect to="/"/>
    }

    return (
        <div className="container">
            <section className="form">
                <form onSubmit={handleLogin}>
                    <h1>Recuperar Senha</h1>

                    <input
                        placeholder="Digite Seu Email"
                        value={email}
                        type="email"
                        onChange={e => setEmail(e.target.value)}
                    />

                    <button className="button" type="submit">Enviar email de recuperação</button>

                    {error && <p>{error.message}</p>}
                </form>
            </section>
        </div>
    )
};

export default PwForget;