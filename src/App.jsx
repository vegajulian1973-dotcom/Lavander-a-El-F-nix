import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './components/Hero';
import Formulario from './components/Formulario';
import ListaOpiniones from './components/ListaOpiniones';
import AdminPanel from './components/AdminPanel';
import Servicios from './components/Servicios';
import SobreNosotros from './components/SobreNosotros';
import Contacto from './components/Contacto';
import Login from './components/Login';
import Registrate from './components/Registrate';
import './App.css';

function App() {
  const [opiniones, setOpiniones] = useState([]);
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [mostrareRegistro, setMostrarRegistro] = useState(false);

  const cargarOpiniones = () => {
    fetch('http://localhost:3001/api/opiniones')
      .then(res => res.json())
      .then(data => setOpiniones(data.opiniones))
      .catch(err => console.error("Error al cargar opiniones:", err));
  };

  const logout = () => {
    sessionStorage.removeItem('adminToken');
    sessionStorage.removeItem('userToken');
    localStorage.removeItem('usuario');
    setUsuarioActual(null);
  };

  const handleLogin = (usuario) => {
    setUsuarioActual(usuario);
  };

  const handleRegister = (usuario) => {
    setUsuarioActual(usuario);
  };

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    const adminToken = sessionStorage.getItem('adminToken');
    const userToken = sessionStorage.getItem('userToken');

    if (usuarioGuardado && (adminToken || userToken)) {
      const usuario = JSON.parse(usuarioGuardado);
      setUsuarioActual(usuario);
    }
    setCargando(false);
    cargarOpiniones();
  }, []);

  if (cargando) {
    return <div className="main-container"><p style={{ textAlign: 'center', marginTop: '40px' }}>Cargando...</p></div>;
  }

  // Vista del Admin
  if (usuarioActual && usuarioActual.es_admin) {
    return (
      <div className="main-container">
        <Navbar />
        <main className="content">
          <div className="admin-box" style={{ marginTop: '20px', padding: '0', border: 'none' }}>
            <AdminPanel
              opiniones={opiniones}
              actualizarDatos={cargarOpiniones}
              onLogout={logout}
            />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Vista del Usuario Normal (solo formulario)
  if (usuarioActual && !usuarioActual.es_admin) {
    return (
      <div className="main-container">
        <Navbar />
        <main className="content">
          <section id="resenas" className="seccion">
            <h2>¡Comparte tu experiencia!</h2>
            <div className="formulario-card">
              <Formulario alEnviar={cargarOpiniones} />
            </div>
            <ListaOpiniones lista={opiniones} />
            <div style={{ textAlign: 'center', marginTop: '30px' }}>
              <button onClick={logout} style={{ background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)', color: 'white', border: 'none', padding: '12px 30px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '1rem' }}>🚪 Cerrar Sesión</button>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  // Vista de inicio (sin autenticar)
  return (
    <div className="main-container">
      <Navbar />
      <main className="content">
        <Hero />
        <section id="servicios" className="seccion">
          <div className="card"><Servicios /></div>
        </section>
        <SobreNosotros />
        <Contacto />
        <section id="resenas" className="seccion">
          <h2>¡Comparte tu experiencia!</h2>
          <p style={{ textAlign: 'center', color: '#666', marginBottom: '20px' }}>Inicia sesión para comentar</p>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
            <div className="admin-box" style={{ marginTop: '0', padding: '0', border: 'none', maxWidth: '400px', width: '100%' }}>
              {!mostrareRegistro ? (
                <Login onLogin={handleLogin} onMostrarRegistro={() => setMostrarRegistro(true)} />
              ) : (
                <Registrate onRegister={handleRegister} onMostrarLogin={() => setMostrarRegistro(false)} />
              )}
            </div>
          </div>
          <ListaOpiniones lista={opiniones} />
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default App;