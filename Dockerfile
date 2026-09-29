# Stage 1: Build the Vite React Application
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy remaining project source files and build
COPY . .
RUN npm run build

# Stage 2: Serve application with Nginx
FROM nginx:alpine

# Copy custom build output from stage 1 to Nginx default html directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]

