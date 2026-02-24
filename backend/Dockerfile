# backend Dockerfile

# Step 1: Use official Node.js LTS image as the base
# We use Alpine (lightweight Linux) to keep the image small
FROM node:20-alpine


# Step 2: Set the working directory inside the container
# All commands below will run from this folder
WORKDIR /app


# Step 3: Copy package.json and package-lock.json first
# We copy these before the rest of the code so Docker can
# cache the npm install layer — saves time on rebuilds
COPY package*.json ./

# Step 4: Install all dependencies
# --omit=dev skips devDependencies (like nodemon) in production
RUN npm install --omit=dev


# Step 5: Copy the rest of the backend source code
# This includes server.js, routes/, models/, controllers/, middleware
COPY . .


# Step 6: Expose the port the backend listens on
# This must match PORT in your .env file (default: 5000)
EXPOSE 5000


# Step 7: Start the backend server
# We use node directly (not nodemon) for production
CMD [ "node", "server.js" ]