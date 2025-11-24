import { Chip } from "@mui/material";

interface StatusBadgeProps {
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getColor = (): "default" | "primary" | "success" => {
    if (status === "COMPLETED") return "success";
    if (status === "IN_PROGRESS") return "primary";
    return "default";
  };

  return (
    <Chip
      label={status.replace("_", " ")}
      color={getColor()}
      size="small"
      sx={{ textTransform: 'uppercase', fontWeight: 500, fontSize: '0.75rem' }}
      data-testid={`badge-status-${status}`}
    />
  );
}
