# Use the official Node.js image.
# https://hub.docker.com/_/node
FROM node:14

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
COPY ../back/package*.json ./

# Install production dependencies.
RUN npm install --only=production

# Copy local code to the container image.
COPY ../back ./

# Set the working directory to the folder containing server.js
WORKDIR /usr/src/app/back

# Run the web service on container startup.
CMD [ "node", "server.js" ]

# Document that the service listens on port 8080.
EXPOSE 8080
