import { useNavigate } from "react-router-dom"

export default function ModalSignup(){
    const navigate = useNavigate('/login');
    const gotologin = () => {
        navigate('/login');
    }
    return(
        <div className="modal">
            <p>Se creo la cuenta exitosamente.</p>
            <button className="btn" onClick={gotologin}>Iniciar sesion</button>
        </div>
    )
}