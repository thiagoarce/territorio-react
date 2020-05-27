import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom'
import { FiPower, FiTrash2 } from 'react-icons/fi';
import { firebaseConfig } from '../../services/firebase'
import './styles.css'

const firestore = firebaseConfig.firestore();


const Tarjeta = props => {
    const [enderecos, setEnderecos] = useState([]);
    const { regiaoId, regiaoNome } = props.location.state.regiao;

    const history = useHistory();

    const userName = localStorage.getItem('nome');
    const userCong = localStorage.getItem('congregacao');

    useEffect(() => {
        const today = new Date();
        const monthAgo = new Date(today.getTime() - 2592000000);

        firestore.collection("enderecos")
            .where("regiao", "==", regiaoId)
            .where("congregacao", "==", userCong)
            .where("visitas.latest.date", "<=", monthAgo)
            .get()
            .then(response => response.docs.map(doc => doc.data()))
            .then(data => setEnderecos(data))

    }, [regiaoId, userCong])

    const handleLogout = () => {
        localStorage.clear();
        history.push('/')
    }

    const handleDeleteIncident = id => console.log(id)
    return (

        <div className="tarjeta-container">
            <header>
                <span>Bem vindo, {userName}</span>
                <Link className="button" to="endereco/new" >Cadastrar novo endereco</Link>
                <button onClick={handleLogout} type="button">
                    <FiPower size={18} color="#E02041" />
                </button>
            </header>

            <h1>Endereços na região {regiaoNome}</h1>

            <ul>
                {enderecos.map(endereco => (
                    <li key={endereco.id} >
                        <strong>Dirrección:</strong>
                        <p>{endereco.direccion}</p>

                        <strong>{endereco.referencia? "Referencia:": ""}</strong>
                        <p>{endereco.referencia}</p>

                        <strong>Nacionalidade:</strong>
                        <p>{endereco.nacionalidade}</p>

                        <strong>Idioma:</strong>
                        <p>{endereco.idioma}</p>

                        <strong>Nome:</strong>
                        <p>{endereco.nome}</p>

                        <button onClick={() => handleDeleteIncident(endereco.id)} type="button">
                            <FiTrash2 size={20} color="#a8a8b3" />
                        </button>
                    </li>
                ))}
            </ul>


        </div>

    )
}

export default Tarjeta;