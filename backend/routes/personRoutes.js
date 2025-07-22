const express = require('express');
const router = express.Router(); // Crea un nuevo enrutador de Express
const Person = require('../models/Person'); // Importa el modelo Person

// Ruta para crear una nueva persona
// POST /api/persons
router.post('/', async (req, res) => {
    try {
        // Extrae el nombre y el rol del cuerpo de la solicitud
        const { name, role } = req.body;

        // Verifica que el nombre sea proporcionado
        if (!name) {
            return res.status(400).json({ message: 'El nombre de la persona es requerido.' });
        }

        // Crea una nueva instancia de Person
        const newPerson = new Person({ name, role });
        // Guarda la nueva persona en la base de datos
        await newPerson.save();

        // Responde con la persona creada y un estado 201 (Creado)
        res.status(201).json(newPerson);
    } catch (error) {
        // Maneja errores, por ejemplo, si ya existe una persona con el mismo nombre
        if (error.code === 11000) { // Código de error de duplicado en MongoDB
            return res.status(409).json({ message: 'Ya existe una persona con este nombre.' });
        }
        console.error('Error al crear persona:', error);
        res.status(500).json({ message: 'Error interno del servidor al crear persona.' });
    }
});

// Ruta para obtener todas las personas
// GET /api/persons
router.get('/', async (req, res) => {
    try {
        // Busca todas las personas en la base de datos
        const persons = await Person.find();
        // Responde con la lista de personas
        res.status(200).json(persons);
    } catch (error) {
        console.error('Error al obtener personas:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener personas.' });
    }
});

// Exporta el enrutador para usarlo en server.js
module.exports = router;

