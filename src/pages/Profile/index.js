import React, { useState, useContext, useCallback } from 'react';
import { firestore, auth } from '../../services/Firebase';
import { AuthContext } from '../../services/Firebase/authContext'
import { erros } from '../../constants/erros'

const Profile = () => {
  const [user, setUser] = useContext(AuthContext)
  const [displayName, setdisplayName] = useState(user.displayName);
  const [congregation, setCongregation] = useState(user.congregation);
  const email = user.email;
  const [passwordOne, setPasswordOne] = useState('');
  const [passwordTwo, setPasswordTwo] = useState('');
  const [errorData, setErrorData] = useState(null);
  const [errorPw, setErrorPw] = useState(null);
  const role = user.role;

  const isDataInvalid = displayName === '';

  const isPwInvalid =
    passwordOne !== passwordTwo ||
    passwordOne === '';


  const handleChangeData = useCallback(e => {
    e.preventDefault();

    firestore.doc(`users/${user.uid}`)
      .update({ displayName, congregation })
      .then(() => setUser({ ...user, displayName, congregation }))
      .then(() => alert("Dados alterados com sucesso!"))
      .catch(error => {
        if (erros[error.code]) {
          error.message = erros[error.code]
        }
        setErrorData(error)
      })
  }, [congregation, displayName, setUser, user])

  const handleChangePw = useCallback(e => {
    e.preventDefault();

    auth.currentUser.updatePassword(passwordOne)
      .then(() => {
        alert("Senha alterada com sucesso");
        setPasswordOne("");
        setPasswordTwo("");
      })
      .catch(error => {
        if (erros[error.code]) {
          console.log(error)
          error.message = erros[error.code]
        }
        setErrorPw(error)
      })

  }, [passwordOne])




  return (
    <div className="container">
      <section className="form" >
        <form onSubmit={handleChangeData}>
          <h1>Alterar meus dados</h1>

          <input
            placeholder="Seu Email"
            value={email}
            type="email"
            disabled={true}
          />

          <p>Habilitado como {role ? role : "Publicador"}</p>

          <input
            placeholder="Digite seu nome"
            value={displayName}
            onChange={e => {
              setdisplayName(e.target.value);
              setErrorData(null);
            }}
          />

          <select
            value={congregation}
            onChange={e => {
              setCongregation(e.target.value);
              setErrorData(null);
            }}>
            <option value="Espanhol">Congregação Espanhola</option>
            <option value="Guarani">Congregação Guarani</option>
          </select>

          <button disabled={isDataInvalid} className="button" type="submit">Alterar</button>

          {errorData && <p>{errorData.message}</p>}
        </form>
      </section>
      <section className="form">
        <form onSubmit={handleChangePw}>
          <h1>Alterar minha senha</h1>

          <input
            placeholder="Digite sua nova senha"
            value={passwordOne}
            type="password"
            onChange={e => {
              setPasswordOne(e.target.value);
              setErrorPw(null);
            }}
          />
          <input
            placeholder="Confirme sua nova senha"
            value={passwordTwo}
            type="password"
            onChange={e => {
              setPasswordTwo(e.target.value);
              setErrorPw(null);
            }}
          />

          <button disabled={isPwInvalid} className="button" type="submit">Alterar</button>

          {errorPw && <p>{errorPw.message}</p>}
        </form>
      </section>
    </div>
  )
};

export default Profile;