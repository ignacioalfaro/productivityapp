// Carga las variables de entorno desde el archivo .env
require('dotenv').config();

// Importa el módulo Express
const express = require('express');
// Importa Mongoose para la conexión a la base de datos MongoDB
const mongoose = require('mongoose');
// Importa CORS para permitir solicitudes desde el frontend
const cors = require('cors');

// Crea una instancia de la aplicación Express
const app = express();

// Define el puerto en el que el servidor escuchará.
// Intenta usar la variable de entorno PORT si está definida (útil para el hosting),
// de lo contrario, usa el puerto 5000 por defecto.
const PORT = process.env.PORT || 5000;

// Obtiene la cadena de conexión a la base de datos desde las variables de entorno
const DB_CONNECTION_STRING = process.env.DB_CONNECTION_STRING;

// Middleware para parsear JSON en las solicitudes (muy importante para recibir datos del frontend)
app.use(express.json());

// Middleware CORS para permitir solicitudes desde cualquier origen (por ahora, luego lo restringiremos)
// Esto es crucial para que tu frontend pueda comunicarse con este backend
app.use(cors());

// Función para conectar a la base de datos
const connectDB = async () => {
    try {
        // Verifica si la cadena de conexión está definida
        if (!DB_CONNECTION_STRING) {
            console.error('Error: La variable de entorno DB_CONNECTION_STRING no está definida.');
            // Termina el proceso si no hay cadena de conexión
            process.exit(1);
        }
        // Intenta conectar a MongoDB usando Mongoose
        await mongoose.connect(DB_CONNECTION_STRING);
        console.log('Conexión a MongoDB establecida con éxito.');
    } catch (error) {
        // Captura y muestra cualquier error de conexión
        console.error('Error al conectar a MongoDB:', error.message);
        // Termina el proceso si la conexión falla
        process.exit(1);
    }
};

// Llama a la función para conectar a la base de datos cuando el servidor se inicia
connectDB();

// Ruta de prueba: GET a la raíz '/'
// Cuando alguien acceda a la URL base de tu backend, recibirá este mensaje.
app.get('/', (req, res) => {
    // Envía una respuesta de texto plano
    res.send('¡Hola desde el backend de Productividad! Conectado a DB.');
});

// Inicia el servidor y lo pone a escuchar en el puerto especificado
app.listen(PORT, () => {
    // Muestra un mensaje en la consola cuando el servidor se inicia correctamente
    console.log(`Servidor backend ejecutándose en el puerto ${PORT}`);
    console.log(`Puedes acceder a él en: http://localhost:${PORT}`);
});
const personRoutes = require('./routes/personRoutes');
// Importa las rutas de productividad
const productivityRoutes = require('./routes/productivityRoutes');
// Middleware CORS para permitir solicitudes desde cualquier origen (por ahora, luego lo restringiremos)
// Esto es crucial para que tu frontend pueda comunicarse con este backend
app.use(cors());

// Usa las rutas de personas bajo el prefijo /api/persons
app.use('/api/persons', personRoutes);
// Usa las rutas de productividad bajo el prefijo /api/productivity
app.use('/api/productivity', productivityRoutes);
// Ruta de prueba: GET a la raíz '/'
// Cuando alguien acceda a la URL base de tu backend, recibirá este mensaje.
app.get('/', (req, res) => {
    // Envía una respuesta de texto plano
    res.send('¡Hola desde el backend de Productividad! Conectado a DB.');
});