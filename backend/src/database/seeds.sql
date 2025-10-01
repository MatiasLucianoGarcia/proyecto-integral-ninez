-- ESTA PARTE ES PARA LOGUEARSE

-- Crear tabla Entidad
CREATE TABLE IF NOT EXISTS Entidad (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(50),
  servicio_local BOOLEAN,
  descripcion TEXT
);

-- Crear tabla Rol
CREATE TABLE IF NOT EXISTS Rol (
  id SERIAL PRIMARY KEY,
  nombre_rol VARCHAR(50) NOT NULL
);

-- Crear tabla Usuarios
CREATE TABLE IF NOT EXISTS Usuario (
  id SERIAL PRIMARY KEY,
  id_entidad INTEGER REFERENCES Entidad(id),
  nombre VARCHAR(50),
  contraseña VARCHAR(255),
  id_rol INTEGER REFERENCES Rol(id)
);

-- RELACIONES QUE PERSONA NECESITA

-- Crear Tabla Nacionalidad
CREATE TABLE IF NOT EXISTS Nacionalidad(
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(50)
);

-- Crear Tabla Genero
CREATE TABLE IF NOT EXISTS Genero(  
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(50)
);

-- PERSONA

-- Crear tabla Persona
CREATE TABLE IF NOT EXISTS Persona (
  dni INTEGER PRIMARY KEY,
  nombre VARCHAR(100),
  apellido VARCHAR(100),
  fecha_nacimiento DATE,
  id_genero INTEGER REFERENCES Genero(id),
  id_nacionalidad INTEGER REFERENCES Nacionalidad(id)
);


-- TABLAS QUE NECESITAN A PERSONA

-- Crear tabla Tipo_Vivienda (PROPIA/ALQUILADA/PRESTADA/USURPADA)
CREATE TABLE IF NOT EXISTS Tipo_vivienda (
  id SERIAL PRIMARY KEY,
  tipo VARCHAR(50) NOT NULL UNIQUE
);

-- Crear tabla Vivienda
CREATE TABLE IF NOT EXISTS Vivienda (
  id SERIAL PRIMARY KEY,
  dni INTEGER REFERENCES Persona(dni),
  tipo_vivienda INTEGER REFERENCES Tipo_Vivienda(id),
  observaciones TEXT,
  fecha_carga TIMESTAMP DEFAULT NOW()
);

-- Crear tabla Condiciones_vida
CREATE TABLE IF NOT EXISTS Condiciones_vida(
  id SERIAL PRIMARY KEY,
  dni INTEGER REFERENCES Persona(dni),
  acceso_luz BOOLEAN,
  acceso_gas BOOLEAN,
  acceso_agua BOOLEAN,
  acceso_internet BOOLEAN,
  alimentos_propios BOOLEAN,
  fecha_carga TIMESTAMP DEFAULT NOW()
);

-- Crear Tabla Parentezco
CREATE TABLE IF NOT EXISTS Parentezco(
  id SERIAL PRIMARY KEY,
  descripcion VARCHAR(50)
);

-- Crear Tabla Familia
CREATE TABLE IF NOT EXISTS Familia(
  id SERIAL PRIMARY KEY,
  dni_p1 INTEGER REFERENCES Persona(dni),
  dni_p2 INTEGER REFERENCES Persona(dni),
  id_parentezco INTEGER REFERENCES Parentezco(id),
  observaciones TEXT
);

-- Crear Tabla Contacto
CREATE TABLE IF NOT EXISTS Contacto(
  id SERIAL PRIMARY KEY,
  dni INTEGER REFERENCES Persona(dni),
  telefono VARCHAR(50),
  fecha_carga TIMESTAMP DEFAULT NOW()
);

-- Crear Tabla Domicilio
CREATE TABLE IF NOT EXISTS Domicilio(
  id SERIAL PRIMARY KEY,
  dni INTEGER REFERENCES Persona(dni),
  nombre VARCHAR(100),
  numero INTEGER,
  fecha_carga TIMESTAMP DEFAULT NOW()
);

-- Crear Tabla Trabajo
CREATE TABLE IF NOT EXISTS Trabajo(
  id SERIAL PRIMARY KEY,
  dni INTEGER REFERENCES Persona(dni),
  descripcion TEXT,
  horario TEXT,
  fecha_carga TIMESTAMP DEFAULT NOW()
);

