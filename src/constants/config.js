// Configuraciones constantes
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export const VALIDATION = {
  NOMBRE_MIN: 2,
  NOMBRE_MAX: 100,
  COMENTARIO_MIN: 10,
  COMENTARIO_MAX: 1000,
  CALIFICACION_MIN: 1,
  CALIFICACION_MAX: 5,
};

export const MESSAGES = {
  SUCCESS: 'Operación realizada con éxito',
  ERROR: 'Error en la operación',
  LOADING: 'Cargando...',
};
