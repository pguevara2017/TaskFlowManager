import { useState } from "react";
import { ProjectCard } from "@/components/ProjectCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchProjects, fetchProjectStatsBulk } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function Projects() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: projects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ["/api/projects"],
    queryFn: () => fetchProjects(),
  });

  const projectIds = projects.map(p => p.id);
  
  const { data: statsMap = {}, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/projects/stats", projectIds],
    queryFn: () => fetchProjectStatsBulk(projectIds),
    enabled: projects.length > 0,
  });

  const projectsWithStats = projects.map((project) => {
    const stats = statsMap[project.id] || {
      totalTasks: 0,
      completedTasks: 0,
      inProgressTasks: 0,
      pendingTasks: 0,
    };
    return {
      ...project,
      description: project.description ?? undefined,
      ...stats,
    };
  });

  const isLoading = projectsLoading || statsLoading;

  const filteredProjects = projectsWithStats.filter(
    (project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-semibold" data-testid="text-projects-title">
            Projects
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage and track all your projects
          </p>
        </div>
        <Button className="gap-2" data-testid="button-create-project">
          <Plus className="h-4 w-4" />
          Create Project
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
          data-testid="input-search-projects"
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              {searchQuery ? "No projects found matching your search" : "No projects yet. Create your first project to get started."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              {...project}
              onEdit={() => console.log("Edit project", project.id)}
              onDelete={() => console.log("Delete project", project.id)}
              onClick={() => console.log("View project", project.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
