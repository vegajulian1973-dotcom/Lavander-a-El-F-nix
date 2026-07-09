import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

// Cargar variables de entorno
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Configuración
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const JWT_SECRET = process.env.JWT_SECRET || 'clave-secreta-por-defecto-cambiar-en-produccion';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
const DB_FILE = process.env.DATABASE_FILE || path.join(__dirname, 'lavanderia.db');

// Middleware de seguridad
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // límite de 100 requests por ventana
  message: 'Demasiadas solicitudes, intenta más tarde',
  standardHeaders: true,
  legacyHeaders: false,
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 intentos de login
  message: 'Demasiados intentos de login, intenta más tarde',
  skipSuccessfulRequests: true, // no cuenta los logins exitosos
});

app.use('/api/', limiter);
app.use('/api/admin/login', loginLimiter);

// Base de datos
let db;

async function initDB() {
  db = await open({
    filename: DB_FILE,
    driver: sqlite3.Database
  });

  // Crear tabla de opiniones si no existe
  await db.exec(`
    CREATE TABLE IF NOT EXISTS opiniones (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      comentario TEXT NOT NULL,
      calificacion INTEGER NOT NULL,
      recomienda TEXT NOT NULL,
      respuesta TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('✅ Base de datos conectada');
}

// Middleware de autenticación con JWT
const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No autorizado: token requerido' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};

// ============ RUTAS DE AUTENTICACIÓN ============

// POST /api/admin/login - Validar contraseña y generar JWT
app.post('/api/admin/login', async (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: 'Contraseña requerida' });
  }

  // Validar contraseña
  if (password === ADMIN_PASSWORD) {
    try {
      // Generar JWT
      const token = jwt.sign(
        { role: 'admin', timestamp: Date.now() },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );
      return res.json({ token, expiresIn: JWT_EXPIRES_IN });
    } catch (error) {
      console.error('Error al generar token:', error);
      return res.status(500).json({ error: 'Error al generar token' });
    }
  }

  // Contraseña incorrecta
  res.status(401).json({ error: 'Contraseña incorrecta' });
});

// ============ RUTAS DE OPINIONES ============

// GET /api/opiniones - Obtener todas las opiniones
app.get('/api/opiniones', async (req, res) => {
  try {
    const opiniones = await db.all(
      'SELECT * FROM opiniones ORDER BY created_at DESC'
    );
    res.json({ opiniones });
  } catch (error) {
    console.error('Error al obtener opiniones:', error);
    res.status(500).json({ error: 'Error al obtener opiniones' });
  }
});

// POST /api/opiniones - Crear nueva opinión
app.post('/api/opiniones', async (req, res) => {
  const { nombre, comentario, calificacion, recomienda } = req.body;

  // Validación
  if (!nombre || !comentario || !calificacion || !recomienda) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }

  if (typeof nombre !== 'string' || nombre.trim().length < 2 || nombre.trim().length > 100) {
    return res.status(400).json({ error: 'El nombre debe tener entre 2 y 100 caracteres' });
  }

  if (typeof comentario !== 'string' || comentario.trim().length < 10 || comentario.trim().length > 1000) {
    return res.status(400).json({ error: 'El comentario debe tener entre 10 y 1000 caracteres' });
  }

  if (!Number.isInteger(calificacion) || calificacion < 1 || calificacion > 5) {
    return res.status(400).json({ error: 'Calificación debe estar entre 1 y 5' });
  }

  if (!['Si', 'No'].includes(recomienda)) {
    return res.status(400).json({ error: 'Campo recomienda inválido' });
  }

  try {
    const result = await db.run(
      'INSERT INTO opiniones (nombre, comentario, calificacion, recomienda) VALUES (?, ?, ?, ?)',
      [nombre, comentario, calificacion, recomienda]
    );

    res.status(201).json({
      id: result.lastID,
      mensaje: 'Opinión creada exitosamente'
    });
  } catch (error) {
    console.error('Error al crear opinión:', error);
    res.status(500).json({ error: 'Error al crear opinión' });
  }
});

// PUT /api/opiniones/:id - Responder opinión (solo admin)
app.put('/api/opiniones/:id', verifyAdmin, async (req, res) => {
  const { id } = req.params;
  const { respuesta } = req.body;

  if (!respuesta) {
    return res.status(400).json({ error: 'Respuesta requerida' });
  }

  try {
    const opinion = await db.get('SELECT id FROM opiniones WHERE id = ?', [id]);

    if (!opinion) {
      return res.status(404).json({ error: 'Opinión no encontrada' });
    }

    await db.run(
      'UPDATE opiniones SET respuesta = ? WHERE id = ?',
      [respuesta, id]
    );

    res.json({ mensaje: 'Opinión actualizada exitosamente' });
  } catch (error) {
    console.error('Error al actualizar opinión:', error);
    res.status(500).json({ error: 'Error al actualizar opinión' });
  }
});

// DELETE /api/opiniones/:id - Eliminar opinión (solo admin)
app.delete('/api/opiniones/:id', verifyAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const opinion = await db.get('SELECT id FROM opiniones WHERE id = ?', [id]);

    if (!opinion) {
      return res.status(404).json({ error: 'Opinión no encontrada' });
    }

    await db.run('DELETE FROM opiniones WHERE id = ?', [id]);

    res.json({ mensaje: 'Opinión eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar opinión:', error);
    res.status(500).json({ error: 'Error al eliminar opinión' });
  }
});

// ============ MANEJO DE ERRORES ============

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// ============ INICIO DEL SERVIDOR ============

async function start() {
  try {
    await initDB();
    app.listen(PORT, () => {
      console.log(`\n🚀 Servidor backend ejecutándose en http://localhost:${PORT}`);
      console.log(`📊 Base de datos: ${DB_FILE}`);
      console.log(`🔐 Ambiente: ${process.env.NODE_ENV || 'development'}`);
      console.log('\n⚠️  Asegúrate de tener las variables de entorno configuradas\n');
    });
  } catch (error) {
    console.error('❌ Error al iniciar servidor:', error);
    process.exit(1);
  }
}

start();
