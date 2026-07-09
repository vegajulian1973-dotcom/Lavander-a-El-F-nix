import '../App.css';

function AdminPanel({ opiniones, actualizarDatos, onLogout }) {

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

  return (
    <div className="admin-panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ margin: 0 }}>Panel de Control Admin</h3>
        <button
          onClick={onLogout}
          style={{
            background: '#6c757d',
            color: 'white',
            border: 'none',
            padding: '8px 15px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.9rem'
          }}
        >
          Cerrar Sesión
        </button>
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

export default AdminPanel;