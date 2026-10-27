# Reglas del Proyecto y del Agente

## 🚨 REGLA 1 (ESTRICTA Y PRIORIDAD MÁXIMA): CONTROL DE GIT PUSH
- **PROHIBIDO hacer `git push` automáticamente.**
- El agente **NUNCA** debe ejecutar el comando `git push` por iniciativa propia, ni al terminar una funcionalidad, ni al verificar pruebas, ni tras realizar un `git commit`.
- **ÚNICA EXCEPCIÓN:** El agente solo tiene permitido ejecutar `git push` cuando el usuario lo solicite de manera **explícita y textual** en su mensaje (ej. *"haz push"*, *"sube los cambios al repo"*, *"haz git push"*).
- Si el usuario no pide push explícitamente, los cambios deben permanecer únicamente en el entorno local.

---

## 📌 REGLA 2: VALIDACIONES TEMPORALES DE RESERVAS
- No permitir reservas en fechas pasadas (`fecha < fecha_actual`).
- No permitir reservas en bloques horarios que ya hayan concluido en el día de hoy (`hora_fin <= hora_actual`).
- Se permite reservar el bloque en curso (ej. a las 11:30 se puede reservar de 11:00 a 12:00, pero no de 10:00 a 11:00).
- Esta validación debe aplicarse tanto en Backend (controlador) como en Frontend (grilla, modal y contexto).

---

## 📌 REGLA 3: INTEGRIDAD Y CONTROL DE CONCURRENCIA
- Todo cambio en la tabla `salas` y `reservas` debe respetar el Bloqueo Optimista mediante la columna `version`.
- Cero uso de ORMs: siempre usar SQL puro mediante `pg` con transacciones explícitas (`BEGIN`, `COMMIT`, `ROLLBACK`).
- Validar compilación con TypeScript (`npx tsc --noEmit`) antes de reportar tareas completadas.
