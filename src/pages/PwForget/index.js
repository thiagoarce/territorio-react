import React, { useState, useCallback, useContext } from 'react';
import { Link, useHistory, Redirect } from 'react-router-dom';
import { AuthContext } from '../../services/Firebase/authContext';
import { erros } from '../../constants/erros';
import { FiArrowLeft } from 'react-icons/fi';
import { auth } from '../../services/Firebase';

const PwForget = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const history = useHistory();

  const handleLogin = useCallback(
    async e => {
      e.preventDefault();

      try {
        await auth.sendPasswordResetEmail(email);
        alert(
          'Um email com um link de recuperação de senha foi enviado para sua caixa de entrada',
        );
        history.push('/');
      } catch (error) {
        if (erros[error.code]) {
          error.message = erros[error.code];
        }
        setError(error);
      }
    },
    [email, history],
  );

  const { user } = useContext(AuthContext);

  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <div className="container">
      <section className="form">
        <Link className="back-link" to="/logon">
          <FiArrowLeft size={32} color="#E02041" />
        </Link>
        <form onSubmit={handleLogin}>
          <h1>Recuperar Senha</h1>

          <input
            placeholder="Digite Seu Email"
            value={email}
            type="email"
            onChange={e => setEmail(e.target.value)}
          />

          <button className="button" type="submit">
            Enviar email de recuperação
          </button>

          {error && <p>{error.message}</p>}
        </form>
      </section>
    </div>
  );
};

export default PwForget;
