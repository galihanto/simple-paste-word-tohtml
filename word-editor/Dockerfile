# Stage 1: Build the React app
FROM node:18-alpine AS build

WORKDIR /word-editor

# Copy package.json dan package-lock.json / yarn.lock
COPY package*.json ./

# Install dependencies
RUN npm install  --legacy-peer-deps

# Copy semua source code
COPY . .

# Build aplikasi React ke folder /app/build (default buat CRA)
RUN npm run build

# Stage 2: Serve hasil build dengan Nginx
FROM nginx:stable-alpine

# Copy hasil build dari stage build ke folder nginx default
COPY --from=build /word-editor/dist /usr/share/nginx/html

# Salin custom nginx config jika perlu (opsional)
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
