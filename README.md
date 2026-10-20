# 🏢 Sistema de Reservas para Laboratorios y Salas de Estudio

> **Proyecto Académico:** Demostración de Control de Concurrencia Optimista, Transacciones ACID en SQL Puro, WebSockets en Tiempo Real, Caché y Colas en Segundo Plano con Docker.

---

## 1. Resumen de Arquitectura y Stack

El sistema está orquestado en **4 contenedores independientes** mediante Docker Compose:

```mermaid
flowchart TD
    subgraph Host ["Máquina Local / Navegador"]
        Browser["Navegador Web (http://localhost:3000)"]
    end

    subgraph DockerNet ["Red Docker: reservas-net"]
        Frontend["reservas_frontend (Next.js 14 + TailwindCSS)\nPuerto: 3000"]
        Backend["reservas_backend (Express + TypeScript + Socket.io)\nPuerto: 4000"]
        Postgres[("reservas_postgres (PostgreSQL 16)\nPuerto: 5432\nDDL & Seeds en SQL Puro")]
        RedisDB[("reservas_redis (Redis 7)\nPuerto: 6379\nCaché & BullMQ")]
    end

    Browser -->|HTTP / Interfaz| Frontend
    Frontend -->|REST API / WebSockets| Backend
    Backend -->|Transacciones ACID (BEGIN / COMMIT / ROLLBACK)| Postgres
    Backend -->|Caché de Disponibilidad & Encolado BullMQ| RedisDB
```

### Tecnologías Empleadas
* **Frontend:** Next.js 14 (App Router, TypeScript, TailwindCSS, Socket.io Client).
* **Backend:** Node.js, Express (TypeScript), Socket.io, BullMQ, Nodemailer, bcrypt, JWT.
* **Persistencia:** PostgreSQL 16 con librería nativa `pg` (**sin ORMs** para evidenciar transacciones manuales).
* **Caché y Colas:** Redis 7 con `ioredis` y `BullMQ`.
* **Orquestación:** Docker & Docker Compose.

---

## 2. Modelo de Base de Datos Relacional (PostgreSQL)

```mermaid
erDiagram
    usuarios ||--o{ reservas : "realiza (1:N)"
    salas ||--o{ reservas : "aloja (1:N)"

    usuarios {
        int id PK "SERIAL - Identificador único"
        string nombre "VARCHAR(100) - Nombre completo"
        string email UK "VARCHAR(150) - Correo único (login)"
        string password_hash "TEXT - Hash seguro (bcrypt)"
        timestamp creado_en "TIMESTAMP - Fecha de registro"
    }

    salas {
        int id PK "SERIAL - Identificador único"
        string nombre "VARCHAR(100) - Nombre del espacio o lab"
        int capacidad "INT - Aforo máximo de personas"
        string ubicacion "VARCHAR(100) - Edificio o piso"
        int version "INT DEFAULT 1 - Control de Bloqueo Optimista (RF-04)"
    }

    reservas {
        int id PK "SERIAL - Identificador único"
        int sala_id FK "INT REFERENCES salas(id) ON DELETE CASCADE"
        int usuario_id FK "INT REFERENCES usuarios(id) ON DELETE CASCADE"
        date fecha "DATE - Fecha de la reserva (YYYY-MM-DD)"
        int hora_inicio "INT - Bloque de inicio (8 a 20)"
        int hora_fin "INT - Bloque de fin (hora_inicio + 1)"
        string estado "VARCHAR(20) - CONFIRMADA o CANCELADA"
        int version_sala_aplicada "INT - Versión de sala al momento del commit"
        timestamp creado_en "TIMESTAMP - Momento del registro"
    }
```

---

## 3. Requerimientos Funcionales y Demostración

