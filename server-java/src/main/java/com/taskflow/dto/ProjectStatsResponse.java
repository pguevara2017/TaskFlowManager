package com.taskflow.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProjectStatsResponse {
    private Long totalTasks;
    private Long completedTasks;
    private Long inProgressTasks;
    private Long pendingTasks;
}
