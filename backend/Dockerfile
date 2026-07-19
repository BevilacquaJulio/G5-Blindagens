# syntax=docker/dockerfile:1

# ============================================================
# Stage 1 — build (Prisma generate + Nest build)
# Tem todas as dependencias (incl. devDeps e a CLI do Prisma).
# ============================================================
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build          # "prisma generate && nest build"

# ============================================================
# Stage 2 — runtime de producao (apenas deps de producao)
# ============================================================
FROM node:22-alpine AS runtime

WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

# Client gerado (Prisma 7 gera fora de node_modules) + build + schema
COPY --from=build /app/generated ./generated
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/prisma.config.ts ./prisma.config.ts

EXPOSE 3000

CMD ["node", "dist/main.js"]
