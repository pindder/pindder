# ----------------------------
# 1. Build Stage
# ----------------------------
FROM node:22-slim AS builder

WORKDIR /app

COPY package.json package-lock.json .npmrc* ./
RUN npm ci --legacy-peer-deps

COPY . .

# Build the Angular app
RUN npx nx run pindder-web:build:production

# ----------------------------
# 2. Production Nginx Stage
# ----------------------------
FROM nginx:alpine AS runner

# Copy custom Nginx configuration
COPY apps/pindder-web/nginx.conf /etc/nginx/conf.d/default.conf

# Copy Angular compiled browser assets
COPY --from=builder /app/dist/apps/pindder-web/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
