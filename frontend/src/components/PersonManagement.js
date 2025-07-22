import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Obtiene la URL del backend desde las variables de entorno
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function PersonManagement() {
  const [persons, setPersons] = useState([]); // Estado para almacenar la lista de personas
  const [newPersonName, setNewPersonName] = useState(''); // Estado para el nombre de la nueva persona
  const [newPersonRole, setNewPersonRole] = useState('Employee'); // Estado para el rol de la nueva persona
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null); // Estado para errores
  const [message, setMessage] = useState(''); // Estado para mensajes de éxito/error al usuario

  // Función para obtener todas las personas del backend
  const fetchPersons = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${BACKEND_URL}/api/persons`);
      setPersons(response.data);
    } catch (err) {
      console.error("Error al obtener personas:", err);
      setError("No se pudieron cargar las personas.");
    } finally {
      setLoading(false);
    }
  };

  // Carga las personas al montar el componente
  useEffect(() => {
    fetchPersons();
  }, []);

  // Función para manejar el envío del formulario para agregar una nueva persona
  const handleAddPerson = async (e) => {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario (recargar la página)
    setMessage(''); // Limpia mensajes anteriores
    setError(null); // Limpia errores anteriores

    if (!newPersonName.trim()) {
      setError("El nombre de la persona no puede estar vacío.");
      return;
    }

    try {
      // Envía una solicitud POST al backend para crear una nueva persona
      const response = await axios.post(`${BACKEND_URL}/api/persons`, {
        name: newPersonName,
        role: newPersonRole,
      });
      setMessage(`Persona "${response.data.name}" agregada con éxito.`);
      setNewPersonName(''); // Limpia el campo de nombre
      setNewPersonRole('Employee'); // Restablece el rol
      fetchPersons(); // Vuelve a cargar la lista de personas para incluir la nueva
    } catch (err) {
      console.error("Error al agregar persona:", err);
      // Muestra un mensaje de error más específico si viene del backend
      setError(err.response?.data?.message || 'Error al agregar la persona.');
    }
  };

  if (loading) {
    return (
      <div className="loading-container"> {/* Clase CSS personalizada */}
        <p className="text-gray-600">Cargando personas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="message-error"> {/* Clase CSS personalizada */}
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="card-small"> {/* Clase CSS personalizada */}
      <h2 className="section-title">Gestión de Personas</h2> {/* Clase CSS personalizada */}

      {/* Formulario para agregar nueva persona */}
      <form onSubmit={handleAddPerson} className="form-section"> {/* Clase CSS personalizada */}
        <h3 className="sub-section-title">Agregar Nueva Persona</h3> {/* Clase CSS personalizada */}
        <div className="form-group"> {/* Clase CSS personalizada */}
          <label htmlFor="personName" className="form-label"> {/* Clase CSS personalizada */}
            Nombre:
          </label>
          <input
            type="text"
            id="personName"
            className="form-input" {/* Clase CSS personalizada */}
            value={newPersonName}
            onChange={(e) => setNewPersonName(e.target.value)}
            required
          />
        </div>
        <div className="form-group"> {/* Clase CSS personalizada */}
          <label htmlFor="personRole" className="form-label"> {/* Clase CSS personalizada */}
            Rol:
          </label>
          <select
            id="personRole"
            className="form-select" {/* Clase CSS personalizada */}
            value={newPersonRole}
            onChange={(e) => setNewPersonRole(e.target.value)}
          >
            <option value="Employee">Empleado</option>
            <option value="Manager">Gerente</option>
            <option value="Admin">Administrador</option>
          </select>
        </div>
        <button
          type="submit"
          className="btn btn-blue" {/* Clases CSS personalizadas */}
        >
          Agregar Persona
        </button>
        {message && <p className="message-success">{message}</p>} {/* Clase CSS personalizada */}
      </form>

      {/* Lista de personas existentes */}
      <div>
        <h3 className="sub-section-title">Personas Existentes</h3> {/* Clase CSS personalizada */}
        {persons.length === 0 ? (
          <p className="text-placeholder">No hay personas registradas aún.</p> {/* Clase CSS personalizada */}
        ) : (
          <ul className="list-container"> {/* Clase CSS personalizada */}
            {persons.map((person) => (
              <li key={person._id} className="list-item"> {/* Clase CSS personalizada */}
                <span className="list-item-name">{person.name}</span> {/* Clase CSS personalizada */}
                <span className="list-item-role">({person.role})</span> {/* Clase CSS personalizada */}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default PersonManagement;
