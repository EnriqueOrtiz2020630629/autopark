const mongoose = require('mongoose');

const encargadoSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    idAdmin: {type: mongoose.Schema.Types.ObjectId, ref: 'Admin'},
    nombre: {type: String, required: true},
    apellido: {type: String, required: true},
    correo: {
        type: String, 
        required: true,
        unique: true, 
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: {type: String, required: true}
});

module.exports = mongoose.model('Encargado', encargadoSchema);

