import { useState,  useContext} from "react";
import { useNavigate,  } from "react-router-dom";
import { SesionContexto } from "./SesionContexto";
import "./css/styles.css";
import "./css/normalize.css";
import configData from  './configData.json';

export default function Login() {
    const navigate = useNavigate();
    const contexto = useContext(SesionContexto);
    
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');
    const [errorAuth, setErrorAuth] = useState(false);
    
    const validar = evento => {
        evento.preventDefault();
        const peticion = {
            correo: correo,
            password: password
        };
        fetch(configData.API_URL+'/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(peticion)
        }).then(response => {
            return response.json();
        }).then(result => {
            console.log(result)
            if(result['mensaje'] === 'Autenticacion exitosa'){
                setErrorAuth(false);
                contexto.guardarNombre(result['nombre']);
                contexto.guardarTipoUsuario(result['tipoUsuario']);
                contexto.guardarToken(result['token']);
                contexto.guardarCorreo(result['correo']);
                navigate('/menu');
            } else{
                setErrorAuth(true);
            }
        });
    }

  return (
    <div class="container">
      <div class="imagenInicio"></div>
      <div class="contenedorFormulario">
      <form onSubmit={validar} class="contenedorForm">
      <h2>Bienvenido!</h2>
      <label htmlFor="GET-correo">Correo electrónico:</label>
      <input id="GET-correo" type="email" name="correo" onChange={e => setCorreo(e.target.value)}></input>
      <label htmlFor="GET-password">Contraseña:</label>
      <input id="GET-password" type="password" name="password" onChange={e => setPassword(e.target.value)}></input>
      {errorAuth && <p class="error-message">Correo y/o contraseña incorrecta. Intente nuevamente</p>}
      <input type="submit" value="Acceder"></input>
      <p>
        No tiene una cuenta? <a href="?"><button onClick={() => navigate('/signup')}>Crear cuenta</button></a>
      </p>
    </form>
  </div>
</div>
  );
}
