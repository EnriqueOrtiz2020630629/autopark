const express = require('express');
const router = express()
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');

const Piso = require('../modelos/piso');
const Evento = require('../modelos/evento');

router.post('/:pisoId/:numCajon', checkAuth, (req, res, next) => {
    if (!req.body.placa) {
        return res.status(500).json({
            error: "No se proporciono la placa del vehiculo"
        });
    } else {
        const entrada = {
            placa: req.body.placa,
            hora_entrada: Date.now()
        }

        Piso.findById(req.params.pisoId)
        .exec()
        .then(doc => {
            const listaActualizada = doc['listaCajones'].map(e => {
                if (e['numCajon'] == req.params.numCajon){
                    e['cajon'] = entrada;
                    //checar si existe                    
                }
                return e;
            });

            Piso.updateOne({_id: req.params.pisoId}, {listaCajones: listaActualizada})
            .exec()
            .then(result => {
                res.status(200).json({
                    message: 'Se registro la entrada del vehiculo',
                    request: {
                        type: 'GET',
                        url: 'http://localhost:11111/pisos/' + req.params.id
                    }
                });

                const nuevoEvento = new Evento({
                    _id: new mongoose.Types.ObjectId(),
                    idAdmin: req.userData['idAdmin'],
                    nombreUsuario: req.userData['nombre'] + ' '+ req.userData['apellido'],
                    descripcion: `Entro ${req.body.placa} al cajon ${req.params.numCajon} de: ${doc['nombre']}`,
                    tipo: "ENTRADA_VEHICULO",
                    timeStamp: Date.now(),
                    horaLegible: new Date().toLocaleTimeString(),
                });
                nuevoEvento.save().catch(err => console.log(err));
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
              error: err
            });
        });
    }     
});

module.exports = router;