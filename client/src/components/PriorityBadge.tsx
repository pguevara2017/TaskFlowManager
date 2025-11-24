import { Chip } from "@mui/material";

interface PriorityBadgeProps {
  priority: number;
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const getColor = (): "error" | "warning" | "default" => {
    if (priority === 1) return "error";
    if (priority === 2) return "error";
    if (priority === 3) return "warning";
    return "default";
  };

  const getLabel = () => {
    if (priority === 1) return "CRITICAL";
    if (priority === 2) return "HIGH";
    if (priority === 3) return "MEDIUM";
    if (priority === 4) return "LOW";
    return "LOWEST";
  };

  return (
    <Chip
      label={getLabel()}
      color={getColor()}
      size="small"
      sx={{ textTransform: 'uppercase', fontWeight: 600, fontSize: '0.75rem' }}
      data-testid={`badge-priority-${priority}`}
    />
  );
}
