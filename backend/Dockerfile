# Stage 1: Base - Install production dependencies
FROM node:current-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Stage 2: Build - Build/Compile the application
FROM base AS build
# Install all dependencies (including devDependencies) for building
RUN npm ci 
COPY . .

# Stage 3: Production - Final slim image
FROM node:current-alpine AS production
WORKDIR /app
# Copy only the production node_modules from base stage
COPY --from=base /app/node_modules ./node_modules
# Copy only the compiled build artifacts (e.g., dist or .next folder)
COPY --from=build /app/src ./src
COPY package*.json ./

# USER node
CMD ["node", "src/server.js"]