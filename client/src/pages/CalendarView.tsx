import { useState } from "react";
import { TaskCalendar } from "@/components/TaskCalendar";
import { CreateTaskDialog } from "@/components/CreateTaskDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

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
    <div className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Calendar</h1>
          <p className="text-muted-foreground mt-1">
            View tasks by due date
          </p>
        </div>
        <CreateTaskDialog />
      </div>

      <div className="flex items-center gap-4">
        <div className="space-y-2">
          <Label htmlFor="project-filter">Filter by Project</Label>
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger className="w-[200px]" id="project-filter" data-testid="select-project-calendar">
              <SelectValue placeholder="All Projects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <TaskCalendar
        tasks={filteredTasks}
        onTaskClick={(task) => console.log('Clicked task:', task)}
      />
    </div>
  );
}
