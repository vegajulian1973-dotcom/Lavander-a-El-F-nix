# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Instalar dependencias de producción
COPY package*.json ./
RUN npm ci --only=production && \
    npm install -g serve

# Copiar build desde el builder
COPY --from=builder /app/dist ./dist

# Copiar archivos necesarios para el servidor
COPY server.js .
COPY .env.example .env

# Exponer puertos
EXPOSE 3001 5173

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/api/opiniones', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Comando para iniciar la app
CMD ["npm", "run", "dev"]
