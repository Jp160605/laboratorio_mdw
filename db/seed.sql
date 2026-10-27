-- ==============================================================
-- SISTEMA DE RESERVAS: DATOS SEMILLA (SEED)
-- ==============================================================

-- Usuarios de prueba iniciales (password: 'password123')
-- Hash bcrypt de 10 rondas para 'password123': $2b$10$7mWXXzEGOSH.Yto9pqURd.3C5vP3ZT6l8NLVtWiVVFN0WTwqlzUjK
INSERT INTO usuarios (nombre, email, password_hash) VALUES
('Juan Pérez (Alumno A)', 'alumnoA@universidad.edu', '$2b$10$7mWXXzEGOSH.Yto9pqURd.3C5vP3ZT6l8NLVtWiVVFN0WTwqlzUjK'),
('María López (Alumno B)', 'alumnoB@universidad.edu', '$2b$10$7mWXXzEGOSH.Yto9pqURd.3C5vP3ZT6l8NLVtWiVVFN0WTwqlzUjK'),
('Carlos Gómez (Profesor)', 'profesor@universidad.edu', '$2b$10$7mWXXzEGOSH.Yto9pqURd.3C5vP3ZT6l8NLVtWiVVFN0WTwqlzUjK');

-- Salas con diversas capacidades y versiones iniciales (version = 1) - EXACTAMENTE 3 SALAS
INSERT INTO salas (nombre, capacidad, ubicacion, version) VALUES
('Lab de Cómputo A', 25, 'Edificio A - Piso 2', 1),
('Sala de Estudio Grupal 1', 10, 'Biblioteca - PB', 1),
('Cabina de Proyectos', 4, 'Biblioteca - Piso 1', 1);
