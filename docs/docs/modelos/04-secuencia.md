---
sidebar_position: 4
title: 4. Modelo de Secuencia
---

# ⏱️ Modelo de Secuencia del Sistema

El diagrama de secuencia detalla el orden cronológico de los mensajes e intercambios de datos entre los distintos subsistemas al ejecutar una reserva exitosa.

---

## 🛰️ Diagrama de Secuencia Completo (Mermaid)

```mermaid
sequenceDiagram
    autonumber
    actor Cliente as 👤 Frontend (Next.js)
    participant Auth as 🛡️ AuthMiddleware
    participant Ctrl as 🎮 ReservasController
    participant DB as 🗄️ PostgreSQL (pg)
    participant Redis as ⚡ Redis Caché
    participant Socket as 🔄 Socket.io Server
    participant Queue as 📨 BullMQ (Redis)
    participant Worker as ⚙️ EmailWorker

    Cliente->>Auth: POST /api/reservas {sala_id: 1, hora: 10, version_esperada: 2} [Token JWT]
    Auth->>Auth: Verificar firma y expiración del JWT
    Auth->>Ctrl: Pasa usuario autenticado (req.user)

    activate Ctrl
    Ctrl->>DB: client.query("BEGIN")
    
    Ctrl->>DB: UPDATE salas SET version = version + 1 WHERE id = 1 AND version = 2
    DB-->>Ctrl: rowCount = 1 (Versión válida y actualizada a 3)

    Ctrl->>DB: INSERT INTO reservas (sala_id, usuario_id, fecha, hora_inicio, hora_fin, version_sala_aplicada) VALUES (...)
    DB-->>Ctrl: Retorna reserva creada con ID 45

    Ctrl->>DB: client.query("COMMIT")
    DB-->>Ctrl: Transacción confirmada

    Ctrl->>Redis: DEL "disponibilidad:2026-10-27" (Invalidar caché)
    Redis-->>Ctrl: OK

    Ctrl->>Socket: io.emit("reserva:creada", {reserva_id: 45, sala_id: 1, hora: 10, nueva_version: 3})
    Socket-->>Cliente: Broadcast a todos los navegadores conectados

    Ctrl->>Queue: emailQueue.add("confirmacion", {email, reserva_id})
    Ctrl->>Queue: emailQueue.add("recordatorio", {email, reserva_id}, {delay: 3600000})

    Ctrl-->>Cliente: HTTP 201 Created {mensaje: "Reserva exitosa", reserva: {...}}
    deactivate Ctrl

    Note over Queue,Worker: Procesamiento Asíncrono en Segundo Plano
    Queue->>Worker: Dispatch de Job 'confirmacion'
    activate Worker
    Worker->>Worker: Enviar correo de confirmación vía Nodemailer (SMTP)
    Worker-->>Queue: Job completado con éxito
    deactivate Worker
```

---

## 🔍 Análisis de Tiempos y Rendimiento

1. **Ruta Crítica Minimizada (Pasos 1 al 10):** La transacción ACID en PostgreSQL solo abarca la actualización del contador de versión y la inserción de la reserva. Toma comúnmente menos de **5 ms**.
2. **Tareas Asíncronas Fuera de la Transacción (Pasos 11 al 16):** La invalidación de caché, el broadcast por WebSockets y el encolado en BullMQ ocurren después de que la transacción fue confirmada con `COMMIT`, evitando retener conexiones de base de datos innecesariamente.
3. **Desacoplamiento del Correo (Pasos 17 al 19):** El usuario no espera los 1 a 2 segundos que tarda el servidor SMTP en enviar el correo; la API responde inmediatamente con HTTP `201`.
