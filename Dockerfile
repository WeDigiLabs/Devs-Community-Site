# syntax=docker/dockerfile:1

# ── Stage 1: build the React frontend ──────────────────────
FROM node:24-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ── Stage 2: lean runtime (Express serves API + built site) ─
FROM node:24-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=5174
ENV DATA_DIR=/data

# Only production deps (express, multer, …) — no build tooling.
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# App code + built frontend
COPY server ./server
COPY --from=build /app/dist ./dist

# Persistent data lives here (mount a volume at /data)
RUN mkdir -p /data/uploads
VOLUME ["/data"]

EXPOSE 5174
CMD ["node", "server/index.js"]
