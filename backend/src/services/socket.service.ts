import { Server as SocketIOServer } from 'socket.io';

let io: SocketIOServer | null = null;

export function inicializarSocket(socketServer: SocketIOServer): void {
  io = socketServer;

  io.on('connection', (socket) => {
    console.log(`[Socket.io] Cliente conectado: ${socket.id}`);

    socket.on('disconnect', () => {
      console.log(`[Socket.io] Cliente desconectado: ${socket.id}`);
    });
  });
}

export function emitirReservaCreada(datos: {
  sala_id: number;
  fecha: string;
  hora_inicio: number;
  nueva_version: number;
}): void {
  if (io) {
    console.log('[Socket.io] Emitiendo evento: reserva_creada', datos);
    io.emit('reserva_creada', datos);
    io.emit('calendario_actualizado', datos);
  }
}

export function emitirReservaCancelada(datos: {
  sala_id: number;
  fecha: string;
  hora_inicio: number;
}): void {
  if (io) {
    console.log('[Socket.io] Emitiendo evento: reserva_cancelada', datos);
    io.emit('reserva_cancelada', datos);
    io.emit('calendario_actualizado', datos);
  }
}
