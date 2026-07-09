const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Abrir la base de datos
const db = new sqlite3.Database('./mi_proyecto.db');

// Crear la tabla (y añadir la columna respuesta si no existía previamente)
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS opiniones (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT,
        comentario TEXT,
        calificacion INTEGER,
        recomienda INTEGER,
        respuesta TEXT
    )`);
});

// Ruta para obtener todas las opiniones
app.get('/api/opiniones', (req, res) => {
    db.all("SELECT * FROM opiniones", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ opiniones: rows });
    });
});

// Ruta para guardar una opinión
app.post('/api/opiniones', (req, res) => {
    const { nombre, comentario, calificacion, recomienda } = req.body;
    const sql = "INSERT INTO opiniones (nombre, comentario, calificacion, recomienda) VALUES (?, ?, ?, ?)";
    db.run(sql, [nombre, comentario, calificacion, recomienda], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID });
    });
});

// Ruta para eliminar una opinión
app.delete('/api/opiniones/:id', (req, res) => {
    db.run("DELETE FROM opiniones WHERE id = ?", req.params.id, function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Eliminado con éxito" });
    });
});

// Ruta para responder una opinión
app.put('/api/opiniones/:id', (req, res) => {
    const { respuesta } = req.body;
    db.run("UPDATE opiniones SET respuesta = ? WHERE id = ?", [respuesta, req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Respuesta guardada" });
    });
});

app.listen(3001, () => console.log("Servidor corriendo en http://localhost:3001"));