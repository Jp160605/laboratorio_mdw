import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const redisHost = process.env.REDIS_HOST || 'localhost';
const redisPort = parseInt(process.env.REDIS_PORT || '6379', 10);

export const redis = new Redis({
  host: redisHost,
  port: redisPort,
  maxRetriesPerRequest: null,
  lazyConnect: true,
  retryStrategy(times) {
    // Reintentos exponenciales con tope de 3 segundos
    return Math.min(times * 200, 3000);
  },
});

redis.on('connect', () => {
  console.log('[Redis] Conectado exitosamente al servidor de caché y colas');
});

redis.on('error', (err) => {
  console.warn('[Redis] Alerta de conexión:', err.message);
});
