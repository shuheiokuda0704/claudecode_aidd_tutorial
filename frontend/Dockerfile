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

# Expose port
EXPOSE 3000

# Start the development server
CMD ["pnpm", "run", "dev", "--host", "0.0.0.0"]
