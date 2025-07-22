import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './style.css'; // ¡Importa style.css!

// Importa los nuevos componentes
import PersonManagement from './components/PersonManagement';
import ProductivityEntry from './components/ProductivityEntry';
import ProductivityMetrics from './components/ProductivityMetrics';

function App() {
  // Estado para controlar la vista actual: 'home', 'persons', 'entry', 'metrics'
  const [currentView, setCurrentView] = useState('home');
  const [backendStatus, setBackendStatus] = useState({ loading: true, error: null, message: '' });

  // Obtiene la URL del backend desde las variables de entorno del frontend
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  // Efecto para verificar la conexión al backend al iniciar la aplicación
  useEffect(() => {
    const checkBackendStatus = async () => {
      try {
        if (!BACKEND_URL) {
          throw new Error("La variable de entorno REACT_APP_BACKEND_URL no está definida.");
        }
        const response = await axios.get(BACKEND_URL);
        setBackendStatus({ loading: false, error: null, message: response.data });
      } catch (err) {
        console.error("Error al conectar con el backend:", err);
        setBackendStatus({
          loading: false,
          error: true,
          message: "No se pudo conectar con el backend. Revisa la URL y el estado del servicio.",
        });
      }
    };

    checkBackendStatus();
  }, [BACKEND_URL]); // Vuelve a ejecutar si la URL del backend cambia

  // Función para renderizar el componente según la vista actual
  const renderView = () => {
    switch (currentView) {
      case 'persons':
        return <PersonManagement />;
      case 'entry':
        return <ProductivityEntry />;
      case 'metrics':
        return <ProductivityMetrics />;
      default:
        return (
          <div className="card"> {/* Clase CSS personalizada */}
            <h1 className="title-app"> {/* Clase CSS personalizada */}
              ¡Bienvenido a la App de Productividad!
            </h1>
            {/* ¡CORREGIDO! Asegúrate de que no haya un '(' extra aquí */}
            {backendStatus.loading && 
              <p className="subtitle-app">Verificando conexión al backend...</p> {/* Clase CSS personalizada */}
            }
            {backendStatus.error && (
              <p className="text-status-error">{backendStatus.message}</p> {/* Clase CSS personalizada */}
            )}
            {!backendStatus.loading && !backendStatus.error && (
              <>
                <p className="subtitle-app"> {/* Clase CSS personalizada */}
                  Estado del backend: <span className="text-backend-message">{backendStatus.message}</span> {/* Clase CSS personalizada */}
                </p>
                <p className="text-info"> {/* Clase CSS personalizada */}
                  Usa la navegación superior para gestionar personas, registrar productividad o ver métricas.
                </p>
              </>
            )}
          </div>
        );
    }
  };

  return (
    <div className="container-app"> {/* Clase CSS personalizada */}
      {/* Barra de Navegación */}
      <nav className="navbar"> {/* Clase CSS personalizada */}
        <div className="navbar-container"> {/* Clase CSS personalizada */}
          <h1 className="navbar-title">ProductivityApp</h1> {/* Clase CSS personalizada */}
          <div className="nav-buttons"> {/* Clase CSS personalizada */}
            <button
              onClick={() => setCurrentView('home')}
              className={`nav-button ${currentView === 'home' ? 'active' : ''}`} {/* Clases CSS personalizadas */}
            >
              Inicio
            </button>
            <button
              onClick={() => setCurrentView('persons')}
              className={`nav-button ${currentView === 'persons' ? 'active' : ''}`} {/* Clases CSS personalizadas */}
            >
              Personas
            </button>
            <button
              onClick={() => setCurrentView('entry')}
              className={`nav-button ${currentView === 'entry' ? 'active' : ''}`} {/* Clases CSS personalizadas */}
            >
              Registrar Productividad
            </button>
            <button
              onClick={() => setCurrentView('metrics')}
              className={`nav-button ${currentView === 'metrics' ? 'active' : ''}`} {/* Clases CSS personalizadas */}
            >
              Métricas
            </button>
          </div>
        </div>
      </nav>

      {/* Contenido Principal */}
      <main className="main-content"> {/* Clase CSS personalizada */}
        {renderView()}
      </main>
    </div>
  );
}

export default App;
