import { Router } from 'express';
import { obtenerSalas, obtenerDisponibilidad, sugerirMejorSala, crearSala, eliminarSala } from '../controllers/salas.controller';

const router = Router();

// Listar salas con su versión actual
router.get('/', obtenerSalas);

// Consultar disponibilidad de salas por fecha (Caché en Redis + Fallback BD)
router.get('/disponibilidad', obtenerDisponibilidad);

// Algoritmo de sugerencia de "Mejor Sala" basado en función de costo (Reto)
router.get('/sugerir', sugerirMejorSala);

// Crear nueva sala (Admin)
router.post('/', crearSala);

// Eliminar sala (Admin)
router.delete('/:id', eliminarSala);

export default router;
