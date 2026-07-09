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
import './App.css';

function App() {
  const [opiniones, setOpiniones] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  const cargarOpiniones = () => {
    fetch('http://localhost:3001/api/opiniones')
      .then(res => res.json())
      .then(data => setOpiniones(data.opiniones))
      .catch(err => console.error("Error al cargar opiniones:", err));
  };

  const logout = () => {
    sessionStorage.removeItem('adminToken');
    setIsAdmin(false);
  };

  useEffect(() => {
    const savedToken = sessionStorage.getItem('adminToken');
    if (savedToken) {
      setIsAdmin(true);
    }
    cargarOpiniones();
  }, []);

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
          
          <div className="formulario-card">
            <Formulario alEnviar={cargarOpiniones} />
          </div>

          <ListaOpiniones lista={opiniones} />
          
          {/* Panel Administrativo con seguridad básica */}
          <h2>¡Espacio solo para el admin!</h2>
          <div className="admin-box" style={{marginTop: '40px', padding: '20px', border: '1px dashed #ccc'}}>
            {!isAdmin ? (
              <Login onLogin={setIsAdmin} />
            ) : (
              <AdminPanel
                opiniones={opiniones}
                actualizarDatos={cargarOpiniones}
                onLogout={logout}
              />
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default App;