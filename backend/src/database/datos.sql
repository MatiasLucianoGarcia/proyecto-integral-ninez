-- Insertar en la tabla Entidad
INSERT INTO Entidad (nombre, servicio_local, descripcion) VALUES ('Municipalidad Bahia Blanca', TRUE, 'Entidad encargada de la administración municipal y de servicios locales en Bahía Blanca');

-- Insertar en la tabla Rol
INSERT INTO Rol (nombre_rol) VALUES ('Administrador'), ('Proteccion'), ('Promocion');

-- Insertar en la tabla Usuario
INSERT INTO Usuario (id_entidad, nombre, contraseña, id_rol) VALUES ((SELECT id FROM Entidad WHERE nombre = 'Municipalidad Bahia Blanca'), 'AdministradorMunicipalidad', '$2b$12$qXp4JJXpccVuAhQmF8ExW.xaitUapMlIiMD4FVGVqBwDe6ktGinCW', (SELECT id FROM Rol WHERE nombre_rol = 'Administrador'));

-- Insertar en la tabla Parentezco
INSERT INTO Parentezco (id, descripcion) VALUES (1, 'Padre'), (2, 'Madre'), (3, 'Hijo/Hija'), (4, 'Hermano/Hermana'), (5, 'Abuelo/Abuela'), (6, 'Nieto/Nieta'), (7, 'Tío/Tía'), (8, 'Sobrino/Sobrina'), (9, 'Primo/Prima'), (10, 'Tutor'), (11, 'Tutoreado');
UPDATE Parentezco SET id_inverso = 3 WHERE id IN (1, 2); -- Padre/Madre -> Hijo/Hija
UPDATE Parentezco SET id_inverso = 1 WHERE id = 3;      -- Hijo/Hija -> Padre (convención)
UPDATE Parentezco SET id_inverso = 4 WHERE id = 4;      -- Hermano/Hermana
UPDATE Parentezco SET id_inverso = 6 WHERE id = 5;      -- Abuelo/Abuela -> Nieto/Nieta
UPDATE Parentezco SET id_inverso = 5 WHERE id = 6;
UPDATE Parentezco SET id_inverso = 8 WHERE id = 7;      -- Tío/Tía -> Sobrino/Sobrina
UPDATE Parentezco SET id_inverso = 7 WHERE id = 8;
UPDATE Parentezco SET id_inverso = 9 WHERE id = 9;      -- Primo/Prima
UPDATE Parentezco SET id_inverso = 11 WHERE id = 10;    -- Tutor -> Tutoreado
UPDATE Parentezco SET id_inverso = 10 WHERE id = 11;

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