const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Abrir la base de datos
const db = new sqlite3.Database('./mi_proyecto.db');

// Crear tablas e inicializar datos
db.serialize(() => {
    // 1. Tabla de opiniones
    db.run(`CREATE TABLE IF NOT EXISTS opiniones (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT,
        comentario TEXT,
        calificacion INTEGER,
        recomienda INTEGER,
        respuesta TEXT
    )`);

    // 2. Tabla de usuarios
    db.run(`CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        nombre_usuario TEXT UNIQUE NOT NULL,
        correo_electronico TEXT UNIQUE NOT NULL,
        contrasena TEXT NOT NULL,
        es_admin INTEGER DEFAULT 0
    )`);

    // 3. Insertar el administrador por defecto (id 1)
    db.run(`INSERT OR IGNORE INTO usuarios (id, nombre, nombre_usuario, correo_electronico, contrasena, es_admin)
            VALUES (1, 'Violeta Duran', 'Admin', 'admin@sistema.com', 'admin123', 1)`);
});

// --- Rutas de Opiniones ---

// Obtener todas las opiniones
app.get('/api/opiniones', (req, res) => {
    db.all("SELECT * FROM opiniones", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ opiniones: rows });
    });
});

// Guardar una opinión
app.post('/api/opiniones', (req, res) => {
    const { nombre, comentario, calificacion, recomienda } = req.body;
    const sql = "INSERT INTO opiniones (nombre, comentario, calificacion, recomienda) VALUES (?, ?, ?, ?)";
    db.run(sql, [nombre, comentario, calificacion, recomienda], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID });
    });
});

// Eliminar una opinión
app.delete('/api/opiniones/:id', (req, res) => {
    db.run("DELETE FROM opiniones WHERE id = ?", req.params.id, function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Eliminado con éxito" });
    });
});

// Responder una opinión
app.put('/api/opiniones/:id', (req, res) => {
    const { respuesta } = req.body;
    db.run("UPDATE opiniones SET respuesta = ? WHERE id = ?", [respuesta, req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Respuesta guardada" });
    });
});

// Iniciar servidor
app.listen(3001, () => console.log("Servidor corriendo en http://localhost:3001"));