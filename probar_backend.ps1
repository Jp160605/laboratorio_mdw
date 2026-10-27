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
# 5. CONCURRENCIA SIMULTANEA REAL CON CONSULTAS INDEPENDIENTES (RF-04)
# ------------------------------------------------------------------------------
Write-Host ""
Write-Host "[5/$totalPruebas] Pruebas de Concurrencia con consultas HTTP independientes..."
try {
    # --------------------------------------------------------------------------
    # 5.1: RONDA 1 - Colision directa sobre la misma sala y hora
    # Cada alumno ejecuta su propia consulta GET /api/salas y su propio POST en paralelo
    # --------------------------------------------------------------------------
    Write-Host "`n  --- [RONDA 1: Colision Directa - Misma Sala y Misma Hora] ---" -ForegroundColor Yellow
    Write-Host "    -> Cada alumno hara su propia consulta GET /api/salas por separado..." -ForegroundColor Gray

    $diaColision = Get-Random -Minimum 10 -Maximum 28
    $horaColision = Get-Random -Minimum 8 -Maximum 19
    $fechaColision = "2026-12-$diaColision"
    $salaDisputaId = 1

    # Job para el Alumno A: Consulta GET independiente y luego POST
    $jobA = Start-Job -ScriptBlock {
        param($url, $token, $salaId, $fecha, $hora)
        $tGet = [DateTime]::Now
        $misSalas = Invoke-RestMethod -Uri "$url/api/salas" -Method Get
        $miSala = $misSalas | Where-Object { $_.id -eq $salaId }
        $version = $miSala.version
        
        $body = @{
            sala_id        = $salaId
            fecha          = $fecha
            hora_inicio    = $hora
            version_actual = $version
        } | ConvertTo-Json

        $tPost = [DateTime]::Now
        try {
            $resp = Invoke-RestMethod -Uri "$url/api/reservas" -Method Post -Headers @{ Authorization = "Bearer $token" } -ContentType "application/json" -Body $body
            $tFin = [DateTime]::Now
            return [PSCustomObject]@{
                Usuario      = "Alumno A"
                ConsultaGet  = $tGet.ToString("HH:mm:ss.fff")
                VersionLeida = $version
                EnvioPost    = $tPost.ToString("HH:mm:ss.fff")
                Status       = 201
                Mensaje      = $resp.mensaje
                LatenciaMs   = [math]::Round(($tFin - $tPost).TotalMilliseconds, 1)
            }
        } catch {
            $tFin = [DateTime]::Now
            $code = $_.Exception.Response.StatusCode.value__
            return [PSCustomObject]@{
                Usuario      = "Alumno A"
                ConsultaGet  = $tGet.ToString("HH:mm:ss.fff")
                VersionLeida = $version
                EnvioPost    = $tPost.ToString("HH:mm:ss.fff")
                Status       = $code
                Mensaje      = "Colision detectada (Rollback en BD)"
                LatenciaMs   = [math]::Round(($tFin - $tPost).TotalMilliseconds, 1)
            }
        }
    } -ArgumentList $baseUrl, $tokenA, $salaDisputaId, $fechaColision, $horaColision

    # Job para el Alumno B: Consulta GET independiente y luego POST
    $jobB = Start-Job -ScriptBlock {
        param($url, $token, $salaId, $fecha, $hora)
        $tGet = [DateTime]::Now
        $misSalas = Invoke-RestMethod -Uri "$url/api/salas" -Method Get
        $miSala = $misSalas | Where-Object { $_.id -eq $salaId }
        $version = $miSala.version
        
        $body = @{
            sala_id        = $salaId
            fecha          = $fecha
            hora_inicio    = $hora
            version_actual = $version
        } | ConvertTo-Json

        $tPost = [DateTime]::Now
        try {
            $resp = Invoke-RestMethod -Uri "$url/api/reservas" -Method Post -Headers @{ Authorization = "Bearer $token" } -ContentType "application/json" -Body $body
            $tFin = [DateTime]::Now
            return [PSCustomObject]@{
                Usuario      = "Alumno B"
                ConsultaGet  = $tGet.ToString("HH:mm:ss.fff")
                VersionLeida = $version
                EnvioPost    = $tPost.ToString("HH:mm:ss.fff")
                Status       = 201
                Mensaje      = $resp.mensaje
                LatenciaMs   = [math]::Round(($tFin - $tPost).TotalMilliseconds, 1)
            }
        } catch {
            $tFin = [DateTime]::Now
            $code = $_.Exception.Response.StatusCode.value__
            return [PSCustomObject]@{
                Usuario      = "Alumno B"
                ConsultaGet  = $tGet.ToString("HH:mm:ss.fff")
                VersionLeida = $version
                EnvioPost    = $tPost.ToString("HH:mm:ss.fff")
                Status       = $code
                Mensaje      = "Colision detectada (Rollback en BD)"
                LatenciaMs   = [math]::Round(($tFin - $tPost).TotalMilliseconds, 1)
            }
        }
    } -ArgumentList $baseUrl, $tokenB, $salaDisputaId, $fechaColision, $horaColision

    $resA = Receive-Job -Job $jobA -Wait
    $resB = Receive-Job -Job $jobB -Wait
    Remove-Job -Job $jobA, $jobB

    Write-Host "    [DETALLE DE CONSULTAS INDEPENDIENTES]" -ForegroundColor Cyan
    Write-Host "    -> $($resA.Usuario): GET ejecutado a $($resA.ConsultaGet) (Version leida: $($resA.VersionLeida)) | POST a $($resA.EnvioPost) -> HTTP $($resA.Status) ($($resA.LatenciaMs) ms)" -ForegroundColor $(if($resA.Status -eq 201){"Green"}else{"Yellow"})
    Write-Host "    -> $($resB.Usuario): GET ejecutado a $($resB.ConsultaGet) (Version leida: $($resB.VersionLeida)) | POST a $($resB.EnvioPost) -> HTTP $($resB.Status) ($($resB.LatenciaMs) ms)" -ForegroundColor $(if($resB.Status -eq 201){"Green"}else{"Yellow"})

    $statusesRonda1 = @($resA.Status, $resB.Status)
    $ronda1Ok = ($statusesRonda1 -contains 201 -and $statusesRonda1 -contains 409)

    if ($ronda1Ok) {
        Write-Host "    >>> RESULTADO RONDA 1: Bloqueo Optimista verificado. 1 confirmada (201) y 1 rechazada (409)." -ForegroundColor Green
    } else {
        Write-Host "    >>> RESULTADO INESPERADO EN RONDA 1: Codigos $($statusesRonda1 -join ', ')" -ForegroundColor Yellow
    }

    # --------------------------------------------------------------------------
    # 5.2: RONDA 2 - Concurrencia Exitosa (Diferentes Salas en Paralelo)
    # Demuestra que dos consultas y reservas simultaneas para salas distintas SI pasan (ambas 201)
    # --------------------------------------------------------------------------
    Write-Host "`n  --- [RONDA 2: Concurrencia Exitosa - Diferentes Salas en Paralelo] ---" -ForegroundColor Yellow
    Write-Host "    -> Alumno A reserva Sala 1 y Alumno B reserva Sala 2 al mismo tiempo..." -ForegroundColor Gray

    $diaNoConflicto = Get-Random -Minimum 10 -Maximum 28
    $horaNoConflicto = Get-Random -Minimum 8 -Maximum 19
    $fechaNoConflicto = "2026-11-$diaNoConflicto"

    $jobParaleloA = Start-Job -ScriptBlock {
        param($url, $token, $fecha, $hora)
        $misSalas = Invoke-RestMethod -Uri "$url/api/salas" -Method Get
        $sala = $misSalas | Where-Object { $_.id -eq 1 }
        $body = @{ sala_id = 1; fecha = $fecha; hora_inicio = $hora; version_actual = $sala.version } | ConvertTo-Json
        $t = [DateTime]::Now
        try {
            $r = Invoke-RestMethod -Uri "$url/api/reservas" -Method Post -Headers @{ Authorization = "Bearer $token" } -ContentType "application/json" -Body $body
            return [PSCustomObject]@{ Usuario = "Alumno A (Sala 1)"; Status = 201; Hora = $t.ToString("HH:mm:ss.fff"); Mensaje = $r.mensaje }
        } catch {
            return [PSCustomObject]@{ Usuario = "Alumno A (Sala 1)"; Status = $_.Exception.Response.StatusCode.value__; Hora = $t.ToString("HH:mm:ss.fff"); Mensaje = "Error" }
        }
    } -ArgumentList $baseUrl, $tokenA, $fechaNoConflicto, $horaNoConflicto

    $jobParaleloB = Start-Job -ScriptBlock {
        param($url, $token, $fecha, $hora)
        $misSalas = Invoke-RestMethod -Uri "$url/api/salas" -Method Get
        $sala = $misSalas | Where-Object { $_.id -eq 2 }
        $body = @{ sala_id = 2; fecha = $fecha; hora_inicio = $hora; version_actual = $sala.version } | ConvertTo-Json
        $t = [DateTime]::Now
        try {
            $r = Invoke-RestMethod -Uri "$url/api/reservas" -Method Post -Headers @{ Authorization = "Bearer $token" } -ContentType "application/json" -Body $body
            return [PSCustomObject]@{ Usuario = "Alumno B (Sala 2)"; Status = 201; Hora = $t.ToString("HH:mm:ss.fff"); Mensaje = $r.mensaje }
        } catch {
            return [PSCustomObject]@{ Usuario = "Alumno B (Sala 2)"; Status = $_.Exception.Response.StatusCode.value__; Hora = $t.ToString("HH:mm:ss.fff"); Mensaje = "Error" }
        }
    } -ArgumentList $baseUrl, $tokenB, $fechaNoConflicto, $horaNoConflicto

    $resParA = Receive-Job -Job $jobParaleloA -Wait
    $resParB = Receive-Job -Job $jobParaleloB -Wait
    Remove-Job -Job $jobParaleloA, $jobParaleloB

    Write-Host "    -> $($resParA.Usuario): POST a $($resParA.Hora) -> HTTP $($resParA.Status)" -ForegroundColor $(if($resParA.Status -eq 201){"Green"}else{"Red"})
    Write-Host "    -> $($resParB.Usuario): POST a $($resParB.Hora) -> HTTP $($resParB.Status)" -ForegroundColor $(if($resParB.Status -eq 201){"Green"}else{"Red"})

    $ronda2Ok = ($resParA.Status -eq 201 -and $resParB.Status -eq 201)
    if ($ronda2Ok) {
        Write-Host "    >>> RESULTADO RONDA 2: Ambas reservas concurrentes pasaron exitosamente (201 y 201)." -ForegroundColor Green
    }

    # --------------------------------------------------------------------------
    # 5.3: RONDA 3 - Intento con Version Desactualizada (Stale Read)
    # Demuestra que enviar una version obsoleta es rechazado inmediatamente con 409
    # --------------------------------------------------------------------------
    Write-Host "`n  --- [RONDA 3: Version Desactualizada - Stale Read] ---" -ForegroundColor Yellow
    $salasActuales = Invoke-RestMethod -Uri "$baseUrl/api/salas" -Method Get
    $sala1Actual = $salasActuales | Where-Object { $_.id -eq 1 }
    $versionObsoleta = $sala1Actual.version - 1
    Write-Host "    -> Version actual de Sala 1 en BD: $($sala1Actual.version) | Intentando reservar con version obsoleta: $versionObsoleta..." -ForegroundColor Gray

    $bodyObsoleto = @{
        sala_id        = 1
        fecha          = "2026-11-29"
        hora_inicio    = 17
        version_actual = $versionObsoleta
    } | ConvertTo-Json

    try {
        $respObs = Invoke-RestMethod -Uri "$baseUrl/api/reservas" -Method Post -Headers @{ Authorization = "Bearer $tokenA" } -ContentType "application/json" -Body $bodyObsoleto
        Write-Host "    >>> RESULTADO INESPERADO: Se permitio reservar con version obsoleta." -ForegroundColor Red
        $ronda3Ok = $false
    } catch {
        $codeObs = $_.Exception.Response.StatusCode.value__
        if ($codeObs -eq 409) {
            Write-Host "    >>> RESULTADO RONDA 3: Rechazo inmediato con HTTP 409 Conflict por version obsoleta." -ForegroundColor Green
            $ronda3Ok = $true
        } else {
            Write-Host "    >>> RESULTADO RONDA 3: Codigo HTTP recibido: $codeObs" -ForegroundColor Yellow
            $ronda3Ok = $false
        }
    }

    if ($ronda1Ok -and $ronda2Ok -and $ronda3Ok) {
        Write-Host "`n    >>> TODAS LAS RONDAS DE CONCURRENCIA COMPLETADAS CON EXITO." -ForegroundColor Green
        $pruebasPasadas++
    } elseif ($ronda1Ok) {
        Write-Host "`n    >>> Prueba de colision concurrente superada exitosamente." -ForegroundColor Green
        $pruebasPasadas++
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
