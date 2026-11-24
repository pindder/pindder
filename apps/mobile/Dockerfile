# ----------------------------
# 1. Build Stage
# ----------------------------
FROM node:22-slim AS builder

WORKDIR /app

COPY package.json package-lock.json .npmrc* ./
RUN npm ci --legacy-peer-deps

COPY . .

# Build Mobile web/PWA preview
RUN npx nx run mobile:build:production

# ----------------------------
# 2. Production Nginx Stage
# ----------------------------
FROM nginx:alpine AS runner

COPY apps/mobile/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist/apps/mobile/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
