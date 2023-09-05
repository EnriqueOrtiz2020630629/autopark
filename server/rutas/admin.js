const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Admin = require("../modelos/admin");
const Encargado = require("../modelos/encargado");
const checkAuth = require('../middleware/check-auth');
const Evento = require('../modelos/evento');

router.post("/signup", (req, res, next) => {
  Admin.find({ correo: req.body.correo })
    .exec()
    .then((result) => {
      if (result.length >= 1) {
        return res.status(409).json({
          error: "Ya existe una cuenta con este correo, intente con otro",
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err,
            });
          } else {
            const admin = new Admin({
              _id: new mongoose.Types.ObjectId(),
              nombre: req.body.nombre,
              apellido: req.body.apellido,
              correo: req.body.correo,
              password: hash,
            });
            admin
              .save()
              .then((result) => {
                res.status(201).json({
                  mensaje: "Admin creado.",
                });
              })
              .catch((err) => {
                console.log(err);
                res.status(500).json({
                  error: err,
                });
              });
          }
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.post("/registrar-encargado", checkAuth, (req, res, next) => {
  Admin.find({ correo: req.body.correo })
    .exec()
    .then((result) => {
      if (result.length >= 1) {
        return res.status(409).json({
          error: "Ya existe una cuenta con este correo, intente con otro",
        });
      } else if (req.userData["tipoUsuario"] !== "Admin") {
        return res.status(403).json({
          error: "Autenticacion invalida",
        });
      } else {
        Encargado.find({ correo: req.body.correo })
        .exec()
        .then((result) => {
          if (result.length >= 1){
            return res.status(409).json({
              error: "Ya existe una cuenta con este correo, intente con otro",
            });
          } else{
            bcrypt.hash(req.body.password, 10, (err, hash) => {
              if (err) {
                return res.status(500).json({
                  error: err,
                });
              } else {
                const encargado = new Encargado({
                  _id: new mongoose.Types.ObjectId(),
                  idAdmin: req.userData["userId"],
                  nombre: req.body.nombre,
                  apellido: req.body.apellido,
                  correo: req.body.correo,
                  password: hash,
                });
                encargado
                  .save()
                  .then((result) => {
                    res.status(201).json({
                      mensaje: "Encargado creado.",
                    });
                  })
                  .catch((err) => {
                    console.log(err);
                    res.status(500).json({
                      error: err,
                    });
                  });
    
                  const nuevoEvento = new Evento({
                    _id: new mongoose.Types.ObjectId(),
                    idAdmin: req.userData['userId'],
                    nombreUsuario: req.body.nombre + ' ' + req.body.apellido,
                    descripcion: 'Se creo su cuenta',
                    tipo: "CREACION_CUENTA",
                    timeStamp: Date.now(),
                    horaLegible: new Date().toLocaleTimeString(),
                  });
                  nuevoEvento.save().catch(err => console.log(err));
              }
            });
          }
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({
            error: err,
          });
        });
        }
    })    
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.post('/cerrar-sesion', checkAuth, (req, res, next) => {
  const nuevoEvento = new Evento({
    _id: new mongoose.Types.ObjectId(),
    idAdmin: req.userData['idAdmin'],
    nombreUsuario: req.userData['nombre'] + ' ' + req.userData['apellido'],
    descripcion: 'Cerro sesion',
    tipo: "CERRAR_SESION",
    timeStamp: Date.now(),
    horaLegible: new Date().toLocaleTimeString(),
  });
  nuevoEvento
  .save()
  .then(() => {
    res.status(201).json({
      mensaje: "Se cerro sesion.",
    });
  })
  .catch(err => console.log(err));
})

router.post("/login", (req, res, next) => {
  Admin.find({ correo: req.body.correo })
    .exec()
    .then((user) => {
      if (user.length >= 1) {
          bcrypt.compare(req.body.password, user[0].password, (err, result) => {
          if (err) {
            return res.status(401).json({
              error: "Autenticacion fallida",
            });
          }

          if (result) {
            const token = jwt.sign(
              {
                correo: user[0].correo,
                userId: user[0]._id,
                nombre: user[0].nombre,
                apellido: user[0].apellido,
                idAdmin: user[0]._id, 
                tipoUsuario: "Admin"
              },
              process.env.JWT_KEY,
              {
                expiresIn: "1h",
              }
            );
            
            const nuevoEvento = new Evento({
              _id: new mongoose.Types.ObjectId(),
              idAdmin: user[0]._id,
              nombreUsuario: user[0].nombre + ' '+ user[0].apellido,
              descripcion: 'Inicio sesion',
              tipo: "INICIO_SESION",
              timeStamp: Date.now(),
              horaLegible: new Date().toLocaleTimeString(),
            });
            nuevoEvento.save().catch(err => console.log(err)); 

            return res.status(200).json({
              mensaje: "Autenticacion exitosa",
              token: token,
              tipoUsuario: "Admin",
              nombre: user[0].nombre,
              correo: user[0].correo
            });
          } else {
            return res.status(401).json({
              error: "Contraseña incorrecta",
            });
          }
        });
      } else {
        Encargado.find({ correo: req.body.correo })
          .exec()
          .then((user) => {
            if (user.length < 1) {
              return res.status(401).json({
                error: "No existe esta cuenta",
              });
            }
            bcrypt.compare(
              req.body.password,
              user[0].password,
              (err, result) => {
                if (err) {
                  return res.status(401).json({
                    error: "Autenticacion fallida",
                  });
                }
                if (result) {
                  const token = jwt.sign(
                    {
                      correo: user[0].correo,
                      userId: user[0]._id,
                      adminId: user[0].idAdmin,
                      nombre: user[0].nombre,
                      apellido: user[0].apellido,
                      idAdmin: user[0].idAdmin,
                      tipoUsuario: "Encargado",
                    },
                    process.env.JWT_KEY,
                    {
                      expiresIn: "1h",
                    }
                  );

                  const nuevoEvento = new Evento({
                    _id: new mongoose.Types.ObjectId(),
                    idAdmin: user[0].idAdmin,
                    nombreUsuario: user[0].nombre + ' '+ user[0].apellido,
                    descripcion: 'Inicio sesion',
                    tipo: "INICIO_SESION",
                    timeStamp: Date.now(),
                    horaLegible: new Date().toLocaleTimeString(),
                  });
                  nuevoEvento.save().catch(err => console.log(err)); 

                  return res.status(200).json({
                    mensaje: "Autenticacion exitosa",
                    token: token,
                    tipoUsuario: "Encargado",
                    nombre: user[0].nombre,
                    correo: user[0].correo
                  });
                }
                res.status(401).json({
                  error: "Contraseña incorrecta",
                });
              }
            );
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({
              error: err,
            });
          });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.delete("/:adminId", (req, res, next) => {
  Admin.remove({ _id: req.params.adminId })
    .exec()
    .then(() => {
      res.status(200).json({
        mensaje: "Cuenta de administrador eliminada.",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
