import { createContext, useState } from "react";

const SesionContexto = createContext({
    token: "",
    tipoUsuario: "",
    correo: "",
    nombre: "",
    guardarCorreo: (correo) => {},
    guardarNombre: (nombre) => {},
    guardarToken: (token) => {},
    guardarTipoUsuario: (tipoUsuario) => {},
});

function SesionContextoProvider(props) {
    const [token, setToken] = useState("");
    const [tipoUsuario, setTipoUsuario] = useState("");
    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");

    const guardarToken = (token) => setToken(token);
    const guardarTipoUsuario = (usuario) => setTipoUsuario(usuario);
    const guardarCorreo = (correo) => setCorreo(correo);
    const guardarNombre = (nombre) => setNombre(nombre);

    const contexto = {
        token: token,
        tipoUsuario: tipoUsuario,
        nombre: nombre,
        correo: correo,
        guardarToken: guardarToken,
        guardarTipoUsuario: guardarTipoUsuario,
        guardarCorreo: guardarCorreo,
        guardarNombre: guardarNombre,
    };

    return (
        <SesionContexto.Provider value={contexto}>
            {props.children}
        </SesionContexto.Provider>
    );
}

export { SesionContexto, SesionContextoProvider };
