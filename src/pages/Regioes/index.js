import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom'
import { FiPower } from 'react-icons/fi';
import {firestore, auth } from '../../services/firebase'
import './styles.css'


const Regioes = () => {
    const [regioes, setRegioes] = useState([]);
    const history = useHistory();

    const userName = localStorage.getItem('nome');
    const userCong = localStorage.getItem('congregacao');

    useEffect(() => {
        
        firestore.collection('estado').doc('regioes').get()
        .then(response => response.data())
        .then(response => Object.keys(response).map(regiao => ({id: regiao, nome: response[regiao].nome, vizinhanca: response[regiao].nearby})))
        .then(response => setRegioes(response))
        .then(console.log("Regiões carregadas"))
        
    }, [userCong])

    const abreRegiao = regiao => {
        history.push('/tarjeta', {regiao: regiao, regioes: regioes})
    } 

    const handleLogout = async () => {

        try{
            await auth.signOut();
            localStorage.clear();
            history.push('/Logon')
        }
        catch(e){console.log("Não foi possível deslogar")}

    }

    return (
        
        <div className="regioes-container">
            <header>
                <span>Bem vindo, {userName}</span>
                <Link className="button" to="endereco/new" >Cadastrar novo endereco</Link>
                <button onClick={handleLogout} type="button">
                    <FiPower size={18} color="#E02041" />
                </button>
            </header>

            <h1>Regiões disponíveis</h1>

            <ul>
                {regioes.map(regiao => (
                    <li key={regiao.id} onClick={() => abreRegiao({regiaoId: regiao.id, regiaoNome: regiao.nome})}>
                        <strong> REGIÃO: </strong>
                        <p>{regiao.nome}</p>
                    </li>
                ))}

            </ul>
        </div>
    )

}

export default Regioes;