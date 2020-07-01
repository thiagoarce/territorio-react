import React, { useState, useContext, useCallback } from 'react';
import { auth } from '../../services/Firebase';
import { AuthContext } from '../../services/Firebase/authContext';
import { toast } from 'react-toastify';
import { erros } from '../../constants/erros';
import { trackPromise } from 'react-promise-tracker';
import { congregacoes, roles } from '../../constants/userConfig';

const Account = () => {
  const [user, setUser] = useContext(AuthContext);
  const congregation = user.congregation;
  const email = user.email;
  const role = user.role;
  const uid = user.uid;

  const [displayName, setdisplayName] = useState(user.displayName);
  const [passwordOne, setPasswordOne] = useState('');
  const [passwordTwo, setPasswordTwo] = useState('');

  const isDataInvalid = displayName === '';

  const isPwInvalid = passwordOne !== passwordTwo || passwordOne === '';

  const handleChangeData = useCallback(
    e => {
      e.preventDefault();

      const userData = {
        displayName,
        congregation,
        role,
      };
      try {
        trackPromise(
          auth.currentUser.updateProfile({
            displayName: JSON.stringify(userData),
          }),
        );

        setUser({ ...userData, uid, email });
        toast.success('✅ Nome alterado com sucesso');
      } catch (error) {
        if (erros[error.code]) {
          error.message = erros[error.code];
        }
        toast.error(`❌ ${error.message}`);
      }
    },
    [congregation, displayName, role, email, setUser, uid],
  );

  const handleChangePw = useCallback(
    e => {
      e.preventDefault();

      trackPromise(
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
          }),
      );
    },
    [passwordOne],
  );

  return (
    <div className="container">
      <section className="form">
        <form onSubmit={handleChangeData}>
          <h1>Meus dados</h1>

          <input
            placeholder="Seu Email"
            value={email}
            type="email"
            disabled={true}
          />

          <p>{congregation ? congregacoes[congregation] : null}</p>
          <p>
            {congregation
              ? `Habilitado como ${roles[role]}`
              : 'Seu Cadastro ainda não foi aprovado, contate o Administrador'}
          </p>

          <input
            placeholder="Digite seu nome"
            value={displayName}
            onChange={e => setdisplayName(e.target.value)}
          />

          <button disabled={isDataInvalid} className="button" type="submit">
            Alterar Nome de Exibição
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
