# DEVS Community — Docker Deployment

The whole app runs as **one container**: the Express server serves the built
React site, the API, and uploaded media on a single port (`5174`). The SQLite
database and all uploaded images/videos live in a **Docker volume**, so they
survive rebuilds and updates.

## Prerequisites (on the VPS)

- Docker Engine + Docker Compose plugin
  ```bash
  curl -fsSL https://get.docker.com | sh
  ```

## First deploy

```bash
git clone <your-repo> /opt/devs && cd /opt/devs

# 1. Set a real admin password
nano docker-compose.yml        # change ADMIN_PASSWORD

# 2. Build and start
docker compose up -d --build
```

The site is now live on **http://<server-ip>:5174** — frontend, admin
(`/admin`), and API all on that one port.

## Updating after code changes

```bash
cd /opt/devs
git pull
docker compose up -d --build   # rebuilds; your data volume is untouched
```

## Your data (important)

Everything you upload lives in the named volume **`devs-data`**, mounted at
`/data` inside the container:

- `/data/devs.db` — all content (chapters, gallery, events, team, testimonials, form submissions)
- `/data/uploads/` — uploaded images & videos

This volume is **not** deleted by `up --build` or `down`. It only goes away if
you run `docker compose down -v` (the `-v` wipes volumes — don't, unless you
mean it).

### Back it up

```bash
docker run --rm -v devs-data:/data -v $(pwd):/backup alpine \
  tar czf /backup/devs-backup-$(date +%F).tar.gz -C /data .
```

### Restore

```bash
docker run --rm -v devs-data:/data -v $(pwd):/backup alpine \
  sh -c "cd /data && tar xzf /backup/devs-backup-YYYY-MM-DD.tar.gz"
```

## HTTPS + custom domain (recommended)

Put a reverse proxy in front of port `5174`. Example nginx server block:

```nginx
server {
    listen 80;
    server_name devs.yourdomain.com;

    client_max_body_size 60M;        # allow 50MB testimonial video uploads

    location / {
        proxy_pass http://127.0.0.1:5174;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```
```bash
sudo certbot --nginx -d devs.yourdomain.com   # free SSL
```

> ⚠️ Without `client_max_body_size 60M`, video uploads fail with HTTP 413.

## Environment variables

| Variable         | Default        | Purpose                                  |
|------------------|----------------|------------------------------------------|
| `ADMIN_PASSWORD` | `devs2025`     | Login for `/admin` — **change this**     |
| `PORT`           | `5174`         | Port the server listens on               |
| `DATA_DIR`       | `/data`        | Where the DB + uploads are stored        |

## Handy commands

```bash
docker compose logs -f      # tail logs
docker compose restart      # restart
docker compose down         # stop (keeps data volume)
docker compose ps           # status
```
