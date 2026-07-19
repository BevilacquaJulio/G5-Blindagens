# syntax=docker/dockerfile:1

# ============================================================
# Stage 1 — build (Vite + React + TypeScript)
# VITE_API_URL e compilado AQUI (build-time). Nunca coloque
# segredo em VITE_*: ele fica embutido no bundle estatico.
# ============================================================
FROM node:22-alpine AS build

WORKDIR /app

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build          # "tsc --noEmit && vite build"

# ============================================================
# Stage 2 — runtime estatico (Nginx)
# ============================================================
FROM nginx:alpine AS runtime

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
