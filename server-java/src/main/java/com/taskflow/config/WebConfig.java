package com.taskflow.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@Profile("production")
public class WebConfig implements WebMvcConfigurer {
    
    private static final String STATIC_PATH = "file:../dist/public/";
    
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Serve assets directory (JS, CSS, images)
        registry.addResourceHandler("/assets/**")
                .addResourceLocations(STATIC_PATH + "assets/")
                .setCachePeriod(31536000); // 1 year cache for hashed assets
        
        // Serve favicon
        registry.addResourceHandler("/favicon.png")
                .addResourceLocations(STATIC_PATH + "favicon.png");
        
        // Serve any other static files at root level
        registry.addResourceHandler("/*.js", "/*.css", "/*.ico", "/*.png", "/*.json")
                .addResourceLocations(STATIC_PATH);
    }
}
