const express = require('express');
const router = express.Router();
const ProductivityRecord = require('../models/ProductivityRecord');
const Person = require('../models/Person'); // Necesitamos el modelo Person para verificar IDs

// Función para calcular el porcentaje de productividad
const calculateProductivityPercentage = (recipesCompleted, errorsDetected) => {
    if (recipesCompleted + errorsDetected === 0) {
        return 0; // Evitar división por cero
    }
    return (recipesCompleted / (recipesCompleted + errorsDetected)) * 100;
};

// Ruta para crear un nuevo registro de productividad
// POST /api/productivity
router.post('/', async (req, res) => {
    try {
        const { personId, date, recipesCompleted, errorsDetected } = req.body;

        // Validaciones básicas
        if (!personId || !date || recipesCompleted === undefined || errorsDetected === undefined) {
            return res.status(400).json({ message: 'Todos los campos (personId, date, recipesCompleted, errorsDetected) son requeridos.' });
        }

        // Verificar si la persona existe
        const personExists = await Person.findById(personId);
        if (!personExists) {
            return res.status(404).json({ message: 'La persona especificada no existe.' });
        }

        // Calcular el porcentaje de productividad
        const productivityPercentage = calculateProductivityPercentage(recipesCompleted, errorsDetected);

        // Crear una nueva instancia de ProductivityRecord
        const newRecord = new ProductivityRecord({
            person: personId,
            date: new Date(date), // Asegura que la fecha se guarde correctamente
            recipesCompleted,
            errorsDetected,
            productivityPercentage
        });

        // Guardar el registro en la base de datos
        await newRecord.save();

        res.status(201).json(newRecord);
    } catch (error) {
        // Manejar el error de duplicado si ya existe un registro para la misma persona en la misma fecha
        if (error.code === 11000) {
            return res.status(409).json({ message: 'Ya existe un registro de productividad para esta persona en esta fecha.' });
        }
        console.error('Error al crear registro de productividad:', error);
        res.status(500).json({ message: 'Error interno del servidor al crear registro de productividad.' });
    }
});

// Ruta para obtener registros de productividad con filtros
// GET /api/productivity
// Ejemplo de uso: /api/productivity?startDate=2023-01-01&endDate=2023-01-31&personIds=60d5ec49f8c7d1001c8a4f01,60d5ec49f8c7d1001c8a4f02
router.get('/', async (req, res) => {
    try {
        const { startDate, endDate, personIds } = req.query;
        let query = {};

        // Filtrar por rango de fechas
        if (startDate || endDate) {
            query.date = {};
            if (startDate) {
                // $gte: Greater Than or Equal (mayor o igual que)
                query.date.$gte = new Date(startDate);
            }
            if (endDate) {
                // $lte: Less Than or Equal (menor o igual que)
                // Ajustamos la fecha final para incluir todo el día
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                query.date.$lte = end;
            }
        }

        // Filtrar por personas específicas
        if (personIds) {
            // personIds puede ser una cadena separada por comas (ej. "id1,id2,id3")
            const idsArray = personIds.split(',').map(id => id.trim());
            query.person = { $in: idsArray }; // $in: Coincide con cualquiera de los valores en un array
        }

        // Buscar registros de productividad, poblar la información de la persona (name, role)
        // y ordenar por fecha descendente
        const records = await ProductivityRecord.find(query)
            .populate('person', 'name role') // 'person' es el campo en el modelo ProductivityRecord
                                            // 'name role' son los campos del modelo Person que queremos traer
            .sort({ date: -1 }); // Ordenar por fecha de forma descendente

        res.status(200).json(records);
    } catch (error) {
        console.error('Error al obtener registros de productividad:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener registros de productividad.' });
    }
});

// Exporta el enrutador
module.exports = router;

