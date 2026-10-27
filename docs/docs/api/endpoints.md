---
sidebar_position: 5
title: Endpoints REST
---

# 🌐 Especificación de la API REST

Todas las rutas de la API están prefijadas por `/api`. Los endpoints protegidos requieren la cabecera `Authorization: Bearer <token_jwt>`.

---

## 🔐 Autenticación (`/api/auth`)

### `POST /api/auth/register`
Registra un nuevo usuario en la base de datos.

* **Cuerpo de la petición (JSON):**
  ```json
  {
    "nombre": "Carlos Rivera",
    "email": "carlos@universidad.edu",
    "password": "Password123!"
  }
  ```
* **Respuesta exitosa (`201 Created`):**
  ```json
  {
    "mensaje": "Usuario registrado exitosamente",
    "usuario": {
      "id": 1,
      "nombre": "Carlos Rivera",
      "email": "carlos@universidad.edu"
    }
  }
  ```

### `POST /api/auth/login`
Autentica al usuario y entrega un token JWT con vigencia de 24 horas.

* **Cuerpo de la petición (JSON):**
  ```json
  {
    "email": "carlos@universidad.edu",
    "password": "Password123!"
  }
  ```
* **Respuesta exitosa (`200 OK`):**
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "usuario": {
      "id": 1,
      "nombre": "Carlos Rivera",
      "email": "carlos@universidad.edu"
    }
  }
  ```

---

## 🏢 Salas de Estudio (`/api/salas`)

### `GET /api/salas`
Obtiene el listado de todas las salas con su capacidad y versión actual.

* **Respuesta exitosa (`200 OK`):**
  ```json
  [
    {
      "id": 1,
      "nombre": "Laboratorio de Cómputo A",
      "capacidad": 20,
      "ubicacion": "Edificio 3, Piso 2",
      "version": 4
    }
  ]
  ```

### `GET /api/salas/disponibilidad`
Consulta la disponibilidad de todos los bloques horarios de una fecha. Utiliza **Redis** como caché de lectura.

* **Parámetros de consulta (Query params):**
  * `fecha` (opcional, formato `YYYY-MM-DD`, por defecto hoy).
* **Respuesta exitosa (`200 OK`):**
  ```json
  {
    "origen": "REDIS_CACHE", // o "POSTGRES_DB" si no existía en caché
    "fecha": "2026-10-27",
    "datos": [ ... ]
  }
  ```

### `GET /api/salas/sugerir` (Reto)
Algoritmo en SQL que evalúa y minimiza una función de costo para sugerir la sala óptima disponible.

* **Parámetros de consulta:**
  * `hora_deseada` (entero entre 8 y 20).
  * `aforo` (número mínimo de personas requeridas).
* **Función de costo:**
  ```text
  Costo = 2 * |hora_sala - hora_deseada| + 1 * (capacidad - aforo)
  ```

---

## 📅 Reservas (`/api/reservas`)

### `POST /api/reservas` (Protegida)
Crea una nueva reserva aplicando control de concurrencia optimista y transacción ACID.

* **Cabeceras:** `Authorization: Bearer <token>`
* **Cuerpo de la petición (JSON):**
  ```json
  {
    "sala_id": 1,
    "fecha": "2026-10-27",
    "hora_inicio": 10,
    "version_esperada": 4
  }
  ```
* **Respuestas posibles:**
  * `201 Created`: Reserva confirmada. La versión de la sala se incrementa a 5. Se encolan los correos en BullMQ y se emite el evento Socket.io.
  * `409 Conflict`: Ocurrió una colisión de concurrencia. La sala fue modificada por otro usuario antes de completar la transacción.
  * `400 Bad Request`: Parámetros inválidos o bloque fuera de horario.

### `GET /api/reservas/mis-reservas` (Protegida)
Obtiene el historial de reservas asociadas al usuario autenticado.

### `PATCH /api/reservas/:id/cancelar` (Protegida)
Cancela una reserva existente (**RF-05**).

* **Regla de negocio:** Solo se puede cancelar si faltan **al menos 2 horas** para el inicio del bloque reservado respecto a la hora actual.
* **Respuesta exitosa (`200 OK`):** Estado cambiado a `CANCELADA`, versión de la sala incrementada e invalidación de caché en Redis.
