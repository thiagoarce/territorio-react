import React, { useState, useEffect, useContext } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import { firestore } from '../../services/Firebase'
import { AuthContext } from '../../services/Firebase/authContext'
import './styles.css'


const Tarjeta = props => {
    const [user] = useContext(AuthContext);
    const [enderecos, setEnderecos] = useState([]);
    const { regiaoId, regiaoNome } = props.location.state.regiao;


    const userName = user.displayName;
    const userCong = user.congregation;

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


    const handleDeleteIncident = id => console.log(id)
    return (

        <div className="tarjeta-container">
            <header>
                <span>Bem vindo, {userName}</span>
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