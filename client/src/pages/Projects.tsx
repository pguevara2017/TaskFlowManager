import { useState } from "react";
import { ProjectCard } from "@/components/ProjectCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function Projects() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const [projects] = useState([
    {
      id: '1',
      name: 'Website Redesign',
      description: 'Complete overhaul of company website with new branding and modern features',
      color: '#3B82F6',
      totalTasks: 12,
      completedTasks: 5,
      inProgressTasks: 4,
      pendingTasks: 3,
    },
    {
      id: '2',
      name: 'Mobile App Development',
      description: 'Build iOS and Android mobile applications for customer engagement',
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
    {
      id: '4',
      name: 'Database Migration',
      description: 'Migrate legacy database to new cloud infrastructure',
      color: '#F59E0B',
      totalTasks: 6,
      completedTasks: 2,
      inProgressTasks: 3,
      pendingTasks: 1,
    },
    {
      id: '5',
      name: 'Marketing Campaign',
      description: 'Q4 digital marketing campaign across social media platforms',
      color: '#EC4899',
      totalTasks: 15,
      completedTasks: 10,
      inProgressTasks: 3,
      pendingTasks: 2,
    },
    {
      id: '6',
      name: 'Customer Portal',
      description: 'Self-service portal for customers to manage their accounts',
      color: '#06B6D4',
      totalTasks: 20,
      completedTasks: 8,
      inProgressTasks: 7,
      pendingTasks: 5,
    },
  ]);

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Projects</h1>
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

      {filteredProjects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No projects found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              {...project}
              onEdit={() => console.log('Edit project', project.id)}
              onDelete={() => console.log('Delete project', project.id)}
              onClick={() => console.log('View project', project.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
