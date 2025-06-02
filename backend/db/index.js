const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool(); // usa las variables de entorno automáticamente

module.exports = pool;
