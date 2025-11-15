package com.taskflow.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "tasks")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Task {
    
    @Id
    @Column(name = "id", columnDefinition = "varchar")
    private String id;
    
    @Column(name = "project_id", nullable = false)
    private String projectId;
    
    @Column(name = "name", nullable = false)
    private String name;
    
    @Column(name = "description")
    private String description;
    
    @Column(name = "priority", nullable = false)
    private Integer priority = 3;
    
    @Column(name = "due_date")
    private LocalDateTime dueDate;
    
    @Column(name = "assignee", nullable = false)
    private String assignee;
    
    @Column(name = "status", nullable = false)
    private String status = "PENDING";
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    @PrePersist
    public void prePersist() {
        if (id == null || id.isEmpty()) {
            id = java.util.UUID.randomUUID().toString();
        }
        LocalDateTime now = LocalDateTime.now();
        if (createdAt == null) {
            createdAt = now;
        }
        if (updatedAt == null) {
            updatedAt = now;
        }
        if (priority == null) {
            priority = 3;
        }
        if (status == null || status.isEmpty()) {
            status = "PENDING";
        }
    }
    
    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
