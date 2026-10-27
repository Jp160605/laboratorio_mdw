import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Sistema de Reservas',
  tagline: 'Documentación Técnica de Salas de Estudio y Laboratorios',
  favicon: 'img/favicon.ico',

  url: 'https://Jp160605.github.io',
  baseUrl: '/',

  organizationName: 'Jp160605',
  projectName: 'laboratorio_mdw',

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'es',
    locales: ['es'],
  },

  markdown: {
    mermaid: true,
  },

  themes: ['@docusaurus/theme-mermaid'],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      defaultMode: 'dark',
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Sistema de Reservas',
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Documentación Técnica',
        },
        {
          href: 'https://github.com/Jp160605/laboratorio_mdw',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: '📐 Modelos de Diseño',
          items: [
            {
              label: 'Casos de Uso',
              to: '/docs/modelos/casos-de-uso',
            },
            {
              label: 'Navegación',
              to: '/docs/modelos/navegacion',
            },
            {
              label: 'Interacción y Estados',
              to: '/docs/modelos/interaccion',
            },
            {
              label: 'Secuencia',
              to: '/docs/modelos/secuencia',
            },
            {
              label: 'Entidad - Relación (E-R)',
              to: '/docs/modelos/er',
            },
          ],
        },
        {
          title: '🏗️ Arquitectura & Datos',
          items: [
            {
              label: 'Arquitectura de Servicios',
              to: '/docs/arquitectura/sistema',
            },
            {
              label: 'Control de Concurrencia Optimista',
              to: '/docs/arquitectura/concurrencia',
            },
            {
              label: 'Modelo Relacional (SQL)',
              to: '/docs/base-de-datos/modelo',
            },
            {
              label: 'API REST & Sockets',
              to: '/docs/api/endpoints',
            },
          ],
        },
        {
          title: '🧪 Pruebas & Gestión',
          items: [
            {
              label: 'Plan y Matriz de Pruebas',
              to: '/docs/pruebas/matriz-pruebas',
            },
            {
              label: 'Asignación de Tareas / RACI',
              to: '/docs/gestion/responsables',
            },
            {
              label: 'Despliegue con Docker',
              to: '/docs/despliegue/docker',
            },
            {
              label: 'Guía de Demostración',
              to: '/docs/demostracion/pruebas',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Sistema de Reservas para Laboratorios. Construido con Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json', 'sql'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
