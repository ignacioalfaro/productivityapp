const mongoose = require('mongoose');

// Define el esquema para el modelo Person
const personSchema = new mongoose.Schema({
    // Nombre de la persona (campo requerido, tipo String)
    name: {
        type: String,
        required: true,
        trim: true // Elimina espacios en blanco al principio y al final
    },
    // Rol de la persona (ej. "Cocinero", "Administrador")
    role: {
        type: String,
        default: 'Employee' // Valor por defecto si no se especifica
    },
    // Fecha de creación del registro de la persona
    createdAt: {
        type: Date,
        default: Date.now // Establece la fecha actual por defecto
    }
});

// Crea y exporta el modelo 'Person' basado en el esquema definido
module.exports = mongoose.model('Person', personSchema);
