package com.taskflow.service;

import com.taskflow.dto.CreateTaskRequest;
import com.taskflow.dto.TasksResponse;
import com.taskflow.model.Task;
import com.taskflow.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TaskService {
    
    private final TaskRepository taskRepository;
    private final NotificationService notificationService;
    
    @Transactional(readOnly = true)
    public TasksResponse getTasks(
            String projectId,
            String status,
            Integer priority,
            LocalDateTime startDate,
            LocalDateTime endDate,
            String sortBy,
            String sortOrder
    ) {
        String sort = sortBy != null ? sortBy : "dueDate";
        String order = sortOrder != null ? sortOrder : "asc";
        
        List<Task> tasks = taskRepository.findTasksWithFilters(
            projectId, status, priority, startDate, endDate, sort, order
        );
        
        return new TasksResponse(tasks, tasks.size());
    }
    
    @Transactional(readOnly = true)
    public Optional<Task> getTaskById(String id) {
        return taskRepository.findById(id);
    }
    
    @Transactional
    public Task createTask(CreateTaskRequest request) {
        Task task = new Task();
        task.setProjectId(request.getProjectId());
        task.setName(request.getName());
        task.setDescription(request.getDescription());
        task.setPriority(request.getPriority());
        task.setAssignee(request.getAssignee());
        task.setStatus(request.getStatus());
        
        LocalDateTime dueDate = parseIsoDate(request.getDueDate());
        task.setDueDate(dueDate);
        
        Task savedTask = taskRepository.save(task);
        
        notificationService.sendTaskCreatedNotification(savedTask);
        
        return savedTask;
    }
    
    @Transactional
    public Optional<Task> updateTask(String id, CreateTaskRequest request) {
        return taskRepository.findById(id).map(task -> {
            if (request.getProjectId() != null) {
                task.setProjectId(request.getProjectId());
            }
            if (request.getName() != null) {
                task.setName(request.getName());
            }
            if (request.getDescription() != null) {
                task.setDescription(request.getDescription());
            }
            if (request.getPriority() != null) {
                task.setPriority(request.getPriority());
            }
            if (request.getAssignee() != null) {
                task.setAssignee(request.getAssignee());
            }
            if (request.getStatus() != null) {
                task.setStatus(request.getStatus());
            }
            if (request.getDueDate() != null) {
                LocalDateTime dueDate = parseIsoDate(request.getDueDate());
                task.setDueDate(dueDate);
            }
            
            Task updatedTask = taskRepository.save(task);
            notificationService.sendTaskUpdatedNotification(updatedTask);
            
            return updatedTask;
        });
    }
    
    @Transactional
    public boolean deleteTask(String id) {
        if (taskRepository.existsById(id)) {
            taskRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    @Transactional
    public Optional<Task> updateTaskStatus(String id, String status) {
        return taskRepository.findById(id).map(task -> {
            task.setStatus(status);
            Task updatedTask = taskRepository.save(task);
            notificationService.sendTaskUpdatedNotification(updatedTask);
            return updatedTask;
        });
    }
    
    private LocalDateTime parseIsoDate(String dateString) {
        try {
            ZonedDateTime zonedDateTime = ZonedDateTime.parse(dateString, DateTimeFormatter.ISO_DATE_TIME);
            return zonedDateTime.toLocalDateTime();
        } catch (Exception e) {
            return LocalDateTime.parse(dateString);
        }
    }
}
