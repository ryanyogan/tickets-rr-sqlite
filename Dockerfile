# syntax = docker/dockerfile:1
# Adjust NODE_VERSION as desired
ARG NODE_VERSION=22.12.0
FROM node:${NODE_VERSION}-slim AS base

LABEL fly_launch_runtime="Node.js/Prisma"

# Node.js/Prisma app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"
ENV DATABASE_URL="file:///data/sqlite.db"

# Build stage to reduce size of final image
FROM base AS deps
# Only copy package files for better layer caching
COPY package*.json ./
# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp openssl pkg-config python-is-python3 && \
    npm ci --legacy-peer-deps --include=dev && \
    apt-get purge -y --auto-remove build-essential python-is-python3 && \
    rm -rf /var/lib/apt/lists/*

# Prisma generation stage
FROM deps AS prisma
COPY prisma ./prisma
RUN npx prisma generate

# Build stage for application
FROM prisma AS builder
# Copy source code
COPY . .
# Build application
RUN npm run build

# Production dependencies only
FROM deps AS production-deps
RUN npm prune --legacy-peer-deps --omit=dev

# Final stage for app image
FROM base AS runner

# Install only essential packages needed for runtime
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y ca-certificates openssl && \
    rm -rf /var/lib/apt/lists/*

# Setup sqlite3 on a separate volume
RUN mkdir -p /data
VOLUME /data

# Copy production dependencies
COPY --from=production-deps /app/node_modules ./node_modules
# Copy Prisma generated client
COPY --from=prisma /app/node_modules/.prisma ./node_modules/.prisma
# Copy built application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public
# Copy essential runtime files
COPY docker-entrypoint.js ./
COPY prisma ./prisma

# Entrypoint prepares the database
ENTRYPOINT ["/app/docker-entrypoint.js"]

# Start the server
EXPOSE 3000
CMD ["npm", "run", "start"]