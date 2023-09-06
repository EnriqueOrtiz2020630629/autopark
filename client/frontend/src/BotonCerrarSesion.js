import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { SesionContexto } from "./SesionContexto";
import "./css/styles.css";


export default function BotonCerrarSesion(){
    const contexto = useContext(SesionContexto);
    const navigate = useNavigate();

    const cerrarSesion = () =>{
        const peticion = {
            token: contexto.token
        }

        fetch('/api/cerrar-sesion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(peticion)
        });
        
        contexto.guardarCorreo('');
        contexto.guardarNombre('');
        contexto.guardarTipoUsuario('');
        contexto.guardarToken('');
        navigate('/login');
    }

    return(
        <button class="botonMenu cerrar" onClick={cerrarSesion}><p class="menu-parrafo">cerrar sesion</p></button>
    )
}
