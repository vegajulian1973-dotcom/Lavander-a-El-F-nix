import '../App.css';
import heroImg from '../assets/ElFenixLogo.png';

function Hero() {
  return (
    <section id='hero' className='hero-section'>
      <div className='hero-content'>
        <h1>Bienvenido a Lavandería El Fénix</h1>
        <p className='hero-subtitle'>Renacemos con tu confianza | Servicios de lavandería profesional</p>
        <div className='hero-cta'>
          <a href='#servicios' className='btn-cta btn-primary'>Nuestros Servicios</a>
          <a href='#contacto' className='btn-cta btn-secondary'>Contáctanos</a>
        </div>
      </div>
      <div className='hero-image'>
        <img src={heroImg} alt='Lavanderia El Fenix' />
      </div>
    </section>
  );
}

export default Hero;