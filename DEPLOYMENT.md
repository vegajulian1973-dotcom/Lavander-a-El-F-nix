# Guía de Deployment

## Requisitos
- Node.js 18+
- Docker (opcional)
- npm o yarn

## Instalación Local

```bash
npm install
cp .env.example .env
# Editar .env con valores correctos
```

## Desarrollo

```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend
npm run server
```

## Build Producción

```bash
npm run build
npm run server
```

## Docker

```bash
docker-compose up --build
```

## Variables de Entorno Críticas
- `ADMIN_PASSWORD`: Cambiar en producción
- `JWT_SECRET`: Usar una clave segura
- `NODE_ENV`: Establecer a "production"

## Base de Datos
- SQLite se crea automáticamente
- Localización: `./lavanderia.db`

## Testing

```bash
npm run test
npm run test:ui
npm run test:coverage
```
