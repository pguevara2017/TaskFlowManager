#!/bin/bash
echo "🔨 Building TaskFlow for production..."

# Build frontend with Vite
echo "📦 Building frontend..."
npx vite build

# Build server orchestrator
echo "📦 Bundling server orchestrator..."
npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

# Build Spring Boot JAR
echo "📦 Building Spring Boot JAR..."
cd server-java
mvn clean package -DskipTests
cd ..

echo "✅ Production build complete!"
