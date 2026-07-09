import { useState } from 'react';
import '../App.css';

// Recibimos 'alEnviar' como prop desde App.jsx
function Formulario({ alEnviar }) {
  const [datos, setDatos] = useState({ nombre: '', comentario: '', calificacion: 5, recomienda: 'Si' });
  const [hover, setHover] = useState(0);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState(false);

  const validarFormulario = () => {
    if (!datos.nombre.trim()) {
      setError('El nombre es requerido');
      return false;
    }
    if (datos.nombre.trim().length < 2) {
      setError('El nombre debe tener al menos 2 caracteres');
      return false;
    }
    if (!datos.comentario.trim()) {
      setError('El comentario es requerido');
      return false;
    }
    if (datos.comentario.trim().length < 10) {
      setError('El comentario debe tener al menos 10 caracteres');
      return false;
    }
    if (datos.calificacion < 1 || datos.calificacion > 5) {
      setError('La calificación debe estar entre 1 y 5');
      return false;
    }
    setError('');
    return true;
  };

  const enviarFormulario = async (e) => {
    e.preventDefault();
    setError('');
    setExito(false);

    if (!validarFormulario()) {
      return;
    }

    setCargando(true);

    try {
      const response = await fetch('http://localhost:3001/api/opiniones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datos),
      });

      if (response.ok) {
        setExito(true);
        setDatos({ nombre: '', comentario: '', calificacion: 5, recomienda: 'Si' });

        if (alEnviar) alEnviar();

        // Ocultar mensaje de éxito después de 3 segundos
        setTimeout(() => setExito(false), 3000);
      } else {
        const respuestaError = await response.json();
        setError(respuestaError.error || 'Error al enviar la reseña');
      }
    } catch (error) {
      console.error("Error en la conexión:", error);
      setError('Error de conexión. Por favor, intenta más tarde.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <form className="form-resenas dark-theme" onSubmit={enviarFormulario}>
      <h3>Completa los campos</h3>

      {error && (
        <div style={{
          background: '#fee',
          border: '2px solid #f88',
          color: '#c33',
          padding: '12px',
          borderRadius: '8px',
          marginBottom: '10px',
          animation: 'fadeInDown 0.3s ease-out'
        }}>
          ⚠️ {error}
        </div>
      )}

      {exito && (
        <div style={{
          background: '#efe',
          border: '2px solid #8f8',
          color: '#3a3',
          padding: '12px',
          borderRadius: '8px',
          marginBottom: '10px',
          animation: 'fadeInDown 0.3s ease-out'
        }}>
          ✅ ¡Gracias por tu reseña! Será visible después de revisión.
        </div>
      )}
      
      <div className="input-group">
        <label>Nombre:</label>
        <input 
          type="text" 
          value={datos.nombre}
          placeholder="Tu nombre completo"
          onChange={(e) => setDatos({...datos, nombre: e.target.value})} 
          required 
        />
      </div>

      <div className="input-group">
        <label>Comentario:</label>
        <textarea 
          value={datos.comentario}
          placeholder="Comparte tu experiencia con nosotros..."
          onChange={(e) => setDatos({...datos, comentario: e.target.value})} 
          required
        ></textarea>
      </div>

      <div className="input-group star-rating-group">
        <label>Tu Calificación:</label>
        <div className="star-rating">
          {[...Array(5)].map((_, index) => {
            const currentRating = index + 1;
            return (
              <label key={index} className="star-label">
                <input 
                  type="radio" 
                  name="rating" 
                  value={currentRating}
                  onClick={() => setDatos({...datos, calificacion: currentRating})}
                />
                <span 
                  className={`star ${currentRating <= (hover || datos.calificacion) ? "on" : "off"}`}
                  onMouseEnter={() => setHover(currentRating)}
                  onMouseLeave={() => setHover(0)}
                >
                  ★
                </span>
              </label>
            );
          })}
          <span className="rating-value">{hover || datos.calificacion} / 5</span>
        </div>
      </div>

      <div className="input-group radio-group recommendations">
        <label>¿Recomiendas los servicios?</label>
        <div className="radios">
          <label className="radio-label">
            <input type="radio" name="rec" value="Si" checked={datos.recomienda === 'Si'} onChange={(e) => setDatos({...datos, recomienda: e.target.value})} /> 
            Sí
          </label>
          <label className="radio-label">
            <input type="radio" name="rec" value="No" checked={datos.recomienda === 'No'} onChange={(e) => setDatos({...datos, recomienda: e.target.value})} /> 
            No
          </label>
        </div>
      </div>

      <div className="form-actions">
        <button
          type="submit"
          className="btn-enviar"
          disabled={cargando}
          style={{ opacity: cargando ? 0.7 : 1, cursor: cargando ? 'not-allowed' : 'pointer' }}
        >
          {cargando ? '⏳ Enviando...' : 'Enviar Reseña'}
        </button>
        <button
          type="button"
          className="btn-cancelar"
          disabled={cargando}
          onClick={() => {
            setDatos({ nombre: '', comentario: '', calificacion: 5, recomienda: 'Si' });
            setError('');
            setExito(false);
          }}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

export default Formulario;