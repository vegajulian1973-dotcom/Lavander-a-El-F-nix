import { useState } from 'react';

function Registrate({ onRegister, onMostrarLogin }) {
  const [nombre, setNombre] = useState('');
  const [user, setUser] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const validarFormulario = () => {
    if (!nombre.trim() || !user.trim() || !email.trim() || !pass.trim() || !confirmPass.trim()) {
      setError('Todos los campos son obligatorios');
      return false;
    }
    if (nombre.trim().length < 2) {
      setError('El nombre debe tener al menos 2 caracteres');
      return false;
    }
    if (user.trim().length < 3) {
      setError('El nombre de usuario debe tener al menos 3 caracteres');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Correo electrónico inválido');
      return false;
    }
    if (pass.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }
    if (pass !== confirmPass) {
      setError('Las contraseñas no coinciden');
      return false;
    }
    setError('');
    return true;
  };

  const registrar = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validarFormulario()) return;

    setLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: nombre.trim(),
          nombre_usuario: user.trim(),
          correo_electronico: email.trim(),
          contrasena: pass
        })
      });

      const data = await response.json();

      if (response.ok) {
        sessionStorage.setItem('userToken', data.token);
        localStorage.setItem('usuario', JSON.stringify(data.user));
        setSuccess('Registro exitoso!');
        setTimeout(() => {
          onRegister(data.user);
        }, 1500);
      } else {
        setError(data.error || 'Error en el registro');
      }
    } catch (error) {
      setError('Error de conexión. Intenta más tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={registrar} className="login-card">
      <h3>Crear Cuenta</h3>

      {error && (
        <p style={{ background: '#fee', border: '2px solid #f88', color: '#c33', padding: '10px', borderRadius: '6px', fontSize: '0.9rem', margin: '0' }}>
          {error}
        </p>
      )}

      {success && (
        <p style={{ background: '#efe', border: '2px solid #8f8', color: '#3c3', padding: '10px', borderRadius: '6px', fontSize: '0.9rem', margin: '0' }}>
          {success}
        </p>
      )}

      <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Tu nombre completo" disabled={loading} required />
      <input type="text" value={user} onChange={(e) => setUser(e.target.value)} placeholder="Nombre de usuario" disabled={loading} required />
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Correo electrónico" disabled={loading} required />
      <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="Contraseña (mín. 6 caracteres)" disabled={loading} required />
      <input type="password" value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} placeholder="Confirmar contraseña" disabled={loading} required />

      <button type="submit" disabled={loading} style={{ opacity: loading ? 0.7 : 1 }}>
        {loading ? 'Registrando...' : 'Registrarse'}
      </button>

      <div style={{ marginTop: '15px', textAlign: 'center' }}>
        <p style={{ fontSize: '0.9rem', margin: '0' }}>
          ¿Ya tienes cuenta? <button onClick={onMostrarLogin} style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline', fontSize: 'inherit', fontFamily: 'inherit', padding: '0' }}>Inicia sesión</button>
        </p>
      </div>
    </form>
  );
}

export default Registrate;