package com.taskflow.service;

import com.taskflow.model.Task;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Slf4j
@Service
public class NotificationService {
    
    private ExecutorService executorService;
    private static final int POOL_SIZE = 4;
    
    @PostConstruct
    public void init() {
        executorService = Executors.newFixedThreadPool(POOL_SIZE);
        log.info("✓ Email notification worker pool initialized with {}/{} workers", POOL_SIZE, POOL_SIZE);
    }
    
    @PreDestroy
    public void shutdown() {
        if (executorService != null) {
            executorService.shutdown();
            log.info("Email notification service shut down");
        }
    }
    
    @Async
    public void sendTaskCreatedNotification(Task task) {
        executorService.submit(() -> {
            try {
                String formattedDueDate = task.getDueDate() != null 
                    ? task.getDueDate().format(DateTimeFormatter.ofPattern("MM/dd/yyyy"))
                    : "No due date";
                
                log.info("\n=== EMAIL NOTIFICATION (Worker Thread) ===");
                log.info("Type: TASK CREATED");
                log.info("To: {}", task.getAssignee());
                log.info("Subject: Task Assigned: {}", task.getName());
                log.info("Task ID: {}", task.getId());
                log.info("Priority: {}", task.getPriority());
                log.info("Due Date: {}", formattedDueDate);
                log.info("Message: You have been assigned to the task \"{}\"", task.getName());
                log.info("==========================================\n");
            } catch (Exception e) {
                log.error("Error sending email notification", e);
            }
        });
    }
    
    @Async
    public void sendTaskUpdatedNotification(Task task) {
        executorService.submit(() -> {
            try {
                String formattedDueDate = task.getDueDate() != null 
                    ? task.getDueDate().format(DateTimeFormatter.ofPattern("MM/dd/yyyy"))
                    : "No due date";
                
                log.info("\n=== EMAIL NOTIFICATION (Worker Thread) ===");
                log.info("Type: TASK UPDATED");
                log.info("To: {}", task.getAssignee());
                log.info("Subject: Task Updated: {}", task.getName());
                log.info("Task ID: {}", task.getId());
                log.info("Priority: {}", task.getPriority());
                log.info("Due Date: {}", formattedDueDate);
                log.info("Status: {}", task.getStatus());
                log.info("Message: You have been notified of an update to the task \"{}\"", task.getName());
                log.info("==========================================\n");
            } catch (Exception e) {
                log.error("Error sending email notification", e);
            }
        });
    }
}
