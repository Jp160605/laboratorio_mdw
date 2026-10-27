---
sidebar_position: 6
title: Eventos en Tiempo Real (WebSockets)
---

# ⚡ Eventos en Tiempo Real (Socket.io)

El backend integra un servidor de **Socket.io** para emitir eventos de dominio a todos los clientes conectados en cuanto ocurre una mutación en las reservas.

---

## 🔌 Conexión del Cliente

El cliente Next.js se conecta al namespace principal del backend:

```typescript
import { io } from 'socket.io-client';

const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000', {
  transports: ['websocket', 'polling'],
});
```

---

## 📡 Catálogo de Eventos Emitidos por el Backend

### 1. `reserva:creada`
Se emite a todos los clientes (`io.emit`) inmediatamente después de que un usuario confirma exitosamente una reserva con HTTP `201`.

* **Carga útil (Payload):**
  ```json
  {
    "reserva_id": 14,
    "sala_id": 2,
    "fecha": "2026-10-27",
    "hora_inicio": 11,
    "hora_fin": 12,
    "nueva_version": 3,
    "usuario_nombre": "Carlos Rivera"
  }
  ```
* **Acción en el cliente:** La celda correspondiente en el calendario interactivo cambia a color rojo ("Ocupado") y la versión de la sala se actualiza localmente.

---

### 2. `reserva:cancelada`
Se emite cuando una reserva es cancelada con éxito mediante `PATCH /api/reservas/:id/cancelar`.

* **Carga útil (Payload):**
  ```json
  {
    "reserva_id": 14,
    "sala_id": 2,
    "fecha": "2026-10-27",
    "hora_inicio": 11,
    "nueva_version": 4
  }
  ```
* **Acción en el cliente:** La celda se libera y vuelve a estado "Disponible" (verde) sin requerir recarga manual del navegador.
