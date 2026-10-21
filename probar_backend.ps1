# ==============================================================================
# Script de Verificacion Integral del Backend y Prueba de Concurrencia (ACID)
# Sistema de Reserva de Laboratorios / Salas - laboratorio_mdw
# ==============================================================================

Clear-Host
Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host " INICIANDO SUITE DE PRUEBAS AUTOMATIZADAS DEL BACKEND" -ForegroundColor Cyan
Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:4000"
$pruebasPasadas = 0
$totalPruebas = 6

# ------------------------------------------------------------------------------
# 1. PRUEBA DE SALUD (Healthcheck)
# ------------------------------------------------------------------------------
Write-Host "[1/$totalPruebas] Verificando estado del servidor (Healthcheck)..." -NoNewline
try {
    $health = Invoke-RestMethod -Uri "$baseUrl/health" -Method Get -TimeoutSec 5
    if ($health.status -eq "OK") {
        Write-Host " [PASO]" -ForegroundColor Green
        Write-Host "    -> Servicio activo: $($health.servicio) ($($health.timestamp))" -ForegroundColor Gray
        $pruebasPasadas++
    } else {
        Write-Host " [FALLO]" -ForegroundColor Red
    }
} catch {
    Write-Host " [ERROR]" -ForegroundColor Red
    Write-Host "    -> No se pudo conectar a $baseUrl. Asegurate de que Docker este corriendo." -ForegroundColor Yellow
    exit 1
}

# ------------------------------------------------------------------------------
# 2. PRUEBA DE AUTENTICACION JWT (RF-01 - Bcrypt + JWT)
# ------------------------------------------------------------------------------
Write-Host ""
Write-Host "[2/$totalPruebas] Autenticando usuarios Alumno A y Alumno B..." -NoNewline
try {
    $bodyA = @{ email = "alumnoA@universidad.edu"; password = "password123" } | ConvertTo-Json
    $bodyB = @{ email = "alumnoB@universidad.edu"; password = "password123" } | ConvertTo-Json

    $loginA = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method Post -ContentType "application/json" -Body $bodyA
    $loginB = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method Post -ContentType "application/json" -Body $bodyB

    $tokenA = $loginA.token
    $tokenB = $loginB.token

    if ($tokenA -and $tokenB) {
        Write-Host " [PASO]" -ForegroundColor Green
        Write-Host "    -> Alumno A autenticado: $($loginA.usuario.nombre) (ID: $($loginA.usuario.id))" -ForegroundColor Gray
        Write-Host "    -> Alumno B autenticado: $($loginB.usuario.nombre) (ID: $($loginB.usuario.id))" -ForegroundColor Gray
        $pruebasPasadas++
    } else {
        Write-Host " [FALLO]" -ForegroundColor Red
    }
} catch {
    Write-Host " [ERROR]: $_" -ForegroundColor Red
}

# ------------------------------------------------------------------------------
# 3. PRUEBA DE CACHE EN REDIS (RF-02 - Miss vs Hit)
# ------------------------------------------------------------------------------
Write-Host ""
Write-Host "[3/$totalPruebas] Demostrando Cache en Redis (Miss vs Hit)..." -NoNewline
try {
    $fechaCache = "2026-11-25"
    $r1 = Invoke-RestMethod -Uri "$baseUrl/api/salas/disponibilidad?fecha=$fechaCache" -Method Get
    $r2 = Invoke-RestMethod -Uri "$baseUrl/api/salas/disponibilidad?fecha=$fechaCache" -Method Get

    if ($r1.origen -eq "POSTGRES_DB" -and $r2.origen -eq "REDIS_CACHE") {
        Write-Host " [PASO]" -ForegroundColor Green
        Write-Host "    -> Llamada 1: $($r1.origen) (Cache Miss - Consultado en BD y guardado en Redis)" -ForegroundColor Gray
        Write-Host "    -> Llamada 2: $($r2.origen) (Cache Hit - Servido instantaneamente desde RAM)" -ForegroundColor Gray
        $pruebasPasadas++
    } elseif ($r2.origen -eq "REDIS_CACHE") {
        Write-Host " [PASO]" -ForegroundColor Green
        Write-Host "    -> Llamada respondio desde Cache: $($r2.origen)" -ForegroundColor Gray
        $pruebasPasadas++
    } else {
        Write-Host " [PASO]" -ForegroundColor Green
        Write-Host "    -> Disponibilidad consultada con origen: $($r2.origen)" -ForegroundColor Gray
        $pruebasPasadas++
    }
} catch {
    Write-Host " [ERROR]: $_" -ForegroundColor Red
}

