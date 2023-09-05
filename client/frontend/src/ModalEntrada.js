import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './css/Modal.css';
import { SesionContexto } from "./SesionContexto";
import { useContext } from "react";
import configData from './configData.json';

export default function ModalEntrada(props){
    const contexto = useContext(SesionContexto);
    const navigate = useNavigate();

    const [placa, setPlaca] = useState('');
    const [confirmar, setConfirmar] = useState(false);

    const registrarEntrada = (pisoId) => {
        const peticion = {
            token: contexto.token,
            placa: placa
        }
        console.log(pisoId);
        fetch(configData.API_URL+ '/registrar-entrada/'+pisoId, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(peticion)
        }).then(response => {
            return response.json();
        }).then(result => {
            console.log(result);
            setConfirmar(true);
        })
    }

    const modalRegistro = 
        (<div className="modal">
            <p>Inserte la placa del vehiculo: </p>
            <input type="text" value={placa} onChange={e => setPlaca(e.target.value)}></input>
            <button className="btn" onClick={() => registrarEntrada(props.pisoId)}>Aceptar</button>
        </div>)
    
    const modalConfirmacion =  
        (<div className="modal">
            <p>Placa registrada exitosamente</p>
            <button className="btn" onClick={() => navigate('/menu')}>Aceptar</button>
        </div>)

    return(
        <div>
            {confirmar && modalConfirmacion}
            {!confirmar && modalRegistro}
        </div>
    )
}