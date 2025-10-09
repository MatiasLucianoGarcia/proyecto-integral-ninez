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
  id_entidad INTEGER REFERENCES Entidad(id) ON DELETE CASCADE,
  nombre VARCHAR(50),
  contraseña VARCHAR(255),
  id_rol INTEGER REFERENCES Rol(id) ON DELETE CASCADE
);

-- RELACIONES QUE PERSONA NECESITA AL SER CREADA

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

CREATE TABLE IF NOT EXISTS Persona (
  dni INTEGER PRIMARY KEY,
  nombre VARCHAR(100),
  apellido VARCHAR(100),
  fecha_nacimiento DATE,
  id_genero INTEGER REFERENCES Genero(id) ON DELETE CASCADE,
  id_nacionalidad INTEGER REFERENCES Nacionalidad(id) ON DELETE CASCADE
);

-- DATOS EXTRA DE CADA PERSONA

-- vivienda va a usar a tipo de vivienda
CREATE TABLE IF NOT EXISTS Tipo_vivienda (
  id SERIAL PRIMARY KEY,
  tipo VARCHAR(50) NOT NULL UNIQUE
);

-- Varios registros de Vivienda por persona
-- Hay un endpoint que muestra el ultimo cargado
CREATE TABLE IF NOT EXISTS Vivienda (
  id SERIAL PRIMARY KEY,
  dni INTEGER REFERENCES Persona(dni) ON DELETE CASCADE,
  tipo_vivienda INTEGER REFERENCES Tipo_vivienda(id) ON DELETE CASCADE,
  observaciones TEXT,
  fecha_carga TIMESTAMP DEFAULT NOW()
);

-- Hay un solo registro de condiciones de vida por persona
CREATE TABLE IF NOT EXISTS Condiciones_vida(
  id SERIAL PRIMARY KEY,
  dni INTEGER REFERENCES Persona(dni) ON DELETE CASCADE,
  acceso_luz BOOLEAN,
  acceso_gas BOOLEAN,
  acceso_agua BOOLEAN,
  acceso_internet BOOLEAN,
  alimentos_propios BOOLEAN,
  fecha_carga TIMESTAMP DEFAULT NOW()
);

-- Familia va a usar a la tabla parentezco
CREATE TABLE IF NOT EXISTS Parentezco(
  id SERIAL PRIMARY KEY,
  descripcion VARCHAR(50)
);

-- Dos personas se vinculan como familia
-- No importa si hijo es dni1 y padre dni2 o viceversa (eso para cada parentezco) lo resuelve el endpoint
-- Hay un endpoint para pedir que te sugiera posibles parentezcos (familia de tu familia que no tenes como familia)
CREATE TABLE IF NOT EXISTS Familia (
  id SERIAL PRIMARY KEY,
  dni_p1 INTEGER REFERENCES Persona(dni) ON DELETE CASCADE,
  dni_p2 INTEGER REFERENCES Persona(dni) ON DELETE CASCADE,
  id_parentezco1 INTEGER REFERENCES Parentezco(id) ON DELETE CASCADE,
  id_parentezco2 INTEGER REFERENCES Parentezco(id) ON DELETE CASCADE,
  observaciones TEXT
);

-- Varios registros de contacto por persona
-- Hay un endpoint que muestra el ultimo cargado
CREATE TABLE IF NOT EXISTS Contacto(
  id SERIAL PRIMARY KEY,
  dni INTEGER REFERENCES Persona(dni) ON DELETE CASCADE,
  telefono VARCHAR(50),
  fecha_carga TIMESTAMP DEFAULT NOW()
);

-- Varios registros de domicilio por persona
-- Hay un endpoint que muestra el ultimo cargado
CREATE TABLE IF NOT EXISTS Domicilio(
  id SERIAL PRIMARY KEY,
  dni INTEGER REFERENCES Persona(dni) ON DELETE CASCADE,
  nombre VARCHAR(100),
  numero INTEGER,
  fecha_carga TIMESTAMP DEFAULT NOW()
);

-- Varios registros de trabajo por persona
-- Hay un endpoint que muestra el ultimo cargado
CREATE TABLE IF NOT EXISTS Trabajo(
  id SERIAL PRIMARY KEY,
  dni INTEGER REFERENCES Persona(dni) ON DELETE CASCADE,
  descripcion TEXT,
  horario TEXT,
  fecha_carga TIMESTAMP DEFAULT NOW()
);

-- Varios registros de Escolaridad por persona
-- Hay un endpoint que muestra el ultimo cargado
CREATE TABLE IF NOT EXISTS Escolaridad(
  id SERIAL PRIMARY KEY,
  dni INTEGER REFERENCES Persona(dni) ON DELETE CASCADE,
  escuela VARCHAR(100),
  nivel VARCHAR(50),
  año VARCHAR(50),
  fecha_carga TIMESTAMP DEFAULT NOW()
);

