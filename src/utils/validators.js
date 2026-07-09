// Funciones de validación reutilizables
import { VALIDATION } from '../constants/config.js';

export const validateName = (name) => {
  if (!name?.trim()) return 'El nombre es requerido';
  if (name.length < VALIDATION.NOMBRE_MIN)
    return `El nombre debe tener al menos ${VALIDATION.NOMBRE_MIN} caracteres`;
  if (name.length > VALIDATION.NOMBRE_MAX)
    return `El nombre no puede exceder ${VALIDATION.NOMBRE_MAX} caracteres`;
  return null;
};

export const validateComment = (comment) => {
  if (!comment?.trim()) return 'El comentario es requerido';
  if (comment.length < VALIDATION.COMENTARIO_MIN)
    return `El comentario debe tener al menos ${VALIDATION.COMENTARIO_MIN} caracteres`;
  if (comment.length > VALIDATION.COMENTARIO_MAX)
    return `El comentario no puede exceder ${VALIDATION.COMENTARIO_MAX} caracteres`;
  return null;
};

export const validateRating = (rating) => {
  if (!rating || rating < VALIDATION.CALIFICACION_MIN || rating > VALIDATION.CALIFICACION_MAX)
    return `La calificación debe estar entre ${VALIDATION.CALIFICACION_MIN} y ${VALIDATION.CALIFICACION_MAX}`;
  return null;
};
