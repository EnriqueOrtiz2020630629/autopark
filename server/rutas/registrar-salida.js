const express = require('express');
const router = express();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');

const Piso = require('../modelos/piso');
const Evento = require('../modelos/evento');

router.post('/:pisoId/:numCajon', checkAuth, (req, res, next) => { 
    Piso.findById(req.params.pisoId)
    .exec()
    .then(doc => {
        let cajon = null;
        let listaActualizada =[];

        doc['listaCajones'].forEach(element => {
            if(element['numCajon'] == req.params.numCajon)
                cajon = JSON.parse(JSON.stringify(element));
        });


        if(!cajon){
            return res.status(500).json({
                error: "El cajon que seleccionaste no existe."
            });
        } else if (!cajon['cajon']){
            return res.status(500).json({
                error: "El cajon que seleccionaste esta vacio."
            });
        } else {
            listaActualizada = doc['listaCajones'].map(cajon => {
                if (cajon['numCajon'] == req.params.numCajon){
                    cajon['cajon'] = {};
                }
                return cajon;
            })
        }

            const salida = {
                placa: cajon['cajon']['placa'],
                hora_entrada: Date(cajon['hora_entrada']).toLocaleString(),
                hora_salida: new Date().toLocaleString(),
            }

            
            const tipoPago = doc['esquemaPago'];
            const montoPago = doc['montoPago'];
            const diferencia = Date.now() - cajon['cajon']['hora_entrada'];

            let monto_a_pagar =0;
            if(tipoPago == 'diario'){
                monto_a_pagar = montoPago*(Math.ceil(diferencia/diferencia/86400000))
            }else {
                monto_a_pagar = montoPago*(Math.ceil(diferencia/diferencia/86400000))
            }
            salida['monto_a_pagar'] = monto_a_pagar;

            Piso.updateOne({_id: req.params.pisoId}, {listaCajones: listaActualizada})
            .exec()
            .then(result => {
                res.status(200).json({
                    message: 'Se registro la salida del vehiculo',
                    salida: salida,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:11111/pisos/' + req.params.id
                    }
                });

                const nuevoEvento = new Evento({
                    _id: new mongoose.Types.ObjectId(),
                    idAdmin: req.userData['idAdmin'],
                    nombreUsuario: req.userData['nombre'] + ' '+ req.userData['apellido'],
                    descripcion: `Salio ${cajon['cajon']['placa']}. Monto cobrado: $ ${monto_a_pagar}`,
                    tipo: "SALIDA_VEHICULO",
                    timeStamp: Date.now(),
                    horaLegible: new Date().toLocaleTimeString(),
                    extra: {
                        placa: cajon['cajon']['placa'],
                        horaEntrada: cajon['cajon']['hora_entrada'],
                        horaSalida: Date.now(),
                        montoAPagar: monto_a_pagar
                    }
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
    })
    

        
module.exports = router;
