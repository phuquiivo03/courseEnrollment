FROM oven/bun:1

# Install OpenSSL for Prisma
RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

# Copy package files
COPY package.json ./

# Install dependencies
RUN bun install

# Copy source code
COPY . .

# Generate Prisma client
RUN bunx prisma generate

EXPOSE 3000

# Start the application directly with TypeScript
CMD ["bun", "run", "start"]