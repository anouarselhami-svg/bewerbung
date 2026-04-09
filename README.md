# Career Service Web App

Frontend: React + Vite
Backend API: Node.js + Express
Database: PostgreSQL

## Security Decisions

- No secrets in frontend code.
- All secrets loaded from environment variables.
- Server-side payload validation with Zod.
- Rate limiting and security headers enabled.
- HTTPS required in production (checked via middleware).

## Environment Variables

Copy `.env.example` to `.env` and set real values:

```bash
cp .env.example .env
```

Required values:

- `DATABASE_URL`: PostgreSQL connection string
- `FRONTEND_ORIGIN`: allowed frontend URL for CORS
- `PORT`: API server port
- `NODE_ENV`: `development` or `production`
- `PGSSL`: `true` in managed cloud DB environments

## PostgreSQL Setup

Create the database first:

```bash
psql -U postgres -c "CREATE DATABASE career_service;"
```

Then create tables and seed agents:

```bash
psql "$DATABASE_URL" -f server/db/init.sql
```

## Run Project

Run frontend + API together:

```bash
npm run dev:full
```

Or run separately:

```bash
npm run dev:client
npm run dev:server
```

## API Endpoints

- `GET /api/health`
- `POST /api/leads`

Expected payload for `POST /api/leads`:

```json
{
	"fullName": "Jane Doe",
	"email": "jane@example.com",
	"domain": "Pflege",
	"languageLevel": "B1",
	"source": "assistant-virtuel",
	"recommendedAgent": "Youssef"
}
```

## Production HTTPS

Deploy behind HTTPS (Nginx/Cloudflare/Load Balancer). The API rejects non-HTTPS requests in production mode.
