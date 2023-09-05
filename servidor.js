const http = require('http');
const app = require('./server/app');

const puerto = process.env.PORT || 11111;

const servidor = http.createServer(app);
servidor.listen(puerto, () => {
    console.log(`Servidor escuchando en el puerto ${puerto}!`);
});