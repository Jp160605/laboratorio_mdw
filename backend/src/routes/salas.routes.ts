import { Router } from 'express';
import { obtenerSalas, obtenerDisponibilidad, sugerirMejorSala } from '../controllers/salas.controller';

const router = Router();

// Listar salas con su versión actual
router.get('/', obtenerSalas);

// Consultar disponibilidad de salas por fecha (Caché en Redis + Fallback BD)
router.get('/disponibilidad', obtenerDisponibilidad);

// Algoritmo de sugerencia de "Mejor Sala" basado en función de costo (Reto)
router.get('/sugerir', sugerirMejorSala);

export default router;
