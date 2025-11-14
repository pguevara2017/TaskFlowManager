import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, isSameDay } from "date-fns";
import { PriorityBadge } from "./PriorityBadge";

interface Task {
  id: string;
  name: string;
  priority: number;
  dueDate: Date;
  assignee: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
}

interface TaskCalendarProps {
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
}

export function TaskCalendar({ tasks, onTaskClick }: TaskCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const getTasksForDate = (date: Date) => {
    return tasks.filter((task) => isSameDay(task.dueDate, date));
  };

  const selectedDateTasks = selectedDate ? getTasksForDate(selectedDate) : [];

  const hasTasksOnDate = (date: Date) => {
    return tasks.some((task) => isSameDay(task.dueDate, date));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Calendar View</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border w-full"
              modifiers={{
                hasTasks: (date) => hasTasksOnDate(date),
              }}
              modifiersStyles={{
                hasTasks: {
                  fontWeight: "bold",
                  textDecoration: "underline",
                },
              }}
            />
          </CardContent>
        </Card>
      </div>

      <div>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Select a date"}
            </CardTitle>
            {selectedDateTasks.length > 0 && (
              <Badge variant="secondary" className="w-fit">
                {selectedDateTasks.length} {selectedDateTasks.length === 1 ? "task" : "tasks"}
              </Badge>
            )}
          </CardHeader>
          <CardContent>
            {selectedDateTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground">No tasks due on this date</p>
            ) : (
              <div className="space-y-3">
                {selectedDateTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-3 border rounded-md hover-elevate cursor-pointer space-y-2"
                    onClick={() => onTaskClick?.(task)}
                    data-testid={`calendar-task-${task.id}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-medium text-sm line-clamp-2">{task.name}</h4>
                      <PriorityBadge priority={task.priority} />
                    </div>
                    <p className="text-xs text-muted-foreground">Assigned to: {task.assignee}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
