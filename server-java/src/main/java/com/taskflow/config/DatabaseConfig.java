package com.taskflow.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;
import java.net.URI;
import java.net.URISyntaxException;

@Configuration
public class DatabaseConfig {
    
    @Bean
    public DataSource dataSource() {
        String databaseUrl = System.getenv("DATABASE_URL");
        
        if (databaseUrl == null || databaseUrl.isEmpty()) {
            throw new RuntimeException("DATABASE_URL environment variable not set");
        }
        
        try {
            URI dbUri = new URI(databaseUrl);
            String username = null;
            String password = null;
            
            if (dbUri.getUserInfo() != null) {
                String[] userInfo = dbUri.getUserInfo().split(":");
                username = userInfo[0];
                if (userInfo.length > 1) {
                    password = userInfo[1];
                }
            }
            
            String host = dbUri.getHost();
            int port = dbUri.getPort();
            if (port == -1) {
                port = 5432;
            }
            String path = dbUri.getPath();
            String query = dbUri.getQuery();
            
            String jdbcUrl = String.format(
                "jdbc:postgresql://%s:%d%s%s",
                host,
                port,
                path,
                query != null ? "?" + query : ""
            );
            
            HikariConfig config = new HikariConfig();
            config.setJdbcUrl(jdbcUrl);
            config.setUsername(username);
            config.setPassword(password);
            config.setMaximumPoolSize(10);
            
            return new HikariDataSource(config);
        } catch (URISyntaxException e) {
            throw new RuntimeException("Invalid DATABASE_URL format", e);
        }
    }
}
