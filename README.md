# umami-anp-service
Microservice to manage user authentication and profile


Setup:
# Initialization
npm init -y

# Basic dependencies
npm install express prisma @prisma/client

# Dev dependencies
npm install -D typescript ts-node nodemon @types/node @types/express

# Initialize TypeScript:
npx tsc --init

# Update tsconfig.json
set the rootDir, outDir
set include src and exclude node_modules for building

# Initialize Prisma:
npx prisma init

# Run migrations and generate Prisma client:
npx prisma migrate dev --name init