package com.taskflow.dto;

import lombok.Data;

@Data
public class UpdateTaskRequest {
    private String projectId;
    private String name;
    private String description;
    private Integer priority;
    private String dueDate;
    private String assignee;
    private String status;
}
