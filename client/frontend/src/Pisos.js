import { useContext, useEffect, useState } from "react";
import { SesionContexto } from "./SesionContexto";
import ModalEntrada from './ModalEntrada';
import Backdrop from "./Backdrop";
import ModalSalida from './ModalSalida';
import configData from './configData.json';

export default function Pisos() {
    const [pisos, setPisos] = useState([]);
    
    const contexto = useContext(SesionContexto);

    const [error, setError] = useState('');
    const [modalEntrada, setModalEntrada] = useState('');
    const [modalSalida, setModalSalida] = useState(false);

    useEffect(() => {
        const peticion = {
            token: contexto.token,
        };
        fetch(configData.API_URL+'/pisos/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(peticion)
        }).then(response => {
            return response.json();
        }).then(result => {
            console.log(result)
            if(result['error'])
                setError(result['error'])
            else
                setPisos(result['pisos'])
        })
    }, [contexto.token]);

    const mostrarModalApropiado = (cajon, id, numCajon) => {
        if(cajon['placa']){
            setModalSalida(id+'/'+numCajon);
        } else {
            setModalEntrada(id+'/'+numCajon);
        }
    }

    const mensajeSinPisos = (
        <div>
            <h2>No tienes ningun piso registrado.</h2>
        </div>
    )

    const displayPisos = pisos.map(piso => {
        return (
          <div className="contenedorEstacionamiento" key={piso['_id']}>
            <h3 className="titulo">{piso['nombre']}</h3>
            <div className="cajonesContenedor">
              {piso['listaCajones'].map(cajon => {
                return (
                  <button className="cajo" key={cajon['numCajon']} onClick={() => mostrarModalApropiado(cajon['cajon'], piso['_id'], cajon['numCajon'])}>
                    <p className="numeroCajon">{cajon['numCajon']}</p>
                    {cajon['cajon'] && <p className="numeroCajon">{cajon['cajon']['placa']}</p>}
                  </button>
                );
              })}
            </div>
          </div>
        );
      });
      
      return (
        <div className="contenedorNiveles">
          <h1 className="titulo">Pisos del Estacionamiento</h1>
          <div className="contenedorPrincipal">
            {pisos ? displayPisos : mensajeSinPisos}
          </div>
          {modalEntrada && <ModalEntrada pisoId={modalEntrada} />}
          {modalEntrada && <Backdrop />}
          {modalSalida && <ModalSalida pisoId={modalSalida} />}
          {modalSalida && <Backdrop />}
        </div>
      );
      
}