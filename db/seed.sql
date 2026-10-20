-- ==============================================================
-- SISTEMA DE RESERVAS: DATOS SEMILLA (SEED)
-- ==============================================================

-- Usuarios de prueba iniciales (password: 'password123')
-- Hash bcrypt de 10 rondas para 'password123': $2b$10$7mWXXzEGOSH.Yto9pqURd.3C5vP3ZT6l8NLVtWiVVFN0WTwqlzUjK
INSERT INTO usuarios (nombre, email, password_hash) VALUES
('Juan Pérez (Alumno A)', 'alumnoA@universidad.edu', '$2b$10$7mWXXzEGOSH.Yto9pqURd.3C5vP3ZT6l8NLVtWiVVFN0WTwqlzUjK'),
('María López (Alumno B)', 'alumnoB@universidad.edu', '$2b$10$7mWXXzEGOSH.Yto9pqURd.3C5vP3ZT6l8NLVtWiVVFN0WTwqlzUjK'),
('Carlos Gómez (Profesor)', 'profesor@universidad.edu', '$2b$10$7mWXXzEGOSH.Yto9pqURd.3C5vP3ZT6l8NLVtWiVVFN0WTwqlzUjK');

-- Salas con diversas capacidades y versiones iniciales (version = 1)
INSERT INTO salas (nombre, capacidad, ubicacion, version) VALUES
('Lab de Cómputo A', 25, 'Edificio A - Piso 2', 1),
('Sala de Estudio Grupal 1', 10, 'Biblioteca - PB', 1),
('Cabina de Proyectos', 4, 'Biblioteca - Piso 1', 1),
('Lab de Robótica y Hardware', 18, 'Edificio B - Lab 3', 1);

-- Reservas de muestra confirmadas para el día de hoy
INSERT INTO reservas (sala_id, usuario_id, fecha, hora_inicio, hora_fin, estado, version_sala_aplicada) VALUES
(1, 1, CURRENT_DATE, 9, 10, 'CONFIRMADA', 1),
(2, 2, CURRENT_DATE, 11, 12, 'CONFIRMADA', 1);
