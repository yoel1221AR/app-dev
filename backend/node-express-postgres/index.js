const express = require('express');
const pool = require('./db');
require('dotenv').config();

const app = express();
const cors = require('cors'); // 👈 importar cors

app.use(cors());          

app.use(express.json());

// Ruta para guardar un name
app.post('/names', async (req, res) => {
  const { name } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO names(name) VALUES($1) RETURNING *',
      [name]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al guardar el nombre' });
  }
});

app.get('/names', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM names');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener los nombres');
  }
});

app.delete('/names/:id', async (req, res) => {
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


app.get('/names/search', async (req, res) => {
  const { name } = req.query;
  try {
    const result = await pool.query(
      'SELECT * FROM names WHERE name ILIKE $1',
      [`%${name}%`]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al buscar nombres');
  }
});




app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
});
