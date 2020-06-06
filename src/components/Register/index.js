import React, { useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import  { Firebase, auth, firestore } from '../Firebase';
import { erros } from '../../constants/erros'
import './styles.css'

const Cadastrar = () => {
    const [displayName, setdisplayName] = useState('');
    const [congregation, setCongregation] = useState('Espanhol');
    const [email, setEmail] = useState('');
    const [passwordOne, setPasswordOne] = useState('');
    const [passwordTwo, setPasswordTwo] = useState('');
    const [error, setError] = useState(null);
    const role = ''
    const history = useHistory();

    const increment = Firebase.firestore.FieldValue.increment(1)


    const isInvalid =
        passwordOne !== passwordTwo ||
        passwordOne === '' ||
        email === '' ||
        displayName === '';

    const handleCadastro = useCallback(e => {
        e.preventDefault();

        auth.createUserWithEmailAndPassword(email, passwordOne)
            .then(authUser => {
                const userRef = firestore.doc(`users/${authUser.user.uid}`);
                const userStateRef = firestore.doc("users/state");

                const batch = firestore.batch();
                batch.set(userRef, { displayName, congregation, email, role });
                batch.update(userStateRef, {users: increment, [congregation]: increment });
                batch.commit();
            })
            .then(() => history.push("/"))
            .catch(error => {
                if(erros[error.code]){
                error.message = erros[error.code]}
                setError(error)
            })

    }, [congregation, displayName, email, history, increment, passwordOne]);

    return (
        <div className="register-container">
            <section className="form">
                <form onSubmit={handleCadastro}>
                    <h1>Faça seu Cadastro</h1>


                    <input
                        placeholder="Seu Nome"
                        value={displayName}
                        onChange={e => {
                            setdisplayName(e.target.value);
                            setError(null);
                        }}
                    />

                    <input
                        className="divisor"
                        placeholder="Seu Email"
                        value={email}
                        type="email"
                        onChange={e => {
                            setEmail(e.target.value);
                            setError(null);
                        }}
                    />

                    <input
                        placeholder="Sua Senha"
                        value={passwordOne}
                        type="password"
                        onChange={e => {
                            setPasswordOne(e.target.value);
                            setError(null);
                        }}
                    />

                    <input
                        className="divisor"
                        placeholder="Confirme Sua Senha"
                        value={passwordTwo}
                        type="password"
                        onChange={e => {
                            setPasswordTwo(e.target.value);
                            setError(null);
                        }}
                    />

                    <select
                        value={congregation}
                        onChange={e => {
                            setCongregation(e.target.value);
                            setError(null);
                        }}>
                        <option value="Espanhol">Congregação Espanhola</option>
                        <option value="Guarani">Congregação Guarani</option>
                    </select>

                    <button disabled={isInvalid} className="button" type="submit">Entrar</button>

                    {error && <p>{error.message}</p>}
                </form>
            </section>
        </div>
    )
}

export default Cadastrar;