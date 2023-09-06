import { useContext } from "react"
import { useNavigate } from "react-router-dom";
import { SesionContexto } from "./SesionContexto"
import "./css/styles.css"; 

export default function Menu(){
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

    if(contexto.tipoUsuario ==='Admin'){
        return (
            <div className="contenedor-menu ">
                <h1>Bienvenido, {contexto.nombre}</h1>
                <div className="menu">
                    <button className="botonMenu piso" onClick={() => navigate('/pisos')}><p className="menu-parrafo">Pisos</p></button>
                    <button className="botonMenu pisos" onClick={() => navigate('/crear-piso')}><p className="menu-parrafo">Crear un Piso</p></button>
                    <button className="botonMenu reporte" onClick={() => navigate('/reporte-financiero')}><p className="menu-parrafo">Reporte Financiero</p></button>
                    <button className="botonMenu bitacora" onClick={() => navigate('/bitacora')}><p className="menu-parrafo">Bitacora</p></button>
                    <button className="botonMenu usuario" onClick={() => navigate('/agregar-encargado')}><p className="menu-parrafo">Agregar Encargado</p></button>
                    <button className="botonMenu cerrar" onClick={cerrarSesion}><p className="menu-parrafo">Cerrar sesion</p></button>
                </div>
            </div>        
        )
    } else if (contexto.tipoUsuario ==='Encargado') {
        return (
            <div class="contenedor-menuUsuario">
                <h1>Bienvenido, {contexto.nombre}</h1>
                <div class="menuUsuario">
                    <button class="botonMenu piso" onClick={() => navigate('/pisos')}>
                         <p class="menu-parrafo">Pisos</p>
                    </button>
                    
                    <button class="botonMenu cerrar" onClick={cerrarSesion}>
                        <p class="menu-parrafo">Cerrar sesión</p>
                    </button>
                </div>
            </div>
       
        )
    } else{
        navigate('/login');
    }
}