# Use official Node.js LTS image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy source code
COPY src ./src
COPY clockify-mcp-spec.json ./
COPY .env.example ./

# Expose port (if needed)
EXPOSE 8080

# Start the MCP server
CMD ["node", "src/server.js"]
