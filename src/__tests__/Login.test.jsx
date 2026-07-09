import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../components/Login';

describe('Componente Login', () => {
  let mockOnLogin;

  beforeEach(() => {
    mockOnLogin = vi.fn();
  });

  it('debe renderizar el formulario de login', () => {
    render(<Login onLogin={mockOnLogin} />);
    expect(screen.getByText(/Acceso Admin/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/contraseña/i)).toBeInTheDocument();
  });

  it('debe mostrar error si la contraseña está vacía', async () => {
    render(<Login onLogin={mockOnLogin} />);
    const button = screen.getByText(/Ingresar/i);
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/requerida/i)).toBeInTheDocument();
    });
  });

  it('debe desabilitar el input cuando está cargando', async () => {
    global.fetch = vi.fn(() => new Promise(() => {}));

    render(<Login onLogin={mockOnLogin} />);
    const input = screen.getByPlaceholderText(/contraseña/i);
    const button = screen.getByText(/Ingresar/i);

    fireEvent.change(input, { target: { value: 'admin123' } });
    fireEvent.click(button);

    expect(input).toBeDisabled();
    expect(button).toBeDisabled();
  });
});
