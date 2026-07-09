import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ListaOpiniones from '../components/ListaOpiniones';

describe('Componente ListaOpiniones', () => {
  it('debe mostrar mensaje cuando no hay opiniones', () => {
    render(<ListaOpiniones lista={[]} />);
    expect(screen.getByText(/Aún no hay opiniones/i)).toBeInTheDocument();
  });

  it('debe renderizar opiniones cuando existen', () => {
    const opiniones = [
      {
        id: 1,
        nombre: 'Juan Pérez',
        comentario: 'Excelente servicio',
        calificacion: 5,
        respuesta: null
      }
    ];
    render(<ListaOpiniones lista={opiniones} />);
    expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
    expect(screen.getByText('Excelente servicio')).toBeInTheDocument();
  });

  it('debe mostrar respuesta del admin si existe', () => {
    const opiniones = [
      {
        id: 1,
        nombre: 'Juan',
        comentario: 'Buen servicio',
        calificacion: 4,
        respuesta: 'Gracias por tu opinión'
      }
    ];
    render(<ListaOpiniones lista={opiniones} />);
    expect(screen.getByText(/Respuesta de Lavandería El Fénix/i)).toBeInTheDocument();
    expect(screen.getByText('Gracias por tu opinión')).toBeInTheDocument();
  });

  it('debe mostrar correctamente las estrellas de calificación', () => {
    const opiniones = [
      {
        id: 1,
        nombre: 'Ana',
        comentario: 'Muy bueno',
        calificacion: 3,
        respuesta: null
      }
    ];
    render(<ListaOpiniones lista={opiniones} />);
    const stars = screen.getAllByText('★');
    expect(stars).toHaveLength(3);
  });
});
