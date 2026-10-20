import { Request } from 'express';

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  password_hash?: string;
  creado_en?: Date;
}

export interface UsuarioAuthPayload {
  id: number;
  nombre: string;
  email: string;
}

export interface AuthRequest extends Request {
  user?: UsuarioAuthPayload;
}

export interface Sala {
  id: number;
  nombre: string;
  capacidad: number;
  ubicacion: string;
  version: number;
}

export interface Reserva {
  id: number;
  sala_id: number;
  sala_nombre?: string;
  usuario_id: number;
  usuario_nombre?: string;
  fecha: string;
  hora_inicio: number;
  hora_fin: number;
  estado: 'CONFIRMADA' | 'CANCELADA';
  version_sala_aplicada: number;
  creado_en?: Date;
}

export interface CrearReservaDTO {
  sala_id: number;
  fecha: string; // YYYY-MM-DD
  hora_inicio: number; // 8 .. 20
  version_actual: number; // Versión leída por el cliente
}

export interface SugerenciaQuery {
  fecha: string;
  hora_deseada: number;
  aforo: number;
}
