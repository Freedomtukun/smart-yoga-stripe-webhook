# Use lightweight Node.js runtime
FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy the rest of the app
COPY . .

# Use Cloud Run expected port
ENV PORT=8080

# Expose port
EXPOSE 8080

# Start webhook server
CMD ["npm", "start"]
