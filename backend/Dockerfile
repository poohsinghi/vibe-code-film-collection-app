# Use Node.js 18 Alpine as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dumb-init and netcat for proper signal handling and database waiting
RUN apk add --no-cache dumb-init netcat-openbsd

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code and scripts
COPY . .
COPY docker-entrypoint.sh ./

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S backend -u 1001

# Change ownership of the app directory and make script executable
RUN chown -R backend:nodejs /app && chmod +x docker-entrypoint.sh
USER backend

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application with dumb-init and custom entrypoint
ENTRYPOINT ["dumb-init", "--"]
CMD ["./docker-entrypoint.sh"]
