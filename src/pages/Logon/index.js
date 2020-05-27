import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom'

import { FiLogIn } from 'react-icons/fi'


import './styles.css'

const Logon = () => {
   const [nome, setNome] = useState('');
   const [congregacao, setCongregacao] = useState('');
    const history = useHistory();

    const handleLogin = (e) => {
        e.preventDefault();

                   
            localStorage.setItem('nome', nome);
            localStorage.setItem('congregacao', congregacao);

            history.push('/regioes');

    } 

    return (
        <div className="logon-container">
            <section className="form">
                <form onSubmit={handleLogin}>
                    <h1>Faça seu login</h1>

                    <input
                        placeholder="Seu Nome"
                        value={nome}
                        onChange={e => setNome(e.target.value)}
                    />

                    <input
                        placeholder="Sua Congregação"
                        value={congregacao}
                        onChange={e => setCongregacao(e.target.value)}
                    />
                    
                    <button className="button" type="submit">Entrar</button>

                    <Link className="back-link" to="/register">
                        <FiLogIn size={16} color="#E02041" />
                        Não tenho cadastro
                    </Link>
                </form>
            </section>
        </div>
    )
};

export default Logon;