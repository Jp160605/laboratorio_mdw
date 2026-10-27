---
sidebar_position: 3
title: 3. Modelo de Interacción y Estados
---

# 🔄 Modelo de Interacción y Estados

El modelo de interacción describe cómo el usuario interactúa con el sistema para mutar el estado de los recursos (salas y bloques horarios), y cómo reacciona el backend ante condiciones normales y colisiones.

---

## 🚦 Máquina de Estados de un Bloque Horario

```mermaid
stateDiagram-v2
    [*] --> BloqueLibre : Inicialización con Seed SQL

    BloqueLibre --> EnProcesoReserva : Usuario selecciona bloque (Lee Versión N)

    state EnProcesoReserva {
        [*] --> ValidandoDisponibilidad
        ValidandoDisponibilidad --> IntentandoUpdateVersion : BEGIN Transaction
        IntentandoUpdateVersion --> CommitExitoso : version == N (1 fila afectada)
        IntentandoUpdateVersion --> RollbackConflicto : version != N (0 filas afectadas)
    }

    CommitExitoso --> BloqueOcupado : HTTP 201 Created (Versión pasa a N + 1)
    RollbackConflicto --> BloqueOcupado : HTTP 409 Conflict (Otro usuario ganó el recurso)

    BloqueOcupado --> EnProcesoCancelacion : Usuario solicita cancelación
    
    state EnProcesoCancelacion {
        [*] --> EvaluandoTiempo
        EvaluandoTiempo --> RechazadoPorAnticipacion : Faltan menos de 2 horas
        EvaluandoTiempo --> AprobadoPorAnticipacion : Faltan 2 horas o más
    }

    RechazadoPorAnticipacion --> BloqueOcupado : HTTP 400 (Se mantiene reserva activa)
    AprobadoPorAnticipacion --> BloqueLibre : HTTP 200 (Estado = CANCELADA, Versión incrementada)

    BloqueOcupado --> [*] : Bloque Horario Concluido
```

---

## ⚡ Flujo de Interacción: Concurrencia Simultánea

```mermaid
flowchart TD
    Inicio(["Dos usuarios visualizan la misma Sala (Versión 1) a las 10:00"])
    
    U1["Usuario A envía POST /reservas\n(version_esperada: 1)"]
    U2["Usuario B envía POST /reservas\n(version_esperada: 1)"]
    
    Inicio --> U1
    Inicio --> U2

    subgraph BackendACID ["Transacciones Aisladas en PostgreSQL"]
        T1["Transacción A:\nUPDATE salas SET version = 2\nWHERE id = 1 AND version = 1"]
        T2["Transacción B:\nUPDATE salas SET version = 2\nWHERE id = 1 AND version = 1"]
    end

    U1 --> T1
    U2 --> T2

    T1 -->|Gana el Lock de Fila| T1_OK["1 Fila Afectada\nINSERT INTO reservas...\nCOMMIT"]
    T2 -->|Espera y evalúa sobre v=2| T2_FAIL["0 Filas Afectadas\n(La versión ya es 2)\nROLLBACK"]

    T1_OK --> ResA["✅ Respuesta 201 Created a Usuario A\n(Notifica a Sockets & BullMQ)"]
    T2_FAIL --> ResB["⛔ Respuesta 409 Conflict a Usuario B\n('Conflicto: la sala ya fue reservada')"]
```

---

## 📌 Garantías de la Interacción

1. **Aislamiento e Idempotencia:** Ningún bloque puede quedar en un estado inconsistente o parcialmente reservado.
2. **Retroalimentación Inmediata:** Si un usuario pierde la contienda de reserva, la UI muestra inmediatamente una alerta amigable explicándole que el recurso fue tomado por otro usuario y refresca los datos.
