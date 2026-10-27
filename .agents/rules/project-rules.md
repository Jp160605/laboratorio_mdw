# Reglas y Estándares del Proyecto: Sistema de Reservas

## 1. Principios de Arquitectura y Stack
- **Monorepo**: Estructura dividida en `/frontend`, `/backend`, `/db`, con `docker-compose.yml` en la raíz.
- **Lenguaje**: TypeScript obligatorio tanto en Frontend como en Backend.
- **Base de Datos**: PostgreSQL utilizando SQL puro mediante la librería `pg`. **NO utilizar ORMs** (Prisma, TypeORM, Sequelize, etc.) para evidenciar explícitamente el manejo transaccional ACID (`BEGIN`, `COMMIT`, `ROLLBACK`) y el control de versiones.
- **Bloqueo Optimista**: Las reservas deben validar y actualizar la columna `version` de la tabla `salas`:
  `UPDATE salas SET version = version + 1 WHERE id = $1 AND version = $2`
  Si `rowCount === 0`, debe realizarse `ROLLBACK` y retornar `HTTP 409 Conflict`.
- **Manejo de Tiempos y Bloques**: Bloques horarios discretos de 1 hora (`08:00` a `20:00`), representados por enteros (ej. `8` para `08:00-09:00`).
- **Tiempo Real**: Eventos de Socket.io (`reserva_creada`, `reserva_cancelada`) emitidos tras confirmar el `COMMIT` en la base de datos para sincronizar clientes.
- **Caché y Colas**: Redis para caché de disponibilidad e invalidación inmediata; BullMQ para envío de correos asíncronos (inmediato y recordatorio con delay de 1 hora antes).

## 2. Reglas de Código y Buenas Prácticas
- Mantener tipado estricto en TypeScript sin uso de `any` injustificado.
- Centralizar el manejo de errores en Express mediante middlewares dedicados.
- Aislar las variables de entorno utilizando archivos `.env` y documentar variables requeridas en `.env.example`.
- Asegurar que toda transacción en base de datos use bloques `try/catch` con liberación explícita del cliente del pool (`client.release()`) en el bloque `finally`.

## 3. Control de Versiones (Git)
- **NO realizar `git commit` ni `git push` de forma autónoma**: Solo ejecutar commits o push cuando el usuario lo solicite de manera explícita en su mensaje. Si hay cambios pendientes, proporcionar los comandos de Git o el estado para que el usuario decida o los ejecute en su terminal.
