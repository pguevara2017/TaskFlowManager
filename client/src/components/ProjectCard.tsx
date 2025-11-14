import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MoreVertical, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProjectCardProps {
  id: string;
  name: string;
  description?: string;
  color: string;
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  pendingTasks: number;
  onEdit?: () => void;
  onDelete?: () => void;
  onClick?: () => void;
}

export function ProjectCard({
  id,
  name,
  description,
  color,
  totalTasks,
  completedTasks,
  inProgressTasks,
  pendingTasks,
  onEdit,
  onDelete,
  onClick,
}: ProjectCardProps) {
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <Card className="hover-elevate cursor-pointer" onClick={onClick} data-testid={`card-project-${id}`}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4 gap-2">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div
            className="w-3 h-3 rounded-full mt-1 flex-shrink-0"
            style={{ backgroundColor: color }}
          />
          <div className="flex-1 min-w-0">
            <CardTitle className="text-xl font-semibold line-clamp-1" data-testid={`text-project-name-${id}`}>
              {name}
            </CardTitle>
            {description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {description}
              </p>
            )}
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" className="h-8 w-8" data-testid={`button-project-menu-${id}`}>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit?.(); }} data-testid={`button-edit-project-${id}`}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDelete?.(); }} data-testid={`button-delete-project-${id}`}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-chart-2" />
              <span className="text-muted-foreground">Completed</span>
            </div>
            <p className="text-2xl font-semibold" data-testid={`text-completed-${id}`}>{completedTasks}</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-chart-4" />
              <span className="text-muted-foreground">In Progress</span>
            </div>
            <p className="text-2xl font-semibold" data-testid={`text-in-progress-${id}`}>{inProgressTasks}</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm">
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Pending</span>
            </div>
            <p className="text-2xl font-semibold" data-testid={`text-pending-${id}`}>{pendingTasks}</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Total Tasks</span>
            </div>
            <p className="text-2xl font-semibold" data-testid={`text-total-${id}`}>{totalTasks}</p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}
