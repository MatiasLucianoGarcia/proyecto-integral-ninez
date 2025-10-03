const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const rolRoutes = require('./routes/rolRoutes');
const entidadRoutes = require('./routes/entidadRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const nacionalidadRoutes = require('./routes/nacionalidadRoutes');
const generoRoutes = require('./routes/generoRoutes');
const personaRoutes = require('./routes/personaRoutes');
const domicilioRoutes = require('./routes/domicilioRoutes');
const contactoRoutes = require('./routes/contactoRoutes');
const escolaridadRoutes = require('./routes/escolaridadRoutes')
const perdidaRoutes = require('./routes/perdidaRoutes')
const trabajoRoutes = require('./routes/trabajoRoutes')
const controlMedicoRoutes = require('./routes/controlMedicoRoutes')
const actividadRoutes = require('./routes/actividadRoutes')
const tipoViviendaRoutes = require('./routes/tipoViviendaRoutes')
const viviendaRoutes = require('./routes/viviendaRoutes')
const saludRoutes = require('./routes/saludRoutes')
const interesesRoutes = require('./routes/interesesRoutes')
const condicionesVidaRoutes = require('./routes/condicionesVidaRoutes')
const parentezcoRoutes = require('./routes/parentezcoRoutes')
const familiaRoutes = require('./routes/familiaRoutes')

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
app.use('/api/nacionalidades',nacionalidadRoutes);
app.use('/api/generos',generoRoutes);
app.use('/api/personas', personaRoutes);
app.use('/api/domicilios', domicilioRoutes);
app.use('/api/contactos', contactoRoutes);
app.use('/api/escolaridad',escolaridadRoutes);
app.use('/api/perdida', perdidaRoutes);
app.use('/api/trabajo', trabajoRoutes);
app.use('/api/controlMedico', controlMedicoRoutes);
app.use('/api/actividad', actividadRoutes);
app.use('/api/tipoVivienda', tipoViviendaRoutes);
app.use('/api/vivienda', viviendaRoutes);
app.use('/api/salud', saludRoutes);
app.use('/api/intereses', interesesRoutes);
app.use('/api/condicionesVida', condicionesVidaRoutes);
app.use('/api/parentezcos', parentezcoRoutes);
app.use('/api/familia', familiaRoutes);

// Bienvenida
app.get('/', (req, res) => {
  res.send('Servidor funcionando');
});

app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});
