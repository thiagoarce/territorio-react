import React, { useCallback, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { auth } from '../../services/Firebase';
import { FiArrowLeft } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { erros } from '../../constants/erros';
import { trackPromise } from 'react-promise-tracker';

const Cadastrar = () => {
  const [displayName, setdisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [passwordOne, setPasswordOne] = useState('');
  const [passwordTwo, setPasswordTwo] = useState('');
  const history = useHistory();

  const isInvalid =
    passwordOne !== passwordTwo ||
    passwordOne === '' ||
    email === '' ||
    displayName === '';

  const handleCadastro = useCallback(
    async e => {
      e.preventDefault();

      const userData = {
        displayName: displayName,
        congregation: 'pend',
        role: 'pub',
      };

      try {
        await trackPromise(
          auth.createUserWithEmailAndPassword(email, passwordOne),
        );
        await trackPromise(
          auth.currentUser.updateProfile({
            displayName: JSON.stringify(userData),
          }),
        );

        toast.success('✅ Usuário adicionado com sucesso');
        await auth.signOut();
        history.push('/');
      } catch (error) {
        if (erros[error.code]) {
          error.message = erros[error.code];
        }
        toast.error(`❌ ${error.message}`);
      }
    },
    [displayName, email, history, passwordOne],
  );

  return (
    <div className="container">
      <section className="form">
        <Link className="back-link" to="/logon">
          <FiArrowLeft size={32} color="#E02041" />
        </Link>
        <form onSubmit={handleCadastro}>
          <h1>Faça seu Cadastro</h1>

          <input
            placeholder="Seu Nome"
            value={displayName}
            onChange={e => setdisplayName(e.target.value)}
          />

          <input
            className="divisor"
            placeholder="Seu Email"
            value={email}
            type="email"
            onChange={e => setEmail(e.target.value)}
          />

          <input
            placeholder="Sua Senha"
            value={passwordOne}
            type="password"
            onChange={e => setPasswordOne(e.target.value)}
          />

          <input
            placeholder="Confirme Sua Senha"
            value={passwordTwo}
            type="password"
            onChange={e => setPasswordTwo(e.target.value)}
          />

          <button disabled={isInvalid} className="button" type="submit">
            Entrar
          </button>
        </form>
      </section>
    </div>
  );
};

export default Cadastrar;
