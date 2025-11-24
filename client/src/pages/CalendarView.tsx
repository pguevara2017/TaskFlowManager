import { useState } from "react";
import { TaskCalendar } from "@/components/TaskCalendar";
import { CreateTaskDialog } from "@/components/CreateTaskDialog";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
} from "@mui/material";

export default function CalendarView() {
  const [selectedProject, setSelectedProject] = useState("all");

  const projects = [
    { id: '1', name: 'Website Redesign' },
    { id: '2', name: 'Mobile App' },
    { id: '3', name: 'API Integration' },
  ];

  const [tasks] = useState([
    {
      id: '1',
      name: 'Design homepage mockups',
      priority: 2,
      dueDate: new Date(2024, 11, 15),
      assignee: 'Sarah Johnson',
      status: 'IN_PROGRESS' as const,
      projectId: '1',
    },
    {
      id: '2',
      name: 'Setup database schema',
      priority: 1,
      dueDate: new Date(2024, 11, 15),
      assignee: 'Mike Chen',
      status: 'COMPLETED' as const,
      projectId: '1',
    },
    {
      id: '3',
      name: 'Write API documentation',
      priority: 4,
      dueDate: new Date(2024, 11, 20),
      assignee: 'Emma Wilson',
      status: 'PENDING' as const,
      projectId: '2',
    },
    {
      id: '4',
      name: 'Implement authentication flow',
      priority: 1,
      dueDate: new Date(2024, 11, 18),
      assignee: 'David Lee',
      status: 'IN_PROGRESS' as const,
      projectId: '2',
    },
    {
      id: '5',
      name: 'Create user dashboard',
      priority: 3,
      dueDate: new Date(2024, 11, 22),
      assignee: 'Lisa Anderson',
      status: 'PENDING' as const,
      projectId: '3',
    },
    {
      id: '6',
      name: 'Setup CI/CD pipeline',
      priority: 2,
      dueDate: new Date(2024, 11, 12),
      assignee: 'Tom Brown',
      status: 'IN_PROGRESS' as const,
      projectId: '3',
    },
    {
      id: '7',
      name: 'Code review and testing',
      priority: 3,
      dueDate: new Date(2024, 11, 25),
      assignee: 'Sarah Johnson',
      status: 'PENDING' as const,
      projectId: '1',
    },
  ]);

  const filteredTasks = selectedProject === "all"
    ? tasks
    : tasks.filter(task => task.projectId === selectedProject);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
            Calendar
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            View tasks by due date
          </Typography>
        </Box>
        <CreateTaskDialog />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="project-filter-label">Filter by Project</InputLabel>
          <Select
            labelId="project-filter-label"
            id="project-filter"
            value={selectedProject}
            label="Filter by Project"
            onChange={(e) => setSelectedProject(e.target.value)}
            data-testid="select-project-calendar"
          >
            <MenuItem value="all">All Projects</MenuItem>
            {projects.map((project) => (
              <MenuItem key={project.id} value={project.id}>
                {project.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <TaskCalendar
        tasks={filteredTasks}
        onTaskClick={(task) => console.log('Clicked task:', task)}
      />
    </Box>
  );
}
