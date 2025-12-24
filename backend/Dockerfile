FROM node:22-alpine

WORKDIR /app

# Enable corepack and pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build TypeScript
RUN pnpm run build

# Expose port
EXPOSE 3001

# Start the application
CMD ["pnpm", "start"]
