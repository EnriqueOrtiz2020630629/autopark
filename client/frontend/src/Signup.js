import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Backdrop from "./Backdrop";
import ModalSignup from "./ModalSignup";

export default function Signup() {
    const navigate = useNavigate();

    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');
    const [cPassword, setCPassword] = useState('');
    const [modalAbierto, setModalAbierto] = useState(false);

    const [errorContra, setErrorContra] = useState(false);
    const [errorCampos, setErrorCampos] = useState(false);
    const [errorApi, setErrorApi] = useState('');

    
    const validarCampos = () => {
        if(nombre === '' || apellido === '' || correo === '' || password === '' || cPassword === ''){
            return false;
        } else{
            return true;
        }
    }

    const enviar = evento => {
        evento.preventDefault();

        setErrorCampos(false);
        setErrorContra(false);
        
        if (!validarCampos()){
            setErrorCampos(true);
        } else if(password !== cPassword){
            setErrorContra(true);
        } else{
          const peticion = {
            nombre: nombre,
            apellido: apellido,
            correo: correo,
            password: password
          };
          fetch('/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(peticion)
          })
          .then(response => response.json())
          .then(result => {
            if(result['error'])
              setErrorApi(result['error']);
            else {
              setErrorApi('');
              setModalAbierto(true);
            }
          })
        }
    }

  return (
    <div className="contenedorFormRe">
      <form className="contenedorForm" onSubmit={enviar}>
        <h2>Crear cuenta</h2>

        <div>
          <label htmlFor="GET-nombre">Nombre</label>
          <input id="GET-nombre" type="text" name="nombre" value={nombre} onChange={e => setNombre(e.target.value)}></input>
        </div>
        <div>
          <label htmlFor="GET-apellido">Apellido</label>
          <input id="GET-apellido" type="text" name="nombre" value={apellido} onChange={e => setApellido(e.target.value)}></input>
        </div>
        <div>
          <label htmlFor="GET-correo">Correo electronico:</label>
          <input id="GET-correo" type="email" name="correo" value={correo} onChange={e => setCorreo(e.target.value)}></input>
        </div>
        <div>
          <label htmlFor="GET-password">Contraseña:</label>
          <input id="GET-password" type="password" name="password" value={password} onChange={e => setPassword(e.target.value)}></input>   
        </div>
        <div>
          <label htmlFor="GET-confirm_pass">Confirme contraseña:</label>
          <input id="GET-confirm_pass" type="password" name="confirm_pass" value={cPassword} onChange={e => setCPassword(e.target.value)}></input>
        </div>
        <input type="submit" onClick={enviar} value="Crear cuenta"></input>
        
        {errorContra && <p className="error-message">Asegurese que sus contraseñas coincidan</p>}
        {errorCampos && <p className="error-message" >Llene todos los campos</p>}
        {errorApi && <p>{errorApi}</p>}

        {modalAbierto && <ModalSignup />}
        {modalAbierto && <Backdrop />}

        <p >
          Ya tiene una cuenta? <button onClick={() => {navigate('/login')}}>Iniciar sesion</button>
        </p>        
      </form>
    </div>
  );
}
