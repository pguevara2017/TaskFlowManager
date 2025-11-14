import { useState } from "react";
import { ProjectCard } from "@/components/ProjectCard";
import { TaskCard } from "@/components/TaskCard";
import { CreateTaskDialog } from "@/components/CreateTaskDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Clock, AlertCircle, FolderKanban } from "lucide-react";

export default function Dashboard() {
  const [tasks] = useState([
    {
      id: '1',
      name: 'Design homepage mockups',
      description: 'Create high-fidelity mockups for the new homepage design',
      priority: 2,
      dueDate: new Date(2024, 11, 15),
      assignee: 'Sarah Johnson',
      status: 'IN_PROGRESS' as const,
      projectId: '1',
    },
    {
      id: '2',
      name: 'Setup database schema',
      description: 'Define and implement the database schema for user authentication',
      priority: 1,
      dueDate: new Date(2024, 11, 10),
      assignee: 'Mike Chen',
      status: 'COMPLETED' as const,
      projectId: '1',
    },
    {
      id: '3',
      name: 'Write API documentation',
      description: 'Document all REST API endpoints with examples',
      priority: 4,
      dueDate: new Date(2024, 11, 25),
      assignee: 'Emma Wilson',
      status: 'PENDING' as const,
      projectId: '2',
    },
    {
      id: '4',
      name: 'Implement authentication flow',
      description: 'Build JWT-based authentication with refresh tokens',
      priority: 1,
      dueDate: new Date(2024, 11, 18),
      assignee: 'David Lee',
      status: 'IN_PROGRESS' as const,
      projectId: '2',
    },
  ]);

  const [projects] = useState([
    {
      id: '1',
      name: 'Website Redesign',
      description: 'Complete overhaul of company website with new branding',
      color: '#3B82F6',
      totalTasks: 12,
      completedTasks: 5,
      inProgressTasks: 4,
      pendingTasks: 3,
    },
    {
      id: '2',
      name: 'Mobile App Development',
      description: 'Build iOS and Android mobile applications',
      color: '#8B5CF6',
      totalTasks: 18,
      completedTasks: 6,
      inProgressTasks: 8,
      pendingTasks: 4,
    },
    {
      id: '3',
      name: 'API Integration',
      description: 'Integrate third-party payment and analytics APIs',
      color: '#10B981',
      totalTasks: 8,
      completedTasks: 7,
      inProgressTasks: 1,
      pendingTasks: 0,
    },
  ]);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'COMPLETED').length;
  const inProgressTasks = tasks.filter(t => t.status === 'IN_PROGRESS').length;
  const pendingTasks = tasks.filter(t => t.status === 'PENDING').length;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Overview of your projects and tasks
          </p>
        </div>
        <CreateTaskDialog />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-total-projects">{projects.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-completed-tasks">{completedTasks}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-chart-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-in-progress-tasks">{inProgressTasks}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-pending-tasks">{pendingTasks}</div>
          </CardContent>
        </Card>
      </div>

      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Active Projects</h2>
          <Button variant="outline" className="gap-2" data-testid="button-view-all-projects">
            View All Projects
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              {...project}
              onEdit={() => console.log('Edit project', project.id)}
              onDelete={() => console.log('Delete project', project.id)}
              onClick={() => console.log('View project', project.id)}
            />
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Recent Tasks</h2>
          <Button variant="outline" data-testid="button-view-all-tasks">
            View All Tasks
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.slice(0, 3).map((task) => (
            <TaskCard
              key={task.id}
              {...task}
              onEdit={() => console.log('Edit task', task.id)}
              onDelete={() => console.log('Delete task', task.id)}
              onClick={() => console.log('View task', task.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
