import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PriorityBadge } from "./PriorityBadge";
import { StatusBadge } from "./StatusBadge";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

interface Task {
  id: string;
  name: string;
  priority: number;
  dueDate: Date;
  assignee: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
}

interface TaskTableProps {
  tasks: Task[];
  selectedTasks: string[];
  onSelectTask: (taskId: string) => void;
  onSelectAll: () => void;
  onSort: (field: string) => void;
  sortBy?: string;
  onTaskClick?: (task: Task) => void;
}

export function TaskTable({
  tasks,
  selectedTasks,
  onSelectTask,
  onSelectAll,
  onSort,
  sortBy,
  onTaskClick,
}: TaskTableProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No tasks found</p>
      </div>
    );
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selectedTasks.length === tasks.length}
                onCheckedChange={onSelectAll}
                data-testid="checkbox-select-all"
              />
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => onSort("name")} className="gap-1" data-testid="button-sort-name">
                Name
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => onSort("priority")} className="gap-1" data-testid="button-sort-priority">
                Priority
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => onSort("dueDate")} className="gap-1" data-testid="button-sort-due-date">
                Due Date
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>Assignee</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow
              key={task.id}
              className="cursor-pointer hover-elevate"
              onClick={() => onTaskClick?.(task)}
              data-testid={`row-task-${task.id}`}
            >
              <TableCell onClick={(e) => e.stopPropagation()}>
                <Checkbox
                  checked={selectedTasks.includes(task.id)}
                  onCheckedChange={() => onSelectTask(task.id)}
                  data-testid={`checkbox-task-${task.id}`}
                />
              </TableCell>
              <TableCell className="font-medium" data-testid={`text-task-name-${task.id}`}>
                {task.name}
              </TableCell>
              <TableCell>
                <PriorityBadge priority={task.priority} />
              </TableCell>
              <TableCell data-testid={`text-due-date-${task.id}`}>
                {format(task.dueDate, "MMM d, yyyy")}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">
                      {getInitials(task.assignee)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{task.assignee}</span>
                </div>
              </TableCell>
              <TableCell>
                <StatusBadge status={task.status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
