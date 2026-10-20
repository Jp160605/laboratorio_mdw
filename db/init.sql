-- ==============================================================
-- SISTEMA DE RESERVAS: ESQUEMA DDL (POSTGRESQL PURO)
-- ==============================================================

DROP TABLE IF EXISTS reservas CASCADE;
DROP TABLE IF EXISTS salas CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;

-- Tabla de Usuarios (RF-01)
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Salas / Espacios de Estudio (RF-04: Bloqueo Optimista)
CREATE TABLE salas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    capacidad INT NOT NULL,
    ubicacion VARCHAR(100),
    version INT NOT NULL DEFAULT 1 -- Control de Concurrencia Optimista
);

-- Tabla de Reservas en Bloques de 1 Hora (RF-03, RF-04, RF-05, RF-07)
CREATE TABLE reservas (
    id SERIAL PRIMARY KEY,
    sala_id INT NOT NULL REFERENCES salas(id) ON DELETE CASCADE,
    usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    fecha DATE NOT NULL,
    hora_inicio INT NOT NULL CHECK (hora_inicio >= 8 AND hora_inicio <= 20), -- Bloques de 08:00 a 20:00
    hora_fin INT NOT NULL CHECK (hora_fin = hora_inicio + 1),
    estado VARCHAR(20) NOT NULL DEFAULT 'CONFIRMADA', -- 'CONFIRMADA', 'CANCELADA'
    version_sala_aplicada INT NOT NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índice Único Parcial: Doble garantía en BD para evitar reservas solapadas en bloques activos
CREATE UNIQUE INDEX idx_reserva_unica_activa 
ON reservas (sala_id, fecha, hora_inicio) 
WHERE estado = 'CONFIRMADA';
