---
sidebar_position: 2
title: Arquitectura de Servicios
---

# 🏗️ Arquitectura de Servicios

El sistema está diseñado bajo un enfoque modular orquestado en **cuatro contenedores Docker independientes** comunicados a través de una red interna bridge llamada `reservas-net`.

```mermaid
flowchart TD
    subgraph Host ["Máquina Local / Navegador"]
        Browser["Navegador Web (http://localhost:3000)"]
    end

    subgraph DockerNet ["Red Docker: reservas-net"]
        Frontend["reservas_frontend\n(Next.js 14 + TailwindCSS)\nPuerto: 3000"]
        Backend["reservas_backend\n(Express + TypeScript + Socket.io)\nPuerto: 4000"]
        Postgres[("reservas_postgres\n(PostgreSQL 16)\nPuerto: 5432\nDDL en SQL Puro")]
        RedisDB[("reservas_redis\n(Redis 7)\nPuerto: 6379\nCaché & BullMQ")]
    end

    Browser -->|HTTP / Interfaz| Frontend
    Frontend -->|REST API & WebSockets| Backend
    Backend -->|Transacciones ACID (pg nativo)| Postgres
    Backend -->|Caché & Workers en segundo plano| RedisDB
```

---

## 🧩 Componentes del Sistema

### 1. Frontend (`reservas_frontend`)
* Desarrollado en **Next.js 14** con TypeScript y TailwindCSS.
* Consume la API REST del backend para operaciones estándar (login, registro, consultar reservas).
* Mantiene una conexión persistente bidireccional mediante **Socket.io-client** para reflejar cambios en tiempo real.
* Incluye un **Simulador de Concurrencia** que dispara dos peticiones idénticas en paralelo (`Promise.all`) para demostrar el comportamiento del bloqueo optimista.

### 2. Backend (`reservas_backend`)
* Servidor en **Node.js** con Express y TypeScript.
* Expone controladores modularizados para autenticación, gestión de salas y reservas.
* Integra el servidor de WebSockets adjunto a la misma instancia HTTP.
* Inicializa trabajadores de **BullMQ** encargados de procesar el envío de correos asíncronos (notificación inmediata y recordatorio programado).

### 3. Base de Datos Relacional (`reservas_postgres`)
* Instancia oficial de PostgreSQL 16.
* Inicializada automáticamente desde un script DDL en SQL puro (`/db/init.sql`).
* Implementa constraints a nivel relacional:
  * Horarios válidos entre 8 y 20 horas.
  * Duración exacta de 1 hora (`hora_fin = hora_inicio + 1`).
  * Claves foráneas con eliminación en cascada.
  * **Índice único condicional** para evitar duplicados a nivel físico.

### 4. Capa de Caché y Mensajería (`reservas_redis`)
* Contenedor de Redis 7 en memoria.
* **Caché:** Almacena temporalmente la matriz de disponibilidad de salas. Cuando se crea o cancela una reserva, la clave de caché se invalida inmediatamente.
* **Colas:** Actúa como motor de persistencia y temporizador para los jobs de BullMQ.
