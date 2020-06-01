import React, {useCallback} from 'react';
import {useHistory} from 'react-router-dom';
import {auth} from '../../services/firebase';

const Cadastrar  = () => {
    const history = useHistory();

    const handleCadastro = useCallback(
        async event => {
            event.preventDefault();

            const {email, password} = event.target.elements;

            try {
                await auth.createUserWithEmailAndPassword(email.value, password.value)

                history.push('/')
            } catch (error){
                console.log(error)
            }
        },
        [history],
    );

    return (
        <div>
            <h1>Cadastrar</h1>
            <form onSubmit={handleCadastro}>
                <label>Email</label>
                <input type="email" name="email"/>
                <label>Senha</label>
                <input type="password" name="password"/>
                <button type="submit">Cadastrar</button>
            </form>
        </div>
    )
}

export default Cadastrar;