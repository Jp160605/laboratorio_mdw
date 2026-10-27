import { Router } from 'express';
import { crearReserva, cancelarReserva, obtenerMisReservas, obtenerTodasReservas } from '../controllers/reservas.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Crear reserva con Bloqueo Optimista y Transacción ACID (RF-03, RF-04)
router.post('/', authMiddleware, crearReserva);

// Historial de reservas del usuario logueado (RF-07)
router.get('/mis-reservas', authMiddleware, obtenerMisReservas);

// Auditoría total de reservas para el panel de administración
router.get('/todas', obtenerTodasReservas);

// Cancelar reserva con regla de >= 2 horas de anticipación (RF-05)
router.patch('/:id/cancelar', authMiddleware, cancelarReserva);

export default router;
