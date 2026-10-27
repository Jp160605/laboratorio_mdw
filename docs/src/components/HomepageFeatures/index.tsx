import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  icon: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Control de Concurrencia Optimista',
    icon: '⚡',
    description: (
      <>
        Garantiza reservas consistentes bajo alta concurrencia mediante versiones en SQL nativo,
        transacciones ACID explícitas y respuesta <code>409 Conflict</code> ante colisiones simultáneas.
      </>
    ),
  },
  {
    title: 'Actualizaciones en Tiempo Real',
    icon: '🔄',
    description: (
      <>
        Los clientes conectados sincronizan el estado del calendario al instante mediante <strong>Socket.io</strong>,
        mostrando bloques ocupados en vivo sin necesidad de recargar la página.
      </>
    ),
  },
  {
    title: 'Caché con Redis y Colas con BullMQ',
    icon: '🚀',
    description: (
      <>
        Respuestas inmediatas para la consulta de disponibilidad mediante caché en memoria y
        procesamiento asíncrono para confirmaciones y recordatorios por correo electrónico.
      </>
    ),
  },
];

function Feature({title, icon, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center" style={{ fontSize: '3rem', margin: '1rem 0' }}>
        <span>{icon}</span>
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
