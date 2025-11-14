import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedProject?: string;
  onProjectChange: (projectId: string) => void;
  projects: Array<{ id: string; name: string }>;
  selectedStatus?: string;
  onStatusChange: (status: string) => void;
  selectedPriority?: string;
  onPriorityChange: (priority: string) => void;
}

export function FilterBar({
  searchQuery,
  onSearchChange,
  selectedProject,
  onProjectChange,
  projects,
  selectedStatus,
  onStatusChange,
  selectedPriority,
  onPriorityChange,
}: FilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
      <div className="relative flex-1 min-w-0">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
          data-testid="input-search"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Select value={selectedProject} onValueChange={onProjectChange}>
          <SelectTrigger className="w-[180px]" data-testid="select-project">
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

        <Select value={selectedStatus} onValueChange={onStatusChange}>
          <SelectTrigger className="w-[150px]" data-testid="select-status-filter">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedPriority} onValueChange={onPriorityChange}>
          <SelectTrigger className="w-[150px]" data-testid="select-priority-filter">
            <SelectValue placeholder="All Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="1">Critical</SelectItem>
            <SelectItem value="2">High</SelectItem>
            <SelectItem value="3">Medium</SelectItem>
            <SelectItem value="4">Low</SelectItem>
            <SelectItem value="5">Lowest</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
