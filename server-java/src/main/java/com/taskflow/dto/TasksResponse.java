package com.taskflow.dto;

import com.taskflow.model.Task;
import lombok.Data;
import lombok.AllArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
public class TasksResponse {
    private List<Task> tasks;
    private long total;
}
