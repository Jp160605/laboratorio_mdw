import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db';

export async function register(req: Request, res: Response): Promise<void> {
  const { nombre, email, password } = req.body;

  if (!nombre || !email || !password) {
    res.status(400).json({ error: 'Nombre, correo y contraseña son obligatorios.' });
    return;
  }

  try {
    // 1. Verificar si el usuario ya existe
    const existe = await pool.query('SELECT id FROM usuarios WHERE email = $1', [email]);
    if (existe.rows.length > 0) {
      res.status(409).json({ error: 'El correo electrónico ya está registrado.' });
      return;
    }

    // 2. Hashear la contraseña con bcrypt
    const passwordHash = await bcrypt.hash(password, 10);

    // 3. Insertar usuario en PostgreSQL (SQL Puro)
    const resultado = await pool.query(
      'INSERT INTO usuarios (nombre, email, password_hash) VALUES ($1, $2, $3) RETURNING id, nombre, email, creado_en',
      [nombre, email, passwordHash]
    );

    const usuario = resultado.rows[0];

    // 4. Firmar token JWT
    const secret = process.env.JWT_SECRET || 'clave_secreta_jwt_para_firmar_tokens_12345';
    const token = jwt.sign(
      { id: usuario.id, nombre: usuario.nombre, email: usuario.email },
      secret,
      { expiresIn: '8h' }
    );

    res.status(201).json({
      mensaje: 'Usuario registrado exitosamente.',
      usuario,
      token,
    });
  } catch (error: any) {
    console.error('[Auth Controller - Register]:', error);
    res.status(500).json({ error: 'Error interno al registrar usuario.' });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Correo y contraseña son requeridos.' });
    return;
  }

  try {
    // 1. Buscar usuario por email en SQL puro
    const resultado = await pool.query(
      'SELECT id, nombre, email, password_hash FROM usuarios WHERE email = $1',
      [email]
    );

    if (resultado.rows.length === 0) {
      res.status(401).json({ error: 'Credenciales inválidas.' });
      return;
    }

    const usuario = resultado.rows[0];

    // 2. Comparar contraseña con el hash
    const esValida = await bcrypt.compare(password, usuario.password_hash);
    if (!esValida) {
      res.status(401).json({ error: 'Credenciales inválidas.' });
      return;
    }

    // 3. Generar token JWT
    const secret = process.env.JWT_SECRET || 'clave_secreta_jwt_para_firmar_tokens_12345';
    const token = jwt.sign(
      { id: usuario.id, nombre: usuario.nombre, email: usuario.email },
      secret,
      { expiresIn: '8h' }
    );

    res.status(200).json({
      mensaje: 'Inicio de sesión exitoso.',
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
      },
      token,
    });
  } catch (error: any) {
    console.error('[Auth Controller - Login]:', error);
    res.status(500).json({ error: 'Error interno al iniciar sesión.' });
  }
}
