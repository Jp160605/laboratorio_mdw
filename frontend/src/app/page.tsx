'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import { Sala, Reserva, Usuario, ResultadoConcurrencia } from '@/types';
import Header from '@/components/Header';
import CalendarioGrid from '@/components/CalendarioGrid';
import MisReservas from '@/components/MisReservas';
import SugerirSala from '@/components/SugerirSala';
import SimuladorConcurrencia from '@/components/SimuladorConcurrencia';
import ModalReserva from '@/components/ModalReserva';
import ModalAuth from '@/components/ModalAuth';
import {
  apiLogin,
  apiObtenerDisponibilidad,
  apiCrearReserva,
  apiCancelarReserva,
  apiSimularColisionConcurrente,
} from '@/services/api';
import { Calendar, UserCheck, Sparkles, Zap, RefreshCw } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function Home() {
  const hoyStr = new Date().toISOString().split('T')[0];
  const [fechaSeleccionada, setFechaSeleccionada] = useState<string>(hoyStr);
  const [tabActiva, setTabActiva] = useState<'calendario' | 'mis-reservas' | 'sugerir' | 'concurrencia'>('calendario');

  // Estado del usuario activo
  const [usuarioActual, setUsuarioActual] = useState<Usuario | null>({
    id: 1,
    nombre: 'Juan Pérez (Alumno A)',
    email: 'alumnoA@universidad.edu',
  });
  const [tokenActual, setTokenActual] = useState<string>('');

  // Tokens cacheados para los usuarios demo A y B para el simulador de concurrencia
  const [tokenUsuarioA, setTokenUsuarioA] = useState<string>('');
  const [tokenUsuarioB, setTokenUsuarioB] = useState<string>('');

  // WebSockets
  const [wsConectado, setWsConectado] = useState<boolean>(false);

  // Salas y Reservas
  const [salas, setSalas] = useState<Sala[]>([]);
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [cargando, setCargando] = useState<boolean>(false);
  const [origenDatos, setOrigenDatos] = useState<string>('');

  // Modales
  const [modalReservaAbierto, setModalReservaAbierto] = useState<boolean>(false);
  const [bloqueSeleccionado, setBloqueSeleccionado] = useState<{ sala: Sala; hora: number } | null>(null);
  const [modalAuthAbierto, setModalAuthAbierto] = useState<boolean>(false);

  // 1. Cargar disponibilidad desde la API (con fallback de inicialización)
  const cargarDisponibilidad = useCallback(async (fecha: string) => {
    try {
      setCargando(true);
      const res = await apiObtenerDisponibilidad(fecha);
      setSalas(res.salas);
      setReservas(res.reservas);
      setOrigenDatos(res.origen);
    } catch (err: unknown) {
      console.warn('[Frontend] No se pudo conectar con la API de backend (usando estado local):', err);
    } finally {
      setCargando(false);
    }
  }, []);

  // 2. Inicialización de sesión demo y Socket.io
  useEffect(() => {
    // Autenticar automáticamente a los usuarios demo en el backend
    async function inicializarSesionesDemo() {
      try {
        const loginA = await apiLogin('alumnoA@universidad.edu', 'password123');
        setTokenUsuarioA(loginA.token);
        setTokenActual(loginA.token);
        setUsuarioActual(loginA.usuario);

        const loginB = await apiLogin('alumnoB@universidad.edu', 'password123');
        setTokenUsuarioB(loginB.token);
      } catch (e) {
        console.warn('[Frontend] No se pudieron autenticar automáticamente los usuarios demo:', e);
      }
    }

    inicializarSesionesDemo();
    cargarDisponibilidad(fechaSeleccionada);

    // Conectar a Socket.io
    const socket = io(API_BASE_URL, {
      reconnectionAttempts: 5,
      timeout: 3000,
    });

    socket.on('connect', () => {
      console.log('[Socket.io] Conectado al backend en tiempo real.');
      setWsConectado(true);
    });

    socket.on('disconnect', () => {
      console.log('[Socket.io] Desconectado del backend.');
      setWsConectado(false);
    });

    socket.on('calendario_actualizado', () => {
      console.log('[Socket.io] Evento recibido: calendario_actualizado. Refrescando cuadrícula...');
      cargarDisponibilidad(fechaSeleccionada);
    });

    return () => {
      socket.disconnect();
    };
  }, [cargarDisponibilidad, fechaSeleccionada]);

  // Al cambiar de fecha
  const handleCambiarFecha = (nuevaFecha: string) => {
    setFechaSeleccionada(nuevaFecha);
    cargarDisponibilidad(nuevaFecha);
  };

  // Alternador de usuario para pruebas
  const handleCambiarUsuario = (u: Usuario) => {
    setUsuarioActual(u);
    if (u.id === 1) {
      setTokenActual(tokenUsuarioA);
    } else {
      setTokenActual(tokenUsuarioB);
    }
  };

  // Abrir modal de reserva
  const handleSeleccionarBloque = (sala: Sala, horaInicio: number) => {
    setBloqueSeleccionado({ sala, hora: horaInicio });
    setModalReservaAbierto(true);
  };

  // Confirmar reserva real con transacción ACID y Bloqueo Optimista
  const handleConfirmarReserva = async (
    sala: Sala,
    fecha: string,
    horaInicio: number,
    versionEnviada: number
  ) => {
    if (!usuarioActual) {
      alert('Debes iniciar sesión para reservar.');
      return;
    }

    try {
      const res = await apiCrearReserva(
        {
          sala_id: sala.id,
          fecha,
          hora_inicio: horaInicio,
          version_actual: versionEnviada,
        },
        tokenActual
      );

      if (res.ok) {
        alert(`¡Reserva confirmada exitosamente! Versión actualizada a v${res.data.nueva_version_sala}`);
        setModalReservaAbierto(false);
        cargarDisponibilidad(fecha);
      } else {
        alert(`Error al reservar (${res.status}): ${res.data.error || 'Conflicto de concurrencia'}`);
        cargarDisponibilidad(fecha);
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Error al conectar con el servidor';
      alert(`Error de red: ${msg}`);
    }
  };

  // Cancelar reserva (RF-05)
  const handleCancelarReserva = async (reservaId: number) => {
    try {
      await apiCancelarReserva(reservaId, tokenActual);
      alert('Reserva cancelada exitosamente.');
      cargarDisponibilidad(fechaSeleccionada);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Error al cancelar la reserva';
      alert(msg);
    }
  };

  // Ejecutar Colisión Real con Promise.all
  const handleEjecutarColision = async (
    salaId: number,
    hora: number,
    versionActual: number
  ): Promise<{ resultadoA: ResultadoConcurrencia; resultadoB: ResultadoConcurrencia }> => {
    try {
      const resultado = await apiSimularColisionConcurrente(
        salaId,
        fechaSeleccionada,
        hora,
        versionActual,
        tokenUsuarioA,
        tokenUsuarioB
      );
      // Refrescar disponibilidad tras la colisión
      cargarDisponibilidad(fechaSeleccionada);
      return resultado;
    } catch {
      // Fallback en caso de que el backend no responda
      const fallbackA: ResultadoConcurrencia = {
        usuario: 'Petición 1 (Usuario A)',
        status: 201,
        exito: true,
        mensaje: '201 Created (Simulación local): Transacción confirmada.',
        timestamp: new Date().toISOString(),
      };
      const fallbackB: ResultadoConcurrencia = {
        usuario: 'Petición 2 (Usuario B)',
        status: 409,
        exito: false,
        mensaje: '409 Conflict (Simulación local): Optimistic Lock Exception.',
        timestamp: new Date().toISOString(),
      };
      return { resultadoA: fallbackA, resultadoB: fallbackB };
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 font-sans">
      <Header
        usuarioActual={usuarioActual}
        onCambiarUsuario={handleCambiarUsuario}
        onAbrirAuth={() => setModalAuthAbierto(true)}
        wsConectado={wsConectado}
      />

      <main className="mx-auto max-w-7xl p-4 sm:p-6 space-y-6">
        {/* Barra de Navegación por Pestañas */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-gray-300 bg-white p-2 rounded shadow-sm">
          <nav className="flex flex-wrap gap-2 text-xs font-bold">
            <button
              type="button"
              onClick={() => setTabActiva('calendario')}
              className={`flex items-center gap-1.5 rounded px-3 py-2 transition ${
                tabActiva === 'calendario'
                  ? 'bg-black text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Calendar className="h-4 w-4" />
              <span>1. Calendario (RF-02)</span>
            </button>

            <button
              type="button"
              onClick={() => setTabActiva('mis-reservas')}
              className={`flex items-center gap-1.5 rounded px-3 py-2 transition ${
                tabActiva === 'mis-reservas'
                  ? 'bg-black text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <UserCheck className="h-4 w-4" />
              <span>2. Mis Reservas (RF-05, RF-07)</span>
            </button>

            <button
              type="button"
              onClick={() => setTabActiva('sugerir')}
              className={`flex items-center gap-1.5 rounded px-3 py-2 transition ${
                tabActiva === 'sugerir'
                  ? 'bg-black text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Sparkles className="h-4 w-4" />
              <span>3. Sugerir Mejor Sala (Reto)</span>
            </button>

            <button
              type="button"
              onClick={() => setTabActiva('concurrencia')}
              className={`flex items-center gap-1.5 rounded px-3 py-2 transition ${
                tabActiva === 'concurrencia'
                  ? 'bg-amber-600 text-white'
                  : 'text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-300'
              }`}
            >
              <Zap className="h-4 w-4" />
              <span>4. ⚡ Simulador de Concurrencia (Demo RF-04)</span>
            </button>
          </nav>

          {/* Estado de origen de datos (Redis vs Postgres) */}
          <div className="flex items-center gap-2 text-[11px] text-gray-500 font-mono">
            {origenDatos && (
              <span className="rounded bg-gray-100 px-2 py-0.5 border border-gray-200">
                Origen: {origenDatos}
              </span>
            )}
            <button
              type="button"
              onClick={() => cargarDisponibilidad(fechaSeleccionada)}
              className="flex items-center gap-1 text-gray-600 hover:text-black"
              title="Refrescar manualmente"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${cargando ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Vistas */}
        {tabActiva === 'calendario' && (
          <CalendarioGrid
            fechaSeleccionada={fechaSeleccionada}
            onCambiarFecha={handleCambiarFecha}
            salas={salas}
            reservas={reservas}
            usuarioActual={usuarioActual}
            onSeleccionarBloque={handleSeleccionarBloque}
          />
        )}

        {tabActiva === 'mis-reservas' && (
          <MisReservas
            reservas={reservas}
            usuarioActual={usuarioActual}
            onCancelarReserva={handleCancelarReserva}
          />
        )}

        {tabActiva === 'sugerir' && (
          <SugerirSala
            fechaActual={fechaSeleccionada}
            salas={salas}
            onReservarSugerencia={(sala, hora) => {
              handleSeleccionarBloque(sala, hora);
              setTabActiva('calendario');
            }}
          />
        )}

        {tabActiva === 'concurrencia' && (
          <SimuladorConcurrencia
            salas={salas}
            onEjecutarColision={handleEjecutarColision}
          />
        )}
      </main>

      {/* Modales */}
      <ModalReserva
        abierto={modalReservaAbierto}
        onCerrar={() => setModalReservaAbierto(false)}
        sala={bloqueSeleccionado?.sala || null}
        fecha={fechaSeleccionada}
        horaInicio={bloqueSeleccionado?.hora || 8}
        usuarioActual={usuarioActual}
        onConfirmar={handleConfirmarReserva}
      />

      <ModalAuth
        abierto={modalAuthAbierto}
        onCerrar={() => setModalAuthAbierto(false)}
        onLoginExitoso={(u) => {
          setUsuarioActual(u);
        }}
      />
    </div>
  );
}
