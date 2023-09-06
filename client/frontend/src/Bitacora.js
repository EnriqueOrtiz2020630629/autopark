import { useContext, useState, useEffect } from "react"
import { SesionContexto } from "./SesionContexto";

export default function Bitacora(){
    const [fecha, setFecha] = useState('');
    const [listaEventos, setListaEventos] = useState([]);
    const contexto = useContext(SesionContexto);

    useEffect(() => {
        if(fecha){
            const peticion = {
                token: contexto.token,
            };
            fetch('/api/bitacora/'+fecha, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(peticion)
            }).then(response => {
                return response.json();
            }).then(result => {
                console.log(result)
                setListaEventos(result['bitacora']);
            })
        }
        
    }, [fecha, contexto.token]);

    const eventosMapeados = listaEventos.map(evento => {
        return(
            <tr>
                <td>{evento['horaLegible']}</td>
                <td>{evento['nombreUsuario']}</td>
                <td>{evento['descripcion']}</td>
            </tr>
        )
    })
    
    return (
        <div class="contenedorBit">
            <h2>Bitacora</h2>
            <div class="contenedorBitacora">
                <div>
                    <label>
                        Seleccione fecha
                        <input type="date" value={fecha} max={new Date().toISOString().split('T')[0]} onChange={e => setFecha(e.target.value)}></input>
                    </label>
                </div>
            </div>


            <table>
                <thead>
                    <tr>
                        <th>Hora</th>
                        <th>Responsable</th>
                        <th>Descripcion</th>
                    </tr>
                </thead>
                <tbody>
                    {eventosMapeados}
                </tbody>
            </table>
        </div>
    )
}