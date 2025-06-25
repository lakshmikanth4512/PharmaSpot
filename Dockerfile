# Use an official Node.js runtime as the base image
FROM node:16-buster

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install all dependencies, including dev dependencies
RUN npm install --include=dev

# Explicitly install electron-forge globally to ensure it's available
RUN npm install -g electron-forge

# Copy the rest of the application code to the container
COPY . .

# Expose the port that the app runs on
EXPOSE 3000

# Command to start the application
CMD ["npm", "start"]
