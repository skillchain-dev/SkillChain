FROM node:22-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY server/package*.json ./server/
RUN cd server && npm ci --omit=dev
COPY server/ ./server/
COPY ai-service/package*.json ./ai-service/
RUN cd ai-service && npm ci --omit=dev
COPY ai-service/ ./ai-service/
WORKDIR /app/server
USER node
EXPOSE 5000
CMD ["node", "src/server.js"]
