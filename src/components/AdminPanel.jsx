import { useState } from 'react';
import '../App.css';
import AdminUsuarios from './AdminUsuarios';

function AdminPanel({ opiniones, actualizarDatos, onLogout }) {
  const [seccion, setSeccion] = useState(null);

  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${sessionStorage.getItem('adminToken')}`
  });

  const eliminar = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar esta opinión?")) {
      try {
        const response = await fetch(`http://localhost:3001/api/opiniones/${id}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        });
        if (response.ok) {
          
          actualizarDatos();
        } else if (response.status === 401) {
          alert('Sesión expirada. Por favor, vuelve a ingresar.');
          onLogout();
        }
      } catch (error) {
        console.error("Error al eliminar:", error);
      }
    }
  };

  const responder = async (id) => {
    const texto = prompt("Escribe tu respuesta:");
    if (!texto) return;

    try {
      const response = await fetch(`http://localhost:3001/api/opiniones/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ respuesta: texto })
      });
      if (response.ok) {
        actualizarDatos();
      } else if (response.status === 401) {
        alert('Sesión expirada. Por favor, vuelve a ingresar.');
        onLogout();
      }
    } catch (error) {
      console.error("Error al responder:", error);
    }
  };

  // Si no hay sección seleccionada, mostrar selector
  if (!seccion) {
    return (
      <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 8px 25px rgba(0, 87, 184, 0.1)', overflow: 'hidden' }}>
        <div style={{ background: 'linear-gradient(135deg, #0057b8 0%, #0080d0 100%)', color: 'white', padding: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: '0 0 5px 0', fontSize: '1.8rem', fontWeight: '700' }}>Administrar:</h1>
            <p style={{ margin: '0', fontSize: '0.95rem', opacity: 0.9 }}>Selecciona qué deseas gestionar</p>
          </div>
          <button onClick={onLogout} style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: '2px solid white', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.95rem' }}>Cerrar Sesión</button>
        </div>

        <div style={{ padding: '40px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          <button
            onClick={() => setSeccion('comentarios')}
            style={{
              background: 'linear-gradient(135deg, #0057b8 0%, #0080d0 100%)',
              color: 'white',
              border: 'none',
              padding: '30px',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '1.2rem',
              fontWeight: '700',
              transition: 'all 0.3s',
              boxShadow: '0 4px 12px rgba(0, 87, 184, 0.2)'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-3px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            💬 Comentarios
          </button>

          <button
            onClick={() => setSeccion('usuarios')}
            style={{
              background: 'linear-gradient(135deg, #25d366 0%, #1da852 100%)',
              color: 'white',
              border: 'none',
              padding: '30px',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '1.2rem',
              fontWeight: '700',
              transition: 'all 0.3s',
              boxShadow: '0 4px 12px rgba(37, 211, 102, 0.2)'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-3px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            👥 Usuarios
          </button>
        </div>
      </div>
    );
  }

  // Si seleccionó comentarios
  if (seccion === 'comentarios') {
    return (
      <div className="admin-panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <button onClick={() => setSeccion(null)} style={{ background: '#6c757d', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem' }}>← Atrás</button>
          <h3 style={{ margin: 0 }}>Comentarios</h3>
          <button onClick={onLogout} style={{ background: '#dc3545', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem' }}>Cerrar Sesión</button>
        </div>
        {opiniones && opiniones.map(op => (
          <div key={op.id} className="admin-row">
            <div className="admin-info">
              <p><strong>{op.nombre}:</strong> {op.comentario}</p>
              {op.respuesta && (
                <p className="admin-respuesta"><em>Respuesta: {op.respuesta}</em></p>
              )}
            </div>
            <div className="admin-actions">
              <button className="btn-responder" onClick={() => responder(op.id)}>Responder</button>
              <button className="btn-eliminar" onClick={() => eliminar(op.id)}>Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Si seleccionó usuarios
  if (seccion === 'usuarios') {
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <button onClick={() => setSeccion(null)} style={{ background: '#6c757d', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem' }}>← Atrás</button>
          <button onClick={onLogout} style={{ background: '#dc3545', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem' }}>Cerrar Sesión</button>
        </div>
        <AdminUsuarios />
      </div>
    );
  }
}

export default AdminPanel;