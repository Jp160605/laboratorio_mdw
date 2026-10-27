---
sidebar_position: 7
title: Despliegue con Docker
---

# 🐳 Despliegue con Docker Compose

El proyecto está completamente preparado para levantarse con un solo comando gracias a **Docker Compose**, asegurando paridad exacta entre entornos de desarrollo, pruebas y evaluación.

---

## 🚀 Inicio Rápido

### 1. Clonar el repositorio
```bash
git clone https://github.com/Jp160605/laboratorio_mdw.git
cd laboratorio_mdw
```

### 2. Construir e Iniciar los Contenedores
```bash
docker compose up --build -d
```

Este comando levantará en segundo plano:
* `reservas_postgres` en el puerto `5432` (ejecutando automáticamente `init.sql` y `seed.sql`).
* `reservas_redis` en el puerto `6379`.
* `reservas_backend` en el puerto `4000`.
* `reservas_frontend` en el puerto `3000`.

---

## 📌 Puertos y URLs del Sistema

| Servicio | Puerto Host | URL de Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| **Frontend Web** | `3000` | [http://localhost:3000](http://localhost:3000) | Aplicación Next.js interactiva |
| **Backend REST API** | `4000` | [http://localhost:4000/health](http://localhost:4000/health) | Healthcheck y endpoints |
| **PostgreSQL** | `5432` | `localhost:5432` | Base de datos relacional |
| **Redis** | `6379` | `localhost:6379` | Servidor de caché y colas |

---

## 🛠️ Comandos de Mantenimiento

### Ver el estado de los contenedores
```bash
docker compose ps
```

### Consultar los registros en tiempo real
```bash
docker compose logs -f backend
```

### Reiniciar la base de datos limpia (borrando volúmenes)
```bash
docker compose down -v
docker compose up --build -d
```
