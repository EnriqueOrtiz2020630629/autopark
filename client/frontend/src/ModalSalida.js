import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import './css/Modal.css';
import { SesionContexto } from "./SesionContexto";

export default function ModalSalida(props){
    const navigate = useNavigate();
    const contexto = useContext(SesionContexto);

    const [placa, setPlaca] = useState('');
    const [horaEntrada, setHoraEntrada] = useState('');
    const [horaSalida, setHoraSalida] = useState('');
    const [montoAPagar, setMontoAPagar] =useState(0);

    const [confirmar, setConfirmar] = useState(false);

    const registrarSalida = (pisoId) => {
        const peticion = {
            token: contexto.token,
        }
        fetch('/api/registrar-salida/'+pisoId, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(peticion)
        }).then(response => {
            return response.json();
        }).then(result => {
            console.log(result);
            setPlaca(result['salida']['placa']);
            setHoraEntrada(result['salida']['hora_entrada']);
            setHoraSalida(result['salida']['hora_salida']);
            setMontoAPagar(result['salida']['monto_a_pagar']);
            setConfirmar(true);
        })
    }

    const modalPregunta = 
        (<div className="modal">
        <p>Desea retirar este vehículo?</p>
        <div className="button-container">
          <button className="btn" onClick={() => registrarSalida(props.pisoId)}>Si</button>
          <button className="btn btn--alt" onClick={() => navigate('/menu')}>No</button>
        </div>
      </div>
      )
    
    const modalConfirmacion =  
        (<div class="modal ticket">
        <p>Salida registrada exitosamente</p>
        <p>Placa: {placa}</p>
        <p>Fecha y hora de entrada: {horaEntrada}</p>
        <p>Fecha y hora de salida: {horaSalida}</p>
        <p>Monto a pagar: $ {montoAPagar}</p>
        <button class="btn" onClick={() => navigate('/menu')}>Aceptar</button>
      </div>
      
      )

    return(
        <div>
            {confirmar && modalConfirmacion}
            {!confirmar && modalPregunta}
        </div>
    )
}