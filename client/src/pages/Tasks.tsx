import { useState } from "react";
import { TaskTable } from "@/components/TaskTable";
import { TaskCard } from "@/components/TaskCard";
import { FilterBar } from "@/components/FilterBar";
import { CreateTaskDialog } from "@/components/CreateTaskDialog";
import { Button } from "@/components/ui/button";
import { LayoutGrid, List } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Tasks() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("dueDate");

  const projects = [
    { id: '1', name: 'Website Redesign' },
    { id: '2', name: 'Mobile App' },
    { id: '3', name: 'API Integration' },
  ];

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
      description: 'Define and implement the database schema',
      priority: 1,
      dueDate: new Date(2024, 11, 10),
      assignee: 'Mike Chen',
      status: 'COMPLETED' as const,
      projectId: '1',
    },
    {
      id: '3',
      name: 'Write API documentation',
      description: 'Document all REST API endpoints',
      priority: 4,
      dueDate: new Date(2024, 11, 25),
      assignee: 'Emma Wilson',
      status: 'PENDING' as const,
      projectId: '2',
    },
    {
      id: '4',
      name: 'Implement authentication flow',
      description: 'Build JWT-based authentication',
      priority: 1,
      dueDate: new Date(2024, 11, 18),
      assignee: 'David Lee',
      status: 'IN_PROGRESS' as const,
      projectId: '2',
    },
    {
      id: '5',
      name: 'Create user dashboard',
      description: 'Design and implement user dashboard UI',
      priority: 3,
      dueDate: new Date(2024, 11, 22),
      assignee: 'Lisa Anderson',
      status: 'PENDING' as const,
      projectId: '3',
    },
    {
      id: '6',
      name: 'Setup CI/CD pipeline',
      description: 'Configure automated testing and deployment',
      priority: 2,
      dueDate: new Date(2024, 11, 12),
      assignee: 'Tom Brown',
      status: 'IN_PROGRESS' as const,
      projectId: '3',
    },
  ]);

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProject = selectedProject === "all" || task.projectId === selectedProject;
    const matchesStatus = selectedStatus === "all" || task.status === selectedStatus;
    const matchesPriority = selectedPriority === "all" || task.priority.toString() === selectedPriority;
    
    return matchesSearch && matchesProject && matchesStatus && matchesPriority;
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Tasks</h1>
          <p className="text-muted-foreground mt-1">
            View and manage all your tasks
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Tabs value={view} onValueChange={(v) => setView(v as "grid" | "list")}>
            <TabsList>
              <TabsTrigger value="grid" data-testid="button-view-grid">
                <LayoutGrid className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="list" data-testid="button-view-list">
                <List className="h-4 w-4" />
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <CreateTaskDialog />
        </div>
      </div>

      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedProject={selectedProject}
        onProjectChange={setSelectedProject}
        projects={projects}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        selectedPriority={selectedPriority}
        onPriorityChange={setSelectedPriority}
      />

      {filteredTasks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No tasks found</p>
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              {...task}
              onEdit={() => console.log('Edit task', task.id)}
              onDelete={() => console.log('Delete task', task.id)}
              onClick={() => console.log('View task', task.id)}
            />
          ))}
        </div>
      ) : (
        <TaskTable
          tasks={filteredTasks}
          selectedTasks={selectedTasks}
          onSelectTask={(id) => {
            setSelectedTasks(prev =>
              prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
            );
          }}
          onSelectAll={() => {
            setSelectedTasks(
              selectedTasks.length === filteredTasks.length
                ? []
                : filteredTasks.map(t => t.id)
            );
          }}
          onSort={(field) => {
            console.log('Sort by:', field);
            setSortBy(field);
          }}
          sortBy={sortBy}
          onTaskClick={(task) => console.log('Clicked task:', task)}
        />
      )}
    </div>
  );
}
