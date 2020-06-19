import React, { useState, useCallback, useContext } from 'react';
import { Link, useHistory, Redirect } from 'react-router-dom';
import { AuthContext } from '../../services/Firebase/authContext';
import { toast } from 'react-toastify';
import { erros } from '../../constants/erros';
import { FiLogIn } from 'react-icons/fi';
import { auth } from '../../services/Firebase';

const Logon = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user] = useContext(AuthContext);
  const history = useHistory();

  const handleLogin = useCallback(
    async e => {
      e.preventDefault();

      try {
        await auth.signInWithEmailAndPassword(email, password);
        history.push('/');
      } catch (error) {
        if (erros[error.code]) {
          error.message = erros[error.code];
        }
        toast.error(`❌ ${error.message}`);
      }
    },
    [email, history, password],
  );

  if (user) {
    console.log('redirecionado');
    return <Redirect to="/" />;
  }

  return (
    <div className="container">
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

          <button className="button" type="submit">
            Entrar
          </button>

          <Link className="back-link" to="/register">
            <FiLogIn size={16} color="#E02041" />
            Não tenho cadastro
          </Link>
          <Link className="back-link" to="/pwforgot">
            <FiLogIn size={16} color="#E02041" />
            Esqueci minha senha
          </Link>
        </form>
      </section>
    </div>
  );
};

export default Logon;
