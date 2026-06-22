# DEVS Community

Website + admin dashboard for **DEVS Community** — a builder community in
Chennai, Tamil Nadu, and the DEVS Technical Society college chapters across
the state. *Code. Coffee. Repeat.*

Black-and-white editorial design. Builders register, colleges apply to start
chapters, and everything (gallery, events, chapters, team, testimonials, form
submissions) is managed from a built-in admin dashboard.

## Tech stack

- **Frontend** — React 18, Vite, React Router v6, Tailwind CSS, Framer Motion, lucide-react
- **Backend** — Node.js + Express, `node:sqlite` (built-in SQLite), Multer for image/video uploads
- **Data** — single SQLite file + an `uploads/` folder on disk

## Local development

```bash
npm install
npm run dev:full      # API (5174) + Vite dev server (5173)
```

Open http://localhost:5173. Admin dashboard at **/admin** (default password
`devs2025` — override with the `ADMIN_PASSWORD` env var).

| Script | Purpose |
|---|---|
| `npm run dev:full` | Run API + frontend together (development) |
| `npm run dev` | Frontend only |
| `npm run server` | API only |
| `npm run build` | Production build → `dist/` |

## Production

The Express server serves the built site + API + uploads on a single port, so
it runs as one process / one container. See **[DOCKER.md](DOCKER.md)** for the
Docker + VPS deployment guide.

## Project layout

```
src/            React app (pages, components, lib)
server/         Express API, SQLite schema, uploads
public/         Static assets (favicon)
Dockerfile      Multi-stage build → single runtime image
docker-compose.yml
```

## Notes

- **Change `ADMIN_PASSWORD`** before deploying publicly.
- The database (`server/devs.db`) and `server/uploads/` are git-ignored — they
  live on the server / in a Docker volume. Back them up regularly.
