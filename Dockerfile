# Multi-stage Docker build for Kisan Setu

# Stage 1: Build Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Stage 2: Production Server
FROM node:20-alpine
WORKDIR /app

# Install server dependencies
COPY server/package*.json ./server/
RUN cd server && npm install --omit=dev

# Copy server code
COPY server/ ./server/

# Copy compiled frontend from Stage 1 into client/dist
COPY --from=frontend-builder /app/client/dist ./client/dist

# Expose server port
EXPOSE 5001

ENV NODE_ENV=production
ENV PORT=5001

CMD ["node", "server/server.js"]
