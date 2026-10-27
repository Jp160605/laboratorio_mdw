---
sidebar_position: 1
title: Introducción al Sistema
---

# 🏢 Sistema de Reservas para Laboratorios y Salas de Estudio

Bienvenido a la documentación técnica del **Sistema de Reservas para Laboratorios y Salas de Estudio**. Este proyecto fue desarrollado como demostración práctica de conceptos avanzados de middleware, ingeniería de datos y desarrollo backend/frontend.

---

## 🎯 Objetivos del Sistema

* **Demostrar Control de Concurrencia Optimista:** Resolución robusta de condiciones de carrera cuando dos o más usuarios intentan reservar el mismo recurso simultáneamente.
* **Transacciones ACID en SQL Nativo:** Manejo estricto de integridad relacional utilizando el controlador nativo `pg` de PostgreSQL sin intermediación de ORMs.
* **Tiempo Real Bidireccional:** Notificación instantánea del estado de ocupación de salas vía WebSockets (Socket.io) a todos los clientes web conectados.
* **Arquitectura de Alto Rendimiento:** Capa de almacenamiento en caché con Redis e infraestructura de procesamiento de tareas en segundo plano con BullMQ.
* **Contenedorización Completa:** Entorno reproducible con Docker Compose que orquesta PostgreSQL, Redis, Backend (Express) y Frontend (Next.js).

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología | Propósito |
| :--- | :--- | :--- |
| **Frontend** | Next.js 14, React 19, TypeScript, TailwindCSS | Interfaz reactiva, vista de calendario interactivo y simulador de concurrencia. |
| **Backend** | Node.js, Express, TypeScript | API REST, lógica de negocio y servidor de WebSockets. |
| **Tiempo Real** | Socket.io / Socket.io-client | Sincronización instantánea de ocupación entre navegadores. |
| **Persistencia** | PostgreSQL 16 (Driver `pg` nativo) | Almacén relacional con restricciones de clave y transacciones manuales. |
| **Caché y Colas** | Redis 7, `ioredis`, BullMQ | Almacenamiento en caché de disponibilidad y colas para envíos de correos asíncronos. |
| **Orquestación** | Docker & Docker Compose | Red aislada de servicios e inicialización con un solo comando. |

---

## 🧭 Mapa de la Documentación

* [**Arquitectura de Servicios**](/docs/arquitectura/sistema): Vista en capas, contenedores y diagramas de flujo.
* [**Control de Concurrencia**](/docs/arquitectura/concurrencia): Explicación detallada del bloqueo optimista y el mecanismo de versionado.
* [**Modelo de Base de Datos**](/docs/base-de-datos/modelo): Esquema DDL en SQL puro, restricciones e índices únicos parciales.
* [**Endpoints REST**](/docs/api/endpoints): Catálogo de rutas HTTP, cuerpos de petición y respuestas.
* [**WebSockets**](/docs/api/websockets): Eventos emitidos y escuchados para mantener la vista sincronizada.
* [**Despliegue con Docker**](/docs/despliegue/docker): Puesta en marcha rápida y variables de entorno.
* [**Guía de Evaluación y Demostración**](/docs/demostracion/pruebas): Pasos para reproducir los escenarios clave de evaluación.
