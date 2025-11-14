import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PriorityBadge } from "./PriorityBadge";
import { StatusBadge } from "./StatusBadge";
import { Button } from "@/components/ui/button";
import { Calendar, MoreVertical } from "lucide-react";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TaskCardProps {
  id: string;
  name: string;
  description?: string;
  priority: number;
  dueDate: Date;
  assignee: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  onEdit?: () => void;
  onDelete?: () => void;
  onClick?: () => void;
}

export function TaskCard({
  id,
  name,
  description,
  priority,
  dueDate,
  assignee,
  status,
  onEdit,
  onDelete,
  onClick,
}: TaskCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusColor = () => {
    if (status === "COMPLETED") return "border-l-chart-2";
    if (status === "IN_PROGRESS") return "border-l-chart-4";
    return "border-l-muted-foreground";
  };

  return (
    <Card
      className={`border-l-4 ${getStatusColor()} hover-elevate cursor-pointer min-h-[120px]`}
      onClick={onClick}
      data-testid={`card-task-${id}`}
    >
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2 gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-base line-clamp-2" data-testid={`text-task-name-${id}`}>
            {name}
          </h3>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" className="h-8 w-8" data-testid={`button-task-menu-${id}`}>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit?.(); }} data-testid={`button-edit-task-${id}`}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDelete?.(); }} data-testid={`button-delete-task-${id}`}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="space-y-4">
        {description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        )}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <PriorityBadge priority={priority} />
            <StatusBadge status={status} />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span data-testid={`text-due-date-${id}`}>{format(dueDate, "MMM d")}</span>
            </div>
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">{getInitials(assignee)}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
