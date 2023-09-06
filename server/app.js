const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require("mongoose");

mongoose
    .connect(process.env.mongoURL)
    .then(() => console.log("Se conecto a la base de datos exitosamente"))
    .catch(console.error);

const app = express();


const pisosRutas = require('./rutas/pisos');
const registrarEntradaRutas = require('./rutas/registrar-entrada');
const registrarSalidaRutas = require('./rutas/registrar-salida');
const adminRutas = require('./rutas/admin');
const bitacoraRutas = require('./rutas/bitacora');
const reporteFinancieroRutas = require('./rutas/reporte-financiero');

app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(express.static('./client/frontend/build'));
/*app.use('/static', express.static('./client/frontend/build/static'));

app.get('/', (req, res) => {
    res.sendFile('index.html', {root: __dirname + './client/frontend/build'});
});*/

app.use('/api/pisos', pisosRutas);
app.use('/api/registrar-entrada', registrarEntradaRutas);
app.use('/api/registrar-salida', registrarSalidaRutas);
app.use('/api', adminRutas);
app.use('/api/bitacora', bitacoraRutas);
app.use('/api/reporte-financiero', reporteFinancieroRutas);

app.use((req, res, next) => {
    const error = new Error('No encontrado');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;
