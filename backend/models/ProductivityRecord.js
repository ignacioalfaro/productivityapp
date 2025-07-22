const mongoose = require('mongoose');

// Define el esquema para el modelo ProductivityRecord
const productivityRecordSchema = new mongoose.Schema({
    // Referencia a la persona a la que pertenece este registro
    // 'ref: "Person"' indica que este campo se relaciona con el modelo 'Person'
    person: {
        type: mongoose.Schema.Types.ObjectId, // Tipo de dato para IDs de MongoDB
        ref: 'Person', // Referencia al modelo 'Person'
        required: true
    },
    // Fecha del registro de productividad (campo requerido, tipo Date)
    date: {
        type: Date,
        required: true,
        // Asegura que la fecha solo tenga el componente de día, mes y año para evitar duplicados por hora
        set: function(v) {
            const date = new Date(v);
            date.setHours(0, 0, 0, 0); // Establece la hora a medianoche UTC
            return date;
        }
    },
    // Cantidad de recetas realizadas (campo requerido, tipo Number)
    recipesCompleted: {
        type: Number,
        required: true,
        min: 0 // Asegura que el número no sea negativo
    },
    // Cantidad de errores detectados (campo requerido, tipo Number)
    errorsDetected: {
        type: Number,
        required: true,
        min: 0 // Asegura que el número no sea negativo
    },
    // Porcentaje de productividad calculado (se calculará en el backend)
    productivityPercentage: {
        type: Number,
        default: 0 // Valor por defecto
    },
    // Fecha de creación del registro
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Agrega un índice único para evitar registros duplicados para la misma persona en la misma fecha
// Esto es importante para asegurar que solo haya un registro de productividad por persona por día
productivityRecordSchema.index({ person: 1, date: 1 }, { unique: true });


// Crea y exporta el modelo 'ProductivityRecord'
module.exports = mongoose.model('ProductivityRecord', productivityRecordSchema);

