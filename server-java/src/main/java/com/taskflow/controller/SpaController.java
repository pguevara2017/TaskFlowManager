package com.taskflow.controller;

import org.springframework.context.annotation.Profile;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

@Controller
@Profile("production")
public class SpaController {
    
    @GetMapping(value = "/", produces = MediaType.TEXT_HTML_VALUE)
    public ResponseEntity<String> index() {
        try {
            String html = Files.readString(Path.of("../dist/public/index.html"));
            return ResponseEntity.ok(html);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Error loading page");
        }
    }
    
    @RequestMapping(value = {"/{path:[^\\.]*}", "/{path:[^\\.]*}/**"})
    public ResponseEntity<String> forwardToIndex() {
        try {
            String html = Files.readString(Path.of("../dist/public/index.html"));
            return ResponseEntity.ok()
                .contentType(MediaType.TEXT_HTML)
                .body(html);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Error loading page");
        }
    }
}
