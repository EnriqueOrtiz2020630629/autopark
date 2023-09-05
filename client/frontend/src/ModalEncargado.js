import { useNavigate } from "react-router-dom"

export default function ModalEncargado(){
    const navigate = useNavigate('/menu');
    const gotomenu = () => {
        navigate('/menu');
    }
    return(
        <div className="modal">
            <p>Se creo la cuenta exitosamente.</p>
            <button className="btn" onClick={gotomenu}>Volver al menu</button>
        </div>
    )
}