export interface Usuario {
  id: number;
  nombre: string;
  email: string;
}

export interface Sala {
  id: number;
  nombre: string;
  capacidad: number;
  ubicacion: string;
  version: number; // Clave para Bloqueo Optimista
}

export interface Reserva {
  id: number;
  sala_id: number;
  sala_nombre?: string;
  usuario_id: number;
  usuario_nombre?: string;
  fecha: string; // YYYY-MM-DD
  hora_inicio: number; // 8 .. 20
  hora_fin: number; // hora_inicio + 1
  estado: 'CONFIRMADA' | 'CANCELADA';
  version_sala_aplicada: number;
  creado_en: string;
}

export interface BloqueHorario {
  hora_inicio: number;
  hora_fin: number;
  etiqueta: string; // ej. "08:00 - 09:00"
}

export interface ResultadoConcurrencia {
  usuario: string;
  status: number;
  mensaje: string;
  timestamp: string;
  datos?: Record<string, unknown>;
  exito: boolean;
}
