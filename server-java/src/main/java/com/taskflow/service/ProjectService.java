package com.taskflow.service;

import com.taskflow.dto.CreateProjectRequest;
import com.taskflow.dto.ProjectStatsResponse;
import com.taskflow.model.Project;
import com.taskflow.repository.ProjectRepository;
import com.taskflow.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProjectService {
    
    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    
    @Transactional(readOnly = true)
    public List<Project> getAllProjects() {
        return projectRepository.findAllByOrderByNameAsc();
    }
    
    @Transactional(readOnly = true)
    public Optional<Project> getProjectById(String id) {
        return projectRepository.findById(id);
    }
    
    @Transactional
    public Project createProject(CreateProjectRequest request) {
        Project project = new Project();
        project.setName(request.getName());
        project.setDescription(request.getDescription());
        if (request.getColor() != null && !request.getColor().isEmpty()) {
            project.setColor(request.getColor());
        }
        return projectRepository.save(project);
    }
    
    @Transactional
    public Optional<Project> updateProject(String id, CreateProjectRequest request) {
        return projectRepository.findById(id).map(project -> {
            if (request.getName() != null) {
                project.setName(request.getName());
            }
            if (request.getDescription() != null) {
                project.setDescription(request.getDescription());
            }
            if (request.getColor() != null) {
                project.setColor(request.getColor());
            }
            return projectRepository.save(project);
        });
    }
    
    @Transactional
    public boolean deleteProject(String id) {
        if (projectRepository.existsById(id)) {
            projectRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    @Transactional(readOnly = true)
    public Map<String, ProjectStatsResponse> getProjectStatsBulk(List<String> projectIds) {
        List<String> idsToQuery;
        if (projectIds == null || projectIds.isEmpty()) {
            idsToQuery = taskRepository.findDistinctProjectIds();
            List<Project> allProjects = projectRepository.findAll();
            for (Project p : allProjects) {
                if (!idsToQuery.contains(p.getId())) {
                    idsToQuery.add(p.getId());
                }
            }
        } else {
            idsToQuery = projectIds;
        }
        
        Map<String, ProjectStatsResponse> stats = new HashMap<>();
        
        for (String projectId : idsToQuery) {
            Long total = taskRepository.countByProjectId(projectId);
            Long completed = taskRepository.countCompletedByProjectId(projectId);
            Long inProgress = taskRepository.countInProgressByProjectId(projectId);
            Long pending = taskRepository.countPendingByProjectId(projectId);
            
            stats.put(projectId, new ProjectStatsResponse(total, completed, inProgress, pending));
        }
        
        return stats;
    }
}
