import { redis } from '../config/redis';

const PREFIJO_DISPONIBILIDAD = 'disponibilidad:';

export async function obtenerDisponibilidadCache(fecha: string): Promise<any | null> {
  try {
    const raw = await redis.get(`${PREFIJO_DISPONIBILIDAD}${fecha}`);
    if (raw) {
      console.log(`[Redis Caché HIT] Disponibilidad recuperada para ${fecha}`);
      return JSON.parse(raw);
    }
    console.log(`[Redis Caché MISS] No hay caché para ${fecha}`);
    return null;
  } catch (error) {
    console.warn('[Redis Caché] Error al leer caché:', error);
    return null;
  }
}

export async function guardarDisponibilidadCache(
  fecha: string,
  datos: any,
  ttlSegundos = 600
): Promise<void> {
  try {
    await redis.set(
      `${PREFIJO_DISPONIBILIDAD}${fecha}`,
      JSON.stringify(datos),
      'EX',
      ttlSegundos
    );
    console.log(`[Redis Caché SET] Guardada disponibilidad para ${fecha} (TTL: ${ttlSegundos}s)`);
  } catch (error) {
    console.warn('[Redis Caché] Error al guardar en caché:', error);
  }
}

export async function invalidarDisponibilidadCache(fecha: string): Promise<void> {
  try {
    const eliminados = await redis.del(`${PREFIJO_DISPONIBILIDAD}${fecha}`);
    console.log(`[Redis Caché INVALIDACIÓN] Clave eliminada para ${fecha} (Registros: ${eliminados})`);
  } catch (error) {
    console.warn('[Redis Caché] Error al invalidar caché:', error);
  }
}

export async function invalidarTodoCacheDisponibilidad(): Promise<void> {
  try {
    const keys = await redis.keys(`${PREFIJO_DISPONIBILIDAD}*`);
    if (keys.length > 0) {
      await redis.del(...keys);
      console.log(`[Redis Caché INVALIDACIÓN GLOBAL] ${keys.length} claves eliminadas`);
    }
  } catch (error) {
    console.warn('[Redis Caché] Error al invalidar caché global:', error);
  }
}
