FROM node:16-alpine

# Install Nginx
RUN apk add --update nginx

# Copy Nginx configuration file
COPY nginx.conf /etc/nginx/nginx.conf

# Copy Next.js app
COPY . /app

# Install Next.js app dependencies
WORKDIR /app
RUN npm install

# Build Next.js app
RUN npm run build

# Start Nginx and Next.js app
CMD nginx && npm start
