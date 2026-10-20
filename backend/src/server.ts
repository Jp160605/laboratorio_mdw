import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import dotenv from 'dotenv';
import { app } from './app';
import { inicializarSocket } from './services/socket.service';
import { inicializarWorker } from './services/queue.service';

dotenv.config();

const PORT = parseInt(process.env.PORT || '4000', 10);

// Crear servidor HTTP para compartirlo con Express y Socket.io
const server = http.createServer(app);

// Inicializar Socket.io sobre el servidor HTTP
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST', 'PATCH'],
  },
});

inicializarSocket(io);

// Inicializar el Worker de BullMQ para procesar correos en segundo plano
try {
  inicializarWorker();
  console.log('[BullMQ] Worker de notificaciones por correo inicializado.');
} catch (error) {
  console.warn('[BullMQ] No se pudo inicializar el worker de BullMQ (¿Redis está levantado?):', error);
}

// Iniciar servidor
server.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 Servidor Backend iniciado en http://localhost:${PORT}`);
  console.log(`📡 WebSockets Socket.io escuchando`);
  console.log(`⚙️  Modo: ${process.env.NODE_ENV || 'development'}`);
  console.log(`====================================================`);
});
