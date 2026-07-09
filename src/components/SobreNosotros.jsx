import '../App.css';
import Mapa from './Mapa'; // 1. Importa el componente

function SobreNosotros() {
  return (
    <section id="nosotros" className="sobre-nosotros-container">
      <h2>Sobre Nosotros</h2>
      <div className="info-grid">
        <div className="col-left">
          <div className="card map-box">
            <h3>Ubicación</h3>
            <Mapa /> {/* 2. Inserta el mapa aquí */}
            <p style={{marginTop: '10px'}}>Corregidora, Querétaro</p>
          </div>
          
          <div className="card text-box">
            <h3>Misión</h3>
            <p>Ofrecer un servicio de lavandería de alta calidad en Corregidora, Querétaro, brindando confianza y puntualidad mediante la integración de herramientas digitales que simplifiquen la experiencia del cliente.</p>
            <h3>Visión</h3>
            <p>Ser la lavandería líder y de mayor confianza en la región para el año 2029, destacando por su excelencia operativa, responsabilidad ambiental y una sólida identidad digital.</p>
            <h3>Valores</h3>
            <ul>
              <li>Confianza | Puntualidad | Calidad</li>
              <li>Innovación | Responsabilidad</li>
            </ul>
          </div>
        </div>

        <div className="col-right card">
          <h3>Horario</h3>
          <p>Lunes a Viernes: 9:00 a.m. - 8:30 p.m.<br/>Sábado: 9:00 a.m. - 4:00 p.m.</p>
          
          <h3>Nuestra Historia</h3>
          <p>Lavandería “El Fénix” nació de un desafío. Tomamos las riendas de un establecimiento que enfrentaba tiempos difíciles y problemas operativos, pero vimos en él una oportunidad de renacer. Inspirados en la leyenda del Fénix, decidimos reconstruir este negocio desde cero, superando los obstáculos iniciales con esfuerzo y dedicación.</p>
          <p>Hoy, nuestro compromiso es transformar la experiencia del cuidado de tus prendas, combinando la atención tradicional con la innovación digital para asegurar que cada cliente reciba un servicio excepcional que honre el nombre de nuestro renacer.</p>
        </div>
      </div>
    </section>
  );
}

export default SobreNosotros;