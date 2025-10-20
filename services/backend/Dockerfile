FROM node:18-alpine

# Install dependencies for Prisma and other native modules
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    openssl \
    postgresql-client

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci --only=production

# Generate Prisma client
RUN npx prisma generate

# Copy source code
COPY src ./src

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S afriverse -u 1001

# Change ownership
RUN chown -R afriverse:nodejs /app

# Switch to non-root user
USER afriverse

# Expose port
EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node health-check.js

# Start application
CMD ["node", "src/server.js"]