-- Hay un solo registro de Salud por persona
CREATE TABLE IF NOT EXISTS Salud(
  id SERIAL PRIMARY KEY,
  dni INTEGER REFERENCES Persona(dni) ON DELETE CASCADE,
  nombre VARCHAR(100),
  enfermedad_cronica TEXT,
  tratamiento_prolongado TEXT,
  discapacidad TEXT,
  adicciones TEXT,
  fecha_carga TIMESTAMP DEFAULT NOW()
);

-- Varios registros de Control medico por persona
-- Hay un endpoint que muestra el ultimo cargado
CREATE TABLE IF NOT EXISTS Control_medico(
  id SERIAL PRIMARY KEY,
  dni INTEGER REFERENCES Persona(dni) ON DELETE CASCADE,
  unidad_sanitaria VARCHAR(100),
  observaciones TEXT,
  fecha_carga TIMESTAMP DEFAULT NOW()
);

-- Varios registros de Control medico por persona
-- Hay un endpoint que muestra el ultimo cargado
CREATE TABLE IF NOT EXISTS Actividades(
  id SERIAL PRIMARY KEY,
  dni INTEGER REFERENCES Persona(dni) ON DELETE CASCADE,
  actividad VARCHAR(100),
  horario VARCHAR(255),
  observaciones TEXT,
  fecha_carga TIMESTAMP DEFAULT NOW()
);

-- Hay un solo registro de Salud por persona
CREATE TABLE IF NOT EXISTS Intereses(
  id SERIAL PRIMARY KEY,
  dni INTEGER REFERENCES Persona(dni) ON DELETE CASCADE,
  gustos TEXT,
  vinculos_significativos TEXT,
  datos_desarrollo TEXT,
  fecha_carga TIMESTAMP DEFAULT NOW()
);

-- Varios registros de Perdidas por persona
-- Hay un endpoint que muestra el ultimo cargado
CREATE TABLE IF NOT EXISTS Perdidas(
  id SERIAL PRIMARY KEY,
  dni INTEGER REFERENCES Persona(dni) ON DELETE CASCADE,
  descripcion TEXT,
  fecha_carga TIMESTAMP DEFAULT NOW()
);

-------------------------------------------------

CREATE TABLE IF NOT EXISTS Programa (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT
);

CREATE TABLE IF NOT EXISTS Efector (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  area VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS Equipo_local (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS Derecho_vulnerado (
  id SERIAL PRIMARY KEY,
  descripcion VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS Servicio_local (
  id SERIAL PRIMARY KEY,
  dni INTEGER REFERENCES Persona(dni) ON DELETE CASCADE,
  id_equipo INTEGER REFERENCES Equipo_local(id) ON DELETE SET NULL,
  fecha_ingreso DATE NOT NULL,
  motivo_ingreso TEXT,
  id_efector INTEGER REFERENCES Efector(id) ON DELETE SET NULL,
  id_derecho INTEGER REFERENCES Derecho_vulnerado(id) ON DELETE SET NULL,
  fecha_carga TIMESTAMP DEFAULT NOW()
);

-- Historial parte 1 -> muestra la carga y modificacion de datos de las personas
CREATE TABLE IF NOT EXISTS Historial(
  id SERIAL PRIMARY KEY,
  dni INTEGER REFERENCES Persona(dni) ON DELETE CASCADE,
  intervencion TEXT,
  resultado TEXT,
  fecha_carga TIMESTAMP DEFAULT NOW()
);

-- Historial parte 2 -> muestra el ingreso de la persona a programas
CREATE TABLE IF NOT EXISTS Ingreso_programa (
  id SERIAL PRIMARY KEY,
  dni INTEGER REFERENCES Persona(dni) ON DELETE CASCADE,
  id_programa INTEGER REFERENCES Programa(id) ON DELETE CASCADE,
  id_efector INTEGER REFERENCES Efector(id) ON DELETE SET NULL,
  dni_familiar INTEGER REFERENCES Persona(dni) ON DELETE SET NULL,
  fecha_ingreso DATE NOT NULL,
  fecha_carga TIMESTAMP DEFAULT NOW(),
  observaciones TEXT
);

-- Historial parte 3 -> muestra la hoja de ruta de un NNA que entro en servicio local
CREATE TABLE IF NOT EXISTS Hoja_ruta (
  id SERIAL PRIMARY KEY,
  id_servicio_local INTEGER REFERENCES Servicio_local(id) ON DELETE CASCADE,
  fecha DATE NOT NULL,
  actividad TEXT NOT NULL,
  resultado TEXT,
  fecha_carga TIMESTAMP DEFAULT NOW()
);

-- Historial parte 4 -> muestra el historial de articulaciones con otros efectores antes o despues de ingresar a un programa
CREATE TABLE IF NOT EXISTS Articulacion (
  id SERIAL PRIMARY KEY,
  id_ingreso INTEGER REFERENCES Ingreso_programa(id) ON DELETE CASCADE,
  id_efector INTEGER REFERENCES Efector(id) ON DELETE SET NULL,
  observacion TEXT,
  fecha_articulacion DATE,
  fecha_carga TIMESTAMP DEFAULT NOW()
);
