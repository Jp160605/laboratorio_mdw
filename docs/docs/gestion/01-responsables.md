---
sidebar_position: 1
title: Asignación de Tareas y Responsables
---

# 👥 Asignación de Tareas y Responsables

Para el desarrollo equilibrado y ordenado del proyecto, las responsabilidades se distribuyeron por módulos técnicos, aplicando una matriz de roles y responsabilidades.

---

## 📊 Matriz de Asignación de Responsabilidades (RACI)

* **R (Responsible):** Quien realiza la actividad.
* **A (Accountable):** Quien aprueba y responde por el resultado final.
* **C (Consulted):** Quien provee información o criterio técnico.
* **I (Informed):** Quien es notificado del progreso o resultado.

| Módulo / Tarea | Backend & Datos | Frontend & UX | DevOps & Calidad |
| :--- | :---: | :---: | :---: |
| **Diseño de Base de Datos y Scripts DDL/Seeds** | **R / A** | C | I |
| **Control de Concurrencia Optimista (SQL nativo)** | **R / A** | C | C |
| **Integración de WebSockets (Socket.io) y BullMQ** | **R / A** | C | I |
| **Diseño de Interfaz de Usuario y Calendario (Next.js)** | C | **R / A** | I |
| **Simulador de Concurrencia (Demo RF-04 en Frontend)** | C | **R / A** | C |
| **Docker Compose y Orquestación Multi-contenedor** | C | C | **R / A** |
| **Plan de Pruebas (Rendimiento, Seguridad, Interfaz)** | C | C | **R / A** |
| **Documentación Técnica y Modelado Mermaid (Docusaurus)** | **R** | **R** | **A** |

---

## 📌 Detalle de Responsabilidades por Rol

### 🛠️ Equipo Backend & Datos
* Implementación de la API REST en Express y TypeScript con arquitectura limpia.
* Transacciones ACID en PostgreSQL nativo (`pg`) sin uso de ORMs.
* Lógica del bloqueo optimista mediante la columna `version` en salas.
* Configuración de la caché con Redis e invalidación reactiva.
* Encolado y procesamiento asíncrono de correos con BullMQ y Nodemailer.

### 🎨 Equipo Frontend & UX
* Construcción del cliente web reactivo en Next.js 14 y TailwindCSS.
* Conexión persistente mediante Socket.io-client para actualizar el calendario sin refresh.
* Desarrollo de componentes accesibles para la gestión de reservas y cancelación anticipada.
* Creación de la pantalla del Simulador de Concurrencia para disparar `Promise.all` en paralelo.

### 🚀 Equipo DevOps & Aseguramiento de Calidad
* Configuración de Dockerfiles multi-stage y orquestación con `docker-compose.yml`.
* Healthchecks automáticos para PostgreSQL y Redis garantizando orden de encendido.
* Ejecución y validación de las pruebas de carga, concurrencia, seguridad e interfaz.
