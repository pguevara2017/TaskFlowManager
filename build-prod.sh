#!/bin/bash
# Build script for production deployment

echo "📦 Building frontend with Vite..."
npm run build:frontend

echo "📦 Building Spring Boot JAR..."
cd server-java
mvn clean package -DskipTests
cd ..

echo "✅ Production build complete!"
