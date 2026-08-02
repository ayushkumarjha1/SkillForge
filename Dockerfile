# Multi-stage lightweight Node.js container
FROM node:20-alpine AS runner

WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV PORT=3000

# Copy package manifests
COPY package*.json ./

# Install dependencies (ignoring dev dependencies for minimal image size)
RUN npm ci --only=production || npm install --production

# Copy application source code
COPY . .

# Expose server port
EXPOSE 3000

# Start production server
CMD ["node", "app.js"]
