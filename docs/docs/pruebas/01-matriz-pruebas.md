---
sidebar_position: 1
title: Plan y Matriz de Pruebas
---

# 🧪 Plan y Matriz de Pruebas

Para garantizar la fiabilidad, robustez y usabilidad del sistema, se diseñó e implementó una batería de pruebas cubriendo las cinco dimensiones requeridas: **Contenido**, **Navegación**, **Interfaz**, **Rendimiento** y **Seguridad**.

---

## 1. 📝 Pruebas de Contenido

Evalúan la exactitud de los datos desplegados al usuario y la coherencia del estado del sistema.

| ID | Caso de Prueba | Entrada / Acción | Resultado Esperado | Estado |
| :--- | :--- | :--- | :--- | :---: |
| **PC-01** | Visualización de salas y aforos | Acceder al panel principal | Se listan las salas con su nombre, capacidad real y ubicación exacta según el seed de BD. | ✅ Aprobado |
| **PC-02** | Historial de reservas propio | Consultar "Mis Reservas" | Solo se muestran las reservas pertenecientes al usuario en sesión, con fechas y horas correctas. | ✅ Aprobado |
| **PC-03** | Algoritmo de Mejor Sala | Parámetros: Hora 10, Aforo 15 | Retorna la sala con menor costo matemático minimizando desviación y aforo desperdiciado. | ✅ Aprobado |

---

## 2. 🗺️ Pruebas de Navegación

Verifican la consistencia de las transiciones entre rutas y componentes.

| ID | Caso de Prueba | Entrada / Acción | Resultado Esperado | Estado |
| :--- | :--- | :--- | :--- | :---: |
| **PN-01** | Redirección de usuario anónimo | Intentar reservar sin loguearse | La aplicación bloquea la acción y solicita inicio de sesión o despliega el modal de login. | ✅ Aprobado |
| **PN-02** | Navegación entre pestañas | Alternar entre Calendario, Mis Reservas y Simulador | La interfaz cambia instantáneamente sin recarga de página completa (SPA con Next.js). | ✅ Aprobado |
| **PN-03** | Enlaces y breadcrumbs de documentación | Clic en el menú lateral de Docusaurus | Cada diagrama y sección carga de manera limpia sin enlaces rotos (cero errores 404). | ✅ Aprobado |

---

## 3. 🎨 Pruebas de Interfaz (UI / UX)

Validan la usabilidad, responsividad y retroalimentación visual al usuario.

| ID | Caso de Prueba | Entrada / Acción | Resultado Esperado | Estado |
| :--- | :--- | :--- | :--- | :---: |
| **PI-01** | Estados visuales de bloques horarios | Consultar la rejilla del calendario | Bloques libres en color verde, ocupados en rojo y reservas propias claramente identificadas. | ✅ Aprobado |
| **PI-02** | Actualización reactiva WebSockets | Reserva completada en otro cliente | La celda pasa a rojo en vivo sin parpadeos de pantalla ni refresco forzado. | ✅ Aprobado |
| **PI-03** | Alertas de conflicto amigables | Colisión en reserva concurrente | Toast / Modal informativo explicando claramente el motivo (HTTP 409) con opción de reintentar. | ✅ Aprobado |

---

## 4. ⚡ Pruebas de Rendimiento

Evalúan los tiempos de respuesta y el comportamiento ante alta demanda.

| ID | Caso de Prueba | Entrada / Acción | Resultado Esperado | Estado |
| :--- | :--- | :--- | :--- | :---: |
| **PR-01** | Aceleración con Caché Redis | Dos peticiones consecutivas a `/api/salas/disponibilidad` | Primera petición desde Postgres (~15ms); segunda petición servida desde Redis (< 3ms). | ✅ Aprobado |
| **PR-02** | Simulación de colisión paralela | Disparo con `Promise.all` de dos peticiones al mismo milisegundo | Una petición se consolida en 201 y la otra responde en 409 en menos de 25 ms sin deadlock. | ✅ Aprobado |
| **PR-03** | Asincronismo de correos con BullMQ | Confirmación de reserva | La API responde 201 de inmediato sin quedar bloqueada esperando la respuesta SMTP de red. | ✅ Aprobado |

---

## 5. 🔒 Pruebas de Seguridad

Garantizan la protección de los datos y la resiliencia contra vulnerabilidades comunes.

| ID | Caso de Prueba | Entrada / Acción | Resultado Esperado | Estado |
| :--- | :--- | :--- | :--- | :---: |
| **PS-01** | Hashing seguro de contraseñas | Registro de usuario | La contraseña se almacena con salting y hash de 10 rondas con `bcrypt`; jamás en texto plano. | ✅ Aprobado |
| **PS-02** | Verificación estricta de JWT | Petición a `/api/reservas` con token manipulado o vencido | Retorna HTTP 401 Unauthorized de forma segura. | ✅ Aprobado |
| **PS-03** | Prevención de Inyección SQL | Inyección de payloads `' OR 1=1 --` en parámetros | Las consultas usan sentencias preparadas parametrizadas en `pg` ($1, $2); payload inocuo. | ✅ Aprobado |
| **PS-04** | Protección contra sobreescritura ajena | Intentar cancelar la reserva de otro usuario | El backend valida que `reserva.usuario_id == req.user.id`; si difiere, retorna 403 Forbidden. | ✅ Aprobado |
