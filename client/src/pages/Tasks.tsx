import { useState } from "react";
import { TaskTable } from "@/components/TaskTable";
import { TaskCard } from "@/components/TaskCard";
import { FilterBar } from "@/components/FilterBar";
import { CreateTaskDialog } from "@/components/CreateTaskDialog";
import { Button } from "@/components/ui/button";
import { LayoutGrid, List } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { fetchProjects, fetchTasks } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function Tasks() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("dueDate");

  const { data: projects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ["/api/projects"],
    queryFn: () => fetchProjects(),
  });

  const { data: tasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: [
      "/api/tasks",
      {
        projectId: selectedProject === "all" ? undefined : selectedProject,
        status: selectedStatus === "all" ? undefined : selectedStatus,
        priority: selectedPriority === "all" ? undefined : parseInt(selectedPriority),
        sortBy: sortBy === "dueDate" ? "dueDate" : sortBy === "priority" ? "priority" : "name",
        sortOrder: "asc",
      },
    ],
    queryFn: () =>
      fetchTasks({
        projectId: selectedProject === "all" ? undefined : selectedProject,
        status: selectedStatus === "all" ? undefined : selectedStatus,
        priority: selectedPriority === "all" ? undefined : parseInt(selectedPriority),
        sortBy: sortBy === "dueDate" ? "dueDate" : sortBy === "priority" ? "priority" : "name",
        sortOrder: "asc",
      }),
  });

  const projectOptions = projects.map((p) => ({ id: p.id, name: p.name }));

  const filteredTasks = tasks
    .filter((task) => {
      const matchesSearch =
        task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    })
    .map((task) => ({
      ...task,
      description: task.description ?? undefined,
      dueDate: new Date(task.dueDate),
      status: task.status as "PENDING" | "IN_PROGRESS" | "COMPLETED",
    }));

  const isLoading = tasksLoading || projectsLoading;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-semibold" data-testid="text-tasks-title">
            Tasks
          </h1>
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
        projects={projectOptions}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        selectedPriority={selectedPriority}
        onPriorityChange={setSelectedPriority}
      />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      ) : filteredTasks.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              {searchQuery || selectedProject !== "all" || selectedStatus !== "all" || selectedPriority !== "all"
                ? "No tasks found matching your filters"
                : "No tasks yet. Create your first task to get started."}
            </p>
          </CardContent>
        </Card>
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              {...task}
              onEdit={() => console.log("Edit task", task.id)}
              onDelete={() => console.log("Delete task", task.id)}
              onClick={() => console.log("View task", task.id)}
            />
          ))}
        </div>
      ) : (
        <TaskTable
          tasks={filteredTasks}
          selectedTasks={selectedTasks}
          onSelectTask={(id) => {
            setSelectedTasks((prev) =>
              prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
            );
          }}
          onSelectAll={() => {
            setSelectedTasks(
              selectedTasks.length === filteredTasks.length ? [] : filteredTasks.map((t) => t.id)
            );
          }}
          onSort={(field) => {
            console.log("Sort by:", field);
            setSortBy(field);
          }}
          sortBy={sortBy}
          onTaskClick={(task) => console.log("Clicked task:", task)}
        />
      )}
    </div>
  );
}
