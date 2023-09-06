import { useContext, useState, useEffect } from "react";
import { SesionContexto } from "./SesionContexto";

export default function ReporteFinanciero() {
    const contexto = useContext(SesionContexto);
    const [tipoReporte, setTipoReporte] = useState("diario");
    const [fecha, setFecha] = useState("");
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFinal, setFechaFinal] = useState("");
    const [numAutos, setNumAutos] = useState(0);
    const [ganancia, setGanancia] = useState(0);
    const [listaRegistros, setListaRegistros] = useState([]);

    useEffect(() => {
        if (fecha) {
            const peticion = {
                token: contexto.token,
                tipo: tipoReporte,
            };
            fetch("/api/reporte-financiero/" + fecha, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(peticion),
            })
                .then((response) => {
                    return response.json();
                })
                .then((result) => {
                    console.log(result);
                    setNumAutos(result["numAutos"]);
                    setGanancia(result["ganancia"]);
                    setFechaInicio(result["fechaInicio"]);
                    setFechaFinal(result["fechaFinal"]);
                    setListaRegistros(result["lista"]);
                });
        }
    }, [fecha, contexto.token, tipoReporte]);

    const displayRegistros = listaRegistros.map((evento) => {
        return (
            <tr>
                <td>{evento.placa}</td>
                <td>{evento.fechaEntrada}</td>
                <td>{evento.fechaSalida}</td>
                <td>${evento.montoCobrado}</td>
            </tr>
        );
    });

    return (
        <div className="contenedorReporte">
            <div class="contenedorReport">
                <h2>Reporte financiero</h2>
                <div>
                    <div>
                        <label>
                            Seleccione tipo de reporte
                            <select
                                value={tipoReporte}
                                onChange={(e) => setTipoReporte(e.target.value)}
                            >
                                <option value="diario">Diario</option>
                                <option value="semanal">Semanal</option>
                                <option value="mensual">Mensual</option>
                            </select>
                        </label>
                    </div>

                    <div>
                        <label>
                            Seleccione fecha
                            <input
                                type="date"
                                max={new Date().toISOString().split("T")[0]}
                                value={fecha}
                                onChange={(e) => setFecha(e.target.value)}
                            ></input>
                        </label>
                    </div>
                </div>

                <div>
                    <div>
                        <h3>Reporte {tipoReporte} </h3>
                    </div>
                    <div>
                        <p>
                            Fecha de corte: {fechaInicio} a {fechaFinal}
                        </p>
                    </div>
                    <div>
                        <p>Numero de autos recibidos: {numAutos}</p>{" "}
                    </div>
                    <div>
                        <p>Ganancias obtenidas: ${ganancia}</p>{" "}
                    </div>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>Placa</th>
                            <th>Fecha/hora de entrada</th>
                            <th>Fecha/hora de salida</th>
                            <th>Monto cobrado</th>
                        </tr>
                    </thead>
                    <tbody>{displayRegistros}</tbody>
                </table>
            </div>
        </div>
    );
}
