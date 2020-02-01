const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let clienteSchema = new Schema({
    estado: {
        type: Object,
        required: true,
        enum: ['activo', 'inactivo'],
        default: 'activo'
    },
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    apellido: {
        type: String,
        required: [true, 'El apellido es obligatorio']
    },
    correo: {
        type: String,
        unique: true,
        required: [true, 'El correo es obligatorio']
    },
    telefono: {
        type: Number,
        required: true
    },
    creacion: {
        type: Date,
        required: true,
        default: new Date()
    }
});

module.exports = mongoose.model('Cliente', clienteSchema);