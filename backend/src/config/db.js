const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Crear el cliente de Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,      // URL de tu proyecto en Supabase
  process.env.SUPABASE_ANON_KEY  // Anon Key de tu proyecto en Supabase
);

// Exportar el cliente para usarlo en otras partes de la aplicación
module.exports = supabase;
