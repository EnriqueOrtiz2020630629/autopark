const mongoose = require('mongoose');

const pisoSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    idAdmin: {type: mongoose.Schema.Types.ObjectId, required:true},
    nombre: {type: String, required: true},
    esquemaPago: {type: String, required: true},
    montoPago: {type: Number, required: true},
    listaCajones: {type: Array, required: true}
}, {minimize: false});

module.exports = mongoose.model('Piso', pisoSchema);