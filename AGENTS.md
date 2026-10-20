# AGENTS.md - Guía de Contexto del Repositorio

Bienvenido al repositorio del **Sistema de Reservas para Laboratorios y Salas de Estudio**.

## Estructura del Monorepo
- `/frontend`: Aplicación Next.js (TypeScript, TailwindCSS, Socket.io-client).
- `/backend`: Servidor Express en Node.js (TypeScript, Socket.io, BullMQ, pg).
- `/db`: Scripts de inicialización y esquemas SQL puro (`init.sql`).
- `docker-compose.yml`: Orquestador de servicios (PostgreSQL, Redis, Backend, Frontend).
- `.agents/rules/`: Reglas del agente específicas para el proyecto.
- `.agents/skills/`: Skills personalizadas del agente para flujos de trabajo repetitivos.

## Restricciones Clave
1. **Sin ORMs**: Consultas en SQL nativo (`pg`) con transacciones explícitas.
2. **Control de Concurrencia**: Bloqueo optimista mediante columna `version` en `salas`.
3. **Manejo de Errores**: Retornar `409 Conflict` cuando ocurra colisión en reservas concurrentes.
4. **Persistencia y Caché**: Cachear disponibilidad en Redis y procesar correos con BullMQ en segundo plano.
