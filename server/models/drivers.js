const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let driverSchema = new Schema({
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
    cedula: {
        type: Number,
        unique: true,
        required: [true, 'La cedula es obligatoria']
    },
    telefono: {
        type: Number,
        required: [true, 'El telefono es obligatorio']
    },
    creacion: {
        type: Date,
        required: true,
        default: new Date()
    }
});

module.exports = mongoose.model('Driver', driverSchema);