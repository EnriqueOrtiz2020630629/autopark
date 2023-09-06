const app = require('./server/app');

const puerto = process.env.PORT || 5001;

app.listen(puerto, () => {
    console.log(`Servidor escuchando en el puerto ${puerto}!`);
});