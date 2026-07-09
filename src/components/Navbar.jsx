import '../App.css';
import { useState } from 'react';
import logo from '../assets/ElFenixLogo.png';

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleScroll = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <nav className='navbar'>
      <div className='navbar-logo'>
        <img src={logo} alt='Logo El Fenix' style={{width: '80px', height: 'auto'}} />
        <a href='#hero' onClick={(e) => { e.preventDefault(); handleScroll('hero'); }}>
          Lavandería El Fénix
        </a>
      </div>

      <button
        className='menu-toggle'
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label='Menu'
      >
        {mobileMenuOpen ? 'X' : '='}
      </button>

      <ul className={`navbar-links ${mobileMenuOpen ? 'active' : ''}`}>
        <li><a href='#servicios' onClick={(e) => { e.preventDefault(); handleScroll('servicios'); }}>Nuestros Servicios</a></li>
        <li><a href='#nosotros' onClick={(e) => { e.preventDefault(); handleScroll('nosotros'); }}>Sobre Nosotros</a></li>
        <li><a href='#contacto' onClick={(e) => { e.preventDefault(); handleScroll('contacto'); }}>Contáctanos</a></li>
        <li><a href='#resenas' onClick={(e) => { e.preventDefault(); handleScroll('resenas'); }}>Nos importa tu opinión</a></li>
      </ul>
    </nav>
  );
}

export default Navbar;