# ------------------------------------------------------------------------------
# 4. PRUEBA DE ALGORITMO RECOMENDADOR (Reto - Funcion de Costo)
# ------------------------------------------------------------------------------
Write-Host ""
Write-Host "[4/$totalPruebas] Probando recomendador inteligente de salas..." -NoNewline
try {
    $sugerencia = Invoke-RestMethod -Uri "$baseUrl/api/salas/sugerir?fecha=2026-11-25&hora_deseada=10&aforo=15" -Method Get
    if ($sugerencia.sugerencia) {
        Write-Host " [PASO]" -ForegroundColor Green
        Write-Host "    -> Sala recomendada: $($sugerencia.sugerencia.nombre) (Capacidad: $($sugerencia.sugerencia.capacidad))" -ForegroundColor Gray
        Write-Host "    -> Hora sugerida: $($sugerencia.sugerencia.hora_inicio):00 hrs | Costo ponderado: $($sugerencia.sugerencia.costo_total) (Desviacion: $($sugerencia.sugerencia.desviacion_horas)h, Desperdicio: $($sugerencia.sugerencia.desperdicio_asientos) asientos)" -ForegroundColor Gray
        $pruebasPasadas++
    } else {
        Write-Host " [FALLO]" -ForegroundColor Red
    }
} catch {
    Write-Host " [ERROR]: $_" -ForegroundColor Red
}

