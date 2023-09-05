const express = require('express');
const router = express()
const checkAuth = require('../middleware/check-auth');

const Evento = require("../modelos/evento");

router.post('/:fecha', checkAuth, (req, res, next) => {
    if (req.userData['tipoUsuario'] !== 'Admin') {
        return res.status(500).json({
            error: "Autenticacion invalida"
        });
    } else {
        const fecha = new Date(req.params.fecha);
        const comienzo = fecha.setUTCHours(0,0,0,0)+21600000;
        const final = fecha.setUTCHours(23, 59, 59, 999)+21600000;
        
        Evento.find({idAdmin: req.userData['idAdmin'], timeStamp: {$gte: comienzo, $lte: final}})
        .exec()
        .then((docs) => {
            const respuesta = {
                total: docs.length,
                bitacora: docs.map(doc => {
                    return {
                        descripcion: doc.descripcion,
                        horaLegible: doc.horaLegible,
                        nombreUsuario: doc.nombreUsuario
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