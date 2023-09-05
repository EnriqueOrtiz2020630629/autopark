import "../src/css/Modal.css";

export default function Modal(props){
    return(
        <div className="modal">
            <p>{props.texto}</p>
            <button className="btn" onClick={props.handler}>Aceptar</button>
        </div>
    )
}