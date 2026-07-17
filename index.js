const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();


app.use(express.json());

app.use(cors());

// Obtener todos los préstamos
app.get('/prestamos', async (req, res) => {
    try {
        const resultado = await pool.query(
            'SELECT * FROM prestamos'
        );

        res.json(resultado.rows);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener préstamo por id
app.get('/prestamos/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const resultado = await pool.query(
            'SELECT * FROM prestamos WHERE id = $1',
            [id]
        );

        res.json(resultado.rows[0]);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Crear préstamo
app.post('/prestamos', async (req, res) => {
    try {
        const { usuario, libro, fecha_prestamo } = req.body;

        const resultado = await pool.query(
            'INSERT INTO prestamos (usuario, libro, fecha_prestamo) VALUES ($1,$2,$3) RETURNING *',
            [usuario, libro, fecha_prestamo]
        );

        res.status(201).json(resultado.rows[0]);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Actualizar préstamo
app.put('/prestamos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { usuario, libro, fecha_prestamo } = req.body;

        const resultado = await pool.query(
            'UPDATE prestamos SET usuario=$1, libro=$2, fecha_prestamo=$3 WHERE id=$4 RETURNING *',
            [usuario, libro, fecha_prestamo, id]
        );

        res.json(resultado.rows[0]);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Eliminar préstamo
app.delete('/prestamos/:id', async (req, res) => {
    try {
        const { id } = req.params;

        await pool.query(
            'DELETE FROM prestamos WHERE id=$1',
            [id]
        );

        res.json({
            mensaje: 'Préstamo eliminado correctamente'
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = 5014;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor escuchando en http://66.175.217.72:${PORT}`);
});
