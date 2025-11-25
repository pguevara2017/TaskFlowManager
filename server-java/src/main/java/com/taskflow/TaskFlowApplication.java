package com.taskflow;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class TaskFlowApplication {
    public static void main(String[] args) {
        SpringApplication app = new SpringApplication(TaskFlowApplication.class);
        
        // Auto-detect environment and set profile
        // If DATABASE_URL exists (Replit), use replit profile
        // Otherwise use local profile (H2 in-memory)
        String databaseUrl = System.getenv("DATABASE_URL");
        String profile = (databaseUrl != null && !databaseUrl.isEmpty()) ? "replit" : "local";
        app.setAdditionalProfiles(profile);
        
        System.out.println("🚀 Starting TaskFlow with profile: " + profile);
        if ("replit".equals(profile)) {
            System.out.println("📊 Using PostgreSQL database (Replit environment)");
        } else {
            System.out.println("📊 Using H2 in-memory database (local environment)");
            System.out.println("💡 H2 Console available at: http://localhost:8080/h2-console");
        }
        
        app.run(args);
    }
}
