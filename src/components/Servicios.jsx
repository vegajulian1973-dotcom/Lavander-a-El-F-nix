import React, { useState, useEffect } from 'react';
import '../App.css';
import RopaKilo from '../assets/RopaKilo.jpg';
import EdredonesBlancos from '../assets/EdredonesBlancos.jpg';
import Planchado from '../assets/Planchado.jpg';
import Tintoreria from '../assets/Tintorería.jpg';
import LavadoTenis from '../assets/LavadoTenis.jpg';
import AbrigosChamarras from '../assets/AbrigosChamarras.jpg';

const serviciosData = [
  {
    id: 1,
    titulo: "Lavado por Kilo",
    descripcion: "Tu ropa del diario limpia, seca y doblada. ¡Lista para guardar!",
    imagen: RopaKilo
  },
  {
    id: 2,
    titulo: "Edredones y Blancos",
    descripcion: "Lavado profundo para edredones, colchas y almohadas de todos los tamaños.",
    imagen: EdredonesBlancos
  },
  {
    id: 3,
    titulo: "Planchado Profesional",
    descripcion: "Impecable y sin arrugas. Servicio por pieza, media docena o docena.",
    imagen: Planchado
  },
  {
    id: 4,
    titulo: "Tintorería Especializada",
    descripcion: "Cuidado experto para camisas, blusas y prendas de uso formal.",
    imagen: Tintoreria
  },
  {
    id: 5,
    titulo: "Lavado de Tenis",
    descripcion: "Renovamos tu calzado favorito con limpieza profunda y detallada.",
    imagen: LavadoTenis
  },
  {
    id: 6,
    titulo: "Abrigos y Chamarras",
    descripcion: "Especialistas en prendas de pluma, piel, gamuza y materiales delicados.",
    imagen: AbrigosChamarras
  }
];

function Servicios() {
  const [indice, setIndice] = useState(0);

  useEffect(() => {
    const intervalo = setInterval(() => {
      siguiente();
    }, 4000);
    return () => clearInterval(intervalo);
  }, [indice]);

  const siguiente = () => {
    setIndice((indice + 1) % serviciosData.length);
  };

  const anterior = () => {
    setIndice((indice - 1 + serviciosData.length) % serviciosData.length);
  };

  return (
    <div className="servicios-section-wrapper">
      <h2>Nuestros Servicios</h2> {/* Título agregado aquí */}
      
      <div className="carousel-container">
        <button className="btn-flecha left" onClick={anterior} aria-label="Anterior">❮</button>
        
        <div className="carousel-slide">
          <img src={serviciosData[indice].imagen} alt={serviciosData[indice].titulo} />
          <div className="carousel-info">
            <h3>{serviciosData[indice].titulo}</h3>
            <p>{serviciosData[indice].descripcion}</p>
          </div>
        </div>

        <button className="btn-flecha right" onClick={siguiente} aria-label="Siguiente">❯</button>

        <div className="carousel-dots">
          {serviciosData.map((_, i) => (
            <span 
              key={i} 
              className={`dot ${i === indice ? 'active' : ''}`}
              onClick={() => setIndice(i)}
            ></span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Servicios;