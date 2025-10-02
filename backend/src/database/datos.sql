-- Insertar en la tabla Entidad
INSERT INTO Entidad (nombre, servicio_local, descripcion) VALUES ('Municipalidad Bahia Blanca', TRUE, 'Entidad encargada de la administración municipal y de servicios locales en Bahía Blanca');

-- Insertar en la tabla Rol
INSERT INTO Rol (nombre_rol) VALUES ('Administrador'), ('Proteccion'), ('Promocion');

-- Insertar en la tabla Usuario
INSERT INTO Usuario (id_entidad, nombre, contraseña, id_rol) VALUES ((SELECT id FROM Entidad WHERE nombre = 'Municipalidad Bahia Blanca'), 'AdministradorMunicipalidad', '$2b$12$qXp4JJXpccVuAhQmF8ExW.xaitUapMlIiMD4FVGVqBwDe6ktGinCW', (SELECT id FROM Rol WHERE nombre_rol = 'Administrador'));

-- Insertar en la tabla Parentezco
INSERT INTO Parentezco (descripcion) VALUES ('Padre'), ('Madre'), ('Hermano'), ('Hermana'), ('Abuelo'), ('Abuela'), ('Tío'), ('Tía'), ('Primo'), ('Prima'), ('Tutor');

-- Insertar en la tabla Efector
INSERT INTO Efector (nombre) VALUES ('Salud'), ('Educación'), ('Servicio Local'), ('Programas'), ('Organizaciones Sociales'), ('Merenderos');

-- Insertar en la tabla Derecho
INSERT INTO Derecho (nombre) VALUES ('Derecho a la educación'), ('Derecho a la salud'), ('Derecho al trabajo'), ('Derecho a la vivienda'), ('Derecho a la alimentación'), ('Derecho a la información'), ('Derecho a la seguridad'), ('Derecho a la protección infantil'), ('Derecho a la participación política'), ('Derecho a la cultura'), ('Derecho a la igualdad de género'), ('Derecho a la libertad de expresión'), ('Derecho a un ambiente sano');

-- Insertar en la tabla Genero
INSERT INTO Genero (nombre) VALUES  ('Masculino'), ('Femenino'), ('No Binario'), ('Transgénero Masculino'), ('Transgénero Femenino'), ('Agénero'), ('Bigénero'), ('Demiboy'), ('Demigirl'), ('Genderfluid'), ('Intergénero'), ('Otros');

-- Insertar en la tabla Nacionalidad
INSERT INTO Nacionalidad (nombre) VALUES  ('Argentina'), ('Chile'), ('Uruguay'), ('Brasil'), ('Paraguay'), ('Bolivia'), ('Perú'), ('Ecuador'),('Colombia'), ('Venezuela'), ('España'), ('Italia'), ('Alemania'), ('Francia'), ('Reino Unido'), ('Estados Unidos');

-- Insertar en la tabla Tipo_vivienda
INSERT INTO Tipo_vivienda (tipo) VALUES ('Casa propia'), ('Casa alquilada'), ('Departamento propio'), ('Departamento alquilado'), ('Casa de familiares'), ('Casa prestada'), ('Vivienda social'), ('Vivienda rural'), ('Pensión'), ('Inquilinato'), ('Hotel/pensión transitoria'), ('Usurpada'), ('En situación de calle'), ('Otro');