-- Crear Tabla Escolaridad
CREATE TABLE IF NOT EXISTS Escolaridad(
  id SERIAL PRIMARY KEY,
  dni INTEGER REFERENCES Persona(dni),
  escuela VARCHAR(100),
  nivel VARCHAR(50),
  año VARCHAR(50),
  fecha_carga TIMESTAMP DEFAULT NOW()
);

-- Crear Tabla Salud
-- 1 solo registro
CREATE TABLE IF NOT EXISTS Salud(
  id SERIAL PRIMARY KEY,
  dni INTEGER REFERENCES Persona(dni),
  nombre VARCHAR(100),
  enfermedad_cronica TEXT,
  tratamiento_prolongado TEXT,
  discapacidad TEXT,
  adicciones TEXT,
  fecha_carga TIMESTAMP DEFAULT NOW()
);

-- Crear Tabla Control_medico
CREATE TABLE IF NOT EXISTS Control_medico(
  id SERIAL PRIMARY KEY,
  dni INTEGER REFERENCES Persona(dni),
  unidad_sanitaria VARCHAR(100),
  observaciones TEXT,
  fecha_carga TIMESTAMP DEFAULT NOW()
);

-- Crear Tabla Actividades
CREATE TABLE IF NOT EXISTS Actividades(
  id SERIAL PRIMARY KEY,
  dni INTEGER REFERENCES Persona(dni),
  actividad VARCHAR(100),
  horario VARCHAR(255),
  observaciones TEXT,
  fecha_carga TIMESTAMP DEFAULT NOW()
);

-- Crear Tabla Intereses
-- 1 solo registro
CREATE TABLE IF NOT EXISTS Intereses(
  id SERIAL PRIMARY KEY,
  dni INTEGER REFERENCES Persona(dni),
  gustos TEXT,
  vinculos_significativos TEXT,
  datos_desarrollo TEXT,
  fecha_carga TIMESTAMP DEFAULT NOW()
);

-- Crear Tabla Perdidas
CREATE TABLE IF NOT EXISTS Perdidas(
  id SERIAL PRIMARY KEY,
  dni INTEGER REFERENCES Persona(dni),
  descripcion TEXT,
  fecha_carga TIMESTAMP DEFAULT NOW()
);

-- Crear Tabla Efector
CREATE TABLE IF NOT EXISTS Efector(
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100)
);

-- Crear Tabla Efectores_previos
CREATE TABLE IF NOT EXISTS Efectores_previos(
  id SERIAL PRIMARY KEY,
  dni INTEGER REFERENCES Persona(dni),
  id_efector INTEGER REFERENCES Efector(id),
  observaciones TEXT,
  fecha_carga TIMESTAMP DEFAULT NOW()
);

-- Crear Tabla Efectores_posteriores
CREATE TABLE IF NOT EXISTS Efectores_posteriores(
  id SERIAL PRIMARY KEY,
  dni INTEGER REFERENCES Persona(dni),
  id_efector INTEGER REFERENCES Efector(id),
  observaciones TEXT,
  fecha_carga TIMESTAMP DEFAULT NOW()
);

-- Crear Tabla Derecho 
CREATE TABLE IF NOT EXISTS Derecho(
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100)
);

-- Crear Tabla Servicio
CREATE TABLE IF NOT EXISTS Servicio(
  id SERIAL PRIMARY KEY,
  id_equipo INTEGER REFERENCES Entidad(id),
  fecha_ingreso DATE,
  motivo TEXT,
  id_efector INTEGER REFERENCES Efector(id),
  derecho_vulnerado INTEGER REFERENCES derecho(id),
  fecha_carga TIMESTAMP DEFAULT NOW()
);

-- Crear Tabla Historial
CREATE TABLE IF NOT EXISTS Historial(
  id SERIAL PRIMARY KEY,
  dni INTEGER REFERENCES Persona(dni),
  intervencion TEXT,
  resultado TEXT,
  fecha_carga TIMESTAMP DEFAULT NOW()
);

-- Crear Tabla
/* CREATE TABLE IF NOT EXISTS (
  id SERIAL PRIMARY KEY,
  dni INTEGER REFERENCES Persona(dni),
) */

