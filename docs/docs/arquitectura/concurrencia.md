---
sidebar_position: 3
title: Control de Concurrencia Optimista
---

# ⚡ Control de Concurrencia Optimista

Uno de los requerimientos nucleares del sistema (**RF-04**) es el control de concurrencia optimista para evitar sobre-reservas (*double-booking*) sin recurrir a bloqueos pesados a nivel de tabla o fila que degraden el rendimiento.

---

## 🔍 ¿Por qué Bloqueo Optimista?

En sistemas de reservas con alta concurrencia, el bloqueo pesimista (`SELECT ... FOR UPDATE`) puede generar contención excesiva y tiempos de espera altos.

El **bloqueo optimista** asume que la mayoría de las transacciones no colisionarán entre sí. Por ello:
1. Cada registro de sala contiene una columna de versión (`version INT NOT NULL DEFAULT 1`).
2. El cliente consulta la disponibilidad y recibe el número de versión actual de la sala.
3. Al intentar reservar, el cliente envía la versión que leyó (`version_esperada`).
4. La base de datos solo confirma la actualización si la versión actual sigue siendo igual a la versión esperada. Si otra transacción ya modificó la sala, la versión habrá cambiado y la operación fallará limpiamente.

---

## 🔄 Flujo de Ejecución del Backend

```mermaid
sequenceDiagram
    autonumber
    actor Usuario A
    actor Usuario B
    participant Backend as Backend API
    participant DB as PostgreSQL
    participant Redis as Redis / Sockets

    Note over Usuario A, Usuario B: Ambos leen la Sala 1 en Versión 3
    Usuario A->>Backend: POST /reservas (sala: 1, hora: 10, version: 3)
    Usuario B->>Backend: POST /reservas (sala: 1, hora: 10, version: 3)

    critical Transacción A
        Backend->>DB: BEGIN TRANSACTION
        Backend->>DB: UPDATE salas SET version = version + 1 WHERE id = 1 AND version = 3
        DB-->>Backend: 1 fila afectada (ÉXITO)
        Backend->>DB: INSERT INTO reservas ...
        Backend->>DB: COMMIT
    end
    Backend->>Redis: Invalidar caché & emitir Socket 'reserva:creada'
    Backend-->>Usuario A: 201 Created (Reserva confirmada, Sala v4)

    critical Transacción B
        Backend->>DB: BEGIN TRANSACTION
        Backend->>DB: UPDATE salas SET version = version + 1 WHERE id = 1 AND version = 3
        DB-->>Backend: 0 filas afectadas (FALLO: la versión ya es 4)
        Backend->>DB: ROLLBACK
    end
    Backend-->>Usuario B: 409 Conflict ("La sala fue modificada por otro usuario")
```

---

## 🛡️ Doble Red de Seguridad en Base de Datos

Además de la verificación por versión a nivel de aplicación dentro de la transacción, PostgreSQL cuenta con un **índice único parcial**:

```sql
CREATE UNIQUE INDEX idx_reserva_unica_activa 
ON reservas (sala_id, fecha, hora_inicio) 
WHERE estado = 'CONFIRMADA';
```

Esto garantiza matemáticamente que:
1. Nunca podrán existir dos reservas con estado `CONFIRMADA` en la misma sala, fecha y hora de inicio.
2. Si por cualquier motivo ocurriera una condición de carrera imprevista, la base de datos lanzará un error de violación de restricción única (`23505`), el backend ejecutará `ROLLBACK` y retornará un error amigable al cliente.
