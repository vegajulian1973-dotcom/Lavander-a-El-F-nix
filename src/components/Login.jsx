import { useState } from 'react';

function Login({ onLogin }) {
  const [pass, setPass] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validarPassword = () => {
    if (!pass.trim()) {
      setError('La contraseña es requerida');
      return false;
    }
    if (pass.length < 3) {
      setError('La contraseña debe tener al menos 3 caracteres');
      return false;
    }
    setError('');
    return true;
  };

  const verificar = async (e) => {
    e.preventDefault();
    setError('');

    if (!validarPassword()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pass })
      });

      if (response.ok) {
        const data = await response.json();
        // Guardar token JWT en sesión
        sessionStorage.setItem('adminToken', data.token);
        onLogin(true);
      } else {
        const dataError = await response.json();
        setError(dataError.error || 'Contraseña incorrecta');
        setPass('');
      }
    } catch (error) {
      setError('Error de conexión. Por favor, intenta más tarde.');
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={verificar} className="login-card">
      <h3>🔐 Acceso Admin</h3>
      {error && (
        <p style={{
          background: '#fee',
          border: '2px solid #f88',
          color: '#c33',
          padding: '10px',
          borderRadius: '6px',
          fontSize: '0.9rem',
          margin: 0,
          animation: 'fadeInDown 0.3s ease-out'
        }}>
          ⚠️ {error}
        </p>
      )}
      <input
        type="password"
        value={pass}
        onChange={(e) => setPass(e.target.value)}
        placeholder="Ingresa la contraseña"
        disabled={loading}
        required
        style={{ animation: 'fadeInUp 0.4s ease-out' }}
      />
      <button
        type="submit"
        disabled={loading}
        style={{
          animation: 'scaleIn 0.4s ease-out',
          opacity: loading ? 0.7 : 1,
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? '⏳ Verificando...' : '🔓 Ingresar'}
      </button>
    </form>
  );
}
export default Login;