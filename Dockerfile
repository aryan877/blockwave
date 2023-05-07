# Use the official Node.js 16 LTS image as the base image
FROM node:16-alpine

# Set the working directory in the container to /app
WORKDIR /app

# Copy the package.json file to the container
COPY package.json .

# Install dependencies using npm
RUN npm install --production

# Copy the rest of the application code to the container
COPY . .

# Build the Next.js application
RUN npm run build

# Set the command to start the Next.js application
CMD ["npm", "start"]
