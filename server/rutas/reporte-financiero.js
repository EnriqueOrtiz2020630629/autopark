const express = require('express');
const router = express()
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');

const Evento = require("../modelos/evento");

router.post('/:fecha', checkAuth, (req, res, next) => {   
    if (req.userData['tipoUsuario'] !== 'Admin') {
        return res.status(500).json({
            error: "Autenticacion invalida"
        });
    } else {
        const fecha = new Date(req.params.fecha);
        
        let comienzo, final = 0;

        if(req.body.tipo === 'diario'){
            comienzo = fecha.setUTCHours(0,0,0,0) +21600000;
            final = fecha.setUTCHours(23, 59, 59, 999) +21600000;
        } else if (req.body.tipo === 'semanal'){
            comienzo = fecha.setUTCHours(0,0,0,0) - 604800000 +21600000;
            final = fecha.setUTCHours(23, 59, 59, 999)+21600000;
        } else {
            comienzo = fecha.setUTCHours(0,0,0,0) - 2629800000+21600000;
            final = fecha.setUTCHours(23, 59, 59, 999)+21600000;
        }
         
        Evento.find({idAdmin: req.userData['idAdmin'], timeStamp: {$gte: comienzo, $lte: final}, tipo: "SALIDA_VEHICULO"})
        .exec()
        .then((docs) => {
            let sumaTotal = 0;
            docs.forEach(element => {
                sumaTotal += element['extra']['montoAPagar'];
            });
            const respuesta = {
                numAutos: docs.length,
                ganancia: sumaTotal,
                fechaInicio: new Date(comienzo).toISOString().split('T')[0],
                fechaFinal: new Date(final).toISOString().split('T')[0],
                lista: docs.map(doc => {
                    return {
                        placa: doc['extra']['placa'],
                        fechaEntrada: new Date(Number(doc['extra']['horaEntrada'])).toLocaleDateString() + ' ' + new Date(Number(doc['extra']['horaEntrada'])).toLocaleTimeString(),
                        fechaSalida: new Date(Number(doc['extra']['horaSalida'])).toLocaleDateString() + ' ' + new Date(Number(doc['extra']['horaSalida'])).toLocaleTimeString(),
                        montoCobrado: doc['extra']['montoAPagar']
                    }
                })
            }
            res.status(200).json(respuesta);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                error: err,
            });
        });
    }
});
        
module.exports = router;