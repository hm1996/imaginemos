const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let pedidoSchema = new Schema({
    estado: {
        type: Object,
        required: true,
        enum: ['activo', 'inactivo', 'pendiente'],
        default: 'pendiente'
    },
    cliente: {
        type: String,
        required: [true, 'El cliente es obligatorio']
    },
    driver: {
        type: String,
        default: ""
    },
    direccion: {
        type: String,
        required: [true, 'La direccion es obligatoria']
    },
    horas: {
        type: String,
        required: [true, 'Las horas son obligatorias'],
    },
    creacion: {
        type: Date,
        required: true,
        default: new Date()
    }
});

module.exports = mongoose.model('Pedido', pedidoSchema);