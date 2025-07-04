# Stage 1: Build the React app
FROM node:18-alpine AS build

WORKDIR /word-editor

# Copy package.json dan package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy seluruh source code
COPY . .

# Build aplikasi React
RUN npm run build

# Stage 2: Serve hasil build dengan Nginx
FROM nginx:stable-alpine

# Copy hasil build ke folder Nginx default
COPY --from=build /word-editor/dist /usr/share/nginx/html

# Optional: custom nginx config
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]