| Requerimiento | Descripción | Mecanismo Técnico |
| :--- | :--- | :--- |
| **RF-01** | Autenticación de usuarios | JWT firmado con `jsonwebtoken` y contraseñas cifradas con `bcrypt` (10 rondas). |
| **RF-02** | Calendario por bloques de 1 hora | Bloques discretos de 8:00 a 20:00 con actualización en tiempo real vía **Socket.io**. |
| **RF-03** | Sin solapamiento horario | Transacción ACID con validación en SQL e índice único condicional en PostgreSQL. |
| **RF-04** | Bloqueo Optimista | Columna `version` en `salas`. Ante peticiones simultáneas, una confirma (`201`) y la otra rebota (`409 Conflict`). |
| **RF-05** | Cancelación anticipada | Solo permitida si faltan **al menos 2 horas** para el inicio del bloque reservado. |
| **RF-06** | Notificaciones asíncronas | BullMQ envía correo de confirmación inmediato y programa recordatorio con *delay* para 1 hora antes. |
| **RF-07** | Historial de reservas | Listado filtrado por usuario logueado con estado `CONFIRMADA` o `CANCELADA`. |
| **Reto** | Sugerencia de "Mejor Sala" | Algoritmo SQL basado en función de costo que minimiza desviación horaria y desperdicio de aforo. |

---

## 3. Instrucciones de Arranque Rápido

Para levantar la solución completa con un único comando:

```bash
# 1. Clonar el repositorio (si aplica)
git clone https://github.com/Jp160605/laboratorio_mdw.git
cd laboratorio_mdw

# 2. Levantar los 4 contenedores
docker compose up --build -d
```

### URLs de Acceso:
* **Frontend (Aplicación Web):** [http://localhost:3000](http://localhost:3000)
* **Backend API (Healthcheck):** [http://localhost:4000/health](http://localhost:4000/health)
* **Disponibilidad con Caché:** [http://localhost:4000/api/salas/disponibilidad](http://localhost:4000/api/salas/disponibilidad)
* **Sugerencia de Mejor Sala (Reto):** [http://localhost:4000/api/salas/sugerir?hora_deseada=10&aforo=15](http://localhost:4000/api/salas/sugerir?hora_deseada=10&aforo=15)

---

## 4. Guía de Demostración para Evaluación

### Prueba 1: Demostración de Concurrencia y Bloqueo Optimista (RF-04)
1. Abrir [http://localhost:3000](http://localhost:3000).
2. Hacer clic en la pestaña **"4. ⚡ Simulador de Concurrencia (Demo RF-04)"**.
3. Seleccionar una sala y un bloque horario.
4. Presionar el botón **"⚡ Simular Colisión de 2 Usuarios"**:
   - Ambas peticiones se disparan en paralelo con `Promise.all` al mismo milisegundo portando la misma versión.
   - **Resultado en pantalla:**
     - **Petición 1:** `HTTP 201 Created` (Transacción confirmada, versión incrementada a `v2`).
     - **Petición 2:** `HTTP 409 Conflict` (Optimistic Lock Exception detectada, transacción revertida con `ROLLBACK`).

### Prueba 2: Tiempo Real con WebSockets (RF-02)
1. Abrir la aplicación en dos pestañas diferentes del navegador en [http://localhost:3000](http://localhost:3000).
2. En la pestaña 1, reservar un bloque disponible del calendario.
3. Observar cómo en la pestaña 2 el bloque se pinta instantáneamente como **"Ocupado"** vía Socket.io sin necesidad de recargar la página.

### Prueba 3: Caché de Redis
1. En la consola ejecutar:
   ```bash
   curl -i http://localhost:4000/api/salas/disponibilidad
   ```
   - Primera llamada: retorna `"origen": "POSTGRES_DB"` y almacena en caché.
   - Segunda llamada: retorna `"origen": "REDIS_CACHE"`.
2. Al crear o cancelar una reserva, el backend invalida automáticamente la clave en Redis.

### Prueba 4: Regla de Cancelación de 2 Horas (RF-05)
1. Ir a la pestaña **"2. Mis Reservas"**.
2. Las reservas cuyo horario comience en menos de 2 horas mostrarán el botón de cancelación bloqueado con una advertencia explicativa.
