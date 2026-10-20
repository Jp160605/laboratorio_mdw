'use client';

import React, { useState } from 'react';
import { Sala, Reserva, Usuario, ResultadoConcurrencia } from '@/types';
import Header from '@/components/Header';
import CalendarioGrid from '@/components/CalendarioGrid';
import MisReservas from '@/components/MisReservas';
import SugerirSala from '@/components/SugerirSala';
import SimuladorConcurrencia from '@/components/SimuladorConcurrencia';
import ModalReserva from '@/components/ModalReserva';
import ModalAuth from '@/components/ModalAuth';
import { Calendar, UserCheck, Sparkles, Zap } from 'lucide-react';

export default function Home() {
  // Fecha inicial en formato YYYY-MM-DD
  const hoyStr = new Date().toISOString().split('T')[0];
  const [fechaSeleccionada, setFechaSeleccionada] = useState<string>(hoyStr);

  // Pestaña activa de la maquetación
  const [tabActiva, setTabActiva] = useState<'calendario' | 'mis-reservas' | 'sugerir' | 'concurrencia'>('calendario');

  // Estado del usuario autenticado (inicializado con Usuario A para agilizar pruebas)
  const [usuarioActual, setUsuarioActual] = useState<Usuario | null>({
    id: 1,
    nombre: 'Juan Pérez (Alumno A)',
    email: 'alumnoA@universidad.edu',
  });

  // Estado de conexión WebSocket
  const [wsConectado] = useState<boolean>(true);

  // Salas de prueba (coinciden con la semilla de base de datos)
  const [salas, setSalas] = useState<Sala[]>([
    { id: 1, nombre: 'Lab de Cómputo A', capacidad: 25, ubicacion: 'Edificio A - Piso 2', version: 1 },
    { id: 2, nombre: 'Sala de Estudio Grupal 1', capacidad: 10, ubicacion: 'Biblioteca - PB', version: 1 },
    { id: 3, nombre: 'Cabina de Proyectos', capacidad: 4, ubicacion: 'Biblioteca - Piso 1', version: 1 },
    { id: 4, nombre: 'Lab de Robótica y Hardware', capacidad: 18, ubicacion: 'Edificio B - Lab 3', version: 1 },
  ]);

  // Reservas iniciales de muestra
  const [reservas, setReservas] = useState<Reserva[]>([
    {
      id: 101,
      sala_id: 1,
      sala_nombre: 'Lab de Cómputo A',
      usuario_id: 1,
      usuario_nombre: 'Juan Pérez',
      fecha: hoyStr,
      hora_inicio: 9,
      hora_fin: 10,
      estado: 'CONFIRMADA',
      version_sala_aplicada: 1,
      creado_en: new Date().toISOString(),
    },
    {
      id: 102,
      sala_id: 2,
      sala_nombre: 'Sala de Estudio Grupal 1',
      usuario_id: 2,
      usuario_nombre: 'María López',
      fecha: hoyStr,
      hora_inicio: 11,
      hora_fin: 12,
      estado: 'CONFIRMADA',
      version_sala_aplicada: 1,
      creado_en: new Date().toISOString(),
    },
  ]);

  // Estados de Modales
  const [modalReservaAbierto, setModalReservaAbierto] = useState<boolean>(false);
  const [bloqueSeleccionado, setBloqueSeleccionado] = useState<{ sala: Sala; hora: number } | null>(null);
  const [modalAuthAbierto, setModalAuthAbierto] = useState<boolean>(false);

  // Abrir modal de reserva al hacer clic en bloque libre del calendario
  const handleSeleccionarBloque = (sala: Sala, horaInicio: number) => {
    setBloqueSeleccionado({ sala, hora: horaInicio });
    setModalReservaAbierto(true);
  };

  // Confirmar reserva
  const handleConfirmarReserva = (sala: Sala, fecha: string, horaInicio: number, versionEnviada: number) => {
    if (!usuarioActual) {
      alert('Debes iniciar sesión para reservar.');
      return;
    }

    // Incrementar versión de la sala (simulando UPDATE salas SET version = version + 1)
    const nuevaVersion = versionEnviada + 1;
    setSalas((prev) =>
      prev.map((s) => (s.id === sala.id ? { ...s, version: nuevaVersion } : s))
    );

    // Crear nueva reserva confirmada
    const nuevaReserva: Reserva = {
      id: Date.now(),
      sala_id: sala.id,
      sala_nombre: sala.nombre,
      usuario_id: usuarioActual.id,
      usuario_nombre: usuarioActual.nombre,
      fecha,
      hora_inicio: horaInicio,
      hora_fin: horaInicio + 1,
      estado: 'CONFIRMADA',
      version_sala_aplicada: nuevaVersion,
      creado_en: new Date().toISOString(),
    };

    setReservas((prev) => [...prev, nuevaReserva]);
    setModalReservaAbierto(false);
  };

  // Cancelar reserva (RF-05)
  const handleCancelarReserva = (reservaId: number) => {
    setReservas((prev) =>
      prev.map((r) => (r.id === reservaId ? { ...r, estado: 'CANCELADA' } : r))
    );
  };

  // Simular Colisión de Concurrencia (Promise.all con misma versión)
  const handleEjecutarColision = async (
    salaId: number,
    hora: number,
    versionActual: number
  ): Promise<{ resultadoA: ResultadoConcurrencia; resultadoB: ResultadoConcurrencia }> => {
    // Simulamos latencia de red y transacción de BD
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Petición 1: Éxito (201 Created)
    const resultadoA: ResultadoConcurrencia = {
      usuario: 'Usuario A (Alumno A)',
      status: 201,
      exito: true,
      mensaje: '201 Created: Transacción confirmada. Versión de sala actualizada a v' + (versionActual + 1),
      timestamp: new Date().toISOString(),
      datos: {
        sala_id: salaId,
        hora_inicio: hora,
        version_previa: versionActual,
        version_nueva: versionActual + 1,
        transaccion: 'ACID COMMIT',
      },
    };

    // Petición 2: Conflicto (409 Conflict por Bloqueo Optimista)
    const resultadoB: ResultadoConcurrencia = {
      usuario: 'Usuario B (Alumno B)',
      status: 409,
      exito: false,
      mensaje: '409 Conflict: Optimistic Lock Exception. La versión enviada (' + versionActual + ') ya no coincide con la versión en base de datos (' + (versionActual + 1) + '). Transacción revertida con ROLLBACK.',
      timestamp: new Date().toISOString(),
      datos: {
        error: 'CONFLICT_OPTIMISTIC_LOCK',
        codigo_http: 409,
        detalle: 'UPDATE salas SET version = version + 1 WHERE id = $1 AND version = $2 retornó 0 filas afectadas.',
        transaccion: 'ROLLBACK',
      },
    };

    // Actualizar versión en estado local
    setSalas((prev) =>
      prev.map((s) => (s.id === salaId ? { ...s, version: s.version + 1 } : s))
    );

    return { resultadoA, resultadoB };
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 font-sans">
      {/* Header General del Sistema */}
      <Header
        usuarioActual={usuarioActual}
        onCambiarUsuario={setUsuarioActual}
        onAbrirAuth={() => setModalAuthAbierto(true)}
        wsConectado={wsConectado}
      />

      {/* Contenedor Principal */}
      <main className="mx-auto max-w-7xl p-4 sm:p-6 space-y-6">
        {/* Barra de Navegación por Pestañas / Módulos */}
        <nav className="flex flex-wrap gap-2 border-b border-gray-300 bg-white p-2 rounded shadow-sm text-xs font-bold">
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
            <span>1. Calendario de Disponibilidad (RF-02)</span>
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

        {/* Vista Condicional según Pestaña */}
        {tabActiva === 'calendario' && (
          <CalendarioGrid
            fechaSeleccionada={fechaSeleccionada}
            onCambiarFecha={setFechaSeleccionada}
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

      {/* Modales de Interacción */}
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
        onLoginExitoso={(u) => setUsuarioActual(u)}
      />
    </div>
  );
}
