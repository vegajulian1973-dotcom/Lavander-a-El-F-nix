import { useState, useEffect } from 'react';
import '../App.css';

function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [editando, setEditando] = useState(null);
  const [mostrareForm, setMostrareForm] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    nombre_usuario: '',
    correo_electronico: '',
    contrasena: '',
    tipo_usuario: 0
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${sessionStorage.getItem('adminToken')}`
  });

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    setCargando(true);
    try {
      const response = await fetch('http://localhost:3001/api/usuarios', {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        setUsuarios(data.usuarios);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setCargando(false);
    }
  };

  const limpiarForm = () => {
    setFormData({ nombre: '', nombre_usuario: '', correo_electronico: '', contrasena: '', tipo_usuario: 0 });
    setEditando(null);
    setError('');
  };

  const abrireForm = (usuario = null) => {
    if (usuario) {
      setFormData({ ...usuario, contrasena: '' });
      setEditando(usuario.id);
    } else {
      limpiarForm();
    }
    setMostrareForm(true);
  };

  const cerrarForm = () => {
    limpiarForm();
    setMostrareForm(false);
  };

  const guardar = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.nombre.trim() || !formData.nombre_usuario.trim() || !formData.correo_electronico.trim()) {
      setError('Campos requeridos');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo_electronico)) {
      setError('Correo inválido');
      return;
    }

    if (!editando && !formData.contrasena.trim()) {
      setError('Contraseña requerida');
      return;
    }

    try {
      const url = editando
        ? `http://localhost:3001/api/admin/usuarios/${editando}`
        : 'http://localhost:3001/api/admin/usuarios';

      const body = editando && !formData.contrasena
        ? { nombre: formData.nombre, nombre_usuario: formData.nombre_usuario, correo_electronico: formData.correo_electronico, tipo_usuario: formData.tipo_usuario }
        : formData;

      const response = await fetch(url, {
        method: editando ? 'PUT' : 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(body)
      });

      if (response.ok) {
        setSuccess(editando ? 'Actualizado' : 'Creado');
        setTimeout(() => {
          cargarUsuarios();
          cerrarForm();
        }, 1000);
      } else {
        const data = await response.json();
        setError(data.error);
      }
    } catch (error) {
      setError('Error');
    }
  };

  const eliminar = async (id) => {
    if (id === 1) {
      alert('No puedes eliminar el admin principal');
      return;
    }
    if (window.confirm('Eliminar usuario?')) {
      try {
        const response = await fetch(`http://localhost:3001/api/admin/usuarios/${id}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        });
        if (response.ok) {
          cargarUsuarios();
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  if (cargando) return <p>Cargando...</p>;

  return (
    <div style={{ background: 'white', borderRadius: '16px', padding: '30px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#0057b8', margin: '0' }}>Gestionar Usuarios</h2>
        <button
          onClick={() => abrireForm()}
          style={{
            background: 'linear-gradient(135deg, #25d366 0%, #1da852 100%)',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          Agregar Usuario
        </button>
      </div>

      {error && <p style={{ color: '#c33', background: '#fee', padding: '10px', borderRadius: '6px' }}>{error}</p>}
      {success && <p style={{ color: '#3c3', background: '#efe', padding: '10px', borderRadius: '6px' }}>{success}</p>}

      {mostrareForm && (
        <div style={{ background: '#f8f9fa', border: '1px solid #d0e8f7', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
          <h3>{editando ? 'Editar' : 'Nuevo'} Usuario</h3>
          <form onSubmit={guardar} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px' }}>
            <input
              type="text"
              placeholder="Nombre"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              required
              style={{ padding: '8px', borderRadius: '6px', border: '2px solid #d0e8f7' }}
            />
            <input
              type="text"
              placeholder="Usuario"
              value={formData.nombre_usuario}
              onChange={(e) => setFormData({ ...formData, nombre_usuario: e.target.value })}
              required
              style={{ padding: '8px', borderRadius: '6px', border: '2px solid #d0e8f7' }}
            />
            <input
              type="email"
              placeholder="Correo"
              value={formData.correo_electronico}
              onChange={(e) => setFormData({ ...formData, correo_electronico: e.target.value })}
              required
              style={{ padding: '8px', borderRadius: '6px', border: '2px solid #d0e8f7' }}
            />
            <input
              type="password"
              placeholder={editando ? 'Contraseña (opcional)' : 'Contraseña'}
              value={formData.contrasena}
              onChange={(e) => setFormData({ ...formData, contrasena: e.target.value })}
              required={!editando}
              style={{ padding: '8px', borderRadius: '6px', border: '2px solid #d0e8f7' }}
            />
            <select
              value={formData.tipo_usuario}
              onChange={(e) => setFormData({ ...formData, tipo_usuario: parseInt(e.target.value) })}
              style={{ padding: '8px', borderRadius: '6px', border: '2px solid #d0e8f7' }}
            >
              <option value={0}>Usuario Normal</option>
              <option value={1}>Admin</option>
            </select>
            <div style={{ display: 'flex', gap: '10px', gridColumn: '1 / -1' }}>
              <button type="submit" style={{ flex: 1, background: '#0057b8', color: 'white', border: 'none', padding: '10px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>Guardar</button>
              <button type="button" onClick={cerrarForm} style={{ flex: 1, background: '#ccc', border: 'none', padding: '10px', borderRadius: '6px', cursor: 'pointer' }}>Cancelar</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'linear-gradient(135deg, #0057b8 0%, #0080d0 100%)', color: 'white' }}>
              <th style={{ padding: '12px', textAlign: 'left' }}>ID</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Nombre</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Usuario</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Correo</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Tipo</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id} style={{ borderBottom: '1px solid #d0e8f7' }}>
                <td style={{ padding: '12px' }}>{u.id}</td>
                <td style={{ padding: '12px' }}>{u.nombre}</td>
                <td style={{ padding: '12px' }}><strong>{u.nombre_usuario}</strong></td>
                <td style={{ padding: '12px' }}>{u.correo_electronico}</td>
                <td style={{ padding: '12px' }}>
                  <span style={{ display: 'inline-block', padding: '4px 10px', borderRadius: '20px', fontSize: '0.9rem', fontWeight: '600', backgroundColor: u.tipo_usuario === 1 ? '#dc3545' : '#0057b8', color: 'white' }}>
                    {u.tipo_usuario === 1 ? 'Admin' : 'Usuario'}
                  </span>
                </td>
                <td style={{ padding: '12px' }}>
                  <button onClick={() => abrireForm(u)} style={{ background: '#0057b8', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', marginRight: '5px', fontSize: '0.9rem' }}>Editar</button>
                  {u.id !== 1 && (
                    <button onClick={() => eliminar(u.id)} style={{ background: '#dc3545', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem' }}>Eliminar</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminUsuarios;
