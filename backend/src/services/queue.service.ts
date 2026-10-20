import { Queue, Worker, Job } from 'bullmq';
import { redis } from '../config/redis';
import { enviarCorreo } from '../config/mailer';

export const EMAIL_QUEUE_NAME = 'email-notifications';

export const emailQueue = new Queue(EMAIL_QUEUE_NAME, {
  connection: redis,
});

export interface EmailJobData {
  tipo: 'CONFIRMACION_INMEDIATA' | 'RECORDATORIO_PREVIO';
  reservaId: number;
  email: string;
  nombreUsuario: string;
  salaNombre: string;
  fecha: string;
  horaInicio: number;
  horaFin: number;
}

export async function programarCorreosReserva(datos: {
  reservaId: number;
  email: string;
  nombreUsuario: string;
  salaNombre: string;
  fecha: string;
  horaInicio: number;
  horaFin: number;
}): Promise<void> {
  try {
    // 1. Encolar correo de confirmación inmediato
    await emailQueue.add(
      'enviar_confirmacion',
      {
        tipo: 'CONFIRMACION_INMEDIATA',
        ...datos,
      },
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 2000 },
      }
    );
    console.log(`[BullMQ] Encolado correo de confirmación inmediato para reserva #${datos.reservaId}`);

    // 2. Calcular delay para recordatorio 1 hora antes
    const fechaHoraInicio = new Date(`${datos.fecha}T${datos.horaInicio < 10 ? '0' : ''}${datos.horaInicio}:00:00`);
    const unaHoraAntesMs = fechaHoraInicio.getTime() - 60 * 60 * 1000;
    const ahoraMs = Date.now();
    const delayMs = Math.max(0, unaHoraAntesMs - ahoraMs);

    // Encolar job de recordatorio con jobId predecible para poder cancelarlo si el usuario cancela la reserva
    await emailQueue.add(
      'enviar_recordatorio',
      {
        tipo: 'RECORDATORIO_PREVIO',
        ...datos,
      },
      {
        jobId: `recordatorio_reserva_${datos.reservaId}`,
        delay: delayMs,
        attempts: 3,
      }
    );
    console.log(
      `[BullMQ] Encolado recordatorio programado para reserva #${datos.reservaId} (delay: ${Math.round(
        delayMs / 1000 / 60
      )} minutos)`
    );
  } catch (error) {
    console.error('[BullMQ] Error al encolar trabajos de correo:', error);
  }
}

export async function cancelarRecordatorioReserva(reservaId: number): Promise<void> {
  try {
    const jobId = `recordatorio_reserva_${reservaId}`;
    const job = await emailQueue.getJob(jobId);
    if (job) {
      await job.remove();
      console.log(`[BullMQ] Removido recordatorio para reserva #${reservaId}`);
    }
  } catch (error) {
    console.warn(`[BullMQ] Error al intentar remover job de recordatorio #${reservaId}:`, error);
  }
}

// Inicialización del Worker que procesa la cola de BullMQ en segundo plano
export function inicializarWorker(): Worker {
  const worker = new Worker<EmailJobData>(
    EMAIL_QUEUE_NAME,
    async (job: Job<EmailJobData>) => {
      const { tipo, email, nombreUsuario, salaNombre, fecha, horaInicio, horaFin, reservaId } = job.data;
      console.log(`[BullMQ Worker] Procesando trabajo ${job.id} (${tipo}) para ${email}`);

      if (tipo === 'CONFIRMACION_INMEDIATA') {
        await enviarCorreo({
          to: email,
          subject: `✅ Reserva Confirmada: ${salaNombre} (#${reservaId})`,
          html: `
            <h2>¡Hola ${nombreUsuario}!</h2>
            <p>Tu reserva en <strong>${salaNombre}</strong> ha sido confirmada exitosamente.</p>
            <ul>
              <li><strong>Fecha:</strong> ${fecha}</li>
              <li><strong>Horario:</strong> ${horaInicio}:00 a ${horaFin}:00</li>
              <li><strong>Código de Reserva:</strong> #${reservaId}</li>
            </ul>
            <p>Gracias por usar el sistema universitario de reservas.</p>
          `,
        });
      } else if (tipo === 'RECORDATORIO_PREVIO') {
        await enviarCorreo({
          to: email,
          subject: `⏰ Recordatorio: Tu reserva en ${salaNombre} comienza en 1 hora`,
          html: `
            <h2>Hola ${nombreUsuario},</h2>
            <p>Te recordamos que tu reserva en <strong>${salaNombre}</strong> comienza en 1 hora:</p>
            <p><strong>Horario:</strong> ${horaInicio}:00 - ${horaFin}:00 (${fecha})</p>
          `,
        });
      }
    },
    {
      connection: redis,
      concurrency: 5,
    }
  );

  worker.on('completed', (job) => {
    console.log(`[BullMQ Worker] Trabajo ${job.id} finalizado exitosamente`);
  });

  worker.on('failed', (job, err) => {
    console.error(`[BullMQ Worker] Trabajo ${job?.id} falló con error:`, err.message);
  });

  return worker;
}
