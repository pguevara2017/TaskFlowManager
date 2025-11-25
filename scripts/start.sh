#!/bin/bash
echo "Starting TaskFlow Spring Boot server in production mode..."
cd server-java && java -jar target/taskflow-api-1.0.0.jar --spring.profiles.active=production
