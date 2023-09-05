const mongoose = require('mongoose');

const eventoSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    idAdmin: {type: mongoose.Schema.Types.ObjectId, required:true},
    nombreUsuario: {type: String, required: true},
    descripcion: {type: String, required: true},
    tipo: {type: String, required: true},
    timeStamp: {type: Number, required: true},
    horaLegible: {type: String, required: true},
    extra: {type: Object}
});

module.exports = mongoose.model('Evento', eventoSchema);