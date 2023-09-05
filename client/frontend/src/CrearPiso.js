import { useState,  useContext} from "react";
import { useNavigate,  } from "react-router-dom";
import { SesionContexto } from "./SesionContexto";
import Modal from './Modal';
import Backdrop from "./Backdrop";
import configData from './configData.json';

export default function CrearPiso() {
    const navigate = useNavigate();
    const contexto = useContext(SesionContexto);
    
    const [nombre, setNombre] = useState('');
    const [esquemaPago, setEsquemaPago] = useState('horario');
    const [monto, setMonto] = useState(1);
    const [numCajones, setNumCajones] = useState(1);
    const [mensaje, setMensaje] = useState('');

    const [error, setError] = useState('');
    
    
    const validar = evento => {
        //setError('');
        evento.preventDefault();
        const peticion = {
            nombre: nombre,
            esquemaPago: esquemaPago,
            montoPago: monto,
            numCajones: numCajones,
            token: contexto.token
        };
        
        fetch(configData.API_URL+'/pisos/crear', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(peticion)
        }).then(response => {
            return response.json();
        }).then(result => {
            console.log(result)
            if (result['error']){
              setError(result['error']);
            } else {
              setMensaje('Piso creado exitosamente');
            }
        });
    }

  return (
    <div class="contenedorFormRe">
      <form class="contenedorForm" onSubmit={validar}>
        <h2>Crear nuevo piso</h2>
        <div>
          <label htmlFor="GET-nombre">Nombre</label>
          <input id="GET-nombre" type="text" name="nombre" value={nombre} onChange={e => setNombre(e.target.value)}></input>
        </div>

        <div>
            <label htmlFor="esquema">Seleccione el esquema de pago: </label>
            <select onChange={(e) =>{setEsquemaPago(e.target.value)}}>
                <option value="horario">Horario</option>
                <option value="diario">Diario</option>
            </select>
        </div>

        <div>
          <label htmlFor="GET-monto">Monto a cobrar: </label>
          <input id="GET-monto" type="number" name="monto" value={monto} onChange={e => setMonto(e.target.value)}></input>
        </div>

        <div>
          <label htmlFor="GET-numCajones">Numero de cajones: </label>
          <input id="GET-numCajones" type="number" name="numCajones" value={numCajones} onChange={e => setNumCajones(e.target.value)}></input>
        </div>

        <input type="submit" value="Crear piso"></input>
      </form>

      {error && <Modal texto={error} handler={() => {setError('')}} />}
      {error && <Backdrop />}

      {mensaje && <Backdrop />}
      {mensaje && <Modal texto={mensaje} handler={() => navigate('/menu')} />}
    
    </div>
  );
}