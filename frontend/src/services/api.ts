import { Sala, Reserva, Usuario, ResultadoConcurrencia } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// Helper para cabeceras con autenticación
function getHeaders(token?: string): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

// 1. Autenticación (RF-01)
export async function apiLogin(email: string, password: string): Promise<{ usuario: Usuario; token: string }> {
  const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error al iniciar sesión');
  return data;
}

export async function apiRegister(nombre: string, email: string, password: string): Promise<{ usuario: Usuario; token: string }> {
  const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ nombre, email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error al registrar usuario');
  return data;
}

// 2. Consulta de Salas y Disponibilidad con Caché Redis (RF-02)
export async function apiObtenerDisponibilidad(fecha: string): Promise<{
  salas: Sala[];
  reservas: Reserva[];
  origen: string;
}> {
  const res = await fetch(`${API_BASE_URL}/api/salas/disponibilidad?fecha=${fecha}`, {
    method: 'GET',
    headers: getHeaders(),
    cache: 'no-store',
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Error al consultar disponibilidad');
  return {
    salas: json.datos.salas,
    reservas: json.datos.reservas,
    origen: json.origen,
  };
}

// 3. Recomendación de "Mejor Sala" con función de costo (Reto)
export async function apiSugerirMejorSala(fecha: string, horaDeseada: number, aforo: number) {
  const res = await fetch(
    `${API_BASE_URL}/api/salas/sugerir?fecha=${fecha}&hora_deseada=${horaDeseada}&aforo=${aforo}`,
    {
      method: 'GET',
      headers: getHeaders(),
      cache: 'no-store',
    }
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || data.mensaje || 'Error al calcular la mejor sala');
  return data;
}

export interface RespuestaCrearReserva {
  mensaje?: string;
  reserva?: Reserva;
  nueva_version_sala?: number;
  error?: string;
  codigo?: string;
}

// 4. Crear Reserva con Transacción ACID y Bloqueo Optimista (RF-03, RF-04)
export async function apiCrearReserva(
  params: { sala_id: number; fecha: string; hora_inicio: number; version_actual: number },
  token?: string
): Promise<{ status: number; data: RespuestaCrearReserva; ok: boolean }> {
  const res = await fetch(`${API_BASE_URL}/api/reservas`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify(params),
  });
  const data = await res.json();
  return { status: res.status, data, ok: res.ok };
}

// 5. Cancelar Reserva con regla de 2 horas (RF-05)
export async function apiCancelarReserva(reservaId: number, token?: string): Promise<{ mensaje: string }> {
  const res = await fetch(`${API_BASE_URL}/api/reservas/${reservaId}/cancelar`, {
    method: 'PATCH',
    headers: getHeaders(token),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error al cancelar la reserva');
  return data;
}

// 6. Historial de Reservas del Usuario (RF-07)
export async function apiObtenerMisReservas(token?: string): Promise<Reserva[]> {
  const res = await fetch(`${API_BASE_URL}/api/reservas/mis-reservas`, {
    method: 'GET',
    headers: getHeaders(token),
    cache: 'no-store',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error al obtener tus reservas');
  return data;
}

// 6b. Auditoría Total de Reservas (Panel de Administración)
export async function apiObtenerTodasReservas(): Promise<Reserva[]> {
  const res = await fetch(`${API_BASE_URL}/api/reservas/todas`, {
    method: 'GET',
    headers: getHeaders(),
    cache: 'no-store',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error al obtener auditoría de reservas');
  return data;
}

// 7. Simulación Real de Concurrencia con Promise.all (Demo Académica)
export async function apiSimularColisionConcurrente(
  salaId: number,
  fecha: string,
  hora: number,
  versionActual: number,
  tokenA?: string,
  tokenB?: string
): Promise<{ resultadoA: ResultadoConcurrencia; resultadoB: ResultadoConcurrencia }> {
  const payload = {
    sala_id: salaId,
    fecha,
    hora_inicio: hora,
    version_actual: versionActual,
  };

  // Disparo simultáneo de ambas peticiones al mismo milisegundo mediante Promise.all
  const [resA, resB] = await Promise.all([
    fetch(`${API_BASE_URL}/api/reservas`, {
      method: 'POST',
      headers: getHeaders(tokenA),
      body: JSON.stringify(payload),
    }),
    fetch(`${API_BASE_URL}/api/reservas`, {
      method: 'POST',
      headers: getHeaders(tokenB),
      body: JSON.stringify(payload),
    }),
  ]);

  const [dataA, dataB] = await Promise.all([resA.json(), resB.json()]);

  const resultadoA: ResultadoConcurrencia = {
    usuario: 'Petición 1 (Usuario A)',
    status: resA.status,
    exito: resA.ok,
    mensaje: resA.ok
      ? `HTTP ${resA.status} Created: Transacción ACID confirmada. Versión de sala actualizada a v${dataA.nueva_version_sala}.`
      : `HTTP ${resA.status} Conflict: ${dataA.error}`,
    timestamp: new Date().toISOString(),
    datos: dataA,
  };

  const resultadoB: ResultadoConcurrencia = {
    usuario: 'Petición 2 (Usuario B)',
    status: resB.status,
    exito: resB.ok,
    mensaje: resB.ok
      ? `HTTP ${resB.status} Created: Transacción confirmada.`
      : `HTTP ${resB.status} Conflict: ${dataB.error}`,
    timestamp: new Date().toISOString(),
    datos: dataB,
  };

  return { resultadoA, resultadoB };
}

// 8. Crear y Eliminar Salas (Panel Admin)
export async function apiCrearSala(
  nueva: Omit<Sala, 'id' | 'version'>,
  token?: string
): Promise<Sala> {
  const res = await fetch(`${API_BASE_URL}/api/salas`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify(nueva),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error al crear la sala');
  return data;
}

export async function apiEliminarSala(id: number, token?: string): Promise<{ mensaje: string }> {
  const res = await fetch(`${API_BASE_URL}/api/salas/${id}`, {
    method: 'DELETE',
    headers: getHeaders(token),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error al eliminar la sala');
  return data;
}
