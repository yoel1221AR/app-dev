const express = require('express');
const router = express.Router();
const pool = require('../db');

// Crear
router.post('/', async (req, res) => {
  const { name } = req.body;
  try {
    const result = await pool.query('INSERT INTO names(name) VALUES($1) RETURNING *', [name]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al guardar el nombre' });
  }
});

// Obtener todos
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM names');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener los nombres');
  }
});

// Eliminar
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM names WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Nombre no encontrado' });
    }
    res.json({ message: 'Nombre eliminado', deleted: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al eliminar el nombre');
  }
});

// Buscar por nombre
router.get('/search', async (req, res) => {
  const { name } = req.query;
  try {
    const result = await pool.query('SELECT * FROM names WHERE name ILIKE $1', [`%${name}%`]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al buscar nombres');
  }
});

module.exports = router;
