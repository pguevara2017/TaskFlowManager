#!/bin/bash
echo "Building frontend with Vite..."
npx vite build

echo "Building Spring Boot JAR..."
cd server-java && mvn clean package -DskipTests

echo "Build complete!"
