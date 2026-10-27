import { Pool, types } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// OID 1082 es el tipo DATE en PostgreSQL. 
// Forzar a devolver 'YYYY-MM-DD' como string puro para evitar conversiones a objeto Date en UTC
types.setTypeParser(1082, (val: string) => val);

export const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'reservas_db',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
  console.error('[PostgreSQL] Error inesperado en el pool de clientes:', err.message);
});
