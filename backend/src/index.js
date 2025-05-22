const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const rolRoutes = require('./routes/rolRoutes');
const entidadRoutes = require('./routes/entidadRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');

//const supabase = require('./config/db'); // Importar el cliente de Supabase

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/roles',rolRoutes);
app.use('/api/entidades', entidadRoutes);
app.use('/api/usuarios', usuarioRoutes);

// Bienvenida
app.get('/', (req, res) => {
  res.send('Servidor funcionando');
});

app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});
