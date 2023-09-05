const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoDb = require('./db-conn');

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

app.get('/', (req, res) => {
    res.sendFile('index.html', {root: __dirname + './client/frontend/build'});
});

app.use('/pisos', pisosRutas);
app.use('/registrar-entrada', registrarEntradaRutas);
app.use('/registrar-salida', registrarSalidaRutas);
app.use('/', adminRutas);
app.use('/bitacora', bitacoraRutas);
app.use('/reporte-financiero', reporteFinancieroRutas);


app.get('/reporte-diario', (req, res, next) => {
    const salidas  = eventos.filter(evento => evento.tipo === "SALIDA").filter(evento => evento.timeStamp.toDateString === Date.now().toDateString());    
    let ganancias = 0;
    let numCarros = 0;
    salidas.forEach(evento => {
        ganancias+=evento.especial;
        numCarros += 1;
    });

    const reporte = {
        fecha: Date.now().toISOString().substring(0, 10),
        ganancias: ganancias,
        numCarros: numCarros
    }

    res.status(200).json({
        reporte: reporte
    });
});

app.get('/reporte-mensual', (req, res, next) => {
    const salidas  = eventos.filter(evento => evento.timeStamp === Date.now().getMonth() && evento.timeStamp.getFullYear() === Date.now().getFullYear());    
    let ganancias = 0;
    let numCarros = 0;
    salidas.forEach(evento => {
        ganancias+=evento.especial;
        numCarros += 1;
    });

    const reporte = {
        fecha: Date.now().toISOString().substring(0, 10),
        ganancias: ganancias,
        numCarros: numCarros
    }
    
    res.status(200).json({
        reporte: reporte
    });
});


app.get('/bitacora', (req, res, next) => {
    const eventos  = eventos.filter(evento => evento.timeStamp.toDateString === Date.now().toDateString);
    
    res.status(200).json({
        reporte: reporte
    });
})

app.use((next) => {
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
