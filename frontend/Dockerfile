# Dockerfile para Frontend (Next.js 14 + TailwindCSS)
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar manifiestos
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar archivos fuente y configuraciones
COPY tsconfig.json tailwind.config.ts postcss.config.mjs next.config.mjs ./
COPY src ./src

# Compilar proyecto Next.js
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Etapa de Producción
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV NEXT_TELEMETRY_DISABLED=1

COPY package*.json ./
RUN npm ci --only=production

# Copiar archivos generados por Next.js
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/src ./src

EXPOSE 3000

CMD ["npm", "start"]