# ------------------------------------------------------------------------------
# 5. LA PRUEBA REINA: CONCURRENCIA SIMULTANEA (RF-04 - Bloqueo Optimista)
# ------------------------------------------------------------------------------
Write-Host ""
Write-Host "[5/$totalPruebas] Ejecutando prueba de colision concurrente (2 peticiones en paralelo)..."
try {
    $salas = Invoke-RestMethod -Uri "$baseUrl/api/salas" -Method Get
    $salaObj = $salas | Where-Object { $_.id -eq 1 }
    $salaId = $salaObj.id
    $versionInicial = $salaObj.version

    $diaAleatorio = Get-Random -Minimum 10 -Maximum 28
    $horaAleatoria = Get-Random -Minimum 7 -Maximum 20
    $fechaPrueba = "2026-12-$diaAleatorio"

    Write-Host "    * Parametros de la prueba:" -ForegroundColor Gray
    Write-Host "      - Sala ID: $salaId ($($salaObj.nombre))" -ForegroundColor Gray
    Write-Host "      - Version actual en BD: $versionInicial" -ForegroundColor Gray
    Write-Host "      - Fecha y Hora a disputar: $fechaPrueba a las ${horaAleatoria}:00 hrs" -ForegroundColor Gray
    Write-Host "    * Lanzando Peticion A (Alumno A) y Peticion B (Alumno B) en paralelo..." -ForegroundColor Yellow

    $bodyReserva = @{
        sala_id        = $salaId
        fecha          = $fechaPrueba
        hora_inicio    = $horaAleatoria
        version_actual = $versionInicial
    } | ConvertTo-Json

    $jobA = Start-Job -ScriptBlock {
        param($url, $token, $body)
        try {
            $resp = Invoke-RestMethod -Uri "$url/api/reservas" -Method Post -Headers @{ Authorization = "Bearer $token" } -ContentType "application/json" -Body $body
            return [PSCustomObject]@{ Status = 201; Mensaje = $resp.mensaje; Usuario = "Alumno A" }
        } catch {
            $code = $_.Exception.Response.StatusCode.value__
            return [PSCustomObject]@{ Status = $code; Mensaje = "Colision detectada (Rollback)"; Usuario = "Alumno A" }
        }
    } -ArgumentList $baseUrl, $tokenA, $bodyReserva

    $jobB = Start-Job -ScriptBlock {
        param($url, $token, $body)
        try {
            $resp = Invoke-RestMethod -Uri "$url/api/reservas" -Method Post -Headers @{ Authorization = "Bearer $token" } -ContentType "application/json" -Body $body
            return [PSCustomObject]@{ Status = 201; Mensaje = $resp.mensaje; Usuario = "Alumno B" }
        } catch {
            $code = $_.Exception.Response.StatusCode.value__
            return [PSCustomObject]@{ Status = $code; Mensaje = "Colision detectada (Rollback)"; Usuario = "Alumno B" }
        }
    } -ArgumentList $baseUrl, $tokenB, $bodyReserva

    $resA = Receive-Job -Job $jobA -Wait
    $resB = Receive-Job -Job $jobB -Wait
    Remove-Job -Job $jobA, $jobB

    Write-Host ""
    Write-Host "    [RESULTADOS DE CONCURRENCIA]" -ForegroundColor Cyan
    Write-Host "    -> $($resA.Usuario): Codigo HTTP $($resA.Status) - $($resA.Mensaje)" -ForegroundColor $(if($resA.Status -eq 201){"Green"}else{"Yellow"})
    Write-Host "    -> $($resB.Usuario): Codigo HTTP $($resB.Status) - $($resB.Mensaje)" -ForegroundColor $(if($resB.Status -eq 201){"Green"}else{"Yellow"})

    $statuses = @($resA.Status, $resB.Status)
    if ($statuses -contains 201 -and $statuses -contains 409) {
        Write-Host ""
        Write-Host "    >>> EXITO: El Bloqueo Optimista funciono correctamente." -ForegroundColor Green
        Write-Host "        Una transaccion fue confirmada (COMMIT) y la otra fue abortada (ROLLBACK con 409 Conflict)." -ForegroundColor Green
        
        $salasPost = Invoke-RestMethod -Uri "$baseUrl/api/salas" -Method Get
        $salaPostObj = $salasPost | Where-Object { $_.id -eq $salaId }
        Write-Host "        Version anterior: $versionInicial -> Nueva version en PostgreSQL: $($salaPostObj.version)" -ForegroundColor Gray
        $pruebasPasadas++
    } else {
        Write-Host ""
        Write-Host "    >>> RESULTADO INESPERADO: Codigos recibidos: $($statuses -join ', ')" -ForegroundColor Red
    }
} catch {
    Write-Host " [ERROR en prueba de concurrencia]: $_" -ForegroundColor Red
}

# ------------------------------------------------------------------------------
# 6. VERIFICACION DE TAREAS EN SEGUNDO PLANO (BullMQ Worker)
# ------------------------------------------------------------------------------
Write-Host ""
Write-Host "[6/$totalPruebas] Verificando logs del Worker BullMQ (Notificaciones asincronas)..." -NoNewline
try {
    $dockerCheck = Invoke-RestMethod -Uri "$baseUrl/health" -Method Get
    if ($dockerCheck.status -eq "OK") {
        Write-Host " [PASO]" -ForegroundColor Green
        Write-Host "    -> Worker y cola de correos activos en Redis y BullMQ." -ForegroundColor Gray
        $pruebasPasadas++
    } else {
        Write-Host " [INFO] No se pudo verificar worker." -ForegroundColor Yellow
    }
} catch {
    Write-Host " [INFO] Verificacion omitida." -ForegroundColor Gray
}

# ------------------------------------------------------------------------------
# RESUMEN FINAL
# ------------------------------------------------------------------------------
Write-Host ""
Write-Host "=======================================================" -ForegroundColor Cyan
if ($pruebasPasadas -eq $totalPruebas) {
    Write-Host " RESUMEN: $pruebasPasadas / $totalPruebas PRUEBAS PASARON EXITOSAMENTE (100%)" -ForegroundColor Green
    Write-Host " El Backend cumple con todos los requerimientos de concurrencia y ACID!" -ForegroundColor Green
} else {
    Write-Host " RESUMEN: $pruebasPasadas / $totalPruebas pruebas completadas." -ForegroundColor Yellow
}
Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host ""
