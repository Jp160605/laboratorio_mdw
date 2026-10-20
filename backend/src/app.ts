import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import salasRoutes from './routes/salas.routes';
import reservasRoutes from './routes/reservas.routes';
import { errorHandler } from './middlewares/error.middleware';

export const app = express();

// Middlewares globales
app.use(
  cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
  })
);
app.use(express.json());

// Verificación de estado del servidor (Healthcheck)
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'OK',
    servicio: 'Backend Reservas API',
    timestamp: new Date().toISOString(),
  });
});

// Rutas Principales
app.use('/api/auth', authRoutes);
app.use('/api/salas', salasRoutes);
app.use('/api/reservas', reservasRoutes);

// Manejador centralizado de errores
app.use(errorHandler);
