package com.taskflow.repository;

import com.taskflow.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, String> {
    
    List<Task> findByProjectId(String projectId);
    
    List<Task> findByStatus(String status);
    
    List<Task> findByPriority(Integer priority);
    
    @Query("SELECT t FROM Task t WHERE " +
           "(:projectId IS NULL OR t.projectId = :projectId) AND " +
           "(:status IS NULL OR t.status = :status) AND " +
           "(:priority IS NULL OR t.priority = :priority) AND " +
           "(:startDate IS NULL OR t.dueDate >= :startDate) AND " +
           "(:endDate IS NULL OR t.dueDate <= :endDate) " +
           "ORDER BY " +
           "CASE WHEN :sortBy = 'priority' AND :sortOrder = 'asc' THEN t.priority END ASC, " +
           "CASE WHEN :sortBy = 'priority' AND :sortOrder = 'desc' THEN t.priority END DESC, " +
           "CASE WHEN :sortBy = 'dueDate' AND :sortOrder = 'asc' THEN t.dueDate END ASC, " +
           "CASE WHEN :sortBy = 'dueDate' AND :sortOrder = 'desc' THEN t.dueDate END DESC, " +
           "CASE WHEN :sortBy = 'name' AND :sortOrder = 'asc' THEN t.name END ASC, " +
           "CASE WHEN :sortBy = 'name' AND :sortOrder = 'desc' THEN t.name END DESC")
    List<Task> findTasksWithFilters(
        @Param("projectId") String projectId,
        @Param("status") String status,
        @Param("priority") Integer priority,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate,
        @Param("sortBy") String sortBy,
        @Param("sortOrder") String sortOrder
    );
    
    @Query("SELECT COUNT(t) FROM Task t WHERE t.projectId = :projectId")
    Long countByProjectId(@Param("projectId") String projectId);
    
    @Query("SELECT COUNT(t) FROM Task t WHERE t.projectId = :projectId AND t.status = 'COMPLETED'")
    Long countCompletedByProjectId(@Param("projectId") String projectId);
    
    @Query("SELECT COUNT(t) FROM Task t WHERE t.projectId = :projectId AND t.status = 'IN_PROGRESS'")
    Long countInProgressByProjectId(@Param("projectId") String projectId);
    
    @Query("SELECT COUNT(t) FROM Task t WHERE t.projectId = :projectId AND t.status = 'PENDING'")
    Long countPendingByProjectId(@Param("projectId") String projectId);
    
    @Query("SELECT t.projectId FROM Task t GROUP BY t.projectId")
    List<String> findDistinctProjectIds();
}
