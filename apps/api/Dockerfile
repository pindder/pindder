# ----------------------------
# 1. Build Stage
# ----------------------------
FROM node:22-slim AS builder

WORKDIR /app

# Install build tools for native modules (like bcrypt)
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

# Copy dependency manifests and npm configuration
COPY package.json package-lock.json .npmrc* ./

# Install dependencies (respecting legacy-peer-deps)
RUN npm ci --legacy-peer-deps

# Copy all source files
COPY . .

# Build contracts first, then the API
RUN npx nx run contracts:build
RUN npx nx run api:build:production

# ----------------------------
# 2. Production Stage
# ----------------------------
FROM node:22-slim AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=4000

# Install production dependencies
COPY package.json package-lock.json .npmrc* ./
RUN npm ci --omit=dev --legacy-peer-deps && npm cache clean --force

# Copy built bundle from builder stage
COPY --from=builder /app/dist/apps/api ./dist/apps/api
COPY --from=builder /app/dist/out-tsc ./dist/out-tsc

# Expose port and start
EXPOSE 4000

CMD ["node", "dist/apps/api/main.js"]
