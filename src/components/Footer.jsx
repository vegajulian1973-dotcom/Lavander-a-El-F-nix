import '../App.css';

function Footer() {
  return (
    <footer className='footer'>
      <div className='footer-content'>
        <div className='footer-section'>
          <h4>Lavandería El Fénix</h4>
          <p>Tu confianza es nuestro compromiso</p>
        </div>

        <div className='footer-section'>
          <h4>Ubicación</h4>
          <p>Corregidora, Queretaro<br/>Abierto: Lun. - Vie. 9 a.m. - 8:30 p.m.<br/>Sábado 9 a.m. - 4 p.m.</p>
        </div>

        <div className='footer-section'>
          <h4>Síguenos</h4>
          <div className='footer-socials'>
            <a href='https://www.facebook.com/profile.php?id=61590482877234' target='_blank' rel='noopener noreferrer'>
              Facebook
            </a>
            <a href='https://wa.me/524424243354' target='_blank' rel='noopener noreferrer'>
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      <div className='footer-bottom'>
        <p>Copyright 2026 Lavandería El Fénix. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;
