import { Badge } from "@/components/ui/badge";

interface PriorityBadgeProps {
  priority: number;
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const getVariant = () => {
    if (priority === 1) return "destructive";
    if (priority === 2) return "destructive";
    if (priority === 3) return "secondary";
    return "secondary";
  };

  const getLabel = () => {
    if (priority === 1) return "CRITICAL";
    if (priority === 2) return "HIGH";
    if (priority === 3) return "MEDIUM";
    if (priority === 4) return "LOW";
    return "LOWEST";
  };

  return (
    <Badge variant={getVariant()} className="text-xs font-semibold uppercase" data-testid={`badge-priority-${priority}`}>
      {getLabel()}
    </Badge>
  );
}
