---
sidebar_position: 8
title: Guía de Demostración y Pruebas
---

# 🧪 Guía de Demostración y Pruebas

Esta guía detalla los pasos reproducibles para demostrar el cumplimiento de los requerimientos funcionales del sistema durante una sesión de evaluación técnica.

---

## ⚡ Escenario 1: Concurrencia y Bloqueo Optimista (RF-04)

Este escenario demuestra cómo el sistema previene el *double-booking* cuando dos peticiones HTTP compiten por el mismo recurso al mismo milisegundo con la misma versión.

1. Abre tu navegador e ingresa a [http://localhost:3000](http://localhost:3000).
2. En la barra de navegación superior, selecciona la pestaña **"4. ⚡ Simulador de Concurrencia (Demo RF-04)"**.
3. Selecciona una sala y un bloque horario libre (ej. Sala A, 10:00 - 11:00).
4. Presiona el botón **"⚡ Simular Colisión de 2 Usuarios"**.
5. **Comportamiento observable:**
   * Ambas peticiones son enviadas concurrentemente mediante `Promise.all`.
   * **Petición 1:** Retorna `HTTP 201 Created`. La transacción se confirma (`COMMIT`) y la versión de la sala avanza a `v + 1`.
   * **Petición 2:** Retorna `HTTP 409 Conflict`. La versión esperada ya no coincide con la versión en BD; la transacción se revierte (`ROLLBACK`) y no se crean reservas corruptas.

---

## 🔄 Escenario 2: Sincronización en Tiempo Real (RF-02)

Demuestra que los cambios de estado se propagan inmediatamente a todos los clientes conectados sin necesidad de recargar la página.

1. Abre dos pestañas o ventanas distintas del navegador (o una en modo incógnito) en [http://localhost:3000](http://localhost:3000).
2. En la **Pestaña 1**, dirígete al calendario de reservas y reserva un bloque disponible.
3. Observa simultáneamente la **Pestaña 2**:
   * En menos de 100 ms, la celda en la Pestaña 2 se pinta automáticamente de color rojo con la etiqueta **"Ocupado"**.
   * La versión de la sala en la cabecera se actualiza de manera reactiva.

---

## 🚀 Escenario 3: Caché de Redis y Rendimiento

Demuestra la aceleración de consultas y la invalidación reactiva de la caché.

1. Desde la terminal, ejecuta una consulta de disponibilidad:
   ```bash
   curl -s http://localhost:4000/api/salas/disponibilidad | jq .origen
   ```
   * En la **primera llamada**, la respuesta reporta `"origen": "POSTGRES_DB"` y almacena el resultado en Redis.
   * En la **segunda llamada**, la respuesta reporta `"origen": "REDIS_CACHE"` con un tiempo de respuesta casi instantáneo.
2. Crea una nueva reserva en el frontend.
3. Vuelve a ejecutar el comando `curl`:
   * Observa que el origen vuelve a ser `"POSTGRES_DB"` debido a que la mutación invalidó la clave de Redis automáticamente.
