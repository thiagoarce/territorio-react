import React, { useState, useContext, useCallback } from 'react';
import { firestore, auth } from '../../services/Firebase';
import { AuthContext } from '../../services/Firebase/authContext';
import { toast } from 'react-toastify';
import { erros } from '../../constants/erros';

const Account = () => {
  const [user, setUser] = useContext(AuthContext);
  const [displayName, setdisplayName] = useState(user.displayName);
  const [congregation, setCongregation] = useState(user.congregation);
  const email = user.email;
  const [passwordOne, setPasswordOne] = useState('');
  const [passwordTwo, setPasswordTwo] = useState('');
  const role = user.role;

  const isDataInvalid = displayName === '';

  const isPwInvalid = passwordOne !== passwordTwo || passwordOne === '';

  const handleChangeData = useCallback(
    e => {
      e.preventDefault();

      firestore
        .doc(`users/${user.uid}`)
        .update({ displayName, congregation })
        .then(() => setUser({ ...user, displayName, congregation }))
        .then(() => toast.success('✅ Dados alterados com sucesso!'))
        .catch(error => {
          if (erros[error.code]) {
            error.message = erros[error.code];
          }
          toast.error(`❌ ${error.message}`);
        });
    },
    [congregation, displayName, setUser, user],
  );

  const handleChangePw = useCallback(
    e => {
      e.preventDefault();

      auth.currentUser
        .updatePassword(passwordOne)
        .then(() => {
          toast.success('✅ Senha alterada com sucesso');
          setPasswordOne('');
          setPasswordTwo('');
        })
        .catch(error => {
          if (erros[error.code]) {
            console.log(error);
            error.message = erros[error.code];
          }
          toast.error(`❌ ${error.message}`);
          setPasswordOne('');
          setPasswordTwo('');
        });
    },
    [passwordOne],
  );

  return (
    <div className="container">
      <section className="form">
        <form onSubmit={handleChangeData}>
          <h1>Alterar meus dados</h1>

          <input
            placeholder="Seu Email"
            value={email}
            type="email"
            disabled={true}
          />

          <p>Habilitado como {role ? role : 'Publicador'}</p>

          <input
            placeholder="Digite seu nome"
            value={displayName}
            onChange={e => setdisplayName(e.target.value)}
          />

          <select
            value={congregation}
            onChange={e => setCongregation(e.target.value)}
          >
            <option value="Espanhol">Congregação Espanhola</option>
            <option value="Guarani">Congregação Guarani</option>
          </select>

          <button disabled={isDataInvalid} className="button" type="submit">
            Alterar
          </button>
        </form>
      </section>
      <section className="form">
        <form onSubmit={handleChangePw}>
          <h1>Alterar minha senha</h1>

          <input
            placeholder="Digite sua nova senha"
            value={passwordOne}
            type="password"
            onChange={e => setPasswordOne(e.target.value)}
          />
          <input
            placeholder="Confirme sua nova senha"
            value={passwordTwo}
            type="password"
            onChange={e => setPasswordTwo(e.target.value)}
          />

          <button disabled={isPwInvalid} className="button" type="submit">
            Alterar
          </button>
        </form>
      </section>
    </div>
  );
};

export default Account;
