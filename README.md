# finsight-backend

Financial Reconciliation Platform — REST API

## Architecture

Layered, modular architecture with strict separation of concerns:

```
Routes → Controllers → Services → Prisma (DB)
```

- **Routes**: Define endpoints, apply middleware
- **Controllers**: Handle HTTP in/out, delegate to services
- **Services**: Business logic, database access via Prisma
- **Config**: Validated env vars, DB/Redis/AWS clients
- **Middlewares**: Error handling, rate limiting, request tracing

## Folder Structure

```
src/
├── config/         # env, database, redis, aws
├── modules/        # feature modules (health, auth, reconciliation...)
├── routes/v1/      # versioned route registry
├── middlewares/    # error, 404, rate-limit, request-id
├── utils/          # logger, api-response
└── types/          # shared TypeScript types
```

## Prerequisites

- Node.js 20+
- Docker Desktop
- npm 10+

## Installation

```bash
npm install
```

## Environment Setup

```bash
cp .env.example .env
# Edit .env with your values
```

## Docker Setup (PostgreSQL + Redis)

```bash
docker compose up -d
```

## Database Migrations

```bash
# Generate Prisma client
npm run db:generate

# Run migrations (development)
npm run db:migrate

# Run migrations (production/CI)
npm run db:migrate:deploy

# Seed database
npm run db:seed

# Open Prisma Studio
npm run db:studio
```

## Development

```bash
npm run dev
```

Server starts at http://localhost:5000

## Testing

```bash
npm test                 # run all tests
npm run test:watch       # watch mode
npm run test:coverage    # with coverage report
```

## Build

```bash
npm run build            # compile TypeScript
npm start                # run compiled output
```

## Code Quality

```bash
npm run lint             # ESLint
npm run lint:fix         # ESLint with auto-fix
npm run format           # Prettier
npm run type-check       # TypeScript strict check
```

## API

All endpoints are versioned under `/api/v1`.

| Method | Path            | Description        |
|--------|-----------------|--------------------|
| GET    | /api/v1/health  | System health check |

### Response Format

**Success**
```json
{
  "success": true,
  "message": "Health check successful",
  "data": { "status": "healthy" }
}
```

**Error**
```json
{
  "success": false,
  "message": "Something went wrong",
  "error": { "code": "INTERNAL_SERVER_ERROR" }
}
```

## Environment Variables

| Variable              | Required | Description                    |
|-----------------------|----------|--------------------------------|
| NODE_ENV              | No       | development / test / production |
| PORT                  | No       | Default 5000                   |
| DATABASE_URL          | Yes      | PostgreSQL connection string   |
| REDIS_URL             | Yes      | Redis connection string        |
| AWS_REGION            | No       | Default us-east-1              |
| AWS_ACCESS_KEY_ID     | No       | AWS credentials                |
| AWS_SECRET_ACCESS_KEY | No       | AWS credentials                |
| AWS_S3_BUCKET         | No       | S3 bucket for settlements      |
| CORS_ORIGIN           | No       | Allowed frontend origin        |

## Planned Phase 2 Entities

- Order, Payment, Settlement, Refund
- Reconciliation, ReconciliationItem, Transaction
- AWS S3 CSV upload + Lambda processing pipeline
