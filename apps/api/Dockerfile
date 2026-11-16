# ----------------------------
# 1. Build Stage
# ----------------------------
FROM node:22-slim AS builder

WORKDIR /app

# Install build tools if any native modules need rebuild
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

# Copy dependency manifests
COPY package.json package-lock.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci

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

# Install production dependencies only
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy built bundle from builder stage
COPY --from=builder /app/dist/apps/api ./dist/apps/api
COPY --from=builder /app/dist/out-tsc ./dist/out-tsc

# Expose port and start
EXPOSE 4000

CMD ["node", "dist/apps/api/main.js"]