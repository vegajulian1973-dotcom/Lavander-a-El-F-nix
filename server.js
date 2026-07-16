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

  // Crear tabla de usuarios si no existe
  await db.exec(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      nombre_usuario TEXT UNIQUE NOT NULL,
      correo_electronico TEXT UNIQUE NOT NULL,
      contrasena TEXT NOT NULL,
      tipo_usuario INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Migrar base de datos: agregar columna correo_electronico si no existe
  try {
    await db.run("SELECT correo_electronico FROM usuarios LIMIT 1");
  } catch (error) {
    if (error.message.includes('no such column')) {
      console.log('⚠️  Migrando base de datos: agregando columna correo_electronico...');
      try {
        // Agregar columna sin restricción unique primero
        await db.run("ALTER TABLE usuarios ADD COLUMN correo_electronico TEXT");
        // Generar emails únicos para registros existentes
        const usuarios = await db.all("SELECT id FROM usuarios");
        for (const usuario of usuarios) {
          await db.run(
            "UPDATE usuarios SET correo_electronico = ? WHERE id = ?",
            [`user${usuario.id}@lavanderia.com`, usuario.id]
          );
        }
        console.log('✅ Columna correo_electronico agregada exitosamente');
      } catch (migrationError) {
        console.error('⚠️  Error en migración:', migrationError.message);
      }
    }
  }

  // Insertar usuario admin por defecto si no existe
  const adminExists = await db.get("SELECT id FROM usuarios WHERE nombre_usuario = ?", ["Admin"]);
  if (!adminExists) {
    await db.run(
      "INSERT INTO usuarios (id, nombre, nombre_usuario, correo_electronico, contrasena, tipo_usuario) VALUES (?, ?, ?, ?, ?, ?)",
      [1, "Violeta Duran", "Admin", "admin@lavanderia.com", "admin123", 1]
    );
    console.log('✅ Usuario admin creado por defecto');
  }

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

// POST /api/login - Validar usuario y contraseña
app.post('/api/login', async (req, res) => {
  const { nombre_usuario, contrasena } = req.body;

  if (!nombre_usuario || !contrasena) {
    return res.status(400).json({ error: 'Usuario y contraseña requeridos' });
  }

  try {
    // Buscar usuario en la base de datos
    const usuario = await db.get(
      "SELECT * FROM usuarios WHERE nombre_usuario = ? AND contrasena = ?",
      [nombre_usuario, contrasena]
    );

    if (!usuario) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }

    // Generar JWT
    const token = jwt.sign(
      { id: usuario.id, nombre_usuario: usuario.nombre_usuario, tipo_usuario: usuario.tipo_usuario },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Devolver información del usuario (sin la contraseña)
    res.json({
      token,
      user: {
        id: usuario.id,
        nombre: usuario.nombre,
        nombre_usuario: usuario.nombre_usuario,
        tipo_usuario: usuario.tipo_usuario,
        es_admin: usuario.tipo_usuario === 1
      },
      expiresIn: JWT_EXPIRES_IN
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// ============ RUTAS DE USUARIOS ============

// GET /api/usuarios - Obtener lista de usuarios (solo admin)
app.get('/api/usuarios', verifyAdmin, async (req, res) => {
  try {
    const usuarios = await db.all(
      "SELECT id, nombre, nombre_usuario, correo_electronico, tipo_usuario, created_at FROM usuarios ORDER BY created_at DESC"
    );
    res.json({ usuarios });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

// POST /api/registro - Registrar nuevo usuario
app.post('/api/registro', async (req, res) => {
  const { nombre, nombre_usuario, correo_electronico, contrasena } = req.body;

  if (!nombre || !nombre_usuario || !correo_electronico || !contrasena) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }

  if (nombre.trim().length < 2 || nombre.trim().length > 100) {
    return res.status(400).json({ error: 'El nombre debe tener entre 2 y 100 caracteres' });
  }

  if (nombre_usuario.trim().length < 3 || nombre_usuario.trim().length > 50) {
    return res.status(400).json({ error: 'El nombre de usuario debe tener entre 3 y 50 caracteres' });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo_electronico)) {
    return res.status(400).json({ error: 'Correo electrónico inválido' });
  }

  if (contrasena.length < 6) {
    return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
  }

  try {
    const existe = await db.get(
      "SELECT id FROM usuarios WHERE nombre_usuario = ? OR correo_electronico = ?",
      [nombre_usuario, correo_electronico]
    );

    if (existe) {
      return res.status(400).json({ error: 'El usuario o correo ya existe' });
    }

    const result = await db.run(
      "INSERT INTO usuarios (nombre, nombre_usuario, correo_electronico, contrasena, tipo_usuario) VALUES (?, ?, ?, ?, ?)",
      [nombre, nombre_usuario, correo_electronico, contrasena, 0]
    );

    const token = jwt.sign(
      { id: result.lastID, nombre_usuario, tipo_usuario: 0 },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(201).json({
      token,
      user: {
        id: result.lastID,
        nombre,
        nombre_usuario,
        correo_electronico,
        tipo_usuario: 0,
        es_admin: false
      },
      message: 'Registro exitoso'
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error en el registro' });
  }
});

// PUT /api/usuarios/:id - Actualizar tipo de usuario (solo admin)
app.put('/api/usuarios/:id', verifyAdmin, async (req, res) => {
  const { id } = req.params;
  const { tipo_usuario } = req.body;

  if (tipo_usuario === undefined || ![0, 1].includes(tipo_usuario)) {
    return res.status(400).json({ error: 'tipo_usuario inválido' });
  }

  try {
    const usuario = await db.get("SELECT id FROM usuarios WHERE id = ?", [id]);

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    await db.run(
      "UPDATE usuarios SET tipo_usuario = ? WHERE id = ?",
      [tipo_usuario, id]
    );

    res.json({ mensaje: 'Usuario actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
});

// POST /api/admin/usuarios - Crear usuario desde admin
app.post('/api/admin/usuarios', verifyAdmin, async (req, res) => {
  const { nombre, nombre_usuario, correo_electronico, contrasena, tipo_usuario } = req.body;

  if (!nombre || !nombre_usuario || !correo_electronico || !contrasena) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }

  if (nombre.trim().length < 2 || nombre.trim().length > 100) {
    return res.status(400).json({ error: 'Nombre inválido' });
  }

  if (nombre_usuario.trim().length < 3 || nombre_usuario.trim().length > 50) {
    return res.status(400).json({ error: 'Usuario inválido' });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo_electronico)) {
    return res.status(400).json({ error: 'Correo inválido' });
  }

  if (contrasena.length < 6) {
    return res.status(400).json({ error: 'Contraseña muy corta' });
  }

  try {
    const existe = await db.get(
      "SELECT id FROM usuarios WHERE nombre_usuario = ? OR correo_electronico = ?",
      [nombre_usuario, correo_electronico]
    );

    if (existe) {
      return res.status(400).json({ error: 'Usuario o correo ya existe' });
    }

    const result = await db.run(
      "INSERT INTO usuarios (nombre, nombre_usuario, correo_electronico, contrasena, tipo_usuario) VALUES (?, ?, ?, ?, ?)",
      [nombre, nombre_usuario, correo_electronico, contrasena, tipo_usuario || 0]
    );

    res.status(201).json({
      id: result.lastID,
      nombre,
      nombre_usuario,
      correo_electronico,
      tipo_usuario: tipo_usuario || 0,
      mensaje: 'Usuario creado'
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
});

// PUT /api/admin/usuarios/:id - Actualizar usuario completo
app.put('/api/admin/usuarios/:id', verifyAdmin, async (req, res) => {
  const { id } = req.params;
  const { nombre, nombre_usuario, correo_electronico, contrasena, tipo_usuario } = req.body;

  if (!nombre || !nombre_usuario || !correo_electronico) {
    return res.status(400).json({ error: 'Campos requeridos' });
  }

  try {
    const usuario = await db.get("SELECT * FROM usuarios WHERE id = ?", [id]);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const existeOtro = await db.get(
      "SELECT id FROM usuarios WHERE (nombre_usuario = ? OR correo_electronico = ?) AND id != ?",
      [nombre_usuario, correo_electronico, id]
    );

    if (existeOtro) {
      return res.status(400).json({ error: 'Usuario o correo duplicado' });
    }

    const query = contrasena
      ? "UPDATE usuarios SET nombre = ?, nombre_usuario = ?, correo_electronico = ?, contrasena = ?, tipo_usuario = ? WHERE id = ?"
      : "UPDATE usuarios SET nombre = ?, nombre_usuario = ?, correo_electronico = ?, tipo_usuario = ? WHERE id = ?";

    const params = contrasena
      ? [nombre, nombre_usuario, correo_electronico, contrasena, tipo_usuario || 0, id]
      : [nombre, nombre_usuario, correo_electronico, tipo_usuario || 0, id];

    await db.run(query, params);

    res.json({ mensaje: 'Usuario actualizado' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al actualizar' });
  }
});

// DELETE /api/admin/usuarios/:id - Eliminar usuario
app.delete('/api/admin/usuarios/:id', verifyAdmin, async (req, res) => {
  const { id } = req.params;

  if (id == 1) {
    return res.status(403).json({ error: 'No puedes eliminar el admin principal' });
  }

  try {
    const usuario = await db.get("SELECT id FROM usuarios WHERE id = ?", [id]);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    await db.run("DELETE FROM usuarios WHERE id = ?", [id]);
    res.json({ mensaje: 'Usuario eliminado' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al eliminar' });
  }
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
