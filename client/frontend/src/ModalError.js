
export default function ModalError(props){
    return(
        <div className="modal">
            <p>{props.error}</p>
            <button className="btn" onClick={props.handler(false)}>Aceptar</button>
        </div>
    )
}