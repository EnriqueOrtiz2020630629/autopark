const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');

const Piso = require('../modelos/piso');
const Evento = require('../modelos/evento');

router.post('/', checkAuth, (req, res, next) => {    
    Piso.find({idAdmin: req.userData['idAdmin']})
    .select("_id nombre esquemaPago montoPago listaCajones")
    .exec()
    .then(docs => {
        const respuesta = {
            total: docs.length,
            pisos: docs.map(doc => {
                return {
                    _id: doc._id,
                    nombre: doc.nombre,
                    esquemaPago: doc.esquemaPago,
                    montoPago: doc.esquemaPago,
                    listaCajones: doc.listaCajones,
                    peticion: {
                        tipo: "GET",
                        url: "http://localhost:11111/pisos/"+doc._id
                    }
                }
            })
        }

        res.status(200).json(respuesta);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});


router.get('/:pisoId', checkAuth, (req, res, next) => {
    let id = "";
    if(req.userData['tipoUsuario'] === 'Admin')
        id = req.userData['userId'];
    else
        id = req.userData['adminId'];
    Piso.findById(id)
    .select("_id nombre esquemaPago montoPago listaCajones")
    .exec()
    .then(doc => {
        if(doc.length >= 1) {
            res.status(200).json({
                piso: doc,
                peticion: {
                    tipo: "GET",
                    url: "http://localhost:11111/pisos/"+doc._id
                }
            });
        } else { 
            res.status(404).json({
                mensaje: "No se encontro un piso valido con el ID proporcionado"
            });
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.post("/crear", checkAuth, (req, res, next) => {
    Piso.find({nombre: req.body.nombre, idAdmin: req.userData["idAdmin"]})
    .exec()
    .then(docs => {
        if(docs.length >= 1){
            return res.status(500).json({
                error: "Ya existe un piso con ese nombre. Intente con otro"
            });
        } else if (!(['horario', 'diario'].includes(req.body.esquemaPago))){
            return res.status(500).json({
                error: "Esquema de pago invalido. Seleccione entre 'horario' y 'diario' solamente."
            });
        } else if (req.userData['tipoUsuario' !== 'Admin']){
            return res.status(401).json({
                error: "Autenticacion invalida"
            });
        } else {
            let listaCajones = [];
            
            if(req.body.listaCajones){
                req.body.listaCajones.forEach(cajon => {
                    listaCajones.push({
                        numCajon: cajon.toString(),
                        cajon: {}
                    });
                });
            } else if (req.body.numCajones){
                let temp = req.body.numCajones;
                while(temp > 0){
                    listaCajones.push({
                        numCajon: temp.toString(),
                        cajon: {}
                    });
                    temp -= 1;
                }
            } else {
                return res.status(500).json({
                    error: "No se proporciono informacion sobre los cajones."
                });
            }
    
            const nuevoPiso = new Piso({
                _id: new mongoose.Types.ObjectId(),
                idAdmin: req.userData['idAdmin'],
                nombre: req.body.nombre,
                esquemaPago: req.body.esquemaPago,
                montoPago: req.body.montoPago,
                listaCajones: listaCajones
            });

            nuevoPiso.save()
            .then(result => {
                res.status(201).json({
                    mensaje: "Se creo nuevo piso exitosamente",
                    pisoCreado: {
                        _id: result._id,
                        nombre: result.nombre,
                        esquemaPago: result.esquemaPago,
                        montoPago: result.montoPago,
                        listaCajones: result.listaCajones,
                        peticion: {
                            tipo: "GET",
                            url: "http://localhost:11111/pisos/"+result._id
                        }
                    }
                });

                const nuevoEvento = new Evento({
                    _id: new mongoose.Types.ObjectId(),
                    idAdmin: req.userData['idAdmin'],
                    nombreUsuario: req.userData['nombre'] + ' ' + req.userData['apellido'],
                    descripcion: `Creo un nuevo piso: ${req.body.nombre}`,
                    tipo: "NUEVO_PISO",
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
    }})
    .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
    });
});

router.delete('/:pisoId', checkAuth, (req, res, next) => {
    if(req.userData['tipoUsuario'] === 'Admin'){
        Piso.deleteOne({_id: req.params.pisoId})
        .exec()
        .then(resultado => {
            res.status(200).json({
                mensaje: "Piso eliminado exitosamente"
            });

            const nuevoEvento = new Evento({
                _id: new mongoose.Types.ObjectId(),
                responsable: req.userData['userId'],
                descripcion: `Se borro el piso con ID${req.params.pisoId}`,
                tipo: "PISO_ELIMINADO",
                timeStamp: Date.now(),
            });

            nuevoEvento.save().catch(err => console.log(err));
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
    } else {
        return res.status(401).json({
            error: "Autenticacion invalida"
        });
    }
});

module.exports = router;