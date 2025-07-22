import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx'; // Importa la librería xlsx para exportar a Excel

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function ProductivityMetrics() {
  const [records, setRecords] = useState([]); // Estado para los registros de productividad
  const [persons, setPersons] = useState([]); // Lista de personas para el filtro
  const [startDate, setStartDate] = useState(''); // Fecha de inicio para el filtro
  const [endDate, setEndDate] = useState(''); // Fecha de fin para el filtro
  const [selectedPersonIds, setSelectedPersonIds] = useState([]); // IDs de personas seleccionadas para el filtro
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null); // Estado para errores

  // Carga inicial de personas y registros
  useEffect(() => {
    fetchPersons();
    fetchProductivityRecords();
  }, []); // Se ejecuta solo una vez al montar

  // Función para obtener todas las personas (para el filtro)
  const fetchPersons = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/persons`);
      setPersons(response.data);
    } catch (err) {
      console.error("Error al obtener personas para el filtro:", err);
      setError("No se pudieron cargar las personas para los filtros.");
    }
  };

  // Función para obtener registros de productividad con los filtros actuales
  const fetchProductivityRecords = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      // Si hay personas seleccionadas, las convierte en una cadena separada por comas
      if (selectedPersonIds.length > 0) {
        params.personIds = selectedPersonIds.join(',');
      }

      const response = await axios.get(`${BACKEND_URL}/api/productivity`, { params });
      setRecords(response.data);
    } catch (err) {
      console.error("Error al obtener registros de productividad:", err);
      setError("No se pudieron cargar los registros de productividad.");
    } finally {
      setLoading(false);
    }
  };

  // Maneja el cambio en la selección de personas para el filtro
  const handlePersonSelectChange = (e) => {
    const { options } = e.target;
    const value = [];
    for (let i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }
    setSelectedPersonIds(value);
  };

  // Maneja la aplicación de filtros
  const handleApplyFilters = () => {
    fetchProductivityRecords();
  };

  // Exportar datos a Excel
  const exportToExcel = () => {
    if (records.length === 0) {
      alert("No hay datos para exportar."); // Usamos alert temporalmente, luego un modal
      return;
    }

    // Prepara los datos para el archivo Excel
    const dataToExport = records.map(record => ({
      'Persona': record.person ? record.person.name : 'Desconocido',
      'Fecha': new Date(record.date).toLocaleDateString('es-ES'), // Formato de fecha local
      'Recetas Realizadas': record.recipesCompleted,
      'Errores Detectados': record.errorsDetected,
      'Productividad (%)': record.productivityPercentage.toFixed(2),
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Productividad");
    XLSX.writeFile(wb, "Productividad_Reporte.xlsx");
  };

  if (loading) {
    return (
      <div className="loading-container"> {/* Clase CSS personalizada */}
        <p className="text-gray-600">Cargando métricas...</p>
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
      <h2 className="section-title">Métricas de Productividad</h2> {/* Clase CSS personalizada */}

      {/* Sección de Filtros */}
      <div className="form-section"> {/* Clase CSS personalizada */}
        <h3 className="sub-section-title">Filtros</h3> {/* Clase CSS personalizada */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4"> {/* Clases CSS personalizadas */}
          <div className="form-group"> {/* Clase CSS personalizada */}
            <label htmlFor="startDate" className="form-label"> {/* Clase CSS personalizada */}
              Fecha Inicio:
            </label>
            <input
              type="date"
              id="startDate"
              className="form-input" {/* Clase CSS personalizada */}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="form-group"> {/* Clase CSS personalizada */}
            <label htmlFor="endDate" className="form-label"> {/* Clase CSS personalizada */}
              Fecha Fin:
            </label>
            <input
              type="date"
              id="endDate"
              className="form-input" {/* Clase CSS personalizada */}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div className="form-group"> {/* Clase CSS personalizada */}
            <label htmlFor="personFilter" className="form-label"> {/* Clase CSS personalizada */}
              Seleccionar Persona(s):
            </label>
            <select
              id="personFilter"
              multiple // Permite seleccionar múltiples opciones
              className="form-select h-24-custom" // Clase CSS personalizada para altura
              value={selectedPersonIds}
              onChange={handlePersonSelectChange}
            >
              <option value="">Todas las personas</option> {/* Opción para no filtrar por persona */}
              {persons.map((person) => (
                <option key={person._id} value={person._id}>
                  {person.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">Mantén Ctrl/Cmd para seleccionar múltiples.</p>
          </div>
        </div>
        <button
          onClick={handleApplyFilters}
          className="btn btn-purple w-full md:w-auto" {/* Clases CSS personalizadas */}
        >
          Aplicar Filtros
        </button>
      </div>

      {/* Botón de Exportar a Excel */}
      <div className="text-right mb-6"> {/* Clases CSS personalizadas */}
        <button
          onClick={exportToExcel}
          className="btn btn-export" {/* Clase CSS personalizada */}
        >
          Exportar a Excel
        </button>
      </div>

      {/* Tabla de Registros de Productividad */}
      <div>
        <h3 className="sub-section-title">Registros de Productividad</h3> {/* Clase CSS personalizada */}
        {records.length === 0 ? (
          <p className="text-placeholder">No hay registros de productividad para los filtros seleccionados.</p> {/* Clase CSS personalizada */}
        ) : (
          <div className="table-container"> {/* Clase CSS personalizada */}
            <table className="data-table"> {/* Clase CSS personalizada */}
              <thead>
                <tr className="table-header"> {/* Clase CSS personalizada */}
                  <th className="table-header th">Persona</th> {/* Clase CSS personalizada */}
                  <th className="table-header th">Fecha</th>
                  <th className="table-header th">Recetas</th>
                  <th className="table-header th">Errores</th>
                  <th className="table-header th">Productividad (%)</th>
                </tr>
              </thead>
              <tbody className="table-body"> {/* Clase CSS personalizada */}
                {records.map((record) => (
                  <tr key={record._id} className="table-row"> {/* Clase CSS personalizada */}
                    <td className="table-cell">
                      {record.person ? record.person.name : 'Desconocido'}
                    </td>
                    <td className="table-cell">
                      {new Date(record.date).toLocaleDateString('es-ES')}
                    </td>
                    <td className="table-cell">{record.recipesCompleted}</td>
                    <td className="table-cell">{record.errorsDetected}</td>
                    <td className="table-cell table-cell-bold"> {/* Clase CSS personalizada */}
                      {record.productivityPercentage.toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductivityMetrics;
