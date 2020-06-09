import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { firestore } from '../../services/Firebase';
import { AuthContext } from '../../services/Firebase/authContext'
import { trackPromise } from 'react-promise-tracker';
import './styles.css';


const Regioes = () => {
    const [regioes, setRegioes] = useState([]);
    const history = useHistory();
    const [user] = useContext(AuthContext);


    useEffect(() => {
        trackPromise(
        firestore.collection('estado').doc('regioes').get()
        .then(response => response.data())
        .then(response => Object.keys(response).map(regiao => ({id: regiao, nome: response[regiao].nome, vizinhanca: response[regiao].nearby})))
        .then(response => setRegioes(response)))
        
    }, [])

    const abreRegiao = regiao => {
        history.push('/tarjeta', {regiao: regiao, regioes: regioes})
    } 
    
    return (
        <>
        <div className="regioes-container">
            <header>
                <span>Olá, {user.displayName}</span>
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
        </>
    )

}

export default Regioes;