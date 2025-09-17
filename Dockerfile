# Build frontend
FROM node:18 AS build-frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Build backend
FROM node:18
WORKDIR /app
COPY backend/package*.json ./
RUN npm install
COPY backend/ ./

# Copy frontend build into backend
COPY --from=build-frontend /app/frontend/build ./frontend/build

EXPOSE 8000
CMD ["npm", "run", "start"]
