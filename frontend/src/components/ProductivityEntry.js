import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function ProductivityEntry() {
  const [persons, setPersons] = useState([]); // Lista de personas para el selector
  const [selectedPersonId, setSelectedPersonId] = useState(''); // ID de la persona seleccionada
  const [date, setDate] = useState(''); // Fecha del registro
  const [recipesCompleted, setRecipesCompleted] = useState(''); // Recetas completadas
  const [errorsDetected, setErrorsDetected] = useState(''); // Errores detectados
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null); // Estado para errores
  const [message, setMessage] = useState(''); // Estado para mensajes de éxito/error

  // Carga las personas al montar el componente para el selector
  useEffect(() => {
    const fetchPersons = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${BACKEND_URL}/api/persons`);
        setPersons(response.data);
        if (response.data.length > 0) {
          setSelectedPersonId(response.data[0]._id); // Selecciona la primera persona por defecto
        }
      } catch (err) {
        console.error("Error al obtener personas para el selector:", err);
        setError("No se pudieron cargar las personas para el registro.");
      } finally {
        setLoading(false);
      }
    };
    fetchPersons();

    // Establece la fecha actual por defecto en el campo de fecha
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Meses son 0-11
    const day = String(today.getDate()).padStart(2, '0');
    setDate(`${year}-${month}-${day}`);
  }, []);

  // Función para manejar el envío del formulario de registro de productividad
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError(null);

    // Validaciones
    if (!selectedPersonId || !date || recipesCompleted === '' || errorsDetected === '') {
      setError("Todos los campos son obligatorios.");
      return;
    }
    if (isNaN(recipesCompleted) || isNaN(errorsDetected) || recipesCompleted < 0 || errorsDetected < 0) {
      setError("Las recetas y errores deben ser números no negativos.");
      return;
    }

    try {
      // Envía una solicitud POST al backend para crear un registro de productividad
      const response = await axios.post(`${BACKEND_URL}/api/productivity`, {
        personId: selectedPersonId,
        date: date,
        recipesCompleted: parseInt(recipesCompleted),
        errorsDetected: parseInt(errorsDetected),
      });
      setMessage(`Registro de productividad guardado para ${persons.find(p => p._id === selectedPersonId)?.name || 'la persona seleccionada'}. Productividad: ${response.data.productivityPercentage.toFixed(2)}%`);
      // Limpia los campos numéricos después de un envío exitoso
      setRecipesCompleted('');
      setErrorsDetected('');
    } catch (err) {
      console.error("Error al guardar registro de productividad:", err);
      setError(err.response?.data?.message || 'Error al guardar el registro de productividad.');
    }
  };

  if (loading) {
    return (
      <div className="loading-container"> {/* Clase CSS personalizada */}
        <p className="text-gray-600">Cargando formulario...</p>
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
      <h2 className="section-title">Registro de Productividad</h2> {/* Clase CSS personalizada */}

      <form onSubmit={handleSubmit} className="form-section"> {/* Clase CSS personalizada */}
        <div className="form-group"> {/* Clase CSS personalizada */}
          <label htmlFor="personSelect" className="form-label"> {/* Clase CSS personalizada */}
            Seleccionar Persona:
          </label>
          <select
            id="personSelect"
            className="form-select" {/* Clase CSS personalizada */}
            value={selectedPersonId}
            onChange={(e) => setSelectedPersonId(e.target.value)}
            required
            disabled={persons.length === 0} // Deshabilita si no hay personas
          >
            {persons.length === 0 ? (
              <option value="">No hay personas disponibles</option>
            ) : (
              persons.map((person) => (
                <option key={person._id} value={person._id}>
                  {person.name}
                </option>
              ))
            )}
          </select>
        </div>

        <div className="form-group"> {/* Clase CSS personalizada */}
          <label htmlFor="recordDate" className="form-label"> {/* Clase CSS personalizada */}
            Fecha:
          </label>
          <input
            type="date"
            id="recordDate"
            className="form-input" {/* Clase CSS personalizada */}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group"> {/* Clase CSS personalizada */}
          <label htmlFor="recipesCompleted" className="form-label"> {/* Clase CSS personalizada */}
            Recetas Realizadas:
          </label>
          <input
            type="number"
            id="recipesCompleted"
            className="form-input" {/* Clase CSS personalizada */}
            value={recipesCompleted}
            onChange={(e) => setRecipesCompleted(e.target.value)}
            min="0"
            required
          />
        </div>

        <div className="form-group"> {/* Clase CSS personalizada */}
          <label htmlFor="errorsDetected" className="form-label"> {/* Clase CSS personalizada */}
            Errores Detectados:
          </label>
          <input
            type="number"
            id="errorsDetected"
            className="form-input" {/* Clase CSS personalizada */}
            value={errorsDetected}
            onChange={(e) => setErrorsDetected(e.target.value)}
            min="0"
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-green" {/* Clases CSS personalizadas */}
          disabled={persons.length === 0} // Deshabilita el botón si no hay personas
        >
          Guardar Registro
        </button>
        {message && <p className="message-success">{message}</p>} {/* Clase CSS personalizada */}
      </form>
    </div>
  );
}

export default ProductivityEntry;
