import '../App.css';

function Contacto() {
  return (
    <section id="contacto" className="contacto-seccion">
      <div className="card contacto-card">
        <h2>¡Conócenos y contáctanos!</h2>
        <p>Estamos a un solo clic de distancia.</p>
        
        <div className="botones-contacto">
          <a href="https://www.facebook.com/profile.php?id=61590482877234" target="_blank" rel="noopener noreferrer" className="btn-social facebook">
            <span>f</span> Facebook
          </a>
          
          <a href="https://wa.me/524424243354" target="_blank" rel="noopener noreferrer" className="btn-social whatsapp">
            <span>💬</span> WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}

export default Contacto;