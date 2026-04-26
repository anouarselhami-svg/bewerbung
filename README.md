# International Career Service Web App

A comprehensive career support platform helping candidates find opportunities in **Canada, Germany, and Europe**. We provide job search assistance, document translation, professional guidance, and direct connections to employers.

## Service Overview

- **Geographic Focus**: Canada, Germany, European Union countries
- **Career Domains**: 11+ sectors including IT, Healthcare, Construction, Logistics, and more
- **Support Languages**: French, Arabic, English
- **Services**: Job search, document preparation & translation, employer connections, career guidance


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
- `COMMENT_ADMIN_TOKEN`: required token to authorize `DELETE /api/comments/:id`
- `ADMIN_DASHBOARD_TOKEN`: token to protect `/api/admin/*` endpoints (if omitted, fallback is `COMMENT_ADMIN_TOKEN`)

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
- `GET /api/comments`
- `POST /api/comments`
- `DELETE /api/comments/:id`
- `POST /api/analytics/events`
- `GET /api/admin/leads`
- `GET /api/admin/leads/export.csv`
- `GET /api/admin/analytics-summary`

## Admin Dashboard

- Public admin page: `/admin.html`
- Requires request header: `x-admin-token: <ADMIN_DASHBOARD_TOKEN>`
- Features:
	- Leads list with pagination
	- CSV export
	- Analytics summary (page views, click events, lead success events)

## Anti-spam

- Honeypot field added to lead form (quietly rejects bot submissions)
- Dedicated rate limiter on `/api/leads`

For `DELETE /api/comments/:id`, send header:

- `x-admin-token: <COMMENT_ADMIN_TOKEN>`

Expected payload for `POST /api/leads`:

```json
{
	"fullName": "Jane Doe",
	"email": "jane@example.com",
	"domain": "Pflege",
	"languageLevel": "B1",
	"source": "site-web",
	"recommendedAgent": "Contact 1"
}
```

## Production HTTPS

Deploy behind HTTPS (Nginx/Cloudflare/Load Balancer). The API rejects non-HTTPS requests in production mode.

## SEO and Search Console

- Main SEO tags configured in `index.html` (title, description, canonical, Open Graph, Twitter)
- Sitemap available at `/sitemap.xml`
- Robots file available at `/robots.txt`
- Search Console verification requires your Google account ownership step (DNS or HTML file verification) and cannot be automated from this repository alone.
