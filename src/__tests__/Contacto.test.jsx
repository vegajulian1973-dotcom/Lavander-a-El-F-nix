import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Contacto from '../components/Contacto';

describe('Componente Contacto', () => {
  it('debe renderizar el título correcto', () => {
    render(<Contacto />);
    expect(screen.getByText('¡Conócenos y contáctanos!')).toBeInTheDocument();
  });

  it('debe renderizar botones de contacto', () => {
    render(<Contacto />);
    expect(screen.getByText(/Facebook/i)).toBeInTheDocument();
    expect(screen.getByText(/WhatsApp/i)).toBeInTheDocument();
  });

  it('los links deben tener target="_blank"', () => {
    render(<Contacto />);
    const links = screen.getAllByRole('link');
    links.forEach(link => {
      expect(link).toHaveAttribute('target', '_blank');
    });
  });
});
