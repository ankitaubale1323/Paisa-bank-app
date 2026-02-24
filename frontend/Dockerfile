#fronend dockerfile
# ── STAGE 1: BUILD ────

# Stage 1 installs dependencies and builds the React app.

# Step 1: Use Node.js Alpine as our build environment
FROM node:20-alpine AS builder

# Step 2: Set working directory for the build stage
WORKDIR /app

# Step 3: Copy package files first for better Docker layer caching
# If package.json hasn't changed, Docker skips npm install on rebuild
COPY package*.json ./

# Step 4: Install ALL dependencies (including devDependencies like Vite)
# We need devDependencies to build the React app
RUN npm install

# Step 5: Copy all frontend source files
# This includes src/, index.html, vite.config.js, tailwind.config.js etc
COPY . .

# Step 6: Build the React app for production
# Vite compiles everything into the /app/dist folder
RUN npm run build

# ── STAGE 2: SERVE ─────

# Stage 2 takes only the built files and serves them with Nginx.
# We do NOT copy node_modules — keeping the final image tiny


# Step 7: Use Nginx (lightweight web server) to serve the built app
FROM nginx:alpine

# Step 8: Copy the built React files from Stage 1 into Nginx's serve folder
COPY --from=builder /app/dist /user/share/nginx/html

# Step 9: Copy our custom Nginx config
COPY nginx.conf  /etc/nginx/conf.d/default.conf

# Step 10: Expose port 80 (standard HTTP port for Nginx)
EXPOSE 80

# Step 11: Start Nginx in the foreground (required for Docker)
CMD [ "nginx","-g","daemon off;" ]