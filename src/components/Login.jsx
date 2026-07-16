import { useState } from 'react'; // Importante para el enlace

function Login({ onLogin, onMostrarRegistro }) {
  const [user, setUser] = useState(''); // Nuevo estado para usuario
  const [pass, setPass] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validarFormulario = () => {
    if (!user.trim() || !pass.trim()) {
      setError('Todos los campos son obligatorios');
      return false;
    }
    setError('');
    return true;
  };

  const verificar = async (e) => {
    e.preventDefault();
    setError('');

    if (!validarFormulario()) return;

    setLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre_usuario: user, contrasena: pass })
      });

      const data = await response.json();

      if (response.ok) {
        // Guardar token en sessionStorage
        sessionStorage.setItem('adminToken', data.token);
        localStorage.setItem('usuario', JSON.stringify(data.user));
        onLogin(data.user); // Pasamos el objeto usuario completo
      } else {
        setError(data.error || 'Usuario o contraseña incorrectos');
        setPass('');
      }
    } catch (error) {
      setError('Error de conexión. Intenta más tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={verificar} className="login-card">
      <h3>🔐 Iniciar Sesión</h3>
      
      {error && (
        <p style={{ background: '#fee', border: '2px solid #f88', color: '#c33', padding: '10px', borderRadius: '6px', fontSize: '0.9rem' }}>
          ⚠️ {error}
        </p>
      )}

      <input
        type="text"
        value={user}
        onChange={(e) => setUser(e.target.value)}
        placeholder="Nombre de usuario"
        disabled={loading}
        required
      />

      <input
        type="password"
        value={pass}
        onChange={(e) => setPass(e.target.value)}
        placeholder="Contraseña"
        disabled={loading}
        required
      />

      <button type="submit" disabled={loading} style={{ opacity: loading ? 0.7 : 1 }}>
        {loading ? '⏳ Verificando...' : '🔓 Ingresar'}
      </button>

      {/* Enlace al registro */}
      <div style={{ marginTop: '15px', textAlign: 'center' }}>
        <p style={{ fontSize: '0.9rem' }}>
          ¿No tienes cuenta? <button onClick={onMostrarRegistro} style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline', fontSize: 'inherit', fontFamily: 'inherit', padding: '0' }}>Regístrate</button>
        </p>
      </div>
    </form>
  );
}

export default Login;