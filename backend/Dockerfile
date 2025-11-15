FROM node:20-alpine

WORKDIR /app

# Copy only package files first (use caching)
COPY package*.json ./

RUN npm install

# Copy the rest of the project
COPY . .

# Build the TypeScript code
RUN npm run build

# Ensure entrypoint is executable
RUN chmod +x entrypoint.sh

EXPOSE 5000

CMD ["./entrypoint.sh"]
