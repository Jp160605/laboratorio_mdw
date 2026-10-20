import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  secure: false, // true para puerto 465, false para 587
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
});

export interface OpcionesCorreo {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function enviarCorreo(opciones: OpcionesCorreo): Promise<void> {
  const remitente = process.env.SMTP_FROM || '"Sistema de Reservas" <notificaciones@universidad.edu>';

  // Si no hay credenciales válidas configuradas, simulamos el envío en consola para pruebas académicas
  if (!process.env.SMTP_USER || process.env.SMTP_PASS === 'contrasena_o_app_password') {
    console.log(`[Mailer Mock] Simulación de correo a: ${opciones.to}`);
    console.log(`[Mailer Mock] Asunto: ${opciones.subject}`);
    console.log(`[Mailer Mock] Contenido: ${opciones.text || opciones.html}`);
    return;
  }

  try {
    await transporter.sendMail({
      from: remitente,
      to: opciones.to,
      subject: opciones.subject,
      text: opciones.text,
      html: opciones.html,
    });
    console.log(`[Mailer] Correo enviado exitosamente a ${opciones.to}`);
  } catch (error) {
    console.error(`[Mailer] Error al enviar correo a ${opciones.to}:`, error);
  }
}
