# Use an official Node.js runtime as the base image
FROM node:16 AS node_base

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json for Node.js dependencies
COPY package.json package-lock.json ./

# Install Node.js dependencies
RUN npm install

# Use an official Python runtime for Python dependencies
FROM python:3.9-slim AS python_base

# Set the working directory in the container
WORKDIR /app

# Copy the Python requirements file
COPY requirements.txt ./

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Combine both environments
FROM node:16-slim

# Set the working directory in the final container
WORKDIR /app

# Copy files from previous stages
COPY --from=node_base /app /app
COPY --from=python_base /app /app

# Copy the rest of the application files
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["node", "start.js"]
