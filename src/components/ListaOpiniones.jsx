import '../App.css';

// Recibimos 'lista' como una propiedad (prop) desde App.jsx
function ListaOpiniones({ lista }) {
  
  return (
    <div className="resenas-section">
      <h3>Opiniones de nuestros clientes</h3>
      
      {/* Si la lista está vacía, mostramos un mensaje */}
      {lista.length === 0 ? (
        <p>Aún no hay opiniones. ¡Sé el primero en compartir la tuya!</p>
      ) : (
        <div className="resenas-grid">
          {lista.map(op => (
            <div key={op.id} className="resena-card">
              <h4>{op.nombre}</h4>
              <p className="comentario">"{op.comentario}"</p>
              
              {/* Calificación de estrellas */}
              <div className="calificacion">
                {Array.from({ length: op.calificacion || 0 }).map((_, i) => (
                  <span key={i} className="star">★</span>
                ))}
              </div>

              {/* Visualización de la respuesta del administrador si existe */}
              {op.respuesta && (
                <div className="admin-respuesta-card">
                  <p><strong>Respuesta de Lavandería El Fénix:</strong></p>
                  <p><em>{op.respuesta}</em></p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ListaOpiniones;