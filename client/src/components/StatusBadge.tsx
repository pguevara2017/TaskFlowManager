import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getVariant = () => {
    if (status === "COMPLETED") return "default";
    if (status === "IN_PROGRESS") return "secondary";
    return "secondary";
  };

  return (
    <Badge variant={getVariant()} className="text-xs font-medium uppercase" data-testid={`badge-status-${status}`}>
      {status.replace("_", " ")}
    </Badge>
  );
}
